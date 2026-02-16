'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { normalizeEmail, capitalizeName } from '@/lib/normalize';

export async function loginUser(formData: FormData) {
    const rawEmail = formData.get('email') as string;
    const rawName = formData.get('name') as string;

    if (!rawEmail || !rawName) {
        throw new Error('Email and Name are required');
    }

    // Normalize data
    const email = normalizeEmail(rawEmail);
    const name = capitalizeName(rawName);

    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name,
            },
        });
    }

    // Simple session management using cookies for MVP
    const cookieStore = await cookies();
    cookieStore.set('userId', user.id);

    redirect('/dashboard');
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    redirect('/');
}

export async function getUserPredictions(userId: string) {
    const predictions = await prisma.prediction.findMany({
        where: { userId },
    });
    return predictions;
}

export async function submitPrediction(
    userId: string,
    matchId: string,
    homeScore: number,
    awayScore: number,
    matchMeta: {
        homeTeam: string;
        awayTeam: string;
        date: string;
        status: string;
    }
) {
    // Ensure match exists in DB
    await prisma.match.upsert({
        where: { id: matchId },
        update: {
            // Optional: update status if it changed, but for now keep it simple or update strictly
            status: matchMeta.status,
        },
        create: {
            id: matchId,
            homeTeam: matchMeta.homeTeam,
            awayTeam: matchMeta.awayTeam,
            date: new Date(matchMeta.date),
            status: matchMeta.status,
        },
    });

    // Use upsert to create or update
    await prisma.prediction.upsert({
        where: {
            userId_matchId: {
                userId,
                matchId,
            },
        },
        update: {
            homeScore,
            awayScore,
        },
        create: {
            userId,
            matchId,
            homeScore,
            awayScore,
        },
    });

    // Revalidate path if needed, or just return success
    return { success: true };
}

/**
 * Submit or update a bracket prediction (for knockout stages)
 */
export async function submitBracketPrediction(
    userId: string,
    stage: string,
    position: number,
    homeTeamId: number | null,
    awayTeamId: number | null,
    homeTeamName: string | null,
    awayTeamName: string | null,
    homeScore: number | null,
    awayScore: number | null
) {
    await prisma.bracketPrediction.upsert({
        where: {
            userId_stage_position: {
                userId,
                stage,
                position,
            },
        },
        update: {
            homeTeamId,
            awayTeamId,
            homeTeamName,
            awayTeamName,
            homeScore,
            awayScore,
            updatedAt: new Date(),
        },
        create: {
            userId,
            stage,
            position,
            homeTeamId,
            awayTeamId,
            homeTeamName,
            awayTeamName,
            homeScore,
            awayScore,
        },
    });

    return { success: true };
}

/**
 * Get all bracket predictions for a user
 */
export async function getUserBracketPredictions(userId: string) {
    const predictions = await prisma.bracketPrediction.findMany({
        where: { userId },
    });
    return predictions;
}

/**
 * Get bracket predictions for a specific stage
 */
export async function getUserBracketPredictionsByStage(userId: string, stage: string) {
    const predictions = await prisma.bracketPrediction.findMany({
        where: { userId, stage },
        orderBy: { position: 'asc' },
    });
    return predictions;
}
