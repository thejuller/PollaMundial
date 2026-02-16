import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                points: true,
                createdAt: true
            }
        });

        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

export async function isAdmin() {
    const user = await getCurrentUser();
    return user?.role === 'ADMIN';
}
