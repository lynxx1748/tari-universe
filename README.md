# Tari Universe v1
<img width="1283" height="787" alt="Screenshot_2025-11-29_09-55-13" src="https://github.com/user-attachments/assets/93a1d48f-151b-4994-a4a1-2129a84bb87c" />

# Disclaimer:

These are pre-compiled packages for installing Tari Universe on Linux Machines for other Downloads (Windows/MacOS) please visit the Offical Tari GitHub. 
[Windows/MacOS](https://www.tari.com/downloads/) from [tari.com](https://www.tari.com/). This is the easiest way to run Tari Universe.

# Desktop Mining Application for Tari

Tari Universe is a desktop application that allows users to mine Tari tokens (XTM) using their Mac or PC. The application features a user-friendly interface with one-click mining setup.

## Applications

The Tari Universe ecosystem includes:

- **Tari Universe Desktop App** - Mining application for Windows, macOS, and Linux
- **Tari Universe Wallet** - Mobile companion app for tracking earnings

## Installing using binaries

### Install

After downloading the binaries:

#### On Windows

Double-click the installer and follow the prompts.

#### On macOS

Open the `.dmg` file and drag Tari Universe to your Applications folder.

#### On Linux

Install the `.deb` package:

```bash
sudo dpkg -i tari-universe_*.deb
```

Or run the `.AppImage`:

```bash
chmod +x Tari-Universe-*.AppImage
./Tari-Universe-*.AppImage
```

### Run

Launch Tari Universe from your applications menu or desktop shortcut.

## Building from source

### Install development packages

#### macOS

```bash
brew update
brew install git node cmake protobuf openssl npm
```

#### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install -y git nodejs npm build-essential \
    libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev \
    patchelf libprotobuf-dev protobuf-compiler libssl-dev \
    pkg-config cmake
```

#### Windows

Install Visual Studio Build Tools 2022 with C++ workload, then:

```powershell
# Install dependencies via chocolatey or vcpkg
choco install git nodejs protoc
```

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### Install Tauri CLI

```bash
cargo install tauri-cli --locked
```

### Build

```bash
git clone https://github.com/lynxx1748/tari-universe.git
cd tari-universe
npm install
npm run build:release
```

### Build Scripts

The project includes easy-to-use build scripts for creating distribution packages:

**Using npm:**
```bash
npm run build:release     # Build for current platform (all formats)
npm run build:deb         # Build .deb package only
npm run build:appimage    # Build .AppImage only
npm run build:rpm         # Build .rpm package only
npm run build:linux       # Build all Linux formats
npm run build:windows     # Build Windows packages
npm run build:macos       # Build macOS packages
npm run build:clean       # Clean and rebuild
```

**Using bash script (Linux/macOS):**
```bash
./scripts/build.sh              # Build for current platform
./scripts/build.sh linux        # Build all Linux packages
./scripts/build.sh deb          # Build .deb only
./scripts/build.sh appimage     # Build .AppImage only
./scripts/build.sh rpm          # Build .rpm only
./scripts/build.sh clean        # Clean and rebuild
./scripts/build.sh help         # Show help
```

**Using PowerShell (Windows):**
```powershell
.\scripts\build.ps1                   # Build Windows packages
.\scripts\build.ps1 -Format msi       # Build MSI only
.\scripts\build.ps1 -Format exe       # Build EXE only
.\scripts\build.ps1 -Clean            # Clean build
.\scripts\build.ps1 -Help             # Show help
```

**Using Node.js directly:**
```bash
node scripts/build.js --help                    # Show all options
node scripts/build.js --format deb,appimage     # Multiple formats
node scripts/build.js --clean --verbose         # Detailed output
```

### Output

Built applications will be in `src-tauri/target/release/bundle/`:

```
bundle/
├── deb/          # .deb packages (Debian/Ubuntu)
├── appimage/     # .AppImage files (Universal Linux)
├── rpm/          # .rpm packages (Fedora/RHEL)
├── msi/          # .msi installers (Windows)
├── nsis/         # .exe installers (Windows)
├── dmg/          # .dmg disk images (macOS)
└── macos/        # .app bundles (macOS)
```

- **Linux**: `.deb`, `.AppImage`, and `.rpm` files
- **Windows**: `.msi` and `.exe` installers
- **macOS**: `.dmg` and `.app` bundle

## Contributing

### Code Quality

The project uses comprehensive linting tools to maintain code quality:

- **Frontend**: ESLint with TypeScript, React, and Prettier integration
- **Backend**: Clippy for Rust with custom lint rules

### Running Lints

```bash
# Frontend linting
npm run lint          # Run all linters (knip + eslint)
npm run lint:fix      # Auto-fix ESLint issues
npm run lint:taplo    # Check TOML file formatting

# Backend linting (from src-tauri directory)
cd src-tauri
cargo clippy          # Run Rust linting
cargo fmt             # Format Rust code
```

### IDE Integration

For the best development experience, install:

- **ESLint extension** for automatic JavaScript/TypeScript linting
- **rust-analyzer extension** for Rust development
- **Prettier extension** for code formatting

Most linting issues can be auto-fixed by your IDE or the lint commands above.

## Configuration

Configuration files are stored at:

- **Linux**: `~/.config/tari-universe/`
- **Windows**: `%APPDATA%\tari-universe\`
- **macOS**: `~/Library/Application Support/tari-universe/`

## Changelog

### Phase 1 Complete: Stats & Achievements (Latest)

Added gamification features to make mining more engaging and provide detailed insights:

**1. Achievement System**
- 25+ achievements across 5 categories: Mining, Earnings, Time, Social, and Special
- Rarity tiers: Common, Uncommon, Rare, Epic, Legendary
- Toast notifications when achievements unlock
- Progress tracking toward locked achievements
- Persistent storage - your achievements are saved locally

**Achievement Categories:**
- ⛏️ **Mining**: Share milestones (100, 1K, 10K, 100K shares)
- 🔥 **Hashrate**: Reach hashrate goals (1 KH/s to 1 MH/s)
- ⏰ **Time**: Mining duration milestones (1 hour to 1 month)
- 🔗 **Streaks**: Consecutive mining days (3, 7, 30 days)
- 💰 **Earnings**: XTM earning milestones
- ⭐ **Special**: Enable Performance Mode, complete sessions

**2. Mining Stats Dashboard**
- New "Stats" tab in Settings (first tab after General)
- Total XTM earned with large highlight
- Shares submitted counter
- Total mining time (formatted as hours/days)
- Best hashrate achieved
- Mining streak tracker with visual day dots
- Last 7 days earnings bar chart
- Recent mining history with daily breakdowns
- Additional stats: Sessions count, longest streak, mining start date

**Access:** Settings → Stats tab (📊)

---

### UI/UX Improvements

Multiple improvements to enhance user experience and provide better feedback:

**1. Fixed Lost Connection Alert**
- Re-enabled the connection status alert that was previously disabled
- Now properly monitors node connection status and displays warnings when disconnected

**2. Pool Connection Status Indicator**
- Added visual pool connection status in the mining tiles tooltip
- Shows "Connected" or "Disconnected" state with color-coded indicators
- Displays accepted shares count for pool mining
- CPU tile shows real-time pool connection status

**3. Improved Seed Word Import**
- New 24-word grid input with numbered boxes (1-24)
- Real-time validation as you type
- Visual feedback for each word (green = valid, red = invalid)
- Smart paste support - paste all 24 words at once
- Keyboard navigation (Space/Tab to move to next word)
- Progress counter showing words entered

**4. Hardware Status Display**
- New "Hardware Status" section in Settings → Mining
- Shows CPU and GPU mining status at a glance
- Displays current hashrate for each
- Shows pool connection status for CPU
- Lists detected GPU devices
- Color-coded status indicators (Mining/Idle/Disabled)

---

### Performance Mode

Added a new **Performance Mode** feature to optimize mining hashrates by reducing UI resource consumption.

**What's New:**
- New "Performance Mode" toggle in Settings → General
- Enabled by default for optimal mining performance
- Automatically disables the 3D tower visualization (WebGL)
- Pauses all decorative CSS animations (rotating cubes, pulses, gradients, floating elements)
- Removes GPU-intensive backdrop blur effects
- Speeds up/removes UI transitions

**Impact:**
- Significantly reduced CPU/GPU usage from UI rendering
- More system resources available for mining operations
- Users can disable Performance Mode in Settings to restore fancy graphics

## Troubleshooting

**Application won't start:**

- Check that your system meets minimum requirements
- Verify firewall isn't blocking the application
- Try running as administrator (Windows) or with appropriate permissions

**Build issues:**

- Ensure all dependencies are installed
- Check that Rust toolchain is up to date
- On Windows, use the Visual Studio Developer Command Prompt

## Getting Help

- **Community Discord**: [discord.gg/tari](https://discord.gg/tari)
- **GitHub Issues**: [github.com/tari-project/universe](https://github.com/tari-project/universe)
- **Documentation**: [docs.tari.com](https://docs.tari.com)

## Project documentation

- [RFC documents](https://rfc.tari.com) are hosted on Github Pages
- Source code documentation is hosted on [docs.rs](https://docs.rs)
- [Contributing Guide](Contributing.md)

## License

Tari Universe is open source software licensed under the [Enhanced Common Public Attribution License Version 1.0](LICENSE).
