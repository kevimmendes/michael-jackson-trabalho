/** Tentativa de descarregar mais imagens do Commons, com pausas longas. */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const ALVOS = [
  ['https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/%22Will_You_Be_There%22_performance_at_Monza_%28July_6%2C_1992%29.jpg/1280px-%22Will_You_Be_There%22_performance_at_Monza_%28July_6%2C_1992%29.jpg', 'assets/fotos/monza-1992.jpg'],
  ['https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Sticky-holiday-MJ-tribute.jpg/1280px-Sticky-holiday-MJ-tribute.jpg', 'assets/fotos/tributo.jpg'],
  ['https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Michael_Jackson%27s_%E2%80%9CBeat_It%E2%80%9D_jacket_worn_on_1992.jpg/1280px-Michael_Jackson%27s_%E2%80%9CBeat_It%E2%80%9D_jacket_worn_on_1992.jpg', 'assets/fotos/beat-it-jacket.jpg'],
  ['https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Michael_Jackson_white_fedora_%28Smooth_Criminal%29%2C_Hard_Rock_Cafe%2C_Nice.jpg/1280px-Michael_Jackson_white_fedora_%28Smooth_Criminal%29%2C_Hard_Rock_Cafe%2C_Nice.jpg', 'assets/fotos/fedora.jpg'],
  ['https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/We_Are_The_World_Cyndi-Glenn_Francis.jpg/800px-We_Are_The_World_Cyndi-Glenn_Francis.jpg', 'assets/fotos/wat-stage.jpg']
];

for (const [url, destino] of ALVOS) {
  let ok = false;
  for (let t = 0; t < 4 && !ok; t++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'TrabalhoEscolar/1.0 (educational project)' },
        redirect: 'follow'
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        await mkdir(dirname(destino), { recursive: true });
        await writeFile(destino, buf);
        console.log('ok', destino, (buf.length / 1024).toFixed(0) + ' KB');
        ok = true;
      } else {
        console.log('http', res.status, destino);
        await new Promise(r => setTimeout(r, 8000 * (t + 1)));
      }
    } catch (e) {
      console.log('erro', destino, e.message);
      await new Promise(r => setTimeout(r, 8000));
    }
  }
  await new Promise(r => setTimeout(r, 5000));
}
console.log('terminado');
