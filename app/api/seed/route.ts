import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// IMPORTANT: This is a one-time seed endpoint
// Delete this file after seeding for security!

export async function GET() {
    try {
        // Check if already seeded
        const agencyCount = await prisma.agency.count();

        if (agencyCount > 0) {
            return NextResponse.json({
                message: 'Database already seeded',
                agencies: agencyCount,
                status: 'already_seeded'
            });
        }

        // Import the seed data (you'll need to adapt this based on your CSV structure)
        // For now, let's create a few sample records to test

        // Sample agencies
        const sampleAgencies = [
            { id: '1', name: 'Sample Agency 1', state: 'CA', website: 'https://example.com' },
            { id: '2', name: 'Sample Agency 2', state: 'NY', website: 'https://example.com' },
            { id: '3', name: 'Sample Agency 3', state: 'TX', website: 'https://example.com' },
        ];

        // Insert agencies
        for (const agency of sampleAgencies) {
            await prisma.agency.create({
                data: agency
            });
        }

        // Sample contacts
        const sampleContacts = [
            { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-0001', agencyId: '1' },
            { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '555-0002', agencyId: '1' },
            { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '555-0003', agencyId: '2' },
        ];

        // Insert contacts
        for (const contact of sampleContacts) {
            await prisma.contact.create({
                data: contact
            });
        }

        const finalAgencyCount = await prisma.agency.count();
        const finalContactCount = await prisma.contact.count();

        return NextResponse.json({
            message: 'Database seeded successfully!',
            agencies: finalAgencyCount,
            contacts: finalContactCount,
            status: 'success',
            note: 'DELETE THIS API ROUTE NOW FOR SECURITY!'
        });

    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({
            message: 'Error seeding database',
            error: error.message,
            status: 'error'
        }, { status: 500 });
    }
}
