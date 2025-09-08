
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const bytenode = require('bytenode');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

async function ensureDir(dirPath) {
	try {
		await access(dirPath, fs.constants.F_OK);
	} catch {
		await mkdir(dirPath, { recursive: true });
	}
}

function getOutPaths() {
	const outMain = path.resolve(__dirname, 'out', 'main', 'main.js');
	const outPreload = path.resolve(__dirname, 'out', 'preload', 'preload.js');
	return { outMain, outPreload };
}

async function compileFileToBytecode(inputPath, outputJscPath) {
	console.log(`[compile] ${path.relative(process.cwd(), inputPath)} -> ${path.relative(process.cwd(), outputJscPath)}`);
	await ensureDir(path.dirname(outputJscPath));
	bytenode.compileFile({ filename: inputPath, output: outputJscPath, electron: true, compileAsModule: false, compress: true });
}

async function writeLoader(loaderPath, jscRelativePath, isPreload = false) {
	const content = `// Auto-generated loader for bytenode-compiled file\n` +
		`require('bytenode');\n` +
		`const path = require('path');\n` +
		`const compiledPath = path.join(__dirname, ${JSON.stringify(jscRelativePath)});\n` +
		`module.exports = require(compiledPath);\n`;
	await ensureDir(path.dirname(loaderPath));
	await writeFile(loaderPath, content, 'utf8');
	console.log(`[write] loader -> ${path.relative(process.cwd(), loaderPath)}`);
}

async function main() {
	const { outMain, outPreload } = getOutPaths();
	const compiledRoot = path.resolve(__dirname, 'compiled');
	const compiledMainJsc = path.join(compiledRoot, 'main', 'main.jsc');
	const compiledMainLoader = path.join(compiledRoot, 'main', 'main.js');
	const compiledPreloadJsc = path.join(compiledRoot, 'preload', 'preload.jsc');
	const compiledPreloadLoader = path.join(compiledRoot, 'preload', 'preload.js');

	await compileFileToBytecode(outMain, compiledMainJsc);
	await writeLoader(compiledMainLoader, './main.jsc');

	await compileFileToBytecode(outPreload, compiledPreloadJsc);
	await writeLoader(compiledPreloadLoader, './preload.jsc', true);

	console.log('[done] Compilation completed.');
}

main().catch((err) => {
	console.error('[error] Compilation failed:', err);
	process.exit(1);
});
