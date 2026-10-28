/**
 * Conta as palavras de texto visível numa página HTML.
 *
 * Uso: node ferramentas/contar.mjs ficheiro.html
 */
import { readFile } from 'node:fs/promises';

const ficheiro = process.argv[2];
const html = await readFile(ficheiro, 'utf8');
const semTags = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&[a-z]+;/g, ' ');
const palavras = semTags.split(/\s+/).filter(Boolean).length;
console.log(ficheiro + ': ' + palavras + ' palavras');
