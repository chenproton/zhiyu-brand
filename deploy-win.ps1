# deploy-win.ps1 - Windows 部署脚本（分步执行，支持密码输入）
# 用法: powershell -ExecutionPolicy Bypass -File .\deploy-win.ps1

$RemoteHost = "47.251.48.187"
$RemoteUser = "root"
$RemoteBase = "/var/www"
$SiteName = "brand"
$Port = 3004
$SshPort = 22
$RemoteDir = "$RemoteBase/$SiteName"
$LocalDir = $PSScriptRoot

Write-Host ""
Write-Host "🚀 Next.js 部署脚本 (Windows)"
Write-Host "   目标服务器: $RemoteUser@$RemoteHost`:$SshPort"
Write-Host "   部署站点: $SiteName (端口 $Port)"
Write-Host ""

# 检查命令
$ssh = Get-Command ssh -ErrorAction SilentlyContinue
$scp = Get-Command scp -ErrorAction SilentlyContinue
if (-not $ssh) {
    Write-Host "❌ 未找到 ssh 命令"
    exit 1
}
if (-not $scp) {
    Write-Host "❌ 未找到 scp 命令"
    exit 1
}

# 步骤1: 打包
Write-Host "[1/4] 打包本地代码..."
$tarPath = "$env:TEMP\brand-deploy.tar.gz"
$gitBashTar = "C:\Program Files\Git\usr\bin\tar.exe"

if (Test-Path $tarPath) {
    Remove-Item $tarPath -Force
}

if (Test-Path $gitBashTar) {
    & $gitBashTar -czf $tarPath --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='*.log' --exclude='.DS_Store' -C $LocalDir .
    Write-Host "       ✅ 打包完成"
} else {
    Write-Host "❌ 未找到 Git tar 命令，请安装 Git for Windows"
    exit 1
}

# 步骤2: 上传
Write-Host ""
Write-Host "[2/4] 上传代码到服务器..."
Write-Host "       正在通过 scp 上传，请根据提示输入服务器密码..."
Write-Host ""

$scpArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-P", $SshPort,
    $tarPath,
    "$RemoteUser@${RemoteHost}:/tmp/brand-deploy.tar.gz"
)
& scp @scpArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 上传失败，请检查密码和网络连接"
    exit 1
}

Write-Host ""
Write-Host "       ✅ 上传完成"

# 步骤3: 远程部署
Write-Host ""
Write-Host "[3/4] 服务器编译并启动服务..."
Write-Host "       正在连接服务器执行部署，请根据提示输入密码..."
Write-Host ""

$remoteScript = 'set -e' + "`n" +
    'cd ' + $RemoteDir + "`n" +
    'echo "解压代码..."' + "`n" +
    'tar -xzf /tmp/brand-deploy.tar.gz -C ' + $RemoteDir + "`n" +
    'rm -f /tmp/brand-deploy.tar.gz' + "`n" +
    'export PATH="$HOME/.local/share/pnpm:$PATH"' + "`n" +
    'if ! command -v pnpm &> /dev/null; then' + "`n" +
    '    echo "安装 pnpm..."' + "`n" +
    '    npm install -g pnpm' + "`n" +
    'fi' + "`n" +
    'echo "安装依赖..."' + "`n" +
    'pnpm install' + "`n" +
    'if [ -d "platform-navigation-shell" ]; then' + "`n" +
    '    echo "构建 platform-navigation-shell..."' + "`n" +
    '    cd platform-navigation-shell && npm run build && cd ..' + "`n" +
    'fi' + "`n" +
    'echo "Next.js 编译中..."' + "`n" +
    'pnpm build' + "`n" +
    'if ! command -v pm2 &> /dev/null; then' + "`n" +
    '    echo "安装 PM2..."' + "`n" +
    '    npm install -g pm2' + "`n" +
    'fi' + "`n" +
    'pm2 startup systemd &>/dev/null || true' + "`n" +
    'if pm2 list | grep -q "' + $SiteName + '"; then' + "`n" +
    '    echo "重启 ' + $SiteName + ' ..."' + "`n" +
    '    pm2 restart ecosystem.config.js' + "`n" +
    'else' + "`n" +
    '    echo "首次启动 ' + $SiteName + ' (端口 ' + $Port + ')..."' + "`n" +
    '    pm2 start ecosystem.config.js' + "`n" +
    'fi' + "`n" +
    'pm2 save' + "`n" +
    'echo "✅ 部署完成"'

$sshArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-p", $SshPort,
    "$RemoteUser@${RemoteHost}",
    $remoteScript
)

& ssh @sshArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 远程部署失败"
    exit 1
}

# 步骤4: 检查状态
Write-Host ""
Write-Host "[4/4] 检查服务状态..."
Start-Sleep -Seconds 2

$checkScript = 'pm2 show ' + $SiteName + ' 2>/dev/null | grep -E "name|status|memory|uptime" || echo "⚠️ 未找到进程"'
$checkArgs = @(
    "-o", "StrictHostKeyChecking=no",
    "-p", $SshPort,
    "$RemoteUser@${RemoteHost}",
    $checkScript
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
