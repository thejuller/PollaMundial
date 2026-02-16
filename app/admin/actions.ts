'use server';

import { prisma } from '@/lib/prisma';

// Default scoring rules matching RESULTADOS.pdf
const DEFAULT_RULES = [
    // Group Stage
    { id: 'EXACT_SCORE', description: 'Marcador Exacto (Fase de Grupos)', points: 7, category: 'GROUP' },
    { id: 'WINNER_OR_DRAW', description: 'Ganador o Empate (Fase de Grupos)', points: 3, category: 'GROUP' },
    { id: 'ONE_SCORE', description: 'Un Marcador Correcto (Fase de Grupos)', points: 1, category: 'GROUP' },

    // Bracket
    { id: 'OCTAVOS_EXACT', description: 'Octavos - Ubicación Exacta', points: 7, category: 'BRACKET' },
    { id: 'OCTAVOS_ANY', description: 'Octavos - Clasificado (Cualquier Ubicación)', points: 3, category: 'BRACKET' },
    { id: 'QUARTER_FINALS', description: 'Cuartos de Final - Por Equipo', points: 8, category: 'BRACKET' },
    { id: 'SEMI_FINALS', description: 'Semifinales - Por Equipo', points: 10, category: 'BRACKET' },
    { id: 'THIRD_PLACE', description: 'Tercer Puesto - Por Equipo', points: 5, category: 'BRACKET' },
    { id: 'FINAL', description: 'Final - Por Equipo', points: 12, category: 'BRACKET' },
    { id: 'CHAMPION', description: 'Campeón del Mundial', points: 15, category: 'BRACKET' },
];

export async function getScoringRules() {
    try {
        let rules = await prisma.scoringRule.findMany({
            orderBy: [{ category: 'asc' }, { points: 'desc' }]
        });

        // Initialize with defaults if empty
        if (rules.length === 0) {
            await initializeDefaultRules();
            rules = await prisma.scoringRule.findMany({
                orderBy: [{ category: 'asc' }, { points: 'desc' }]
            });
        }

        return { success: true, rules };
    } catch (error) {
        console.error('Error fetching scoring rules:', error);
        return { success: false, error: 'Error al cargar reglas de puntuación' };
    }
}

export async function updateScoringRule(id: string, points: number) {
    try {
        await prisma.scoringRule.update({
            where: { id },
            data: { points }
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating scoring rule:', error);
        return { success: false, error: 'Error al actualizar regla' };
    }
}

export async function initializeDefaultRules() {
    try {
        await prisma.scoringRule.createMany({
            data: DEFAULT_RULES,
            skipDuplicates: true
        });

        return { success: true };
    } catch (error) {
        console.error('Error initializing default rules:', error);
        return { success: false, error: 'Error al inicializar reglas' };
    }
}

export async function getScoringConfig() {
    try {
        const rules = await prisma.scoringRule.findMany();

        // Convert to config object for easy use in scoring logic
        const config: Record<string, number> = {};
        rules.forEach((rule: { id: string; points: number }) => {
            config[rule.id] = rule.points;
        });

        return { success: true, config };
    } catch (error) {
        console.error('Error fetching scoring config:', error);
        return { success: false, config: {} };
    }
}
