# Billu Extension Test Script
# This script helps with testing and development of the Billu extension

Write-Host "🐱 Billu Extension Test Helper" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

$extensionPath = Get-Location
Write-Host "Extension path: $extensionPath" -ForegroundColor Yellow

# Check if all required files exist
$requiredFiles = @(
    "manifest.json",
    "content.js", 
    "content.css",
    "background.js",
    "newtab.html",
    "newtab.js",
    "popup.html",
    "popup.js",
    "test-page.html"
)

Write-Host "`nChecking required files..." -ForegroundColor Cyan
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file (missing)" -ForegroundColor Red
    }
}

# Open test page
Write-Host "`nOpening test page..." -ForegroundColor Cyan
$testPagePath = Join-Path $extensionPath "test-page.html"
if (Test-Path $testPagePath) {
    Start-Process $testPagePath
    Write-Host "✓ Test page opened in browser" -ForegroundColor Green
} else {
    Write-Host "✗ Test page not found" -ForegroundColor Red
}

# Display extension loading instructions
Write-Host "`nTo load the extension in Edge:" -ForegroundColor Cyan
Write-Host "1. Open Edge browser" -ForegroundColor White
Write-Host "2. Navigate to edge://extensions/" -ForegroundColor White
Write-Host "3. Enable 'Developer mode'" -ForegroundColor White
Write-Host "4. Click 'Load unpacked'" -ForegroundColor White
Write-Host "5. Select this folder: $extensionPath" -ForegroundColor White

Write-Host "`nTesting checklist:" -ForegroundColor Cyan
Write-Host "□ Billu appears after 3 seconds" -ForegroundColor White
Write-Host "□ Shows loading state first" -ForegroundColor White  
Write-Host "□ Displays AI-generated message" -ForegroundColor White
Write-Host "□ Double-click to hide works" -ForegroundColor White
Write-Host "□ Doesn't appear while typing" -ForegroundColor White
Write-Host "□ Speech bubble is properly positioned" -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
