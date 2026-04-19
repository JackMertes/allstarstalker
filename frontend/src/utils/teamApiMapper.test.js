import { normalizeTeamFromApi } from './teamApiMapper';

describe('teamApiMapper', () => {
  it('keeps supported statuses like DIVERTED and DELAYED', () => {
    expect(normalizeTeamFromApi({
      teamName: 'Denver Nuggets',
      callSign: 'DAL8924',
      status: 'DIVERTED',
    })).toMatchObject({
      callsign: 'DAL8924',
      status: 'DIVERTED',
    });

    expect(normalizeTeamFromApi({
      teamName: 'Denver Nuggets',
      callSign: 'DAL8924',
      status: 'delayed',
    })).toMatchObject({
      callsign: 'DAL8924',
      status: 'DELAYED',
    });
  });

  it('maps unsupported statuses to UNKNOWN', () => {
    expect(normalizeTeamFromApi({
      teamName: 'Denver Nuggets',
      callSign: 'DAL8924',
      status: 'BOARDING',
    })).toMatchObject({
      status: 'UNKNOWN',
    });
  });
});
