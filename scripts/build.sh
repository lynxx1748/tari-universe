#!/bin/bash
#
# Tari Universe Build Script (Bash wrapper)
#
# Quick build commands:
#   ./scripts/build.sh              # Build for current platform
#   ./scripts/build.sh linux        # Build all Linux packages
#   ./scripts/build.sh deb          # Build .deb only
#   ./scripts/build.sh appimage     # Build .AppImage only
#   ./scripts/build.sh rpm          # Build .rpm only
#   ./scripts/build.sh windows      # Build Windows packages (requires Windows or cross-compile)
#   ./scripts/build.sh macos        # Build macOS packages (requires macOS)
#   ./scripts/build.sh clean        # Clean and rebuild
#   ./scripts/build.sh help         # Show detailed help
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

print_banner() {
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║               Tari Universe Build Script                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_help() {
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./scripts/build.sh [command] [options]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo "  (none)      Build for current platform with all formats"
    echo "  linux       Build all Linux packages (deb, appimage, rpm)"
    echo "  windows     Build Windows packages (msi, exe)"
    echo "  macos       Build macOS packages (dmg, app)"
    echo ""
    echo "  deb         Build .deb package only"
    echo "  appimage    Build .AppImage only"
    echo "  rpm         Build .rpm package only"
    echo "  msi         Build .msi installer only"
    echo "  exe         Build .exe installer only"
    echo "  dmg         Build .dmg disk image only"
    echo ""
    echo "  clean       Clean build artifacts and rebuild"
    echo "  help        Show this help message"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --debug     Build debug version"
    echo "  --verbose   Show detailed output"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  ${GREEN}./scripts/build.sh${NC}"
    echo "      Build for current platform"
    echo ""
    echo -e "  ${GREEN}./scripts/build.sh deb appimage${NC}"
    echo "      Build both .deb and .AppImage"
    echo ""
    echo -e "  ${GREEN}./scripts/build.sh clean --verbose${NC}"
    echo "      Clean build with detailed output"
    echo ""
    echo -e "${YELLOW}Output Location:${NC}"
    echo "  src-tauri/target/release/bundle/"
}

check_deps() {
    echo -e "${BLUE}Checking dependencies...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js not found${NC}"
        echo "Install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} Node.js $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm not found${NC}"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} npm $(npm --version)"
    
    # Check Rust
    if ! command -v rustc &> /dev/null; then
        echo -e "${RED}Error: Rust not found${NC}"
        echo "Install Rust from https://rustup.rs"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} $(rustc --version)"
    
    # Check cargo
    if ! command -v cargo &> /dev/null; then
        echo -e "${RED}Error: Cargo not found${NC}"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} $(cargo --version)"
}

build_packages() {
    local args="$@"
    
    cd "$ROOT_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}Installing dependencies...${NC}"
        npm install
    fi
    
    # Run the build
    echo -e "${BLUE}Building packages...${NC}"
    node scripts/build.js $args
}

# Main
print_banner

case "$1" in
    help|--help|-h)
        print_help
        exit 0
        ;;
    clean)
        shift
        check_deps
        build_packages --clean "$@"
        ;;
    linux)
        shift
        check_deps
        build_packages --target linux "$@"
        ;;
    windows)
        shift
        check_deps
        build_packages --target windows "$@"
        ;;
    macos)
        shift
        check_deps
        build_packages --target macos "$@"
        ;;
    deb)
        shift
        check_deps
        build_packages --format deb "$@"
        ;;
    appimage)
        shift
        check_deps
        build_packages --format appimage "$@"
        ;;
    rpm)
        shift
        check_deps
        build_packages --format rpm "$@"
        ;;
    msi)
        shift
        check_deps
        build_packages --target windows --format msi "$@"
        ;;
    exe)
        shift
        check_deps
        build_packages --target windows --format exe "$@"
        ;;
    dmg)
        shift
        check_deps
        build_packages --target macos --format dmg "$@"
        ;;
    *)
        check_deps
        build_packages "$@"
        ;;
esac

echo ""
echo -e "${GREEN}${BOLD}Build complete!${NC}"
echo -e "Packages are in: ${CYAN}src-tauri/target/release/bundle/${NC}"

