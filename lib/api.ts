const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';

export interface MatchData {
  id: number; // API ID
  homeTeam: { name: string; crest: string };
  awayTeam: { name: string; crest: string };
  utcDate: string;
  status: string;
  stage: string; // GROUP_STAGE, ROUND_OF_16, QUARTER_FINALS, SEMI_FINALS, FINAL
  group: string | null; // GROUP_A, GROUP_B, etc. (solo en GROUP_STAGE)
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export async function getMatches(): Promise<MatchData[]> {
  let matches: MatchData[] = [];

  if (!API_KEY) {
    console.warn('No API key provided, returning mock data.');
    matches = getMockMatches();
  } else {
    try {
      const res = await fetch(`${BASE_URL}/competitions/WC/matches`, {
        headers: { 'X-Auth-Token': API_KEY },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch matches: ${res.statusText}`);
      }

      const data = await res.json();
      matches = data.matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      matches = getMockMatches();
    }
  }

  // FORCE: Add Mock Round of 16 matches if not present (for demo purposes)
  // Check if we already have Round of 16 matches
  const hasRoundOf16 = matches.some(m => m.stage === 'ROUND_OF_16');

  if (!hasRoundOf16) {
    const mockRoundOf16 = getMockMatches().filter(m => m.stage === 'ROUND_OF_16');
    matches = [...matches, ...mockRoundOf16];
  }

  // FORCE: Add other stages if missing
  const stagesToCheck = ['QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];
  const mockData = getMockMatches();

  stagesToCheck.forEach(stage => {
    if (!matches.some(m => m.stage === stage)) {
      const stageMatches = mockData.filter(m => m.stage === stage);
      matches = [...matches, ...stageMatches];
    }
  });

  return matches;
}

export interface Team {
  id: number;
  name: string;
  crest: string;
}

/**
 * Extract unique teams from matches
 */
export function getTeamsFromMatches(matches: MatchData[]): Team[] {
  const teamsMap = new Map<string, Team>();

  matches.forEach(match => {
    // Skip if team names are missing
    if (!match.homeTeam?.name || !match.awayTeam?.name) {
      return;
    }

    // Note: API doesn't provide team IDs in homeTeam/awayTeam directly
    // For MVP, we'll use hash of team name as ID
    const homeId = hashCode(match.homeTeam.name);
    const awayId = hashCode(match.awayTeam.name);

    if (!teamsMap.has(match.homeTeam.name)) {
      teamsMap.set(match.homeTeam.name, {
        id: homeId,
        name: match.homeTeam.name,
        crest: match.homeTeam.crest,
      });
    }

    if (!teamsMap.has(match.awayTeam.name)) {
      teamsMap.set(match.awayTeam.name, {
        id: awayId,
        name: match.awayTeam.name,
        crest: match.awayTeam.crest,
      });
    }
  });

  return Array.from(teamsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Simple hash function for team names (MVP)
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}


function getMockMatches(): MatchData[] {
  return [
    {
      id: 1,
      homeTeam: { name: 'Brasil', crest: 'https://crests.football-data.org/764.svg' },
      awayTeam: { name: 'Serbia', crest: 'https://crests.football-data.org/780.svg' },
      utcDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'GROUP_STAGE',
      group: 'GROUP_A',
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 2,
      homeTeam: { name: 'Francia', crest: 'https://crests.football-data.org/773.svg' },
      awayTeam: { name: 'Australia', crest: 'https://crests.football-data.org/779.svg' },
      utcDate: new Date(Date.now() + 172800000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'GROUP_STAGE',
      group: 'GROUP_B',
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 3,
      homeTeam: { name: 'Argentina', crest: 'https://crests.football-data.org/762.svg' },
      awayTeam: { name: 'Arabia Saudita', crest: 'https://crests.football-data.org/801.svg' },
      utcDate: new Date(Date.now() + 259200000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'GROUP_STAGE',
      group: 'GROUP_C',
      score: { fullTime: { home: null, away: null } },
    },
    // Round of 16 Mock Matches
    {
      id: 50,
      homeTeam: { name: '1A', crest: '' },
      awayTeam: { name: '2B', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 51,
      homeTeam: { name: '1C', crest: '' },
      awayTeam: { name: '2D', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 52,
      homeTeam: { name: '1E', crest: '' },
      awayTeam: { name: '2F', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 53,
      homeTeam: { name: '1G', crest: '' },
      awayTeam: { name: '2H', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 54,
      homeTeam: { name: '1B', crest: '' },
      awayTeam: { name: '2A', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 55,
      homeTeam: { name: '1D', crest: '' },
      awayTeam: { name: '2C', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 56,
      homeTeam: { name: '1F', crest: '' },
      awayTeam: { name: '2E', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    {
      id: 57,
      homeTeam: { name: '1H', crest: '' },
      awayTeam: { name: '2G', crest: '' },
      utcDate: new Date(Date.now() + 1000000000).toISOString(),
      status: 'PROGRAMADO',
      stage: 'ROUND_OF_16',
      group: null,
      score: { fullTime: { home: null, away: null } },
    },
    // Quarter Finals
    { id: 60, homeTeam: { name: 'W50', crest: '' }, awayTeam: { name: 'W51', crest: '' }, utcDate: new Date(Date.now() + 2000000000).toISOString(), status: 'PROGRAMADO', stage: 'QUARTER_FINALS', group: null, score: { fullTime: { home: null, away: null } } },
    { id: 61, homeTeam: { name: 'W52', crest: '' }, awayTeam: { name: 'W53', crest: '' }, utcDate: new Date(Date.now() + 2000000000).toISOString(), status: 'PROGRAMADO', stage: 'QUARTER_FINALS', group: null, score: { fullTime: { home: null, away: null } } },
    { id: 62, homeTeam: { name: 'W54', crest: '' }, awayTeam: { name: 'W55', crest: '' }, utcDate: new Date(Date.now() + 2000000000).toISOString(), status: 'PROGRAMADO', stage: 'QUARTER_FINALS', group: null, score: { fullTime: { home: null, away: null } } },
    { id: 63, homeTeam: { name: 'W56', crest: '' }, awayTeam: { name: 'W57', crest: '' }, utcDate: new Date(Date.now() + 2000000000).toISOString(), status: 'PROGRAMADO', stage: 'QUARTER_FINALS', group: null, score: { fullTime: { home: null, away: null } } },
    // Semi Finals
    { id: 64, homeTeam: { name: 'W60', crest: '' }, awayTeam: { name: 'W61', crest: '' }, utcDate: new Date(Date.now() + 3000000000).toISOString(), status: 'PROGRAMADO', stage: 'SEMI_FINALS', group: null, score: { fullTime: { home: null, away: null } } },
    { id: 65, homeTeam: { name: 'W62', crest: '' }, awayTeam: { name: 'W63', crest: '' }, utcDate: new Date(Date.now() + 3000000000).toISOString(), status: 'PROGRAMADO', stage: 'SEMI_FINALS', group: null, score: { fullTime: { home: null, away: null } } },
    // Third Place
    { id: 66, homeTeam: { name: 'L64', crest: '' }, awayTeam: { name: 'L65', crest: '' }, utcDate: new Date(Date.now() + 4000000000).toISOString(), status: 'PROGRAMADO', stage: 'THIRD_PLACE', group: null, score: { fullTime: { home: null, away: null } } },
    // Final
    { id: 67, homeTeam: { name: 'W64', crest: '' }, awayTeam: { name: 'W65', crest: '' }, utcDate: new Date(Date.now() + 5000000000).toISOString(), status: 'PROGRAMADO', stage: 'FINAL', group: null, score: { fullTime: { home: null, away: null } } },
  ];
}
