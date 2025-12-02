<#
.SYNOPSIS
    Tari Universe Build Script for Windows

.DESCRIPTION
    Builds distribution packages for Tari Universe.

.PARAMETER Target
    Target platform: windows, linux, macos, all (default: windows)

.PARAMETER Format
    Build specific format(s): msi, exe, deb, appimage, rpm, dmg
    Multiple formats can be comma-separated.

.PARAMETER Debug
    Build debug version instead of release.

.PARAMETER Clean
    Clean build artifacts before building.

.PARAMETER Verbose
    Show detailed build output.

.EXAMPLE
    .\scripts\build.ps1
    Build for Windows with all formats.

.EXAMPLE
    .\scripts\build.ps1 -Format msi
    Build MSI installer only.

.EXAMPLE
    .\scripts\build.ps1 -Clean -Verbose
    Clean build with detailed output.
#>

param(
    [ValidateSet('windows', 'linux', 'macos', 'all')]
    [string]$Target = 'windows',
    
    [string]$Format,
    
    [switch]$Debug,
    
    [switch]$Clean,
    
    [switch]$Verbose,
    
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Banner {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║               Tari Universe Build Script                      ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Help {
    Write-Host "Tari Universe Build Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\scripts\build.ps1 [options]"
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Target <platform>    windows, linux, macos, all (default: windows)"
    Write-Host "  -Format <formats>     msi, exe, deb, appimage, rpm, dmg (comma-separated)"
    Write-Host "  -Debug                Build debug version"
    Write-Host "  -Clean                Clean before building"
    Write-Host "  -Verbose              Show detailed output"
    Write-Host "  -Help                 Show this help"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\scripts\build.ps1" -ForegroundColor Green
    Write-Host "      Build Windows packages (msi, exe)"
    Write-Host ""
    Write-Host "  .\scripts\build.ps1 -Format msi" -ForegroundColor Green
    Write-Host "      Build MSI installer only"
    Write-Host ""
    Write-Host "  .\scripts\build.ps1 -Clean -Verbose" -ForegroundColor Green
    Write-Host "      Clean build with detailed output"
}

function Test-Dependencies {
    Write-Host "Checking dependencies..." -ForegroundColor Blue
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Node.js not found" -ForegroundColor Red
        Write-Host "    Install from https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Host "  ✓ npm $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ npm not found" -ForegroundColor Red
        exit 1
    }
    
    # Check Rust
    try {
        $rustVersion = rustc --version
        Write-Host "  ✓ $rustVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Rust not found" -ForegroundColor Red
        Write-Host "    Install from https://rustup.rs" -ForegroundColor Yellow
        exit 1
    }
    
    # Check Cargo
    try {
        $cargoVersion = cargo --version
        Write-Host "  ✓ $cargoVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Cargo not found" -ForegroundColor Red
        exit 1
    }
}

function Start-Build {
    Set-Location $RootDir
    
    # Install dependencies if needed
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Blue
        npm install
    }
    
    # Build arguments
    $buildArgs = @()
    $buildArgs += "--target"
    $buildArgs += $Target
    
    if ($Format) {
        $buildArgs += "--format"
        $buildArgs += $Format
    }
    
    if ($Debug) {
        $buildArgs += "--debug"
    }
    
    if ($Clean) {
        $buildArgs += "--clean"
    }
    
    if ($Verbose) {
        $buildArgs += "--verbose"
    }
    
    Write-Host "Building packages..." -ForegroundColor Blue
    node scripts/build.js @buildArgs
}

# Main
if ($Help) {
    Show-Help
    exit 0
}

Write-Banner
Test-Dependencies

try {
    Start-Build
    Write-Host ""
    Write-Host "Build complete!" -ForegroundColor Green
    Write-Host "Packages are in: src-tauri\target\release\bundle\" -ForegroundColor Cyan
}
catch {
    Write-Host "Build failed: $_" -ForegroundColor Red
    exit 1
}

