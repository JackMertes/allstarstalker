// Mock Teams Data
export const mockTeams = [
  {
    category: "CS506",
    callsign: "3B",
    team: "Star Stalker (returned from front end mock)"
  },
  {
    category: "NBA",
    callsign: "DAL8918",
    team: "Atlanta Hawks"
  },
  {
    category: "NBA",
    callsign: "DAL8919",
    team: "Boston Celtics"
  },
  {
    category: "NBA",
    callsign: "DAL8920",
    team: "Brooklyn Nets"
  },
  {
    category: "NBA",
    callsign: "DAL8921",
    team: "Charlotte Hornets"
  },
  {
    category: "NBA",
    callsign: "DAL8922",
    team: "Chicago Bulls"
  },
  {
    category: "NBA",
    callsign: "DAL8923",
    team: "Cleveland Cavaliers"
  },
  {
    category: "NBA",
    callsign: "DAL8924",
    team: "Denver Nuggets"
  },
  {
    category: "NBA",
    callsign: "DAL8925",
    team: "Detroit Pistons"
  },
  {
    category: "NFL",
    callsign: "DAL9001",
    team: "Dallas Cowboys"
  },
  {
    category: "NFL",
    callsign: "DAL9002",
    team: "Green Bay Packers"
  }
];

// Mock Flight Status Response (Flying)
export const mockFlightStatusFlying = {
  team: "Denver Nuggets",
  callsign: "DAL8924",
  is_flying: true,
  last_seen: 1772142652001,
  raw: {
    ac: [
      {
        hex: "a8bbff",
        type: "adsb_icao",
        flight: "DAL8924 ",
        r: "N662DN",
        t: "B752",
        desc: "BOEING 757-200",
        ownOp: "BANK OF UTAH TRUSTEE",
        year: "1991",
        alt_baro: 33000,
        alt_geom: 33500,
        gs: 559.9,
        track: 125.99,
        baro_rate: 64,
        squawk: "2722",
        emergency: "none",
        category: "A4",
        nav_qnh: 1013.6,
        nav_altitude_mcp: 32992,
        nav_heading: 113.20,
        lat: 37.729844,
        lon: -102.776443,
        nic: 8,
        rc: 186,
        seen_pos: 0.289,
        version: 2,
        nic_baro: 1,
        nac_p: 10,
        nac_v: 2,
        sil: 3,
        sil_type: "perhour",
        gva: 2,
        sda: 2,
        alert: 0,
        spi: 0,
        mlat: [],
        tisb: [],
        messages: 40013,
        seen: 0.2,
        rssi: -22.3
      }
    ],
    msg: "No error",
    now: 1772142652001,
    total: 1,
    ctime: 1772142652001,
    ptime: 0
  }
};

// Mock Flight Status Response (Not Flying)
export const mockFlightStatusNotFlying = {
  team: "Los Angeles Clippers",
  callsign: "DAL8928",
  is_flying: false,
  last_seen: null,
  raw: null
};

// Mock User Tracking List
export const mockUserTrackings = [
  {
    trackingId: 1,
    callsign: "DAL8924",
    team: "Denver Nuggets (front-end)",
    category: "NBA",
    type: "team",
    notificationEnabled: true,
    createdAt: '2024-02-01T10:00:00'
  },
  {
    trackingId: 2,
    callsign: "DAL9001",
    team: "Dallas Cowboys (front-end)",
    category: "NFL",
    type: "team",
    notificationEnabled: false,
    createdAt: '2024-02-05T14:30:00'
  }
];

// Helper function to search teams
export const searchTeams = (query) => {
  if (!query) return mockTeams;
  
  const searchTerm = query.toLowerCase();
  return mockTeams.filter(team => 
    team.team.toLowerCase().includes(searchTerm) ||
    team.category.toLowerCase().includes(searchTerm) ||
    team.callsign.toLowerCase().includes(searchTerm)
  );
};

// Helper function to get team by callsign
export const getTeamByCallsign = (callsign) => {
  return mockTeams.find(team => team.callsign === callsign);
};

// Helper function to get flight status (mock)
export const getFlightStatus = (callsign) => {
  // Simulate: some teams are flying, others are not
  const flyingCallsigns = ["DAL8924", "DAL8920", "DAL9001"];
  
  if (flyingCallsigns.includes(callsign)) {
    return {
      ...mockFlightStatusFlying,
      callsign: callsign,
      team: mockTeams.find(t => t.callsign === callsign)?.team || "Unknown Team"
    };
  } else {
    return {
      ...mockFlightStatusNotFlying,
      callsign: callsign,
      team: mockTeams.find(t => t.callsign === callsign)?.team || "Unknown Team"
    };
  }
};
// Mock Flight Data
export const mockFlights = [
  {
    flightId: 1,
    flightNumber: 'TS001',
    aircraftId: 1,
    tailNumber: 'N628TS',
    aircraftType: 'Gulfstream G650',
    origin: 'LAX',
    originName: 'Los Angeles International',
    destination: 'JFK',
    destinationName: 'John F. Kennedy International',
    departureTime: '2024-02-13T10:00:00',
    arrivalTime: null,
    estimatedArrivalTime: '2024-02-13T18:30:00',
    status: 'ACTIVE',
    entityName: 'Taylor Swift',
    entityType: 'CELEBRITY',
    currentPosition: {
      latitude: 39.8000,
      longitude: -82.0000,
      altitude: 38000,
      groundSpeed: 475,
      heading: 68
    }
  },
  {
    flightId: 2,
    flightNumber: 'NK100',
    aircraftId: 4,
    tailNumber: 'N1KE',
    aircraftType: 'Gulfstream G-V',
    origin: 'PDX',
    originName: 'Portland International',
    destination: 'ATL',
    destinationName: 'Hartsfield-Jackson Atlanta',
    departureTime: '2024-02-13T11:00:00',
    arrivalTime: null,
    estimatedArrivalTime: '2024-02-13T19:00:00',
    status: 'ACTIVE',
    entityName: 'Nike Inc',
    entityType: 'COMPANY',
    currentPosition: {
      latitude: 39.5000,
      longitude: -96.0000,
      altitude: 37500,
      groundSpeed: 475,
      heading: 108
    }
  },
  {
    flightId: 3,
    flightNumber: 'AMZ123',
    aircraftId: 3,
    tailNumber: 'N757AF',
    aircraftType: 'Boeing 757-200',
    origin: 'SEA',
    originName: 'Seattle-Tacoma International',
    destination: 'IAD',
    destinationName: 'Washington Dulles International',
    departureTime: '2024-02-12T14:00:00',
    arrivalTime: '2024-02-12T22:00:00',
    estimatedArrivalTime: '2024-02-12T22:00:00',
    status: 'LANDED',
    entityName: 'Amazon Inc',
    entityType: 'COMPANY',
    currentPosition: null
  },
  {
    flightId: 4,
    flightNumber: 'AF1',
    aircraftId: 7,
    tailNumber: 'N28000',
    aircraftType: 'Boeing 747-200',
    origin: 'JBA',
    originName: 'Joint Base Andrews',
    destination: 'LAX',
    destinationName: 'Los Angeles International',
    departureTime: '2024-02-13T16:00:00',
    arrivalTime: null,
    estimatedArrivalTime: '2024-02-13T21:00:00',
    status: 'SCHEDULED',
    entityName: 'Air Force One',
    entityType: 'GOVERNMENT',
    currentPosition: null
  },
  {
    flightId: 5,
    flightNumber: 'SPX200',
    aircraftId: 8,
    tailNumber: 'N910TE',
    aircraftType: 'Dassault Falcon 7X',
    origin: 'LAX',
    originName: 'Los Angeles International',
    destination: 'KSC',
    destinationName: 'Kennedy Space Center',
    departureTime: '2024-02-11T09:00:00',
    arrivalTime: '2024-02-11T17:00:00',
    estimatedArrivalTime: '2024-02-11T17:00:00',
    status: 'LANDED',
    entityName: 'SpaceX',
    entityType: 'COMPANY',
    currentPosition: null
  },
  {
    flightId: 6,
    flightNumber: 'META01',
    aircraftId: 12,
    tailNumber: 'N456CD',
    aircraftType: 'Bombardier Challenger 650',
    origin: 'SFO',
    originName: 'San Francisco International',
    destination: 'ORD',
    destinationName: "O'Hare International",
    departureTime: '2024-02-13T12:30:00',
    arrivalTime: null,
    estimatedArrivalTime: '2024-02-13T19:30:00',
    status: 'DELAYED',
    entityName: 'Meta Platforms',
    entityType: 'COMPANY',
    currentPosition: null
  }
];

// Mock Aircraft Data
export const mockAircraft = [
  {
    aircraftId: 1,
    tailNumber: 'N628TS',
    aircraftType: 'Gulfstream G650',
    manufacturer: 'Gulfstream Aerospace',
    entities: [
      { entityId: 1, name: 'Taylor Swift', type: 'CELEBRITY' }
    ]
  },
  {
    aircraftId: 3,
    tailNumber: 'N757AF',
    aircraftType: 'Boeing 757-200',
    manufacturer: 'Boeing',
    entities: [
      { entityId: 3, name: 'Amazon Inc', type: 'COMPANY' }
    ]
  },
  {
    aircraftId: 4,
    tailNumber: 'N1KE',
    aircraftType: 'Gulfstream G-V',
    manufacturer: 'Gulfstream Aerospace',
    entities: [
      { entityId: 4, name: 'Nike Inc', type: 'COMPANY' }
    ]
  },
  {
    aircraftId: 7,
    tailNumber: 'N28000',
    aircraftType: 'Boeing 747-200',
    manufacturer: 'Boeing',
    entities: [
      { entityId: 6, name: 'Air Force One', type: 'GOVERNMENT' }
    ]
  },
  {
    aircraftId: 8,
    tailNumber: 'N910TE',
    aircraftType: 'Dassault Falcon 7X',
    manufacturer: 'Dassault Aviation',
    entities: [
      { entityId: 5, name: 'SpaceX', type: 'COMPANY' }
    ]
  }
];

// Mock Tracked Entities
export const mockEntities = [
  { entityId: 1, name: 'Taylor Swift', type: 'CELEBRITY', description: 'American singer-songwriter' },
  { entityId: 2, name: 'Travis Kelce', type: 'CELEBRITY', description: 'NFL player for Kansas City Chiefs' },
  { entityId: 3, name: 'Amazon Inc', type: 'COMPANY', description: 'E-commerce and technology company' },
  { entityId: 4, name: 'Nike Inc', type: 'COMPANY', description: 'Sportswear and athletic equipment company' },
  { entityId: 5, name: 'SpaceX', type: 'COMPANY', description: 'Aerospace manufacturer' },
  { entityId: 6, name: 'Air Force One', type: 'GOVERNMENT', description: 'US Presidential aircraft fleet' }
];

// Helper function to search flights
export const searchFlights = (query) => {
  if (!query) return mockFlights;
  
  const searchTerm = query.toLowerCase();
  return mockFlights.filter(flight => 
    flight.flightNumber.toLowerCase().includes(searchTerm) ||
    flight.tailNumber.toLowerCase().includes(searchTerm) ||
    flight.entityName.toLowerCase().includes(searchTerm) ||
    flight.origin.toLowerCase().includes(searchTerm) ||
    flight.destination.toLowerCase().includes(searchTerm)
  );
};

// Helper function to get flight by ID
export const getFlightById = (id) => {
  return mockFlights.find(flight => flight.flightId === parseInt(id));
};

// Helper function to get active flights
export const getActiveFlights = () => {
  return mockFlights.filter(flight => flight.status === 'ACTIVE');
};
