
import { MatchData } from './api';
import { STAGES } from './stages';

// --- Use simple string ID or number ID for teams depending on what's available ---
// For this app, we often use Team ID (number) if available, or name hash

// --- Group Stage Scoring ---

const DEFAULT_POINTS: Record<string, number> = {
    EXACT_SCORE: 7,
    WINNER_OR_DRAW: 3,
    ONE_SCORE: 1,
    NONE: 0
};

export function calculateMatchScore(
    predHome: number,
    predAway: number,
    realHome: number | null,
    realAway: number | null,
    config?: Record<string, number>
): number {
    if (realHome === null || realAway === null) return 0;

    const points = config || DEFAULT_POINTS;

    // 1. Exact Score
    if (predHome === realHome && predAway === realAway) {
        return points.EXACT_SCORE || DEFAULT_POINTS.EXACT_SCORE;
    }

    // 2. Winner or Draw
    const predDiff = predHome - predAway;
    const realDiff = realHome - realAway;

    const predSign = Math.sign(predDiff);
    const realSign = Math.sign(realDiff);

    if (predSign === realSign) {
        return points.WINNER_OR_DRAW || DEFAULT_POINTS.WINNER_OR_DRAW;
    }

    // 3. One Correct Score (Consolation)
    if (predHome === realHome || predAway === realAway) {
        return points.ONE_SCORE || DEFAULT_POINTS.ONE_SCORE;
    }

    return 0;
}

// --- Knockout Stage Scoring ---

const DEFAULT_BRACKET_POINTS: Record<string, number> = {
    [STAGES.ROUND_OF_16]: 3,
    [STAGES.QUARTER_FINALS]: 8,
    [STAGES.SEMI_FINALS]: 10,
    [STAGES.THIRD_PLACE]: 5,
    [STAGES.FINAL]: 12,
    CHAMPION: 15,
    OCTAVOS_EXACT: 7,
    OCTAVOS_ANY: 3
};

/**
 * Calculates points for Bracket predictions.
 * 
 * @param stage The stage being scored.
 * @param userPredictions Array of predictions for this stage.
 * @param realMatches Real matches for this stage.
 * @param config Optional scoring configuration from database.
 */
export function calculateBracketScore(
    stage: string,
    userPredictions: any[],
    realMatches: MatchData[],
    config?: Record<string, number>
): number {
    let score = 0;
    const bracketPoints = config || DEFAULT_BRACKET_POINTS;

    // Get real teams present in this stage
    const realTeamsInStage = new Set<number>();

    // Also track exact slots for Octavos
    // Map: MatchId (or Slot Index) -> [HomeTeamId, AwayTeamId]
    const realSlots = new Map<number, { home: number, away: number }>();

    realMatches.forEach(m => {
        if (m.stage === stage) {
            // We need function to get ID from name or crest if ID missing
            // Assuming we use the same helper as elsewhere: hashCode or mapped ID
            const homeId = getTeamId(m.homeTeam);
            const awayId = getTeamId(m.awayTeam);

            if (homeId) realTeamsInStage.add(homeId);
            if (awayId) realTeamsInStage.add(awayId);

            realSlots.set(m.id, { home: homeId, away: awayId });
        }
    });

    if (stage === STAGES.ROUND_OF_16) {
        // Special Logic for Octavos: Exact (7) vs Any (3)
        // Iterate user predictions.
        // Assuming userPredictions has structure: { matchId: number, homeTeamId: number, awayTeamId: number }

        userPredictions.forEach(pred => {
            const predHomeId = pred.homeTeamId;
            const predAwayId = pred.awayTeamId;
            const realSlot = realSlots.get(Number(pred.matchId)); // Assuming matchId aligns

            // Check Home Prediction
            if (predHomeId) {
                if (realSlot && realSlot.home === predHomeId) {
                    score += bracketPoints.OCTAVOS_EXACT || DEFAULT_BRACKET_POINTS.OCTAVOS_EXACT;
                } else if (realSlot && realSlot.away === predHomeId) {
                    // Predicted as Home, but came as Away in SAME match? 
                    // The rule says "Ubicación Exacta". 
                    // Does "Ubicación" mean just "In Match X"? Or "In Match X as Home Team"?
                    // Usually it implies the Bracket Slot (Match X, Slot 1).
                    // So if I predict Team A in Match 49, Slot 1. And Team A is in Match 49, Slot 2...
                    // Let's assume strict Slot: Exact = 7.
                    // If not exact slot, but in stage: 3.
                    score += bracketPoints.OCTAVOS_ANY || DEFAULT_BRACKET_POINTS.OCTAVOS_ANY;
                } else if (realTeamsInStage.has(predHomeId)) {
                    score += bracketPoints.OCTAVOS_ANY || DEFAULT_BRACKET_POINTS.OCTAVOS_ANY;
                }
            }

            // Check Away Prediction
            if (predAwayId) {
                if (realSlot && realSlot.away === predAwayId) {
                    score += bracketPoints.OCTAVOS_EXACT || DEFAULT_BRACKET_POINTS.OCTAVOS_EXACT;
                } else if (realSlot && realSlot.home === predAwayId) {
                    score += bracketPoints.OCTAVOS_ANY || DEFAULT_BRACKET_POINTS.OCTAVOS_ANY;
                } else if (realTeamsInStage.has(predAwayId)) {
                    score += bracketPoints.OCTAVOS_ANY || DEFAULT_BRACKET_POINTS.OCTAVOS_ANY;
                }
            }
        });

    } else {
        // Standard "In Stage" logic for other rounds
        // Just need to count how many predicted teams are in `realTeamsInStage`
        const pointsPerTeam = bracketPoints[stage] || DEFAULT_BRACKET_POINTS[stage] || 0;

        // Avoid double counting if user predicted same team twice (shouldn't happen in UI but safe to check)
        const countedTeams = new Set<number>();

        userPredictions.forEach(pred => {
            if (pred.homeTeamId && !countedTeams.has(pred.homeTeamId)) {
                if (realTeamsInStage.has(pred.homeTeamId)) {
                    score += pointsPerTeam;
                    countedTeams.add(pred.homeTeamId);
                }
            }
            if (pred.awayTeamId && !countedTeams.has(pred.awayTeamId)) {
                if (realTeamsInStage.has(pred.awayTeamId)) {
                    score += pointsPerTeam;
                    countedTeams.add(pred.awayTeamId);
                }
            }
        });
    }

    return score;
}

// Helper (duplicated from api.ts to avoid circular deps or complex imports if separate)
function getTeamId(team: { name: string }): number {
    return hashCode(team.name);
}

function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}
