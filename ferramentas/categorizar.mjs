/**
 * Acrescenta a categoria (cat) aos álbuns e videoclipes em dados.js,
 * para que os filtros das páginas de arquivo funcionem.
 *
 * Uso: node ferramentas/categorizar.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\//, '').replace(/\/$/, '');
const CAMINHO = join(RAIZ, 'dados.js');

const CATEGORIA_ALBUM = {
  'off-the-wall': 'estudio',
  'thriller': 'estudio',
  'bad': 'estudio',
  'dangerous': 'estudio',
  'history-past-present-and-future-book-i': 'estudio',
  'blood-on-the-dancefloor-history-in-the-mix': 'estudio',
  'invincible': 'estudio',
  'number-ones': 'compilacao',
  'essential-michael-jackson': 'compilacao',
  'immortal': 'compilacao',
  'this-is-it': 'posthumo',
  'michael': 'posthumo',
  'xscape': 'posthumo',
  'scream': 'posthumo'
};

const CATEGORIA_VIDEO = { '80s': 1, '90s': 1, '00s': 1 };

function categoriaVideo(data) {
  const ano = parseInt((data.match(/\d{4}/) || ['0'])[0], 10);
  if (ano < 1990) return '80s';
  if (ano < 2000) return '90s';
  return '00s';
}

let texto = await readFile(CAMINHO, 'utf8');

// Álbuns: insere cat depois da linha "capa: ..."
const linhas = texto.split('\n');
const saida = [];
let dentroDe = null;

for (const linha of linhas) {
  saida.push(linha);

  if (/^\s*albuns:\s*\[/.test(linha)) dentroDe = 'albuns';
  else if (/^\s*videos:\s*\[/.test(linha)) dentroDe = 'videos';
  else if (/^\s*\];?\s*$/.test(linha) && dentroDe) dentroDe = null;

  if (dentroDe === 'albuns') {
    const m = linha.match(/^\s*id:\s*'([^']+)'/);
    if (m && CATEGORIA_ALBUM[m[1]]) {
      saida.push(`      cat: '${CATEGORIA_ALBUM[m[1]]}',`);
    }
  }
  if (dentroDe === 'videos') {
    const m = linha.match(/data:\s*'([^']+)'/);
    if (m) {
      // Os videoclipes estão escritos em uma só linha: a categoria é inserida
      // dentro do mesmo objeto.
      saida[saida.length - 1] = linha.replace(
        /(\s*poster:\s*'[^']*')(\s*\},\s*)$/,
        `$1, cat: '${categoriaVideo(m[1])}'$2`
      );
    }
  }
}

texto = saida.join('\n');
await writeFile(CAMINHO, texto, 'utf8');
console.log('categorias acrescentadas');
