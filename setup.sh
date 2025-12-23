#!/bin/bash

# LAUTECH Study Hub - Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🎓 LAUTECH Study Hub - Setup Script"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18 or higher${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) is installed${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not installed${NC}"
    echo "Please install PostgreSQL v15 or higher from https://www.postgresql.org/"
    echo "You can continue, but you'll need to install it before running the app."
else
    echo -e "${GREEN}✅ PostgreSQL is installed${NC}"
fi

echo ""
echo "Installing dependencies..."
echo "=========================="

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd apps/server
npm install
cd ../..

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
echo ""

# Setup environment variables
echo "Setting up environment variables..."
echo "==================================="

if [ ! -f .env ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and update the following:${NC}"
    echo "   - DATABASE_URL (your PostgreSQL connection string)"
    echo "   - JWT_SECRET (run: openssl rand -base64 32)"
    echo "   - JWT_REFRESH_SECRET (run: openssl rand -base64 32)"
    echo "   - GEMINI_API_KEY (get from https://makersuite.google.com/app/apikey)"
    echo ""
    echo -e "${YELLOW}Press Enter after you've updated .env${NC}"
    read
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo ""
echo "Database Setup"
echo "=============="

# Ask if user wants to create database
read -p "Do you want to create the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Extract database name from .env
    DB_NAME=$(grep DATABASE_URL .env | cut -d'=' -f2 | sed 's/.*\/\([^?]*\).*/\1/')
    echo "Creating database: $DB_NAME"
    
    # Try to create database
    if command -v psql &> /dev/null; then
        createdb "$DB_NAME" 2>/dev/null || echo "Database might already exist"
        echo -e "${GREEN}✅ Database created/exists${NC}"
    else
        echo -e "${YELLOW}⚠️  Please create the database manually:${NC}"
        echo "   createdb $DB_NAME"
    fi
fi

echo ""
echo "Running Prisma Setup"
echo "===================="

cd apps/server

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"

# Ask if user wants to run migrations
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running migrations..."
    npx prisma migrate dev --name init
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${YELLOW}⚠️  Remember to run migrations before starting the app:${NC}"
    echo "   cd apps/server && npx prisma migrate dev"
fi

# Ask if user wants to seed database
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    npm run prisma:seed 2>/dev/null || echo "Seed script not implemented yet"
fi

cd ../..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Make sure your .env file is properly configured"
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "The application will be available at:"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"
echo "   Frontend: http://localhost:3000 (when created)"
echo ""
echo "For more information, see README.md"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
