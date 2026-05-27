import { createClient } from "@supabase/supabase-js"
import { execSync } from "node:child_process"
import { writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"

loadDevVars()

function loadDevVars() {
	const path = join(import.meta.dirname, "..", ".dev.vars")
	if (!existsSync(path)) return
	for (const line of readFileSync(path, "utf-8").split("\n")) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith("#")) continue
		const eq = trimmed.indexOf("=")
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		const value = trimmed
			.slice(eq + 1)
			.trim()
			.replace(/^["']|["']$/g, "")
		if (!process.env[key]) process.env[key] = value
	}
}

function generateSvg(name: string, hex: string): string {
	const textColor = isLight(hex) ? "#1a1a1a" : "#ffffff"
	return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="${hex}" rx="20"/>
  <text x="200" y="520" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="${textColor}">${name}</text>
  <text x="200" y="555" text-anchor="middle" font-family="monospace" font-size="16" fill="${textColor}" opacity="0.7">${hex}</text>
</svg>`
}

function isLight(hex: string): boolean {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

async function main() {
	const supabaseUrl = process.env.SUPABASE_URL
	const supabaseKey = process.env.SUPABASE_KEY

	if (!supabaseUrl || !supabaseKey) {
		console.error("ERROR: SUPABASE_URL and SUPABASE_KEY not found in .dev.vars")
		process.exit(1)
	}

	const supabase = createClient(supabaseUrl, supabaseKey)

	console.log("Fetching colors from Supabase...")
	const { data: colors, error } = await supabase.from("colors").select("id, name, hex")

	if (error || !colors || colors.length === 0) {
		console.error("No colors found in database. Run pnpm migrate first.")
		process.exit(1)
	}

	const workDir = join(tmpdir(), `color-swipe-seed-${Date.now()}`)
	mkdirSync(workDir, { recursive: true })

	try {
		for (const color of colors as { id: string; name: string; hex: string }[]) {
			const svg = generateSvg(color.name, color.hex)
			const filename = `${color.id}.svg`
			const filepath = join(workDir, filename)

			writeFileSync(filepath, svg)

			const result = execSync(
				`pnpm wrangler r2 object put color-swipe-images/colors/${filename} --remote --file="${filepath}" --content-type="image/svg+xml"`,
				{ encoding: "utf-8" },
			)
			console.log(result.trim())

			const { error: updateError } = await supabase
				.from("colors")
				.update({ image_key: filename })
				.eq("id", color.id)

			if (updateError) {
				console.error(`  Failed to update ${color.name}: ${updateError.message}`)
			} else {
				console.log(`  ✓ ${color.name} (${color.hex})`)
			}
		}

		console.log(`\nDone! ${colors.length} images uploaded to R2.`)
	} finally {
		rmSync(workDir, { recursive: true, force: true })
	}
}

main()
