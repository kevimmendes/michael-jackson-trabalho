/** Extrai URLs de imagens de um ficheiro HTML local. */
import { readFile } from 'node:fs/promises';

const ficheiro = process.argv[2];
const html = await readFile(ficheiro, 'utf8');
const re = /https?:\/\/[^"'<>\s)]+?\.(?:jpg|jpeg|png|webp)/gi;
const urls = [...new Set(html.match(re) || [])];
console.log(urls.length + ' imagens');
for (const u of urls) console.log(u);
