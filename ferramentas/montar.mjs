/**
 * Script auxiliar (não faz parte do site).
 * Monta as páginas do trabalho a partir do modelo e das partes de conteúdo,
 * para que cada página possa ser escrita em blocos curtos e editáveis.
 *
 * Uso:  node ferramentas/montar.mjs [nome-da-pagina]
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PARTES = join(RAIZ, 'ferramentas', 'partes');

/** Definição de cada página: título, descrição,Secção ativa e blocos de hero. */
const PAGINAS = {
  cultura: {
    titulo: 'A Cultura — Michael Jackson | Trabalho de Grupo',
    descricao: 'Capítulo B do trabalho: o contexto cultural em que Michael Jackson cresceu, a influência da cultura na sua obra e o que ele contribuiu para a cultura.',
    atual: 'CULTURA',
    hero: 'cultura'
  },
  comunidade: {
    titulo: 'A Comunidade — Michael Jackson | Trabalho de Grupo',
    descricao: 'Capítulo C do trabalho: o impacto de Michael Jackson na sociedade, as causas sociais, os grupos inspirados e a relação entre pessoa, cultura e comunidade.',
    atual: 'COMUNIDADE',
    hero: 'comunidade'
  },
  legado: {
    titulo: 'O Impacto e o Legado — Michael Jackson | Trabalho de Grupo',
    descricao: 'Capítulo E do trabalho: o impacto de Michael Jackson, o que deixou às próximas gerações, a influência atual e as razões para o estudar.',
    atual: 'LEGADO',
    hero: 'legado'
  },
  conclusao: {
    titulo: 'Conclusão — Michael Jackson | Trabalho de Grupo',
    descricao: 'Capítulo F do trabalho: porque escolhemos Michael Jackson, o que aprendemos com ele, a linha contínua da análise e a opinião de cada elemento do grupo.',
    atual: 'CONCLUSAO',
    hero: 'conclusao'
  },
  guiao: {
    titulo: 'Guião do Trabalho — Michael Jackson',
    descricao: 'Mapa de todas as perguntas do enunciado e da página onde cada uma é respondida.',
    atual: 'GUIAO',
    hero: 'guiao'
  },
  albuns: {
    titulo: 'Discografia — Michael Jackson | Trabalho de Grupo',
    descricao: 'A discografia completa de Michael Jackson: catorze álbuns com as respetivas tracklists e uma leitura do que cada um acrescenta.',
    atual: '',
    hero: 'albuns'
  },
  videos: {
    titulo: 'Videoclipes — Michael Jackson | Trabalho de Grupo',
    descricao: 'Trinta e três videoclipes de Michael Jackson, organizados cronologicamente, com a leitura cultural de cada período.',
    atual: '',
    hero: 'videos'
  },
  album: {
    titulo: 'Álbum — Michael Jackson | Trabalho de Grupo',
    descricao: 'Ficha de álbum com capa, tracklist e análise.',
    atual: '',
    hero: 'album'
  }
};

/** Blocos de hero reutilizáveis. */
const HEROS = {
  cultura: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Capítulo B &middot; Lente 02</span>
    <h1 class="h1">A Cultura</h1>
    <p class="page-hero__lead">
      Ninguém cria do nada. Este capítulo segue as raízes: a Motown e o R&amp;B negro
      americano, a segregação, a televisão, a MTV, o pop global. Depois mostra o
      inverso — o momento em que a cultura deixa de ser o que o formou e passa
      a ser aquilo que ele próprio reconfigurou.
    </p>
    <div class="page-hero__meta">
      <a class="btn btn--light" href="#q-contexto"><span>Começar a leitura</span><span class="btn__arrow">&darr;</span></a>
      <a class="btn btn--light" href="comunidade.html"><span>Capítulo C: A Comunidade</span><span class="btn__arrow">&rarr;</span></a>
    </div>
  </div>
</section>`,
  comunidade: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Capítulo C &middot; Lente 03</span>
    <h1 class="h1">A Comunidade</h1>
    <p class="page-hero__lead">
      O que acontece quando um artista deixa de ser apenas um produto e passa a
      ser uma presença? As causas sociais, as pessoas que inspirou, os grupos
      que tocou, as mentalidades que mudou &mdash; e o modelo que liga a pessoa,
      a cultura e a comunidade.
    </p>
    <div class="page-hero__meta">
      <a class="btn btn--light" href="#q-impacto-sociedade"><span>Começar a leitura</span><span class="btn__arrow">&darr;</span></a>
      <a class="btn btn--light" href="legado.html"><span>Capítulo E: O Impacto</span><span class="btn__arrow">&rarr;</span></a>
    </div>
  </div>
</section>`,
  legado: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Capítulo E &middot; O Impacto</span>
    <h1 class="h1">O Legado</h1>
    <p class="page-hero__lead">
      O que fica quando a pessoa deixa de estar presente? O impacto imediato,
      aquilo que foi entregue às gerações seguintes, a influência que continua
      a actuar hoje &mdash; e as razões por que este trabalho considera que
      Michael Jackson merece ser estudado.
    </p>
    <div class="page-hero__meta">
      <a class="btn btn--light" href="#q-impacto"><span>Começar a leitura</span><span class="btn__arrow">&darr;</span></a>
      <a class="btn btn--light" href="conclusao.html"><span>Capítulo F: Conclusão</span><span class="btn__arrow">&rarr;</span></a>
    </div>
  </div>
</section>`,
  conclusao: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Capítulo F &middot; Conclusão</span>
    <h1 class="h1">Conclusão</h1>
    <p class="page-hero__lead">
      Porque escolhemos Michael Jackson, o que aprendemos com ele e o que cada
      elemento do grupo pensa. A linha contínua de toda a análise, reescrita
      em última instância.
    </p>
    <div class="page-hero__meta">
      <a class="btn btn--light" href="#q-porque-escolhemos"><span>Começar a leitura</span><span class="btn__arrow">&darr;</span></a>
      <a class="btn btn--light" href="guiao.html"><span>Voltar ao guião</span><span class="btn__arrow">&rarr;</span></a>
    </div>
  </div>
</section>`,
  guiao: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Mapa do trabalho</span>
    <h1 class="h1">Guião</h1>
    <p class="page-hero__lead">
      Todas as perguntas do enunciado, com a indicação de onde cada uma &eacute;
      respondida. Serve para navegar, mas sobretudo para verificar que nenhuma
      pergunta ficou sem resposta.
    </p>
  </div>
</section>`,
  albuns: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Arquivo &middot; Escuta</span>
    <h1 class="h1">Discografia</h1>
    <p class="page-hero__lead">
      Catorze álbuns, do <em>Off the Wall</em> (1979) às compilações póstumas.
      Cada capa abre a ficha completa com a tracklist.
    </p>
  </div>
</section>`,
  videos: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Arquivo &middot; Vis&atilde;o</span>
    <h1 class="h1">Videoclipes</h1>
    <p class="page-hero__lead">
      Trinta e tr&ecirc;s videoclipes em ordem cronológica. Clique em qualquer
      cartaz para ver o clipe &mdash; a imagem &eacute;, neste caso, parte
      insepar&aacute;vel da obra.
    </p>
  </div>
</section>`,
  album: `<section class="page-hero">
  <div class="container page-hero__inner">
    <span class="eyebrow eyebrow--light">Arquivo &middot; Ficha</span>
    <h1 class="h1" data-album-titulo>&Aacute;lbum</h1>
  </div>
</section>`
};

async function partesDe(nome) {
  const dir = join(PARTES, nome);
  let lista = [];
  try {
    lista = await readdir(dir);
  } catch {
    return [];
  }
  return lista
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(f => join(dir, f));
}

const modelo = await readFile(join(RAIZ, 'ferramentas', 'modelo.html'), 'utf8');

const pedidos = process.argv.slice(2);
const aMontar = pedidos.length ? pedidos : Object.keys(PAGINAS);

await mkdir(PARTES, { recursive: true });

for (const nome of aMontar) {
  const cfg = PAGINAS[nome];
  if (!cfg) { console.log('pagina desconhecida:', nome); continue; }

  const partes = await partesDe(nome);
  if (!partes.length) { console.log('sem partes para', nome); continue; }

  const conteudos = [];
  for (const p of partes) conteudos.push((await readFile(p, 'utf8')).trim());

  const hero = HEROS[cfg.hero] || '';

  let html = modelo
    .replace('{{TITULO}}', cfg.titulo)
    .replace('{{DESCRICAO}}', cfg.descricao)
    .replace('{{HERO}}', hero)
    .replace('{{CONTEUDO}}', conteudos.join('\n\n'));

  for (const sec of ['INICIO', 'PESSOA', 'CULTURA', 'COMUNIDADE', 'LEGADO', 'CONCLUSAO', 'GUIAO']) {
    html = html.replace('{{ATUAL_' + sec + '}}', sec === cfg.atual ? ' aria-current="page"' : '');
  }

  await writeFile(join(RAIZ, nome + '.html'), html);
  console.log('montada:', nome + '.html', '(' + partes.length + ' partes)');
}
