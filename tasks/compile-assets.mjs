import { mkdir, writeFile } from 'fs/promises'
import { dirname } from 'path'

/**
 * Write asset helper
 *
 * @param {AssetEntry[0]} filePath - File path to asset
 * @param {AssetOutput} result - Generated or minified bundle
 * @returns {Promise<void>}
 */
export async function writeAsset (filePath, result) {
  await mkdir(dirname(filePath), { recursive: true })

  const writeTasks = []

  // Files to write
  const code = result.code || result.css?.toString()
  const map = result.map?.toString()

  // 1. Write code (example.js)
  writeTasks.push(writeFile(filePath, code))

  // 2. Write source map (example.js.map)
  if (map) {
    writeTasks.push(writeFile(`${filePath}.map`, map))
  }

  return Promise.all(writeTasks)
}

/**
 * Asset entry file path with options
 *
 * @typedef {[string, AssetOptions]} AssetEntry
 */

/**
 * Asset options
 *
 * @typedef {object} AssetOptions
 * @property {string} srcPath - Input directory
 * @property {string} destPath - Output directory
 */

/**
 * Asset compiled output
 *
 * 1. Rollup generated bundle
 * 2. Terser minified bundle
 * 3. Sass compiler result
 *
 * @typedef {import('rollup').OutputChunk | import('terser').MinifyOutput | import('node-sass').Result} AssetOutput
 */
