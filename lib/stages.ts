import { MatchData } from './api';

export const STAGES = {
    GROUP_STAGE: 'GROUP_STAGE',
    LAST_32: 'LAST_32',
    ROUND_OF_16: 'ROUND_OF_16',
    LAST_16: 'LAST_16',
    QUARTER_FINALS: 'QUARTER_FINALS',
    SEMI_FINALS: 'SEMI_FINALS',
    THIRD_PLACE: 'THIRD_PLACE',
    FINAL: 'FINAL',
} as const;

export const STAGE_LABELS: Record<string, string> = {
    [STAGES.GROUP_STAGE]: 'Fase de Grupos',
    [STAGES.LAST_32]: 'Dieciseisavos',
    [STAGES.ROUND_OF_16]: 'Octavos',
    [STAGES.LAST_16]: 'Octavos',
    [STAGES.QUARTER_FINALS]: 'Cuartos',
    [STAGES.SEMI_FINALS]: 'Semifinales',
    [STAGES.THIRD_PLACE]: '3ᵉʳ Puesto',
    [STAGES.FINAL]: 'Final',
};

export type Stage = typeof STAGES[keyof typeof STAGES];

/**
 * Filtra partidos por fase
 */
export function getMatchesByStage(matches: MatchData[], stage: string): MatchData[] {
    return matches.filter(m => m.stage === stage);
}

/**
 * Agrupa partidos por grupo (solo para GROUP_STAGE)
 */
export function groupMatchesByGroup(matches: MatchData[]): Record<string, MatchData[]> {
    const grouped: Record<string, MatchData[]> = {};

    matches.forEach(match => {
        if (match.group) {
            if (!grouped[match.group]) {
                grouped[match.group] = [];
            }
            grouped[match.group].push(match);
        }
    });

    return grouped;
}

/**
 * Obtiene todas las fases disponibles en los partidos
 */
export function getAvailableStages(matches: MatchData[]): string[] {
    const stages = new Set(matches.map(m => m.stage));

    // Filter out stages we don't want to show yet or are empty
    const filteredStages = Array.from(stages).filter(stage =>
        stage !== STAGES.LAST_32 && stage !== STAGES.LAST_16
    );

    return filteredStages.sort((a, b) => {
        const order = [
            STAGES.GROUP_STAGE,
            STAGES.LAST_32,
            STAGES.LAST_16,
            STAGES.ROUND_OF_16,
            STAGES.QUARTER_FINALS,
            STAGES.SEMI_FINALS,
            STAGES.THIRD_PLACE,
            STAGES.FINAL
        ];
        return order.indexOf(a as Stage) - order.indexOf(b as Stage);
    });
}
