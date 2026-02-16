import { PrismaClient } from '@prisma/client';
import { getMatches, MatchData } from './api';
import { calculateMatchScore } from './scoring';

const prisma = new PrismaClient();

export type LeaderboardEntry = {
    userId: string;
    name: string;
    points: number;
    exactMatches: number; // For tie-breaking or verification
    correctResults: number;
};

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await prisma.user.findMany({
        include: {
            predictions: true,
        },
    });

    const matches = await getMatches();
    const finishedMatches = matches.filter((m) => m.status === 'FINISHED');

    // Create a map of match results for quick lookup
    const matchResults = new Map<string, { home: number; away: number }>();
    finishedMatches.forEach((m) => {
        if (m.score.fullTime.home !== null && m.score.fullTime.away !== null) {
            matchResults.set(m.id.toString(), {
                home: m.score.fullTime.home,
                away: m.score.fullTime.away,
            });
        }
    });

    const leaderboard: LeaderboardEntry[] = users.map((user) => {
        let points = 0;
        let exactMatches = 0;
        let correctResults = 0;

        user.predictions.forEach((pred) => {
            const matchResult = matchResults.get(pred.matchId);
            if (matchResult) {
                const p = calculateMatchScore(
                    pred.homeScore,
                    pred.awayScore,
                    matchResult.home,
                    matchResult.away
                );
                points += p;
                if (p === 7) exactMatches++;
                if (p === 3) correctResults++;
            }
        });

        return {
            userId: user.id,
            name: user.name || 'Anonymous',
            points,
            exactMatches,
            correctResults,
        };
    });

    // Sort by points descending
    return leaderboard.sort((a, b) => b.points - a.points);
}
