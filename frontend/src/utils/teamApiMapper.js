/**
 * Maps GET /api/teams rows (teamName, callSign, …) to the shape TeamCard and Search expect.
 */
export function normalizeTeamFromApi(row) {
  if (!row || typeof row !== 'object') return null;

  const team =
    row.team ??
    row.teamName ??
    '';
  const callsign = (row.callsign ?? row.callSign ?? '').trim();
  if (!callsign && !team) return null;

  return {
    team,
    callsign,
    teamId: row.teamId ?? row.nbaTeamId ?? '',
    division: row.division ?? '',
    city: row.city ?? '',
    category: row.category ?? 'NBA',
    status: row.status ?? 'UNKNOWN',
    origin: row.origin,
    destination: row.destination,
    aircraft: row.aircraft ?? row.aircraftType,
  };
}

export function normalizeTeamsFromApi(data) {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeTeamFromApi).filter(Boolean);
}

export function filterTeamsBySearchTerm(teams, term) {
  const q = term.trim().toLowerCase();
  if (!q) return teams;
  return teams.filter((t) => {
    const hay = [
      t.team,
      t.callsign,
      t.city,
      t.division,
      t.teamId,
      t.category,
      t.origin,
      t.destination,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}
