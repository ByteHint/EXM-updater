const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

console.log("🚀 Starting obfuscation...\n");

// Obfuscation settings
const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: "hexadecimal",
    rotateStringArray: true,
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
};

// Clean build directory
if (fs.existsSync("build")) {
    fs.rmSync("build", { recursive: true, force: true });
}
fs.mkdirSync("build");

// Obfuscate JS file
function obfuscateFile(inputPath, outputPath) {
    try {
        const sourceCode = fs.readFileSync(inputPath, "utf8");
        console.log(`📝 Obfuscating: ${inputPath}`);

        const result = JavaScriptObfuscator.obfuscate(sourceCode, obfuscatorOptions);
        fs.writeFileSync(outputPath, result.getObfuscatedCode());

        console.log(`✅ Done: ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error: ${inputPath} - ${error.message}`);
    }
}

// Copy non-JS files
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
    console.log(`📁 Copied: ${src}`);
}

// Process directory recursively
function processDirectory(srcDir, buildDir) {
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    const items = fs.readdirSync(srcDir);

    items.forEach((item) => {
        const srcPath = path.join(srcDir, item);
        const buildPath = path.join(buildDir, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // Skip these directories
            if (["node_modules", ".git", "build", "dist"].includes(item)) {
                return;
            }
            processDirectory(srcPath, buildPath);
        } else if (item.endsWith(".js")) {
            // Obfuscate JavaScript files
            obfuscateFile(srcPath, buildPath);
        } else {
            // Copy everything else
            copyFile(srcPath, buildPath);
        }
    });
}

// Process your source files (adjust path as needed)
const sourceDir = "src"; // Change this to your source directory
if (fs.existsSync(sourceDir)) {
    processDirectory(sourceDir, "build");
} else {
    // If no src folder, obfuscate files in root
    console.log("No src folder found, processing root directory...");

    const files = fs.readdirSync(".");
    files.forEach((file) => {
        if (file.endsWith(".js") && !file.includes("build") && !file.includes("node_modules")) {
            obfuscateFile(file, path.join("build", file));
        } else if (!fs.statSync(file).isDirectory() && !file.includes("node_modules")) {
            copyFile(file, path.join("build", file));
        }
    });
}

// Copy package.json
if (fs.existsSync("package.json")) {
    copyFile("package.json", "build/package.json");
}

console.log("\n✨ Obfuscation complete!");

// If you have electron-builder, uncomment this to auto-build:
/*
console.log('📦 Building app...');
exec('electron-builder', (error, stdout, stderr) => {
    if (error) {
        console.error('Build failed:', error);
        return;
    }
    console.log('🎉 Build complete!');
    console.log(stdout);
});
*/
