# NBA Charter Flight Data Collection
# Fetches live ADS-B data from Airplanes.live for each team in database/teams.json
# and writes results to database/flights_snapshot.json. Uses 10s delay between requests.

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DatabaseDir = Join-Path $ScriptDir "..\database"
$TeamsPath = Join-Path $DatabaseDir "teams.json"
$SnapshotPath = Join-Path $DatabaseDir "flights_snapshot.json"
$ApiBase = "http://api.airplanes.live/v2/callsign"
$DelaySeconds = 10

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

    try {
        $url = "$ApiBase/$([uri]::EscapeDataString($callsign))"
        $data = Invoke-RestMethod -Uri $url -Method Get
        $total = if ($null -eq $data.total) { 0 } else { $data.total }

        if ($total -eq 1) {
            $ts = if ($null -ne $data.now) { $data.now } elseif ($null -ne $data.ctime) { $data.ctime } else { [long](Get-Date -UFormat %s) * 1000 }
            $teamsMap[$callsign] = [PSCustomObject]@{
                team      = $team
                callsign  = $callsign
                is_flying = $true
                last_seen = $ts
                raw       = $data
            }
            Write-Host "[$i/$($teams.Count)] $team ($callsign): flying - updated"
        } else {
            if ($existing) {
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
    } catch {
        Write-Host "[$i/$($teams.Count)] $team ($callsign): ERROR - $($_.Exception.Message)" -ForegroundColor Red
        if ($existing) {
            $teamsMap[$callsign] = [PSCustomObject]@{ team = $team; callsign = $callsign; is_flying = $false; last_seen = $existing.last_seen; raw = $existing.raw }
        } else {
            $teamsMap[$callsign] = [PSCustomObject]@{ team = $team; callsign = $callsign; is_flying = $false; last_seen = $null; raw = $null }
        }
    }

    if ($i -lt $teams.Count) { Start-Sleep -Seconds $DelaySeconds }
}

$snapshotTime = [long](Get-Date -UFormat %s) * 1000
$output = @{ snapshot_time = $snapshotTime; teams = $teamsMap }
$output | ConvertTo-Json -Depth 20 | Set-Content $SnapshotPath -Encoding UTF8
Write-Host "`nSaved to $SnapshotPath"
