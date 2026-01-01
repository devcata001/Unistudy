#!/bin/bash

# 🔧 UniStudy Deployment Troubleshooting Script
# Run this to diagnose and fix deployment issues

set -e

echo "🔍 UniStudy Deployment Health Check"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Check Backend URL
BACKEND_URL="${RENDER_EXTERNAL_URL:-http://localhost:3001}"
ADMIN_API="${BACKEND_URL}/api/health"

echo -e "${BLUE}1. Backend Health Check${NC}"
echo "   Testing: $ADMIN_API"

if curl -s -I "$ADMIN_API" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is reachable${NC}"
    HEALTH=$(curl -s "$ADMIN_API")
    echo "   Response: $HEALTH"
else
    echo -e "${RED}❌ Backend is NOT reachable${NC}"
    echo "   Make sure:"
    echo "   1. Root Directory is: apps/server"
    echo "   2. Build Command is: npm install && npm run build"
    echo "   3. Start Command is: npm run start:prod"
    echo "   4. Health Check Path is: /api/health"
    echo ""
fi

# 2. Check Environment Variables
echo ""
echo -e "${BLUE}2. Environment Variables Check${NC}"

REQUIRED_VARS=("DATABASE_URL" "JWT_SECRET" "JWT_REFRESH_SECRET" "GEMINI_API_KEY" "ALLOWED_ORIGINS" "ADMIN_PASSWORD")

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Missing: $var${NC}"
    else
        VALUE="${!var}"
        if [ ${#VALUE} -gt 20 ]; then
            VALUE="${VALUE:0:20}..."
        fi
        echo -e "${GREEN}✅ Set: $var = $VALUE${NC}"
    fi
done

# 3. Check Frontend Config
echo ""
echo -e "${BLUE}3. Frontend Configuration${NC}"
FRONTEND_URL="${NEXT_PUBLIC_API_URL:-not-set}"
echo "   NEXT_PUBLIC_API_URL: $FRONTEND_URL"

if [ "$FRONTEND_URL" = "not-set" ]; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_API_URL not set on Vercel${NC}"
    echo "   Add to Vercel Environment Variables:"
    echo "   NEXT_PUBLIC_API_URL=https://your-api.onrender.com"
fi

# 4. Check Database
echo ""
echo -e "${BLUE}4. Database Connection Test${NC}"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
else
    echo -e "${GREEN}✅ DATABASE_URL is set${NC}"
    # Extract host from connection string
    DB_HOST=$(echo "$DATABASE_URL" | grep -oP '(?<=@)[^:]+' || echo "unknown")
    echo "   Host: $DB_HOST"
fi

# 5. Check Admin Credentials
echo ""
echo -e "${BLUE}5. Admin Credentials${NC}"

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
    echo -e "${YELLOW}⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set${NC}"
    echo "   Default credentials (for first login only):"
    echo "   Username: admin"
    echo "   Password: (check your .env)"
else
    echo -e "${GREEN}✅ Admin credentials configured${NC}"
fi

# 6. Check CORS
echo ""
echo -e "${BLUE}6. CORS Configuration${NC}"

if [ -z "$ALLOWED_ORIGINS" ]; then
    echo -e "${RED}❌ ALLOWED_ORIGINS not set${NC}"
else
    echo -e "${GREEN}✅ ALLOWED_ORIGINS = $ALLOWED_ORIGINS${NC}"
    echo "   Make sure to include both:"
    echo "   - https://your-frontend.vercel.app"
    echo "   - https://www.your-frontend.vercel.app"
fi

# Summary
echo ""
echo "===================================="
echo -e "${BLUE}📋 Summary${NC}"
echo ""
echo "If backend is NOT reachable:"
echo "  1. Check Render build logs for errors"
echo "  2. Verify all ENV variables are set"
echo "  3. Check database connection"
echo "  4. Redeploy with 'Clear build cache' enabled"
echo ""
echo "If backend IS reachable but frontend shows errors:"
echo "  1. Check browser DevTools → Network tab"
echo "  2. Verify NEXT_PUBLIC_API_URL on Vercel"
echo "  3. Check CORS errors"
echo "  4. Verify ALLOWED_ORIGINS includes frontend URL"
echo ""
echo "For admin dashboard issues:"
echo "  1. Go to https://your-frontend.com/admin/login"
echo "  2. Use admin credentials from .env"
echo "  3. Check browser console for errors"
echo "  4. Verify backend /api/admin/* endpoints exist"
echo ""
