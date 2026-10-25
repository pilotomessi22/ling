#!/usr/bin/env bash
# Deploy da loja na VPS.
# Substitui public/run_vps.sh, public/run_full_vps.sh e public/deploy.py, que embutiam uma cópia
# antiga do código (com a chave da Stripe dentro) e eram servidos publicamente pelo site.
#
# Agora o código vem direto do GitHub, então o deploy sempre sobe a versão atual.
#
# Uso na VPS (na primeira vez ou em toda atualização):
#   bash deploy/deploy-vps.sh                 # branch main
#   BRANCH=outra-branch bash deploy/deploy-vps.sh
#
# Repositório privado: use REPO_URL com token, ex.:
#   REPO_URL=https://<token>@github.com/pilotomessi22/ling.git bash deploy/deploy-vps.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/lingpetshop}"
REPO_URL="${REPO_URL:-https://github.com/pilotomessi22/ling.git}"
BRANCH="${BRANCH:-main}"
PM2_NAME="${PM2_NAME:-lingpetshop}"

echo "🚀 Deploy da loja em ${APP_DIR} (branch ${BRANCH})"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Dados de produção que não podem ser sobrescritos pelo código do repositório
BACKUP_DIR="$(mktemp -d)"
for f in .env orders.json; do
  [ -f "$f" ] && cp "$f" "$BACKUP_DIR/"
done

if [ ! -d .git ]; then
  echo "📥 Primeira vez: ligando a pasta ao repositório"
  git init -q
  git remote add origin "$REPO_URL"
fi
git remote set-url origin "$REPO_URL"
git fetch -q origin "$BRANCH"
git checkout -q -f -B "$BRANCH" "origin/$BRANCH"

for f in .env orders.json; do
  [ -f "$BACKUP_DIR/$f" ] && cp "$BACKUP_DIR/$f" "$f"
done
rm -rf "$BACKUP_DIR"

if [ ! -f .env ]; then
  echo "⚠️  Arquivo .env não encontrado em ${APP_DIR}. Crie com STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ADMIN_SECRET_TOKEN, APP_URL e RESEND_API_KEY antes de abrir a loja."
fi

echo "📦 Instalando dependências..."
# --legacy-peer-deps: vite e tsx pedem versões diferentes do esbuild e o npm recusa sem essa opção
npm install --legacy-peer-deps

echo "🔨 Compilando o site..."
npm run build

echo "🚀 Reiniciando no pm2 (porta 3000, modo produção)..."
# NODE_ENV=production: serve o site compilado (dist). Sem isso o servidor sobe o Vite de desenvolvimento.
pm2 delete "$PM2_NAME" >/dev/null 2>&1 || true
NODE_ENV=production pm2 start "npx tsx server.ts" --name "$PM2_NAME" --update-env
pm2 save

echo "🎉 Loja no ar. Teste: curl -s http://localhost:3000/api/health"
