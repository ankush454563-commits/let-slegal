# Let'sLegal Setup Script
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Let'sLegal - Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ROOT_DIR = $PSScriptRoot

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet
    if ($mongoCheck) {
        Write-Host "✓ MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "⚠ MongoDB is not running on port 27017" -ForegroundColor Yellow
        Write-Host "  Please start MongoDB before running the application" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Could not check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Installing Dependencies" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Backend setup
Write-Host "Setting up Backend..." -ForegroundColor Yellow
Set-Location "$ROOT_DIR\backend"
if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "  Please update .env file with your configurations" -ForegroundColor Yellow
}
npm install
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Admin Panel setup
Write-Host "Setting up Admin Panel..." -ForegroundColor Yellow
Set-Location "$ROOT_DIR\admin-panel"
if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
}
npm install
Write-Host "✓ Admin Panel dependencies installed" -ForegroundColor Green
Write-Host ""

# Mobile App setup
Write-Host "Setting up Mobile App..." -ForegroundColor Yellow
Set-Location "$ROOT_DIR\mobile-app"
if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file from .env.example" -ForegroundColor Green
}
npm install
Write-Host "✓ Mobile App dependencies installed" -ForegroundColor Green
Write-Host ""

Set-Location $ROOT_DIR

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Update .env files in each directory with your configurations" -ForegroundColor White
Write-Host "3. Start the applications:" -ForegroundColor White
Write-Host ""
Write-Host "   Backend:      cd backend && npm start" -ForegroundColor Cyan
Write-Host "   Admin Panel:  cd admin-panel && npm start" -ForegroundColor Cyan
Write-Host "   Mobile App:   cd mobile-app && npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Visit README.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
