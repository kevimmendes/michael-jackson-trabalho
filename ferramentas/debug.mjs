import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const caminho = join(RAIZ, 'biografia.html');
let texto = await readFile(caminho, 'utf8');
const linhas = texto.split('\n');
const i = 302;
const antes = linhas[i];
console.log('ANTES:', JSON.stringify(antes));
const depois = antes.replace(/determina[\u0400-\u04FF]+vam o que podia fazer\./, 'determinavam o que podia fazer.');
console.log('DEPOIS:', JSON.stringify(depois));
console.log('mudou?', antes !== depois);
if (antes !== depois) {
  linhas[i] = depois;
  await writeFile(caminho, linhas.join('\n'));
  console.log('gravado');
}
