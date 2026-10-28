/**
 * Tabela de substituições literais aplicadas aos ficheiros de texto.
 *
 * Uso: node ferramentas/fix-texto.mjs [ficheiro ...]
 */
import { readFile, writeFile } from 'node:fs/promises';

const RAIZ = new URL('..', import.meta.url).pathname.replace(/^\//, '').replace(/\/$/, '');

const TABELA = {
  'biografia.html': [
    [
      `E é conhecido, ainda, por aquilo que a imprensa do seu tempo não conseguia
              digerir: um homem negro, jovem e EMR, que era simultaneamente o ícone
              sexual mais vendido do planeta e um responsável humanitário com bolsas de
              estudo. Contradição, em-si, é o que faz de um artista uma figura
              cultural e não apenas um sucesso comercial.`,
      `E é conhecido, ainda, por aquilo que a imprensa do seu tempo não conseguia
              digerir: um homem negro, jovem e atraente, que era simultaneamente o
              ícone sexual mais vendido do planeta e um responsável humanitário com
              bolsas de estudo. Contradição, em-si, é o que faz de um artista uma
              figura cultural e não apenas um sucesso comercial.`
    ],
    [
      `Compreendeu a televisão antes de quase toda a
                    geração do seu público. Os comercais da Pepsi (1984) e daambig
                    perfume (1988) foram peças de comunicação, não publicidade.`,
      `Compreendeu a televisão antes de quase toda a
                    geração do seu público. Os comercais da Pepsi (1984) e de outras
                    marcas (1988) foram peças de comunicação, não publicidade.`
    ],
    [
      `Mas a característica mais preventiva — e a mais útil para a análise — é a
              <strong>contradição</strong>. Eraossiates:`,
      `Mas a característica mais preventiva — e a mais útil para a análise — é a
              <strong>contradição</strong>. Era, em resumo:`
    ],
    [
      `(fazer um álbum dedance; fazer um duplo; fazer um álbum de remixes;`,
      `(fazer um álbum de dance; fazer um duplo; fazer um álbum de remixes;`
    ],
    [
      `é uma tomada de posição explícita contra oEO racismo e contra a
                segregação residua. É o exemplo mais directo de um valor que se
                transforma em obra.`,
      `é uma tomada de posição explícita contra o racismo e contra a
                segregação residual. É o exemplo mais directo de um valor que se
                transforma em obra.`
    ],
    [
      `<strong>Ajuda ao próximo</strong> — a humanitarian career, com a`,
      `<strong>Ajuda ao próximo</strong> — a carreira humanitária, com a`
    ],
    [
      `entrevistar a Randy Tarabor trouxe accusations de abuso de crianças
                que a imprensa transformou em caso; em 2003 foi formalmente
                acusado em Santa Maria, na California, e o processo —`,
      `entrevista a Randy Tarabor trouxe acusações de abuso de crianças
                que a imprensa transformou em caso; em 2003 foi formalmente
                acusado em Santa Maria, na Califórnia, e o processo —`
    ],
    [
      `e depois a gravação de <em>This Is It</em>: a decisão de se deixar
                filmar emFRA no trabalho. Foi o momento em que a personagem pública
                se voltou a encontrar com a pessoa real.`,
      `e depois a gravação de <em>This Is It</em>: a decisão de se deixar
                filmar sem reservas. Foi o momento em que a personagem pública
                se voltou a encontrar com a pessoa real.`
    ],
    [
      `Perdeu a máquina promotional
                  da Motown e ganhou controlo artístico`,
      `Perdeu a máquina promocional
                  da Motown e ganhou controlo artístico`
    ],
    [
      `“Thriller” é um curta-metragem com orçamento de cinema, Actors
                   profissional, argumento e efeitos especiais. Nenhum
                   videoclipe antes disso tinha duraç`,
      `“Thriller” é um curta-metragem com orçamento de cinema, atores
                   profissionais, argumento e efeitos especiais. Nenhum
                   videoclipe antes disso tinha duração`
    ],
    [
      `deixou de ser um cantor
          adolescent entre outros e passou a controlar a própria imagem, som e narrativa.`,
      `deixou de ser um cantor
          adolescente entre outros e passou a controlar a própria imagem, som e narrativa.`
    ],
    [
      `o corpo, o sexo, o olhar remote.`,
      `o corpo, o sexo, o olhar distante.`
    ]
  ]
};

const ficheiros = process.argv.slice(2);
const lista = ficheiros.length ? ficheiros : Object.keys(TABELA);

/* ------------------------------------------------------------------ */
/* Substituições por expressão regular (tolerantes a indentação)        */
/* ------------------------------------------------------------------ */
const PADRAOES = {
  'biografia.html': [
    [/trouxe accusations de abuso/g, 'trouxe acusações de abuso'],
    [/na California,/g, 'na Califórnia,'],
    [/cinema, Actors/g, 'cinema, atores'],
    [/professional, argumento/g, 'profissionais, argumento'],
    [/profissional, argumento e efeitos/g, 'profissionais, argumento e efeitos'],
    [/tinha dura\uFFFD+\u00E7o narrativa/g, 'tinha duração narrativa'],
    [/um cantor\s+adolescent entre outros/g, 'um cantor adolescente entre outros'],
    [/o olhar remote\./g, 'o olhar distante.'],
    [/O\s*Traje de/g, 'O traje de'],
    [/lhekez\./g, 'lhe fez.'],
    [/OTraje de/g, 'O traje de']
  ],
  'ferramentas/partes/cultura/02.html': [
    [/sinonimo de sucesso/g, 'sinónimo de sucesso']
  ]
};

let total = 0;
for (const nome of lista) {
  const caminho = `${RAIZ}/${nome}`;
  let texto = await readFile(caminho, 'utf8');
  let aplicadas = 0;
  for (const [antes, depois] of TABELA[nome] || []) {
    if (texto.includes(antes)) {
      texto = texto.split(antes).join(depois);
      aplicadas++;
    }
  }
  for (const [re, depois] of PADRAOES[nome] || []) {
    const antes = texto;
    texto = texto.replace(re, depois);
    if (texto !== antes) aplicadas++;
  }
  if (aplicadas) {
    await writeFile(caminho, texto, 'utf8');
    console.log(`${nome}: ${aplicadas} substituição(ões)`);
    total += aplicadas;
  } else {
    console.log(`${nome}: sem correspondência`);
  }
}
console.log(`total: ${total}`);
