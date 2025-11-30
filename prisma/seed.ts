// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

async function main() {
  const agencies: any[] = [];
  const contacts: any[] = [];

  // Use process.cwd() to ensure we find the files correctly from the project root
  const agenciesPath = path.join(process.cwd(), 'prisma', 'agencies_agency_rows.csv');
  const contactsPath = path.join(process.cwd(), 'prisma', 'contacts_contact_rows.csv');

  console.log("Reading CSV files...");

  // 1. Read Agencies
  if (fs.existsSync(agenciesPath)) {
    await new Promise((resolve) => {
      fs.createReadStream(agenciesPath)
        .pipe(csv())
        .on('data', (row) => agencies.push(row))
        .on('end', resolve);
    });
    console.log(`Found ${agencies.length} agencies.`);
  } else {
    console.error(`❌ Error: Could not find ${agenciesPath}`);
    return;
  }

  // 2. Insert Agencies (Upsert handles duplicates)
  console.log("Inserting agencies...");
  for (const a of agencies) {
    await prisma.agency.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        name: a.name,
        state: a.state,
        website: a.website,
      },
    });
  }

  // 3. Read Contacts
  if (fs.existsSync(contactsPath)) {
    await new Promise((resolve) => {
      fs.createReadStream(contactsPath)
        .pipe(csv())
        .on('data', (row) => contacts.push(row))
        .on('end', resolve);
    });
  } else {
    console.error(`❌ Error: Could not find ${contactsPath}`);
    return;
  }

  // 4. Insert Contacts (Changed to upsert to fix the error)
  const validAgencyIds = new Set((await prisma.agency.findMany({ select: { id: true } })).map(a => a.id));
  
  let validCount = 0;
  console.log("Inserting contacts...");
  for (const c of contacts) {
    if (validAgencyIds.has(c.agency_id)) {
      await prisma.contact.upsert({
        where: { id: c.id },
        update: {}, // If it exists, do nothing
        create: {
          id: c.id,
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          phone: c.phone,
          agencyId: c.agency_id,
        },
      });
      validCount++;
    }
  }

  console.log(`✅ Seeding finished. Inserted ${validCount} valid contacts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });