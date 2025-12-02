#!/bin/bash

# Script to seed production database
# Run this locally to populate your Vercel production database

echo "🌱 Production Database Seeding Script"
echo "======================================"
echo ""

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: No database URL provided"
    echo ""
    echo "Usage:"
    echo "  ./seed-production.sh 'your_production_database_url'"
    echo ""
    echo "Get your production DATABASE_URL from:"
    echo "  Vercel Dashboard → Your Project → Settings → Environment Variables"
    echo ""
    exit 1
fi

DATABASE_URL="$1"

echo "📊 Checking database connection..."
echo ""

# Export the DATABASE_URL
export DATABASE_URL

# Run Prisma generate
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run the seed
echo "🌱 Seeding database..."
echo "This may take several minutes for 922 agencies..."
echo ""

npx tsx prisma/seed.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Production database seeded successfully!"
    echo ""
    echo "🔍 Verify by visiting:"
    echo "   https://dashboard-rouge-theta.vercel.app/agencies"
    echo "   https://dashboard-rouge-theta.vercel.app/contacts"
else
    echo ""
    echo "❌ Seeding failed. Check the error messages above."
    exit 1
fi
