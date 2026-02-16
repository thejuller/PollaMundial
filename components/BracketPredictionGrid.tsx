'use client';

import { Team } from '@/lib/api';
import { STAGES } from '@/lib/stages';
import BracketPredictionCard from './BracketPredictionCard';

interface BracketPredictionGridProps {
    userId: string;
    stage: string;
    availableTeams: Team[];
    initialPredictions: Array<{
        position: number;
        homeTeamId: number | null;
        awayTeamId: number | null;
        homeTeamName: string | null;
        awayTeamName: string | null;
        homeScore: number | null;
        awayScore: number | null;
    }>;
}

// Number of matches per stage
const MATCHES_PER_STAGE: Record<string, number> = {
    [STAGES.ROUND_OF_16]: 8,
    [STAGES.QUARTER_FINALS]: 4,
    [STAGES.SEMI_FINALS]: 2,
    [STAGES.THIRD_PLACE]: 1,
    [STAGES.FINAL]: 1,
};

export default function BracketPredictionGrid({
    userId,
    stage,
    availableTeams,
    initialPredictions,
}: BracketPredictionGridProps) {
    const matchCount = MATCHES_PER_STAGE[stage] || 0;
    const positions = Array.from({ length: matchCount }, (_, i) => i + 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {positions.map(position => {
                const prediction = initialPredictions.find(p => p.position === position);

                return (
                    <BracketPredictionCard
                        key={position}
                        userId={userId}
                        stage={stage}
                        position={position}
                        availableTeams={availableTeams}
                        initialPrediction={prediction}
                    />
                );
            })}
        </div>
    );
}
