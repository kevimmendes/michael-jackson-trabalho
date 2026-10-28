/**
 * Descarrega uma lista de imagens do Wikimedia Commons para a pasta local.
 *
 * Uso: node ferramentas/baixar-commons.mjs ficheiro.json
 * onde o JSON é uma lista de { url, destino }.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\//, '').replace(/\/$/, '');
const lista = JSON.parse(await readFile(process.argv[2], 'utf8'));

for (const item of lista) {
  let tentativa = 0;
  while (tentativa < 3) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'TrabalhoEscolar/1.0 (educational project)' },
        redirect: 'follow'
      });
      if (res.status === 429) {
        tentativa++;
        await new Promise(r => setTimeout(r, 4000 * tentativa));
        continue;
      }
      if (!res.ok) { console.log('falhou', res.status, item.destino); break; }
      const buf = Buffer.from(await res.arrayBuffer());
      const destino = join(RAIZ, item.destino);
      await mkdir(dirname(destino), { recursive: true });
      await writeFile(destino, buf);
      console.log('ok', item.destino, (buf.length / 1024).toFixed(0) + ' KB');
      break;
    } catch (e) {
      tentativa++;
      await new Promise(r => setTimeout(r, 3000 * tentativa));
      if (tentativa >= 3) console.log('erro', item.destino, e.message);
    }
  }
  await new Promise(r => setTimeout(r, 1500));
}
