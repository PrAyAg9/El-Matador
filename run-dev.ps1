# PowerShell script to run the development environment
# This script helps with running the dev environment since PowerShell doesn't support the && operator
Write-Host "Starting Financial Assistant Development Environment" -ForegroundColor Green

# Set the Node.js environment variables
$env:NODE_ENV = "development"

# Check if necessary environment variables are set
if (-not (Test-Path .env.local)) {
    Write-Host "Warning: .env.local file not found. Some features may not work correctly." -ForegroundColor Yellow
}

# Check if the Gemini API key is set
$envContent = Get-Content .env.local -ErrorAction SilentlyContinue
$hasGeminiKey = $envContent | Where-Object { $_ -match "NEXT_PUBLIC_GEMINI_API_KEY" }
if (-not $hasGeminiKey) {
    Write-Host "Warning: NEXT_PUBLIC_GEMINI_API_KEY not found in .env.local." -ForegroundColor Yellow
    Write-Host "AI features may not work correctly." -ForegroundColor Yellow
}

# Try to start Firebase emulators in a separate process
try {
    Write-Host "Attempting to start Firebase emulators in background..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-Command firebase emulators:start" -WindowStyle Minimized
    Write-Host "Firebase emulators starting in separate window." -ForegroundColor Green
    Start-Sleep -Seconds 5 # Give emulators time to start
} catch {
    Write-Host "Could not start Firebase emulators: $_" -ForegroundColor Red
    Write-Host "Continuing with Next.js only..." -ForegroundColor Yellow
}

# Start Next.js development server
Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
npm run dev

# Notes about how to use this script - displayed when script finishes or is interrupted
function Show-Notes {
    Write-Host "`nFinancial Assistant Development Environment" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "• Next.js runs on: http://localhost:3000" -ForegroundColor White
    Write-Host "• Firebase Emulators UI: http://localhost:4000" -ForegroundColor White
    Write-Host "• To test without Firebase, use the Test User login option" -ForegroundColor White
    Write-Host "• If you encounter auth errors, make sure Google provider is enabled in Firebase console" -ForegroundColor White
}

# Register the exit handler
$null = Register-ObjectEvent -InputObject ([System.Console]) -EventName CancelKeyPress -Action {
    Show-Notes
}

# Show the notes when the script completes
Show-Notes 