#!/bin/bash
# ==============================================================================
# Ling Petshop - Safe Isolated Test Environment Deployment Script
# Target Directory: /root/ling (TEST ENVIRONMENT ONLY)
# NEVER run this script in /root/ling-petshop-store (PRODUCTION)
# ==============================================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Ling Petshop Test Environment Deployment ===${NC}"

# 1. Safety check: ensure current directory is /root/ling
CURRENT_DIR=$(pwd)
if [ "$CURRENT_DIR" != "/root/ling" ]; then
  echo -e "${RED}[ERROR] Safety abort! You must run this script from /root/ling (Current: $CURRENT_DIR).${NC}"
  echo -e "${RED}Production directory /root/ling-petshop-store is strictly protected.${NC}"
  exit 1
fi

if [ -d "/root/ling-petshop-store" ] && [ "$CURRENT_DIR" = "/root/ling-petshop-store" ]; then
  echo -e "${RED}[ERROR] FATAL: Production directory detected! Aborting immediately.${NC}"
  exit 1
fi

echo -e "${GREEN}[OK] Verified running inside /root/ling test directory.${NC}"

# 2. Create backup of existing files
echo -e "${YELLOW}Creating backups of existing files...${NC}"
mkdir -p backups_$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups_$(date +%Y%m%d_%H%M%S)"
if [ -f "server.ts" ]; then
  cp server.ts "$BACKUP_DIR/"
fi
if [ -f "ecosystem.test.config.js" ]; then
  cp ecosystem.test.config.js "$BACKUP_DIR/"
fi
echo -e "${GREEN}[OK] Backups saved to $BACKUP_DIR${NC}"

# 3. Check for .env.test configuration
if [ ! -f ".env.test" ]; then
  echo -e "${YELLOW}[WARNING] .env.test not found in /root/ling!${NC}"
  if [ -f ".env.test.example" ]; then
    cp .env.test.example .env.test
    echo -e "${YELLOW}Created .env.test from .env.test.example template.${NC}"
  fi
  echo -e "${RED}Please edit .env.test and fill in your Stripe test credentials (sk_test_... and whsec_...) before starting PM2.${NC}"
else
  echo -e "${GREEN}[OK] .env.test file found.${NC}"
fi

# 4. Verify TypeScript and Build
echo -e "${YELLOW}Verifying TypeScript compilation and project build...${NC}"
npm run lint
npm run build
echo -e "${GREEN}[OK] TypeScript linting and build verified successfully.${NC}"

# 5. Start / Restart PM2 test process (ling-checkout-test) without touching production (ling-petshop)
echo -e "${YELLOW}Starting PM2 process 'ling-checkout-test' on port 3002...${NC}"
if pm2 list | grep -q "ling-petshop"; then
  echo -e "${GREEN}[OK] Production process 'ling-petshop' detected and will remain untouched.${NC}"
fi

pm2 startOrReload ecosystem.test.config.js
echo -e "${GREEN}[SUCCESS] Test environment 'ling-checkout-test' successfully started!${NC}"
echo -e "Check logs using: ${YELLOW}pm2 logs ling-checkout-test${NC}"
