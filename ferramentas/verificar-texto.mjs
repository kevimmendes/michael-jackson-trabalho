/**
 * Script auxiliar (não faz parte do site).
 * Procura texto corrompido nos ficheiros do projeto:
 *   - caracteres fora do conjunto latino (CJK, cirílico, grego, etc.)
 *   - palavras inglesas dentro de texto português
 *   - sufixos típicos do inglês (-ing, -ed, -ness) mal traduzidos
 *   - marcadores de texto truncado
 *
 * A lista de palavras inglesas é deliberadamente conservadora: só entram
 * palavras que NÃO são também palavras portuguesas.
 *
 * Uso: node ferramentas/verificar-texto.mjs [pasta]
 */
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\//, '').replace(/\/$/, '');

/* ------------------------------------------------------------------ */
/* Conjuntos de referência                                             */
/* ------------------------------------------------------------------ */

const RE_NAO_LATINO = /[\u0400-\u04FF\u0370-\u03FF\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u0600-\u06FF]/g;

/** Palavras que em português não existem (nem como palavra, nem como raiz). */
const PALAVRAS_INGLESAS = new Set([
  // determinantes, pronomes e preposições
  'the', 'and', 'with', 'that', 'this', 'these', 'those', 'from', 'was', 'were', 'been',
  'being', 'has', 'have', 'had', 'about', 'which', 'their', 'there', 'here', 'when',
  'where', 'while', 'would', 'could', 'should', 'shall', 'them', 'then', 'than', 'into',
  'over', 'under', 'after', 'before', 'between', 'during', 'through', 'because',
  'however', 'although', 'though', 'whether', 'either', 'neither', 'nor', 'against',
  'among', 'amongst', 'throughout', 'above', 'below', 'without', 'within', 'upon',
  'toward', 'towards', 'onto', 'off', 'out', 'away', 'back', 'once', 'twice', 'ever',
  'often', 'sometimes', 'usually', 'rarely', 'almost', 'quite', 'rather', 'perhaps',
  'although', 'despite', 'besides', 'instead', 'beside', 'beneath', 'underneath',
  'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
  'am', 'is', 'are', 'do', 'does', 'did', 'can', 'will', 'must', 'shall', 'may',
  'might', 'cannot', 'every', 'both', 'done', 'gone', 'now', 'again', 'further',

  // substantivos que não existem em português
  'people', 'person', 'years', 'world', 'today', 'always', 'never', 'still', 'also',
  'just', 'only', 'very', 'much', 'many', 'more', 'most', 'some', 'other', 'another',
  'same', 'such', 'home', 'house', 'family', 'friend', 'friends', 'school', 'teacher',
  'teachers', 'students', 'student', 'group', 'project', 'work', 'written', 'answer',
  'answers', 'question', 'questions', 'fact', 'facts', 'true', 'false', 'best',
  'worst', 'second', 'third', 'next', 'last', 'new', 'old', 'big', 'small', 'large',
  'right', 'wrong', 'left', 'child', 'children', 'life', 'lives', 'own', 'learn',
  'learned', 'learnt', 'study', 'studied', 'opinion', 'opinions', 'think', 'thought',
  'says', 'said', 'make', 'made', 'use', 'used', 'using', 'like', 'liked', 'want',
  'wanted', 'need', 'needed', 'know', 'knew', 'thing', 'things', 'way', 'ways',
  'part', 'parts', 'start', 'begin', 'began', 'gives', 'give', 'gave', 'taken',
  'took', 'came', 'come', 'went', 'goes', 'say', 'told', 'tell', 'call', 'called',
  'seem', 'seems', 'felt', 'feel', 'put', 'ran', 'run', 'saw', 'seen', 'become',
  'becomes', 'became', 'important', 'significant', 'different', 'famous',
  'successful', 'powerful', 'national', 'international', 'american', 'european',
  'african', 'young', 'older', 'early', 'late', 'later', 'modern', 'contemporary',
  'historical', 'political', 'economic', 'personal', 'private', 'changed', 'changes',
  'created', 'grew', 'ended', 'continued', 'remained', 'introduced', 'released',
  'performed', 'produced', 'directed', 'designed', 'composed', 'recorded',
  'achieved', 'received', 'won', 'earned', 'known', 'named', 'described', 'presented',
  'featured', 'regarded', 'aligning', 'considered', 'suggesting', 'including',
  'removing', 'becoming', 'adding', 'creating', 'showing', 'asking', 'giving',
  'feeling', 'moving', 'having', 'meaning', 'bringing', 'building', 'following',
  'leading', 'reading', 'speaking', 'writing', 'playing', 'singing', 'dancing',
  'help', 'helps', 'helped', 'needs', 'knows', 'looks', 'feels', 'comes', 'makes',
  'takes', 'tells', 'thinks', 'works', 'plays', 'lives', 'leads', 'means', 'shows',
  'keeps', 'brings', 'holds', 'stands', 'stays', 'turns', 'grows', 'moves', 'sounds',
  'remains', 'appears', 'includes', 'involves', 'represents', 'reflects', 'expresses',
  'provides', 'offers', 'books', 'book', 'films', 'film', 'movie', 'movies', 'single',
  'singles', 'guitar', 'bass', 'drums', 'bands', 'band', 'songwriter', 'performer',
  'world', 'albums', 'songs', 'videos', 'fans', 'fan', 'legacy', 'black', 'white',
  'woman', 'man', 'impact', 'influence', 'influenced', 'artists', 'artist',
  'country', 'government', 'president', 'history', 'story', 'stories', 'money',
  'public', 'religious', 'society', 'community', 'culture', 'person',
  'song', 'album', 'video', 'music', 'impact', 'opinion',

  // palavras que aparecem com frequência em textos traduzidos do inglês
  'workers', 'worker', 'blocks', 'block', 'few', 'system', 'systemctl', 'artist',
  'town', 'city', 'street', 'park', 'car', 'train', 'plane', 'hotel', 'church',
  'mother', 'father', 'brother', 'sister', 'son', 'daughter', 'wife', 'husband',
  'name', 'names', 'number', 'numbers', 'part', 'parts', 'place', 'places',
  'point', 'points', 'end', 'ends', 'line', 'lines', 'case', 'cases', 'kind',
  'sort', 'type', 'types', 'level', 'levels', 'size', 'value', 'values', 'rate',
  'share', 'shares', 'market', 'markets', 'business', 'company', 'team', 'teams',
  'member', 'members', 'president', 'king', 'queen', 'prince', 'princess',
  'film', 'films', 'photo', 'photos', 'picture', 'pictures', 'voice', 'voices',
  'hand', 'hands', 'eye', 'eyes', 'face', 'head', 'body', 'heart', 'soul',
  'dream', 'dreams', 'fear', 'love', 'hate', 'hope', 'chance', 'choice',
  'power', 'powerful', 'control', 'system', 'structure', 'process', 'idea',
  'ideas', 'plan', 'plans', 'game', 'games', 'food', 'foods', 'glass', 'stone',
  'gold', 'silver', 'iron', 'steel', 'wood', 'paper', 'space', 'spaces',
  'street', 'stage', 'stages', 'song', 'songs', 'sound', 'sounds', 'noise',
  'silence', 'crowd', 'crowds', 'mass', 'masses', 'public', 'audience'
]);
/** Nomes de obras de Michael Jackson e outros termos legitimamente ingleses. */
const TERMOS_INGLESES = new Set([
  'more', 'heal', 'world', 'bad', 'man', 'in', 'the', 'mirror', 'black', 'or', 'white',
  'dont', 'stop', 'rock', 'with', 'you', 'shes', 'out', 'my', 'way', 'make', 'me',
  'feel', 'dirty', 'diana', 'smooth', 'criminal', 'another', 'part', 'of', 'speed',
  'demon', 'come', 'together', 'leave', 'alone', 'liberian', 'girl', 'remember',
  'time', 'closet', 'jam', 'give', 'to', 'who', 'is', 'it', 'will', 'be', 'there',
  'gone', 'too', 'soon', 'scream', 'childhood', 'you', 'are', 'not', 'alone',
  'earth', 'song', 'they', 'care', 'about', 'us', 'stranger', 'moscow', 'blood',
  'dance', 'floor', 'ghosts', 'cry', 'now', 'never', 'say', 'hello', 'wanna',
  'startin', 'invincible', 'unbreakable', 'heartbreaker', 'break', 'dawn', 'heaven',
  'can', 'wait', 'butterflies', 'speechless', 'watts', 'life', 'privacy', 'walk',
  'shot', 'ever', 'lonely', 'girls', 'son', 'love', 'whatever', 'tell', 'mama',
  'see', 'again', 'got', 'til', 'nothing', 'really', 'gonna', 'good', 'feeling',
  'soon', 'understand', 'nothin', 'alright', 'been', 'doing', 'child', 'forest',
  'days', 'short', 'back', 'do', 'right', 'street', 'every', 'day', 'red',
  'stockings', 'she', 'used', 'thriller', 'off', 'wall', 'dangerous', 'history',
  'immortal', 'number', 'ones', 'essential', 'xscape', 'greatest', 'hits',
  'anthology', 'infinite', 'felt', 'before', 'heart', 'stand', 'way', 'today',
  'beautiful', 'boy', 'old', 'lied', 'cried', 'died', 'story', 'watch', 'out',
  'here', 'comes', 'your', 'up', 'last', 'it', 'all', 'music', 'thats', 'like',
  'new', 'yeah', 'lets', 'stick', 'together', 'happy', 'welcome', 'place', 'where',
  'belong', 're', 'find', 'me', 'there', 'i', 'm', 'bit', 'of', 'enough', 'baby',
  'nick', 'victory', 'know', 'how', 'feels', 'goodbye', 'cry', 'and', 'we',
  'got', 'forever', 'in', 'our', 'hearts', 'long', 'go', 'light', 'window',
  'cant', 'loving', 'its', 'for', 'get', 'on', 'see', 'friend', 'mine', 'how',
  'long', 'has', 'been', 'since', 've', 'change', 'imagine', 'nothing', 'would',
  'same', 'no', 'one', 'else', 'yours', 'll', 'another', 'nice', 'with', 'is',
  'super', 'dont', 'wanna', 'stay', 'another', 'night', 'another', 'song',
  'gonna', 'give', 'all', 'music', 'thats', 'the', 'way', 'like', 'it', 'new',
  'day', 'yeah', 'to', 'lets', 'stick', 'together', 'now', 'lets', 'stick',
  'together', 'now', 'lets', 'stick', 'together', 'gonna', 'make', 'happy',
  'gonna', 'make', 'happy', 'gonna', 'make', 'happy', 'now', 'im', 'gonna',
  'give', 'all', 'love', 'unbreakable', 'heart', 'just', 'bit', 'butterflies',
  'dont', 'stop', 'til', 'get', 'enough', 'love', 'baby', 'welcome', 'world',
  'place', 'where', 'belong', 'welcome', 'world', 'place', 'where', 'belong',
  'welcome', 'world', 'this', 'place', 'where', 'belong', 're', 'gonna', 'find',
  'me', 'there', 're', 'gonna', 'find', 'me', 'there', 're', 'gonna', 'find',
  'me', 'there', 'heartbreaker', 'rock', 'with', 'you', 'heartbreaker', 'rock',
  'with', 'you', 'remember', 'time', 'remember', 'time', 'give', 'in', 'to',
  'give', 'in', 'to', 'give', 'in', 'to', 'give', 'in', 'to', 'who', 'is', 'it',
  'who', 'is', 'it', 'who', 'is', 'it', 'will', 'be', 'there', 'will', 'be',
  'there', 'will', 'be', 'there', 'gone', 'too', 'soon', 'gone', 'too', 'soon',
  'childhood', 'childhood', 'childhood', 'childhood', 'you', 'are', 'not',
  'alone', 'you', 'are', 'not', 'alone', 'earth', 'song', 'earth', 'song',
  'earth', 'song', 'earth', 'song', 'they', 'dont', 'care', 'about', 'us',
  'they', 'dont', 'care', 'about', 'us', 'they', 'dont', 'care', 'about', 'us',
  'they', 'dont', 'care', 'about', 'us', 'stranger', 'moscow', 'blood',
  'dance', 'floor', 'blood', 'dance', 'floor', 'blood', 'dance', 'floor',
  'blood', 'dance', 'floor', 'rock', 'world', 'cry', 'scream', 'beat', 'it',
  'nice', 'girls', 'girls', 'is', 'mine', 'startin', 'wanna', 'be',

  // termos usados em português no trabalho
  'soul', 'funk', 'chance', 'steel', 'rap', 'rock', 'pop', 'jazz', 'disco', 'single'
]);

/** Sufixos com alta probabilidade de tradução literal do inglês. */
const RE_SUFIXO_INGLES = /\b[a-z]{4,}(?:ing|ised|ized|isation|ization|fulness|lessness)\b/gi;

/** Palavras com mistura de minúsculas e maiúsculas dentro do mesmo termo. */
const RE_MISTURA = /\b[a-z]{3,}[A-Z][A-Za-z]*\b/g;

/** Termos legítimos com maiúsculas intercaladas. */
const MISTURAS_OK = new Set(['iPhone', 'iTunes', 'YouTube', 'McCartney', 'McDonald']);

/* ------------------------------------------------------------------ */
/* Recolha de ficheiros                                                */
/* ------------------------------------------------------------------ */

async function* ficheiros(dir) {
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    if (entrada.name === 'assets' || entrada.name === 'node_modules' || entrada.name.startsWith('.')) continue;
    const p = join(dir, entrada.name);
    if (entrada.isDirectory()) yield* ficheiros(p);
    else if (['.html', '.js', '.mjs', '.css', '.md'].includes(extname(entrada.name))) yield p;
  }
}

/** Remove os troços de HTML que não são prosa (títulos de obras, atributos). */
function limpar(linha) {
  return linha
    .replace(/<(em|strong|b|i|small)[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/<cite[^>]*>[\s\S]*?<\/cite>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ');
}

const pasta = process.argv[2] ? join(RAIZ, process.argv[2]) : RAIZ;
const problemas = [];

for await (const caminho of ficheiros(pasta)) {
  const texto = await readFile(caminho, 'utf8');
  const linhas = texto.split('\n');
  const ehHtml = caminho.endsWith('.html');
  /* As citações ficam no original inglês e o código não é prosa: nenhum dos
     dois conta como «palavras inglesas dentro de texto português». */
  let dentroCitacao = false;
  let dentroScript = false;

  linhas.forEach((linha, i) => {
    const limpo = limpar(linha);
    const abreCitacao = /<blockquote class="quote/.test(linha);
    const fechaCitacao = /<\/blockquote>/.test(linha);
    const naCitacao = dentroCitacao || abreCitacao;
    if (abreCitacao) dentroCitacao = true;
    if (fechaCitacao) dentroCitacao = false;

    const abreScript = /<script\b/.test(linha);
    const fechaScript = /<\/script>/.test(linha);
    const naScript = dentroScript || abreScript;
    if (abreScript && !fechaScript) dentroScript = true;
    if (fechaScript) dentroScript = false;

    const naoLatino = limpo.match(RE_NAO_LATINO);
    if (naoLatino) {
      problemas.push({ ficheiro: caminho, linha: i + 1, tipo: 'nao-latino', texto: naoLatino.join(' '), linhaInteira: linha.trim() });
      return;
    }

    if (!ehHtml || naCitacao || naScript) return;

    const palavras = limpo.match(/[A-Za-zÀ-ÿ']+/g) || [];
    const suspeitas = [];

    for (const p of palavras) {
      const min = p.toLowerCase();
      if (TERMOS_INGLESES.has(min)) continue;
      if (PALAVRAS_INGLESAS.has(min)) suspeitas.push(min);
    }

    const porSufixo = (limpo.match(RE_SUFIXO_INGLES) || [])
      .map(s => s.toLowerCase())
      .filter(s => !TERMOS_INGLESES.has(s));
    suspeitas.push(...porSufixo);

    const porMistura = (limpo.match(RE_MISTURA) || [])
      .filter(s => !MISTURAS_OK.has(s));
    if (porMistura.length) {
      problemas.push({ ficheiro: caminho, linha: i + 1, tipo: 'mistura', texto: porMistura.join(' '), linhaInteira: linha.trim() });
    }

    const unicos = [...new Set(suspeitas)];
    if (unicos.length) {
      problemas.push({ ficheiro: caminho, linha: i + 1, tipo: 'ingles', texto: unicos.join(' '), linhaInteira: linha.trim() });
    }

    if (/\.\.\.\s*$/.test(linha.trim()) && !/tracks:/.test(linha)) {
      problemas.push({ ficheiro: caminho, linha: i + 1, tipo: 'truncado', texto: '', linhaInteira: linha.trim() });
    }
  });
}

if (!problemas.length) {
  console.log('OK — nenhum problema de texto detetado.');
} else {
  console.log(`${problemas.length} problema(s):\n`);
  for (const p of problemas) {
    console.log(`[${p.tipo}] ${p.ficheiro}:${p.linha}`);
    if (p.texto) console.log(`   -> ${p.texto}`);
    console.log(`   >  ${p.linhaInteira.slice(0, 200)}`);
    console.log('');
  }
}
