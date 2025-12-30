# 🚀 Quick Start Guide - LAUTECH Study Hub

Get up and running in under 10 minutes!

## Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL v15+ installed and running
- [ ] npm v9+ installed
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Google Gemini API key (free at https://makersuite.google.com/app/apikey)

## Step-by-Step Setup

### 1. Clone the Repository (2 minutes)

```bash
git clone https://github.com/yourusername/lautech-study-hub.git
cd lautech-study-hub
```

### 2. Run the Setup Script (5 minutes)

**On Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

**On Windows (PowerShell):**

```powershell
# Install dependencies
npm install
cd apps/server
npm install
cd ../..

# Copy environment file
copy .env.example .env

# Edit .env with your settings
notepad .env
```

### 3. Configure Environment Variables (2 minutes)

Open `.env` and update these required fields:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/lautech_study_hub"

# JWT secrets - generate and set strong, distinct values (do not check into git)
JWT_SECRET="<32+_byte_base64_secret>"
JWT_REFRESH_SECRET="<32+_byte_base64_secret_different_from_JWT_SECRET>"

# Google Gemini API
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Setup Database (1 minute)

```bash
# Create database
createdb lautech_study_hub

# Run migrations
cd apps/server
npx prisma generate
npx prisma migrate dev --name init
cd ../..
```

### 5. Start the Application (30 seconds)

```bash
npm run dev
```

That's it! 🎉

## Access Your Application

- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Database Studio**: Run `npm run prisma:studio` to open at http://localhost:5555

## Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@lautech.edu.ng",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "department": "Computer Science",
    "faculty": "Faculty of Engineering"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@lautech.edu.ng",
    "password": "SecurePass123!"
  }'
```

Copy the `accessToken` from the response.

### 3. Get Your Profile

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Common Issues & Solutions

### Issue: "Port 3001 already in use"

**Solution:**

```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port in .env
PORT=3002
```

### Issue: "Cannot connect to database"

**Solution:**

1. Make sure PostgreSQL is running:

```bash
# On Linux
sudo systemctl status postgresql

# On Mac
brew services list | grep postgresql

# On Windows
# Check Services app for PostgreSQL
```

2. Verify your `DATABASE_URL` in `.env`
3. Test connection:

```bash
psql -U your_username -d lautech_study_hub
```

### Issue: "Prisma Client not generated"

**Solution:**

```bash
cd apps/server
npx prisma generate
cd ../..
```

### Issue: "Module not found" errors

**Solution:**

```bash
# Clean install
rm -rf node_modules apps/*/node_modules
npm install
cd apps/server && npm install && cd ../..
```

## What's Next?

Now that your backend is running:

1. **Explore the API**: Visit http://localhost:3001/api/docs
2. **Create sample data**: Add courses, materials, and test the AI tutor
3. **Build the frontend**: See [Frontend Development Guide](./FRONTEND.md)
4. **Customize**: Modify according to your needs

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# In separate terminals:
npm run prisma:studio    # View/edit database
```

### Making Database Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
cd apps/server
npx prisma migrate dev --name your_change
cd ../..
```

### Adding New Features

```bash
# 1. Create NestJS module
cd apps/server
nest g module feature-name
nest g service feature-name
nest g controller feature-name

# 2. Implement your feature
# 3. Test the endpoints
```

## Need Help?

- 📖 Read the [Full Documentation](../README.md)
- 🏗️ Check [Architecture Guide](./ARCHITECTURE.md)
- 💬 Ask questions on [Discord/GitHub Issues]
- 📧 Email: support@lautechstudyhub.com

## Quick Commands Reference

```bash
# Development
npm run dev              # Start both backend and frontend
npm run dev:server       # Start backend only
npm run dev:web          # Start frontend only

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Seed database

# Build & Deploy
npm run build            # Build for production
npm start                # Start production server

# Maintenance
npm run lint             # Lint code
npm run format           # Format code
npm test                 # Run tests
```

## Tips for Success

1. **Use Environment Variables**: Never commit secrets
2. **Read Error Messages**: They usually tell you what's wrong
3. **Use Prisma Studio**: Great for debugging database issues
4. **Check API Docs**: Always refer to http://localhost:3001/api/docs
5. **Test as You Go**: Don't wait until everything is built
6. **Use Git**: Commit often, push regularly

---

**Ready to build something amazing?** Let's go! 🚀

For detailed information, see the [main README](../README.md).
