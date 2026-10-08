import { cp, mkdir, readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

// Package the existing production output for a project-site URL.
// The recovered game source and original dist remain unchanged.
const source = path.resolve('dist');
const destinationArg = process.argv[2];
if (!destinationArg) throw new Error('Usage: node scripts/prepare-pages.mjs <empty-output-directory>');
const destination = path.resolve(destinationArg);
if (destination === source || destination.startsWith(source + path.sep)) throw new Error('Output must be outside dist.');
try {
  if ((await readdir(destination)).length) throw new Error('Output directory is not empty; nothing was overwritten.');
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await stat(path.join(source, 'index.html'));
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
let replacements = 0;
async function adapt(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) { await adapt(filename); continue; }
    if (!/\.(html|js|css)$/.test(entry.name)) continue;
    let text = await readFile(filename, 'utf8');
    for (const assetRoot of ['/assets/', '/textures/', '/favicon.svg']) {
      const count = text.split(assetRoot).length - 1;
      replacements += count;
      text = text.replaceAll(assetRoot, '/hogwat-3d' + assetRoot);
    }
    await writeFile(filename, text);
  }
}
await adapt(destination);
if (!replacements) throw new Error('No root asset references were found; check the build format before deploying.');
await writeFile(path.join(destination, '.nojekyll'), '');
console.log(`Prepared existing build for /hogwat-3d/ (${replacements} asset references).`);
