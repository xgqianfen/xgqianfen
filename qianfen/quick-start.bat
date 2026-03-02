@echo off
chcp 65001 >nul
echo ========================================
echo 潜江千分游戏 - 快速启动脚本
echo ========================================
echo.

echo [1/3] 检查环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未安装 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

echo [2/3] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo [3/3] 启动开发服务器...
echo.
echo 🎮 游戏即将在浏览器中打开...
echo 📱 访问地址: http://localhost:5173
echo.
echo 按 Ctrl+C 停止服务器
echo.
call npm run dev
pause
