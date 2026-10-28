/**
 * Script auxiliar (não faz parte do site).
 * Verifica o equilíbrio de etiquetas e a existência de ancoras usadas
 * nos links internos.
 *
 * Uso: node ferramentas/validar.mjs [pagina.html ...]
 */
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\//, '').replace(/\/$/, '');

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
]);

const args = process.argv.slice(2);
const paginas = args.length ? args : ['index.html', 'biografia.html', 'cultura.html'];

let problemas = 0;

for (const pag of paginas) {
  const caminho = join(RAIZ, pag);
  let html;
  try {
    html = await readFile(caminho, 'utf8');
  } catch {
    console.log('✗ não existe:', pag);
    problemas++;
    continue;
  }

  // 1. equilíbrio de etiquetas
  const pilha = [];
  const semDados = html.replace(/data:[^"]*/g, 'data:');
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(semDados)) !== null) {
    const [, fecho, tag, autoFecho] = m;
    const t = tag.toLowerCase();
    if (VOID.has(t) || autoFecho) continue;
    if (fecho) {
      const topo = pilha.pop();
      if (topo !== t) {
        console.log(`✗ ${pag}: etiqueta fechada <${t}> mas estava aberto <${topo}>`);
        problemas++;
      }
    } else {
      pilha.push(t);
    }
  }
  if (pilha.length) {
    console.log(`✗ ${pag}: ${pilha.length} etiqueta(s) por fechar: ${pilha.join(', ')}`);
    problemas++;
  }

  // 2. âncoras internas
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]));
  for (const link of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(link[1])) {
      console.log(`✗ ${pag}: link interno #${link[1]} sem destino`);
      problemas++;
    }
  }

  // 3. imagens existentes
  for (const img of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = img[1].split('?')[0];
    if (src.startsWith('http') || src.startsWith('data:')) continue;
    try {
      await readFile(join(RAIZ, src));
    } catch {
      console.log(`✗ ${pag}: imagem em falta -> ${src}`);
      problemas++;
    }
  }

  // 4. recursos referenciados
  for (const ref of [...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)].map(x => x[1])) {
    const src = ref.split('?')[0];
    if (src.startsWith('http') || src.startsWith('//') || src.startsWith('data:')) continue;
    try {
      await readFile(join(RAIZ, src));
    } catch {
      console.log(`✗ ${pag}: recurso em falta -> ${src}`);
      problemas++;
    }
  }

  console.log(`✓ ${pag} — ${ids.size} âncora(s)`);
}

console.log(problemas ? `\n${problemas} problema(s).` : '\nTudo certo.');
