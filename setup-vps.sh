#!/usr/bin/env bash
# ==============================================================================
# LING PETSHOP - SCRIPT DE INSTALAÇÃO E DEPLOY AUTOMÁTICO (UBUNTU VPS)
# ==============================================================================
# Este script limpa configurações antigas, instala Node.js 20 LTS, Nginx,
# compila a loja e coloca no ar com suporte a SPA e alta performance.
# ==============================================================================

set -e

echo "=========================================================="
echo "🐾 INICIANDO CONFIGURAÇÃO PROFISSIONAL DA LING PETSHOP"
echo "=========================================================="

# 1. Atualizar pacotes do sistema
echo "📦 [1/6] Atualizando pacotes do sistema..."
sudo apt-get update -y
sudo apt-get install -y curl git nginx ufw

# 2. Instalar Node.js 20.x LTS oficial (se não estiver instalado ou desatualizado)
echo "⚡ [2/6] Verificando e instalando Node.js 20 LTS oficial..."
NODE_VER=$(node -v 2>/dev/null || echo "none")
if [[ "$NODE_VER" != v20* && "$NODE_VER" != v22* ]]; then
  echo "Instalando NodeSource 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "✓ Node.js versão: $(node -v)"
echo "✓ NPM versão: $(npm -v)"

# 3. Liberar portas no Firewall UFW
echo "🛡️ [3/6] Liberando portas 80 (HTTP), 443 (HTTPS) e 22 (SSH)..."
sudo ufw allow 22/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true
sudo ufw allow 'Nginx Full' || true

# 4. Instalar dependências e compilar a loja
echo "🔨 [4/6] Instalando dependências e compilando o site..."
# Se rodando de dentro do diretório do projeto
if [ -f "package.json" ]; then
  npm install
  npm run build
else
  echo "Erro: execute este script dentro da pasta do projeto onde está o package.json!"
  exit 1
fi

# 5. Configurar pasta de produção
echo "📂 [5/6] Configurando pasta pública de produção (/var/www/lingpetshop)..."
sudo mkdir -p /var/www/lingpetshop
sudo cp -r dist/* /var/www/lingpetshop/
sudo chown -R www-data:www-data /var/www/lingpetshop
sudo chmod -R 755 /var/www/lingpetshop

# 6. Configurar Nginx com suporte completo a SPA (evita erros 404 nas páginas)
echo "🌐 [6/6] Configurando Nginx para servir a loja..."
cat << 'EOF' | sudo tee /etc/nginx/sites-available/lingpetshop > /dev/null
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name lingpetshop.com www.lingpetshop.com _;

    root /var/www/lingpetshop;
    index index.html;

    # Compressão Gzip para velocidade máxima
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache eficiente para imagens e scripts
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# Ativar o site no Nginx e desativar default antigo
sudo rm -f /etc/nginx/sites-enabled/default || true
sudo ln -sf /etc/nginx/sites-available/lingpetshop /etc/nginx/sites-enabled/lingpetshop

# Testar configuração e reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=========================================================="
echo "🎉 SUCESSO! A LING PETSHOP ESTÁ NO AR!"
echo "=========================================================="
echo "Abra o navegador e acesse:"
echo "👉 http://SEU_IP_DA_VPS"
echo "👉 http://lingpetshop.com (assim que o DNS propagar)"
echo "=========================================================="
