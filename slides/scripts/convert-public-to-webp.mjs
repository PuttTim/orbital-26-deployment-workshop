import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const RASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);

/** Higher quality for logos and QR codes so edges stay crisp. */
function qualityFor(relPath) {
	if (relPath.startsWith("logos/") || relPath.startsWith("qr/")) {
		return 90;
	}
	return 85;
}

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(full);
		} else if (entry.isFile()) {
			yield full;
		}
	}
}

async function convertFile(filePath) {
	const ext = filePath.slice(filePath.lastIndexOf(".")).toLowerCase();
	if (!RASTER_EXT.has(ext)) return;

	const rel = relative(PUBLIC_DIR, filePath);
	const outPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");

	const [srcStat, outStat] = await Promise.all([
		stat(filePath),
		stat(outPath).catch(() => null),
	]);

	if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
		console.log(`skip ${rel} (webp up to date)`);
		return;
	}

	const quality = qualityFor(rel);
	await sharp(filePath).webp({ quality, effort: 4 }).toFile(outPath);

	const outSize = (await stat(outPath)).size;
	console.log(
		`✓ ${rel} → ${relative(PUBLIC_DIR, outPath)} (${Math.round(outSize / 1024)} KB)`,
	);
}

async function main() {
	let count = 0;
	for await (const file of walk(PUBLIC_DIR)) {
		const ext = file.slice(file.lastIndexOf(".")).toLowerCase();
		if (RASTER_EXT.has(ext)) {
			await convertFile(file);
			count++;
		}
	}
	console.log(`\nDone. Processed ${count} raster file(s).`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
