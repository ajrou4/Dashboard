'use server'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAgencies() {
    try {
        const agencies = await prisma.agency.findMany({
            include: {
                _count: {
                    select: { contacts: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return agencies;
    } catch (error) {
        console.error('Error fetching agencies:', error);
        return [];
    }
}
