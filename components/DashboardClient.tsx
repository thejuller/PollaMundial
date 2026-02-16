'use client';

import { useState } from 'react';
import { MatchData, getTeamsFromMatches } from '@/lib/api';
import { getAvailableStages, getMatchesByStage, STAGES } from '@/lib/stages';
import StageNavigation from './StageNavigation';
import PredictionForm from './PredictionForm';
import BracketPredictionGrid from './BracketPredictionGrid';

interface DashboardClientProps {
    userId: string;
    matches: MatchData[];
    initialPredictions: { matchId: string; homeScore: number; awayScore: number }[];
    bracketPredictions: Array<{
        stage: string;
        position: number;
        homeTeamId: number | null;
        awayTeamId: number | null;
        homeTeamName: string | null;
        awayTeamName: string | null;
        homeScore: number | null;
        awayScore: number | null;
    }>;
}

export default function DashboardClient({ userId, matches, initialPredictions, bracketPredictions }: DashboardClientProps) {
    const availableStages = getAvailableStages(matches);
    const [currentStage, setCurrentStage] = useState(availableStages[0] || STAGES.GROUP_STAGE);

    const filteredMatches = getMatchesByStage(matches, currentStage);
    // Only get teams from Group Stage matches to avoid placeholders like "1A", "2B"
    const groupStageMatches = getMatchesByStage(matches, STAGES.GROUP_STAGE);
    const availableTeams = getTeamsFromMatches(groupStageMatches);
    const stageBracketPredictions = bracketPredictions.filter(p => p.stage === currentStage);

    return (
        <>
            <StageNavigation
                availableStages={availableStages}
                currentStage={currentStage}
                onStageChange={setCurrentStage}
            />

            {currentStage === STAGES.GROUP_STAGE ? (
                <PredictionForm
                    userId={userId}
                    matches={filteredMatches}
                    initialPredictions={initialPredictions}
                />
            ) : (
                <BracketPredictionGrid
                    userId={userId}
                    stage={currentStage}
                    availableTeams={availableTeams}
                    initialPredictions={stageBracketPredictions}
                />
            )}
        </>
    );
}
