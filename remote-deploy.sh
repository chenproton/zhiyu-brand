#!/bin/bash
# remote-deploy.sh - 在服务器上执行的部署脚本
set -e

REMOTE_DIR="/var/www/brand"
SITE_NAME="brand"
PORT="3004"

cd "$REMOTE_DIR"

echo "解压代码..."
tar -xzf /tmp/brand-deploy.tar.gz -C "$REMOTE_DIR"
rm -f /tmp/brand-deploy.tar.gz

export PATH="$HOME/.local/share/pnpm:$PATH"

if ! command -v pnpm &> /dev/null; then
    echo "安装 pnpm..."
    npm install -g pnpm
fi

echo "安装依赖..."
pnpm install

if [ -d "platform-navigation-shell" ]; then
    echo "构建 platform-navigation-shell..."
    cd platform-navigation-shell && npm run build && cd ..
fi

echo "Next.js 编译中..."
pnpm build

if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

pm2 startup systemd &>/dev/null || true

if pm2 list | grep -q "$SITE_NAME"; then
    echo "重启 $SITE_NAME ..."
    pm2 restart ecosystem.config.js
else
    echo "首次启动 $SITE_NAME (端口 $PORT)..."
    pm2 start ecosystem.config.js
fi

pm2 save
echo "✅ 部署完成"
