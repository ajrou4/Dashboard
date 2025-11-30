'use server'

import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

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

export async function getUserUsage() {
    try {
        const { userId } = await auth();
        if (!userId) return { count: 0, limit: 50, remaining: 50 };

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const usage = await prisma.userUsage.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            }
        });

        const count = usage?.count || 0;
        const limit = 50;
        const remaining = Math.max(0, limit - count);

        return { count, limit, remaining };
    } catch (error) {
        console.error('Error fetching user usage:', error);
        return { count: 0, limit: 50, remaining: 50 };
    }
}

export async function getContacts() {
    try {
        const { userId } = await auth();
        if (!userId) return { contacts: [], usage: { count: 0, limit: 50, remaining: 50 } };

        const today = new Date().toISOString().split('T')[0];

        // Get or create usage record
        let usage = await prisma.userUsage.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            }
        });

        if (!usage) {
            usage = await prisma.userUsage.create({
                data: {
                    userId,
                    date: today,
                    count: 0
                }
            });
        }

        const remaining = Math.max(0, 50 - usage.count);

        // If limit reached, return empty contacts
        if (remaining === 0) {
            return {
                contacts: [],
                usage: { count: usage.count, limit: 50, remaining: 0 }
            };
        }

        // Fetch contacts (limit to remaining views)
        const contacts = await prisma.contact.findMany({
            take: remaining,
            include: {
                agency: {
                    select: {
                        name: true,
                        state: true
                    }
                }
            },
            orderBy: {
                lastName: 'asc'
            }
        });

        // Update usage count
        const newCount = usage.count + contacts.length;
        await prisma.userUsage.update({
            where: {
                userId_date: {
                    userId,
                    date: today
                }
            },
            data: {
                count: newCount
            }
        });

        return {
            contacts,
            usage: { count: newCount, limit: 50, remaining: Math.max(0, 50 - newCount) }
        };
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return { contacts: [], usage: { count: 0, limit: 50, remaining: 50 } };
    }
}
