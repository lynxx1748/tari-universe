#!/usr/bin/env node
/**
 * Tari Universe Build Script
 * 
 * Cross-platform build script for creating distribution packages.
 * 
 * Usage:
 *   node scripts/build.js [options]
 *   npm run build:release [-- options]
 * 
 * Options:
 *   --target <platform>  Build for specific platform: windows, linux, macos, all (default: current)
 *   --format <format>    Build specific format: exe, msi, deb, appimage, rpm, dmg, app (can be comma-separated)
 *   --debug              Build debug version instead of release
 *   --verbose            Show detailed build output
 *   --clean              Clean build artifacts before building
 *   --help               Show this help message
 * 
 * Examples:
 *   node scripts/build.js                          # Build for current platform
 *   node scripts/build.js --target linux           # Build all Linux formats
 *   node scripts/build.js --format deb,appimage   # Build only .deb and .appimage
 *   node scripts/build.js --target windows --format msi
 */

import { spawn, execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const TAURI_DIR = join(ROOT_DIR, 'src-tauri');
const TARGET_DIR = join(TAURI_DIR, 'target');
const BUNDLE_DIR = join(TARGET_DIR, 'release', 'bundle');

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    step: (msg) => console.log(`\n${colors.cyan}${colors.bright}▶ ${msg}${colors.reset}`),
    header: (msg) => console.log(`\n${colors.magenta}${colors.bright}${'═'.repeat(60)}\n  ${msg}\n${'═'.repeat(60)}${colors.reset}\n`),
};

// Platform-specific bundle targets
const BUNDLE_TARGETS = {
    windows: {
        formats: ['msi', 'nsis'],
        extensions: ['.msi', '.exe'],
        folder: ['msi', 'nsis'],
    },
    linux: {
        formats: ['deb', 'appimage', 'rpm'],
        extensions: ['.deb', '.AppImage', '.rpm'],
        folder: ['deb', 'appimage', 'rpm'],
    },
    macos: {
        formats: ['dmg', 'app'],
        extensions: ['.dmg', '.app'],
        folder: ['dmg', 'macos'],
    },
};

function getCurrentPlatform() {
    const p = platform();
    if (p === 'win32') return 'windows';
    if (p === 'darwin') return 'macos';
    return 'linux';
}

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        target: getCurrentPlatform(),
        formats: null,
        debug: false,
        verbose: false,
        clean: false,
        help: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--target':
            case '-t':
                options.target = args[++i];
                break;
            case '--format':
            case '-f':
                options.formats = args[++i]?.split(',').map((f) => f.trim().toLowerCase());
                break;
            case '--debug':
            case '-d':
                options.debug = true;
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--clean':
            case '-c':
                options.clean = true;
                break;
            case '--help':
            case '-h':
                options.help = true;
                break;
        }
    }

    return options;
}

function showHelp() {
    console.log(`
${colors.cyan}${colors.bright}Tari Universe Build Script${colors.reset}

${colors.yellow}Usage:${colors.reset}
  node scripts/build.js [options]
  npm run build:release [-- options]

${colors.yellow}Options:${colors.reset}
  --target, -t <platform>  Build for specific platform
                           Platforms: windows, linux, macos, all
                           Default: current platform (${getCurrentPlatform()})
  
  --format, -f <formats>   Build specific format(s), comma-separated
                           Windows: msi, nsis (exe)
                           Linux: deb, appimage, rpm
                           macOS: dmg, app
  
  --debug, -d              Build debug version (faster, larger)
  --verbose, -v            Show detailed build output
  --clean, -c              Clean build artifacts before building
  --help, -h               Show this help message

${colors.yellow}Examples:${colors.reset}
  ${colors.green}node scripts/build.js${colors.reset}
      Build for current platform with all formats
  
  ${colors.green}node scripts/build.js --target linux${colors.reset}
      Build all Linux packages (deb, appimage, rpm)
  
  ${colors.green}node scripts/build.js --format deb,appimage${colors.reset}
      Build only .deb and .AppImage
  
  ${colors.green}node scripts/build.js --target windows --format msi${colors.reset}
      Build Windows MSI installer only
  
  ${colors.green}node scripts/build.js --clean --verbose${colors.reset}
      Clean build with detailed output

${colors.yellow}Output:${colors.reset}
  Built packages are placed in:
  ${colors.cyan}src-tauri/target/release/bundle/${colors.reset}
    ├── deb/          # .deb packages
    ├── appimage/     # .AppImage files
    ├── rpm/          # .rpm packages
    ├── msi/          # .msi installers
    ├── nsis/         # .exe installers
    ├── dmg/          # .dmg disk images
    └── macos/        # .app bundles

${colors.yellow}Requirements:${colors.reset}
  • Node.js 18+
  • Rust toolchain
  • Platform-specific dependencies (see README.md)
`);
}

function checkDependencies() {
    log.step('Checking build dependencies...');

    // Check Node.js
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
        log.success(`Node.js ${nodeVersion}`);
    } catch {
        log.error('Node.js not found. Please install Node.js 18+');
        process.exit(1);
    }

    // Check npm
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
        log.success(`npm ${npmVersion}`);
    } catch {
        log.error('npm not found');
        process.exit(1);
    }

    // Check Rust
    try {
        const rustVersion = execSync('rustc --version', { encoding: 'utf-8' }).trim();
        log.success(`${rustVersion}`);
    } catch {
        log.error('Rust not found. Please install Rust: https://rustup.rs');
        process.exit(1);
    }

    // Check Cargo
    try {
        const cargoVersion = execSync('cargo --version', { encoding: 'utf-8' }).trim();
        log.success(`${cargoVersion}`);
    } catch {
        log.error('Cargo not found');
        process.exit(1);
    }

    // Check Tauri CLI
    try {
        execSync('npm run tauri -- --version', { encoding: 'utf-8', cwd: ROOT_DIR });
        log.success('Tauri CLI available');
    } catch {
        log.warn('Tauri CLI not found, will use npx');
    }
}

function cleanBuild() {
    log.step('Cleaning build artifacts...');

    if (existsSync(BUNDLE_DIR)) {
        rmSync(BUNDLE_DIR, { recursive: true, force: true });
        log.success('Cleaned bundle directory');
    }

    const distDir = join(ROOT_DIR, 'dist');
    if (existsSync(distDir)) {
        rmSync(distDir, { recursive: true, force: true });
        log.success('Cleaned dist directory');
    }
}

function installDependencies() {
    log.step('Installing dependencies...');

    const nodeModules = join(ROOT_DIR, 'node_modules');
    if (!existsSync(nodeModules)) {
        log.info('Running npm install...');
        execSync('npm install', { cwd: ROOT_DIR, stdio: 'inherit' });
    } else {
        log.success('Dependencies already installed');
    }
}

async function runTauriBuild(options) {
    log.step('Building Tari Universe...');

    const targetPlatforms = options.target === 'all' 
        ? [getCurrentPlatform()] // Can only build for current platform without cross-compilation
        : [options.target];

    for (const targetPlatform of targetPlatforms) {
        if (targetPlatform !== getCurrentPlatform()) {
            log.warn(`Cross-compilation to ${targetPlatform} requires additional setup.`);
            log.info(`Building for current platform (${getCurrentPlatform()}) instead.`);
            continue;
        }

        const bundleConfig = BUNDLE_TARGETS[targetPlatform];
        if (!bundleConfig) {
            log.error(`Unknown platform: ${targetPlatform}`);
            continue;
        }

        // Determine which formats to build
        let formats = options.formats || bundleConfig.formats;
        formats = formats.filter((f) => bundleConfig.formats.includes(f) || 
            (f === 'exe' && targetPlatform === 'windows'));

        // Map 'exe' to 'nsis' for Windows
        formats = formats.map((f) => (f === 'exe' ? 'nsis' : f));

        if (formats.length === 0) {
            log.warn(`No valid formats for ${targetPlatform}`);
            continue;
        }

        log.info(`Building for ${targetPlatform}: ${formats.join(', ')}`);

        // Build command
        const args = ['run', 'tauri', '--', 'build'];
        
        if (options.debug) {
            args.push('--debug');
        }

        // Add bundle targets
        for (const format of formats) {
            args.push('--bundles', format);
        }

        if (options.verbose) {
            args.push('--verbose');
        }

        return new Promise((resolve, reject) => {
            const child = spawn('npm', args, {
                cwd: ROOT_DIR,
                stdio: options.verbose ? 'inherit' : 'pipe',
                shell: true,
            });

            let output = '';
            if (!options.verbose) {
                child.stdout?.on('data', (data) => {
                    output += data.toString();
                    // Show progress indicators
                    const line = data.toString().trim();
                    if (line.includes('Compiling') || line.includes('Building') || line.includes('Bundling')) {
                        process.stdout.write('.');
                    }
                });
                child.stderr?.on('data', (data) => {
                    output += data.toString();
                });
            }

            child.on('close', (code) => {
                if (!options.verbose) {
                    console.log(); // New line after progress dots
                }

                if (code === 0) {
                    resolve();
                } else {
                    if (!options.verbose) {
                        console.log(output);
                    }
                    reject(new Error(`Build failed with code ${code}`));
                }
            });

            child.on('error', reject);
        });
    }
}

function listBuiltPackages() {
    log.step('Built packages:');

    if (!existsSync(BUNDLE_DIR)) {
        log.warn('No bundle directory found');
        return;
    }

    const bundleDirs = readdirSync(BUNDLE_DIR);
    let totalSize = 0;
    const packages = [];

    for (const dir of bundleDirs) {
        const dirPath = join(BUNDLE_DIR, dir);
        if (!statSync(dirPath).isDirectory()) continue;

        const files = readdirSync(dirPath);
        for (const file of files) {
            const filePath = join(dirPath, file);
            const stat = statSync(filePath);
            
            if (stat.isFile()) {
                const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
                totalSize += stat.size;
                packages.push({ name: file, size: sizeMB, path: filePath });
            }
        }
    }

    if (packages.length === 0) {
        log.warn('No packages found');
        return;
    }

    console.log();
    for (const pkg of packages) {
        console.log(`  ${colors.green}📦${colors.reset} ${pkg.name} ${colors.cyan}(${pkg.size} MB)${colors.reset}`);
    }
    console.log();
    log.info(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    log.info(`Output directory: ${BUNDLE_DIR}`);
}

async function main() {
    const options = parseArgs();

    if (options.help) {
        showHelp();
        process.exit(0);
    }

    log.header('Tari Universe Build');

    console.log(`  Platform: ${colors.cyan}${options.target}${colors.reset}`);
    console.log(`  Formats:  ${colors.cyan}${options.formats?.join(', ') || 'all'}${colors.reset}`);
    console.log(`  Mode:     ${colors.cyan}${options.debug ? 'debug' : 'release'}${colors.reset}`);

    try {
        checkDependencies();

        if (options.clean) {
            cleanBuild();
        }

        installDependencies();
        await runTauriBuild(options);
        
        log.header('Build Complete! 🎉');
        listBuiltPackages();

    } catch (error) {
        log.error(`Build failed: ${error.message}`);
        process.exit(1);
    }
}

main();

