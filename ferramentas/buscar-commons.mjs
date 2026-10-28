/**
 * Procura imagens no Wikimedia Commons (ficheiros de uso livre) para ilustrar
 * os capítulos do trabalho.
 *
 * Uso: node ferramentas/buscar-commons.mjs "Michael Jackson" [limite]
 */
const termo = process.argv[2] || 'Michael Jackson';
const limite = parseInt(process.argv[3] || '12', 10);

const api = 'https://commons.wikimedia.org/w/api.php';

const params = new URLSearchParams({
  action: 'query',
  generator: 'search',
  gsrsearch: `filetype:bitmap ${termo}`,
  gsrnamespace: '6',
  gsrlimit: String(limite),
  prop: 'imageinfo',
  iiprop: 'url|size|extmetadata',
  iiurlwidth: '1200',
  format: 'json',
  origin: '*'
});

const res = await fetch(`${api}?${params}`, {
  headers: { 'User-Agent': 'TrabalhoEscolar/1.0 (educational project)' }
});
const json = await res.json();
const paginas = json?.query?.pages || {};

for (const p of Object.values(paginas)) {
  const info = p.imageinfo?.[0];
  if (!info) continue;
  const meta = info.extmetadata || {};
  const lic = meta.LicenseShortName?.value || '?';
  const autor = (meta.Artist?.value || '').replace(/<[^>]*>/g, '').trim().slice(0, 80);
  console.log(JSON.stringify({
    titulo: p.title,
    thumb: info.thumburl,
    original: info.url,
    largura: info.width,
    altura: info.height,
    licenca: lic,
    autor
  }));
}
