/**
 * Script auxiliar (não faz parte do site).
 * Descarrega as imagens do CDN original para a pasta assets/ com um ritmo
 * lento, porque o CDN aplica limitação de taxa.
 *
 * Uso:  node ferramentas/baixar-imagens.mjs
 */
import { writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://cdn-p.smehost.net/sites/b216384857054ba4a3f60f1ed1d26488/wp-content/uploads/';
const DEST = new URL('../assets/', import.meta.url).pathname.replace(/^\//, '');
const LOG = new URL('../assets/_download.log', import.meta.url).pathname.replace(/^\//, '');

const ficheiros = [
  ['2025/10/home-hero-figure-isolated.png', 'hero-michael.png'],
  ['2025/10/mj-spotlight-item-01-mj-one-new.jpg', 'spotlight/mj-one.jpg'],
  ['2025/10/mj-spotlight-item-02-mj-musical-new.jpg', 'spotlight/mj-musical.jpg'],
  ['2025/10/spotlight-mj-shop.jpg', 'spotlight/mj-shop.jpg'],
  ['2025/10/album-cover_offthewall-640x640.jpg', 'albuns/album-cover_offthewall-640x640.jpg'],
  ['2025/10/album-cover_thriller-640x640.jpg', 'albuns/album-cover_thriller-640x640.jpg'],
  ['2025/10/album-bad-640x640.png', 'albuns/album-bad-640x640.png'],
  ['2025/10/album-cover_dangerous-640x640.jpg', 'albuns/album-cover_dangerous-640x640.jpg'],
  ['2025/11/album-cover_history-640x640.jpg', 'albuns/album-cover_history-640x640.jpg'],
  ['2025/11/album-cover_bloodonthedancefloor-640x640.jpg', 'albuns/album-cover_bloodonthedancefloor-640x640.jpg'],
  ['2025/11/album-cover_invincible-640x640.jpg', 'albuns/album-cover_invincible-640x640.jpg'],
  ['2025/11/album-cover_numberones-640x640.jpg', 'albuns/album-cover_numberones-640x640.jpg'],
  ['2025/11/album-cover_theessentialmj-640x640.jpg', 'albuns/album-cover_theessentialmj-640x640.jpg'],
  ['2026/01/album-this-is-it-640x640.jpg', 'albuns/album-this-is-it-640x640.jpg'],
  ['2025/11/album-cover_michael-640x640.jpg', 'albuns/album-cover_michael-640x640.jpg'],
  ['2025/11/album-cover_immortal-640x640.jpg', 'albuns/album-cover_immortal-640x640.jpg'],
  ['2025/11/album-cover_xscape-640x640.jpg', 'albuns/album-cover_xscape-640x640.jpg'],
  ['2025/11/album-cover_scream-640x640.jpg', 'albuns/album-cover_scream-640x640.jpg'],
  ['2025/11/v-dont-stop-poster.jpg', 'posters/v-dont-stop-poster.jpg'],
  ['2025/11/v-rock-with-you-poster.jpg', 'posters/v-rock-with-you-poster.jpg'],
  ['2025/11/v-shes-out-poster.jpg', 'posters/v-shes-out-poster.jpg'],
  ['2025/11/v-thriller-poster.jpg', 'posters/v-thriller-poster.jpg'],
  ['2025/11/v-bad-poster.jpg', 'posters/v-bad-poster.jpg'],
  ['2025/11/v-the-way-you-make-me-feel-poster.jpg', 'posters/v-the-way-you-make-me-feel-poster.jpg'],
  ['2025/11/v-man-in-the-mirror-poster.jpg', 'posters/v-man-in-the-mirror-poster.jpg'],
  ['2025/11/v-dirty-diana-poster.jpg', 'posters/v-dirty-diana-poster.jpg'],
  ['2025/11/v-smooth-criminal-poster.jpg', 'posters/v-smooth-criminal-poster.jpg'],
  ['2025/11/v-another-part-of-me-poster.jpg', 'posters/v-another-part-of-me-poster.jpg'],
  ['2025/11/v-speed-demon-poster.jpg', 'posters/v-speed-demon-poster.jpg'],
  ['2025/11/v-come-together-poster.jpg', 'posters/v-come-together-poster.jpg'],
  ['2025/11/v-leave-me-alone-poster.jpg', 'posters/v-leave-me-alone-poster.jpg'],
  ['2025/11/v-liberian-girl-poster.jpg', 'posters/v-liberian-girl-poster.jpg'],
  ['2025/11/v-black-or-white-poster.jpg', 'posters/v-black-or-white-poster.jpg'],
  ['2025/11/v-remember-the-time-poster.jpg', 'posters/v-remember-the-time-poster.jpg'],
  ['2025/11/v-in-the-closet-poster.jpg', 'posters/v-in-the-closet-poster.jpg'],
  ['2025/11/v-jam-poster.jpg', 'posters/v-jam-poster.jpg'],
  ['2025/11/v-heal-the-world-poster.jpg', 'posters/v-heal-the-world-poster.jpg'],
  ['2025/11/v-give-in-to-me-poster.jpg', 'posters/v-give-in-to-me-poster.jpg'],
  ['2025/11/v-who-is-it-poster.jpg', 'posters/v-who-is-it-poster.jpg'],
  ['2025/11/v-will-you-be-there-poster.jpg', 'posters/v-will-you-be-there-poster.jpg'],
  ['2025/11/v-gone-too-soon-poster.jpg', 'posters/v-gone-too-soon-poster.jpg'],
  ['2025/11/v-scream-poster.jpg', 'posters/v-scream-poster.jpg'],
  ['2025/11/v-childhood-poster.jpg', 'posters/v-childhood-poster.jpg'],
  ['2025/11/v-you-are-not-alone-poster.jpg', 'posters/v-you-are-not-alone-poster.jpg'],
  ['2025/11/v-earth-song-poster.jpg', 'posters/v-earth-song-poster.jpg'],
  ['2025/11/v-dont-care-about-us-poster.jpg', 'posters/v-dont-care-about-us-poster.jpg'],
  ['2025/11/v-stranger-in-moscow-poster.jpg', 'posters/v-stranger-in-moscow-poster.jpg'],
  ['2025/11/v-blood-on-the-dancefloor-poster.jpg', 'posters/v-blood-on-the-dancefloor-poster.jpg'],
  ['2025/11/v-ghosts-poster.jpg', 'posters/v-ghosts-poster.jpg'],
  ['2025/11/v-rock-my-world-poster.jpg', 'posters/v-rock-my-world-poster.jpg'],
  ['2025/11/v-cry-poster.jpg', 'posters/v-cry-poster.jpg']
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = m => writeFile(LOG, m + '\n', { flag: 'a' }).catch(() => {});

const jaExiste = async p => {
  try { return (await stat(p)).size > 2000; } catch { return false; }
};

const restantes = [];
for (const [origem, destino] of ficheiros) {
  if (!(await jaExiste(join(DEST, destino)))) restantes.push([origem, destino]);
}
log(`[${new Date().toISOString()}] Por descarregar: ${restantes.length}`);

for (const [origem, destino] of restantes) {
  const destinoFinal = join(DEST, destino);
  await mkdir(dirname(destinoFinal), { recursive: true });
  let ok = false;
  for (let tentativa = 1; tentativa <= 5 && !ok; tentativa++) {
    try {
      const r = await fetch(BASE + origem, { headers: { 'User-Agent': 'curl/8.7.1' } });
      const buf = Buffer.from(await r.arrayBuffer());
      if (r.ok && buf.length > 2000) {
        await writeFile(destinoFinal, buf);
        ok = true;
        log(`OK   ${destino}  ${buf.length}`);
      } else {
        log(`FAIL ${destino}  http=${r.status} bytes=${buf.length} (tentativa ${tentativa})`);
      }
    } catch (e) {
      log(`ERR  ${destino}  ${e.message}`);
    }
    if (!ok) await sleep(20000);
  }
  await sleep(12000);
}
log(`[${new Date().toISOString()}] Concluído.`);
