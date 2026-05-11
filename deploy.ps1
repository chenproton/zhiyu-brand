# deploy.ps1 - Windows PowerShell 部署脚本
# 用法: .\deploy.ps1 -RemotePass "你的密码"

param(
    [string]$RemoteHost = "47.251.48.187",
    [string]$RemoteUser = "root",
    [string]$RemoteBase = "/var/www",
    [string]$SiteName = "brand",
    [int]$Port = 3004,
    [Parameter(Mandatory=$true)]
    [string]$RemotePass,
    [int]$SshPort = 22
)

$RemoteDir = "$RemoteBase/$SiteName"
$LocalDir = $PSScriptRoot

Write-Host ""
Write-Host "🚀 Next.js 部署脚本 (PowerShell)"
Write-Host "   目标服务器: $RemoteUser@$RemoteHost"
Write-Host "   部署站点: $SiteName (端口 $Port)"
Write-Host ""

# 检查必要命令
$ssh = Get-Command ssh -ErrorAction SilentlyContinue
$scp = Get-Command scp -ErrorAction SilentlyContinue
if (-not $ssh -or -not $scp) {
    Write-Host "❌ 需要 ssh 和 scp 命令"
    exit 1
}

# 创建临时 tar 包（排除不需要的文件）
Write-Host "[1/4] 打包本地代码..."
$tarPath = "$env:TEMP\brand-deploy.tar.gz"
$excludePatterns = @("node_modules", ".git", ".next", "*.log", ".DS_Store")

# 使用 7z 或 tar（Git Bash 自带）
$gitBashTar = "C:\Program Files\Git\usr\bin\tar.exe"
if (Test-Path $gitBashTar) {
    $excludeArgs = $excludePatterns | ForEach-Object { "--exclude=$_" }
    & $gitBashTar -czf $tarPath @excludeArgs -C $LocalDir .
} else {
    Write-Host "❌ 找不到 tar 命令，请安装 Git for Windows"
    exit 1
}

Write-Host "       打包完成: $tarPath"

# 上传 tar 包
Write-Host ""
Write-Host "[2/4] 上传代码到服务器..."
$scpArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-P", $SshPort,
    $tarPath,
    "$RemoteUser@${RemoteHost}:/tmp/brand-deploy.tar.gz"
)
& scp @scpArgs 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 上传失败"
    exit 1
}

# 远程解压并部署
Write-Host ""
Write-Host "[3/4] 服务器编译并启动服务..."

$remoteScript = @"
set -e
cd $RemoteDir

# 备份当前代码
cp -r . ../brand-backup-\$(date +%Y%m%d%H%M%S) 2>/dev/null || true

# 解压新代码
tar -xzf /tmp/brand-deploy.tar.gz -C $RemoteDir
rm -f /tmp/brand-deploy.tar.gz

# 安装依赖
export PATH="\$HOME/.local/share/pnpm:\$PATH"
if ! command -v pnpm &> /dev/null; then
    echo "正在安装 pnpm..."
    npm install -g pnpm
fi

echo "安装依赖..."
pnpm install

# 构建子项目
if [ -d "platform-navigation-shell" ]; then
    echo "构建 platform-navigation-shell..."
    cd platform-navigation-shell && npm run build && cd ..
fi

# 构建 Next.js
echo "Next.js 编译中..."
pnpm build

# 启动/重启服务
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

pm2 startup systemd &>/dev/null || true

if pm2 list | grep -q "$SiteName"; then
    echo "重启 $SiteName ..."
    pm2 restart ecosystem.config.js
else
    echo "首次启动 $SiteName (端口 $Port)..."
    pm2 start ecosystem.config.js
fi

pm2 save
echo "PM2 进程已保存"
"@

$sshArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-p", $SshPort,
    "$RemoteUser@${RemoteHost}",
    $remoteScript
)

# 使用 sshpass 或 expect 处理密码输入
# 如果没有 sshpass，尝试用 plink (PuTTY)
$sshpass = Get-Command sshpass -ErrorAction SilentlyContinue
if ($sshpass) {
    $sshpassArgs = @("-p", $RemotePass, "ssh") + $sshArgs
    & sshpass @sshpassArgs
} else {
    Write-Host "⚠️ 未找到 sshpass，尝试使用 ssh 的密码输入方式..."
    # 使用 echo 管道传密码（某些 ssh 版本支持）
    $process = Start-Process -FilePath "ssh" -ArgumentList $sshArgs -RedirectStandardInput (New-TemporaryFile).FullName -NoNewWindow -Wait -PassThru
}

# 检查状态
Write-Host ""
Write-Host "[4/4] 检查服务状态..."
Start-Sleep -Seconds 2
$checkArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-p", $SshPort,
    "$RemoteUser@${RemoteHost}",
    "pm2 show $SiteName 2>/dev/null | grep -E 'name|status|memory|uptime' || echo '⚠️ 未找到进程'"
)
& ssh @checkArgs 2>$null

Write-Host ""
Write-Host "✅ $SiteName 部署完成"
Write-Host "   访问地址: http://$RemoteHost`:$Port"
Write-Host ""
Write-Host "📋 常用命令:"
Write-Host "   查看日志: ssh $RemoteUser@$RemoteHost 'pm2 logs $SiteName'"
Write-Host "   重启服务: ssh $RemoteUser@$RemoteHost 'pm2 restart $SiteName'"
Write-Host ""
Write-Host "Done."
