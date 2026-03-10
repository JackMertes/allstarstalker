# NBA Charter Flight Data Collection
# Fetches live ADS-B data from Airplanes.live for each team in database/teams.json
# and writes results to database/flights_snapshot.json. Rate limit: 15s between requests; retries on 429.
# Logs one line per run to database/flight_refresh.log with per-team status updates.

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DatabaseDir = Join-Path $ScriptDir "..\database"
$TeamsPath = Join-Path $DatabaseDir "teams.json"
$SnapshotPath = Join-Path $DatabaseDir "flights_snapshot.json"
$LogPath = Join-Path $DatabaseDir "flight_refresh.log"
$ApiBase = "http://api.airplanes.live/v2/callsign"
$DelaySeconds = 10
$RetryWaitSeconds = 45
$MaxRetries = 2

$logLines = @()

$teamsData = Get-Content $TeamsPath -Raw | ConvertFrom-Json
$teams = @($teamsData.teams)
if ($teams.Count -eq 0) {
    Write-Error "No teams in $TeamsPath"
    exit 1
}

$teamsMap = @{}
if (Test-Path $SnapshotPath) {
    try {
        $snapshotJson = Get-Content $SnapshotPath -Raw | ConvertFrom-Json
        if ($snapshotJson.teams) {
            $snapshotJson.teams.PSObject.Properties | ForEach-Object { $teamsMap[$_.Name] = $_.Value }
        }
    } catch {
        Write-Warning "Could not load existing snapshot: $_"
    }
}

Write-Host "Loaded $($teams.Count) teams. Fetching ($DelaySeconds s between requests)...`n"

$i = 0
foreach ($t in $teams) {
    $i++
    $team = $t.team
    $callsign = $t.callsign.Trim()
    $existing = $teamsMap[$callsign]

    $url = "$ApiBase/$([uri]::EscapeDataString($callsign))"
    $retryCount = 0
    $done = $false

    while (-not $done) {
        try {
            $data = Invoke-RestMethod -Uri $url -Method Get
            $total = if ($null -eq $data.total) { 0 } else { $data.total }

            if ($total -eq 1) {
                $wasFlying = $existing -and $existing.is_flying -eq $true
                $ts = if ($null -ne $data.now) { $data.now } elseif ($null -ne $data.ctime) { $data.ctime } else { [long](Get-Date -UFormat %s) * 1000 }
                $teamsMap[$callsign] = [PSCustomObject]@{
                    team      = $team
                    callsign  = $callsign
                    is_flying = $true
                    last_seen = $ts
                    raw       = $data
                }
                if ($wasFlying) {
                    $logLines += "$team updated flying position"
                } else {
                    $logLines += "$team now flying"
                }
                Write-Host "[$i/$($teams.Count)] $team ($callsign): flying - updated"
            } else {
                if ($existing) {
                    $wasFlying = $existing.is_flying -eq $true
                    $teamsMap[$callsign] = [PSCustomObject]@{
                        team      = $team
                        callsign  = $callsign
                        is_flying = $false
                        last_seen = $existing.last_seen
                        raw       = $existing.raw
                    }
                    Write-Host "[$i/$($teams.Count)] $team ($callsign): not flying - kept last known"
                } else {
                    $teamsMap[$callsign] = [PSCustomObject]@{
                        team      = $team
                        callsign  = $callsign
                        is_flying = $false
                        last_seen = $null
                        raw       = $null
                    }
                    Write-Host "[$i/$($teams.Count)] $team ($callsign): not flying - no prior data"
                }
            }
            $done = $true
        } catch {
            $is429 = $_.Exception.Message -match '429'
            if ($is429 -and $retryCount -lt $MaxRetries) {
                $retryCount++
                Write-Host "[$i/$($teams.Count)] $team ($callsign): 429 Too Many Requests - waiting ${RetryWaitSeconds}s then retry $retryCount/$MaxRetries" -ForegroundColor Yellow
                Start-Sleep -Seconds $RetryWaitSeconds
            } else {
                Write-Host "[$i/$($teams.Count)] $team ($callsign): ERROR - $($_.Exception.Message)" -ForegroundColor Red
                if ($existing) {
                    $teamsMap[$callsign] = [PSCustomObject]@{ team = $team; callsign = $callsign; is_flying = $false; last_seen = $existing.last_seen; raw = $existing.raw }
                } else {
                    $teamsMap[$callsign] = [PSCustomObject]@{ team = $team; callsign = $callsign; is_flying = $false; last_seen = $null; raw = $null }
                }
                $done = $true
            }
        }
    }

    if ($i -lt $teams.Count) { Start-Sleep -Seconds $DelaySeconds }
}

$snapshotTime = [long](Get-Date -UFormat %s) * 1000
$output = @{ snapshot_time = $snapshotTime; teams = $teamsMap }
$output | ConvertTo-Json -Depth 20 | Set-Content $SnapshotPath -Encoding UTF8
$ts = Get-Date -Format "MM/dd/yyyy HH:mm"
if ($logLines.Count -gt 0) {
    $msg = "$ts " + ($logLines -join ". ") + "."
} else {
    $msg = "$ts No teams currently flying."
}
$msg | Add-Content -Path $LogPath -Encoding UTF8 -ErrorAction SilentlyContinue
Write-Host "`nSaved to $SnapshotPath"
