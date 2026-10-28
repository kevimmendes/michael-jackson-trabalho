/* =====================================================================
   TRABALHO DE GRUPO — MICHAEL JACKSON
   Pessoa · Cultura · Comunidade
   ---------------------------------------------------------------------
   Ficheiro de dados de catálogo (discografia, videoclipes, cronologia
   e guião do trabalho). Editar aqui para atualizar o conteúdo sem
   mexer no código das páginas.
   ===================================================================== */

/* `const` no escopo global não cria propriedade em `window`, por isso o
   script.js (que testa `window.DADOS`) não encontrava os dados. */
const DADOS = {

  /* ---------------------------------------------------------------
     1. DISCOGRAFIA
     --------------------------------------------------------------- */
  albuns: [
    {
      id: 'off-the-wall',
      cat: 'estudio',
      titulo: 'Off the Wall',
      data: 'Ago 1979',
      ano: 1979,
      capa: 'assets/albuns/album-cover_offthewall-640x640.jpg',
      resumo: 'O álbum de transição. A Motown organiza a saída, a Epic acolhe. Quincy Jones transforma o R&B de estúdio em pop internacional.',
      tracks: ['Off The Wall', 'Get on the Floor', "Workin' Day and Night", 'Girlfriend', "I Can't Help It", "It's the Falling in Love", 'Burn This Disco Out', 'Rock With You', "Don't Stop 'Til You Get Enough", "She's Out of My Life"]
    },
    {
      id: 'thriller',
      cat: 'estudio',
      titulo: 'Thriller',
      data: 'Nov 1982',
      ano: 1982,
      capa: 'assets/albuns/album-cover_thriller-640x640.jpg',
      resumo: 'O álbum mais vendido de sempre. Nove faixas, sete canções no top 10 e um videoclipe de catorze minutos que inventou o cinema pop.',
      tracks: ["Wanna Be Startin' Somethin'", 'Baby Be Mine', 'The Girl Is Mine', 'Thriller', 'Beat It', 'Billie Jean', 'Human Nature', 'P.Y.T. (Pretty Young Thing)', 'The Lady in My Life']
    },
    {
      id: 'bad',
      cat: 'estudio',
      titulo: 'Bad',
      data: 'Ago 1987',
      ano: 1987,
      capa: 'assets/albuns/album-bad-640x640.png',
      resumo: 'Cinco canções seguidas no primeiro lugar nos EUA — um recorde. "Smooth Criminal" fixa o "leaning" como assinatura corporal.',
      tracks: ['Bad', 'The Way You Make Me Feel', 'Speed Demon', 'Liberian Girl', 'Just Good Friends', 'Another Part Of Me', 'Man In The Mirror', "I Just Can't Stop Loving You", 'Dirty Diana', 'Smooth Criminal', 'Leave Me Alone']
    },
    {
      id: 'dangerous',
      cat: 'estudio',
      titulo: 'Dangerous',
      data: 'Nov 1991',
      ano: 1991,
      capa: 'assets/albuns/album-cover_dangerous-640x640.jpg',
      resumo: 'O álbum mais adulto. Fragmentação, sexualidade, fé e mensagem social: "Black or White" e "Heal the World" mudam o tipo de artista que ele é.',
      tracks: ['Jam', 'Why You Wanna Trip on Me', 'In the Closet', 'She Drives Me Wild', 'Remember The Time', "Can't Let Her Get Away", 'Heal the World', 'Black or White', 'Who Is It', 'Give In To Me', 'Will You Be There', 'Keep The Faith', 'Gone Too Soon', 'Dangerous']
    },
    {
      id: 'history-past-present-and-future-book-i',
      cat: 'estudio',
      titulo: 'HIStory: Past, Present and Future, Book I',
      data: 'Jun 1995',
      ano: 1995,
      capa: 'assets/albuns/album-cover_history-640x640.jpg',
      resumo: 'Álbum duplo: um disco de êxitos e outro inteiramente novo. "Scream" e "They Don’t Care About Us" misturam a crítica musical e a crítica social.',
      tracks: ['Billie Jean', 'The Way You Make Me Feel', 'Black or White', 'Rock With You', "She's Out Of My Life", 'Bad', "I Just Can't Stop Loving You", 'Man In The Mirror', 'Thriller', 'Beat It', 'The Girl Is Mine', 'Remember The Time', "Don't Stop 'Til You Get Enough", "Wanna Be Startin' Somethin'", 'Heal the World', 'Scream', 'They Don’t Care About Us', 'Stranger in Moscow', 'This Time Around', 'Earth Song', 'D.S.', 'Money', 'Come Together', 'You Are Not Alone', 'Childhood', 'Tabloid Junkie', '2 Bad', 'History', 'Little Susie', 'Smile']
    },
    {
      id: 'blood-on-the-dancefloor-history-in-the-mix',
      cat: 'estudio',
      titulo: 'Blood on the Dance Floor: HIStory in the Mix',
      data: 'Mai 1997',
      ano: 1997,
      capa: 'assets/albuns/album-cover_bloodonthedancefloor-640x640.jpg',
      resumo: 'Cinco faixas novas e remixes. É o álbum da HIStory World Tour — som pensado para a arena, não para o rádio.',
      tracks: ['Blood on the Dance Floor', 'Morphine', 'Superfly Sister', 'Ghosts', 'Is It Scary', 'Scream Louder', 'Money', '2 Bad', 'Stranger in Moscow', 'This Time Around', 'Earth Song', 'You Are Not Alone', 'History']
    },
    {
      id: 'invincible',
      cat: 'estudio',
      titulo: 'Invincible',
      data: 'Out 2001',
      ano: 2001,
      capa: 'assets/albuns/album-cover_invincible-640x640.jpg',
      resumo: 'O último álbum de material original em vida. "Unbreakable" responde, palavra a palavra, à crítica pública: o disco é também uma tese sobre a reputação.',
      tracks: ['Unbreakable', 'Heartbreaker', 'Invincible', 'Break of Dawn', 'Heaven Can Wait', 'You Rock My World', 'Butterflies', 'Speechless', '2000 Watts', 'You Are My Life', 'Privacy', "Don't Walk Away", 'Cry', 'The Lost Children', 'Whatever Happens', 'Threatened']
    },
    {
      id: 'number-ones',
      cat: 'compilacao',
      titulo: 'Number Ones',
      data: 'Nov 2003',
      ano: 2003,
      capa: 'assets/albuns/album-cover_numberones-640x640.jpg',
      resumo: 'Coletânea de 2003 com os números um do catálogo — a obra reorganizada para um público novo.',
      tracks: ["Don't Stop 'Til You Get Enough", 'Rock With You', 'Billie Jean', 'Beat It', 'Thriller', "I Just Can't Stop Loving You", 'Bad', 'Smooth Criminal', 'The Way You Make Me Feel', 'Man In The Mirror', 'Dirty Diana', 'Black or White', 'You Are Not Alone', 'Earth Song', 'You Rock My World', 'Break of Dawn', 'One More Chance', 'Ben']
    },
    {
      id: 'essential-michael-jackson',
      cat: 'compilacao',
      titulo: 'Essential Michael Jackson',
      data: 'Jul 2005',
      ano: 2005,
      capa: 'assets/albuns/album-cover_theessentialmj-640x640.jpg',
      resumo: 'A antologia que atravessa dos Jackson 5 à carreira solo — a forma como o catálogo é apresentado ao público novo.',
      tracks: ['I Want You Back', 'ABC', 'The Love You Save', 'Got To Be There', "Rockin' Robin", 'Ben', 'Enjoy Yourself', 'Blame It On The Boogie', 'Shake Your Body', "Don't Stop 'Til You Get Enough", 'Rock With You', 'Off The Wall', "She's Out Of My Life", 'Can You Feel It', 'The Girl Is Mine', 'Billie Jean', 'Beat It', "Wanna Be Startin' Somethin'", 'Human Nature', 'P.Y.T.', 'Thriller', 'Bad', "I Just Can't Stop Loving You", 'Leave Me Alone', 'The Way You Make Me Feel', 'Man In The Mirror', 'Dirty Diana', 'Another Part Of Me', 'Smooth Criminal', 'Black or White', 'Heal the World', 'Remember The Time', 'In The Closet', 'Who Is It', 'Will You Be There', 'Dangerous', 'You Are Not Alone', 'You Rock My World']
    },
    {
      id: 'this-is-it',
      cat: 'posthumo',
      titulo: 'This Is It',
      data: 'Out 2009',
      ano: 2009,
      capa: 'assets/albuns/album-this-is-it-640x640.jpg',
      resumo: 'Os ensaios de Londres reunidos num filme e num álbum, lançados em outubro de 2009.',
      tracks: ["Wanna Be Startin' Somethin'", 'Jam', 'They Don’t Care About Us', 'Human Nature', 'Smooth Criminal', 'The Way You Make Me Feel', 'Shake Your Body', "I Just Can't Stop Loving You", 'Thriller', 'Beat It', 'Black Or White', 'Earth Song', 'Billie Jean', 'Man In The Mirror', 'This Is It']
    },
    {
      id: 'michael',
      cat: 'posthumo',
      titulo: 'Michael',
      data: 'Dez 2010',
      ano: 2010,
      capa: 'assets/albuns/album-cover_michael-640x640.jpg',
      resumo: 'Faixas inéditas recuperadas das sessões mais remotas — o catálogo tratado como arquivo vivo.',
      tracks: ['Hold My Hand', 'Hollywood Tonight', '(I Like) The Way You Love Me', 'Best of Joy', 'Another Day', 'Behind The Mask', 'Much Too Soon']
    },
    {
      id: 'immortal',
      cat: 'compilacao',
      titulo: 'Immortal',
      data: 'Nov 2011',
      ano: 2011,
      capa: 'assets/albuns/album-cover_immortal-640x640.jpg',
      resumo: 'Banda sonora da digressão THE IMMORTAL World Tour, do Cirque du Soleil: o catálogo transformado em espetáculo de arena.',
      tracks: ["Workin' Day and Night", 'The Immortal Intro', 'Childhood', "Wanna Be Startin' Somethin'", 'Shake Your Body', 'Dancing Machine', 'Ben', 'This Place Hotel', 'Smooth Criminal', 'Dangerous', 'The Mime Segment', 'The Jackson 5 Medley', 'Speechless', 'Is It Scary', 'Thriller', 'You Are Not Alone', 'Beat It', 'Jam', 'Planet Earth', 'Scream', 'Gone Too Soon', 'They Don’t Care About Us', 'Will You Be There', "I'll Be There", 'Immortal Megamix', 'Man In The Mirror', 'Remember The Time']
    },
    {
      id: 'xscape',
      cat: 'posthumo',
      titulo: 'Xscape',
      data: 'Mai 2014',
      ano: 2014,
      capa: 'assets/albuns/album-cover_xscape-640x640.jpg',
      resumo: 'Faixas de catálogo reeditadas com instrumentação eletrónica mínima. O timbre de 1982 regressa sem a produção de 1982.',
      tracks: ['Love Never Felt So Good', 'Chicago', 'Loving You', 'A Place With No Name', 'Slave To The Rhythm', 'Do You Know Where Your Children Are', 'Blue Gangsta', 'Xscape']
    },
    {
      id: 'scream',
      cat: 'posthumo',
      titulo: 'Scream',
      data: 'Set 2017',
      ano: 2017,
      capa: 'assets/albuns/album-cover_scream-640x640.jpg',
      resumo: 'Compilação de Halloween com a voz original — prova de que, no catálogo póstumo, a reordenação é permanente.',
      tracks: ['This Place Hotel', 'Thriller', 'Blood On The Dance Floor', "Somebody's Watching Me", 'Dirty Diana', 'Torture', 'Leave Me Alone', 'Scream', 'Dangerous', 'Unbreakable', 'Xscape', 'Threatened', 'Ghosts']
    }
  ],

  /* ---------------------------------------------------------------
     2. VIDEOCLIPES
     --------------------------------------------------------------- */
  videos: [
    { titulo: 'Don’t Stop ‘Til You Get Enough', data: 'Nov 1979', yt: 'yURRmWtbTbo', poster: 'v-dont-stop-poster.jpg', cat: '80s' },
    { titulo: 'Rock With You', data: 'Nov 1979', yt: '5X-Mrc2l1d0', poster: 'v-rock-with-you-poster.jpg', cat: '80s' },
    { titulo: 'She’s Out Of My Life', data: 'Nov 1980', yt: '6DQJPL9Yuq0', poster: 'v-shes-out-poster.jpg', cat: '80s' },
    { titulo: 'Thriller', data: 'Nov 1983', yt: 'sOnqjkJTMaA', poster: 'v-thriller-poster.jpg', cat: '80s' },
    { titulo: 'Bad', data: 'Nov 1987', yt: 'Sd4SJVsTulc', poster: 'v-bad-poster.jpg', cat: '80s' },
    { titulo: 'The Way You Make Me Feel', data: 'Nov 1987', yt: 'HzZ_urpj4As', poster: 'v-the-way-you-make-me-feel-poster.jpg', cat: '80s' },
    { titulo: 'Man in the Mirror', data: 'Nov 1988', yt: 'PivWY9wn5ps', poster: 'v-man-in-the-mirror-poster.jpg', cat: '80s' },
    { titulo: 'Dirty Diana', data: 'Nov 1988', yt: 'yUi_S6YWjZw', poster: 'v-dirty-diana-poster.jpg', cat: '80s' },
    { titulo: 'Smooth Criminal', data: 'Nov 1988', yt: 'h_D3VFfhvs4', poster: 'v-smooth-criminal-poster.jpg', cat: '80s' },
    { titulo: 'Another Part of Me', data: 'Nov 1988', yt: '8vwHQNQ88cM', poster: 'v-another-part-of-me-poster.jpg', cat: '80s' },
    { titulo: 'Speed Demon', data: 'Nov 1988', yt: 'l039y9FaIjc', poster: 'v-speed-demon-poster.jpg', cat: '80s' },
    { titulo: 'Come Together', data: 'Nov 1988', yt: 'ubR9cXWkXv8', poster: 'v-come-together-poster.jpg', cat: '80s' },
    { titulo: 'Leave Me Alone', data: 'Nov 1988', yt: 'crbFmpezO4A', poster: 'v-leave-me-alone-poster.jpg', cat: '80s' },
    { titulo: 'Liberian Girl', data: 'Nov 1989', yt: 'f3V-7DEAgdc', poster: 'v-liberian-girl-poster.jpg', cat: '80s' },
    { titulo: 'Black Or White', data: 'Nov 1991', yt: 'pTFE8cirkdQ', poster: 'v-black-or-white-poster.jpg', cat: '90s' },
    { titulo: 'Remember The Time', data: 'Nov 1992', yt: 'LeiFF0gvqcc', poster: 'v-remember-the-time-poster.jpg', cat: '90s' },
    { titulo: 'In The Closet', data: 'Nov 1992', yt: '4qLY0vbrT8Q', poster: 'v-in-the-closet-poster.jpg', cat: '90s' },
    { titulo: 'Jam', data: 'Nov 1992', yt: 'JbHI1yI1Ndk', poster: 'v-jam-poster.jpg', cat: '90s' },
    { titulo: 'Heal the World', data: 'Nov 1992', yt: 'BWf-eARnf6U', poster: 'v-heal-the-world-poster.jpg', cat: '90s' },
    { titulo: 'Give In To Me', data: 'Nov 1993', yt: 'LJ7qXHjxj_0', poster: 'v-give-in-to-me-poster.jpg', cat: '90s' },
    { titulo: 'Who Is It', data: 'Nov 1993', yt: 'PfrV_6yWbEg', poster: 'v-who-is-it-poster.jpg', cat: '90s' },
    { titulo: 'Will You Be There', data: 'Nov 1993', yt: 'jQY_QL_wvQU', poster: 'v-will-you-be-there-poster.jpg', cat: '90s' },
    { titulo: 'Gone Too Soon', data: 'Nov 1993', yt: 'IcNamirwTaY', poster: 'v-gone-too-soon-poster.jpg', cat: '90s' },
    { titulo: 'Scream', data: 'Nov 1995', yt: '0P4A1K4lXDo', poster: 'v-scream-poster.jpg', cat: '90s' },
    { titulo: 'Childhood', data: 'Nov 1995', yt: 'puQEcN_iI9o', poster: 'v-childhood-poster.jpg', cat: '90s' },
    { titulo: 'You Are Not Alone', data: 'Nov 1995', yt: 'pAyKJAtDNCw', poster: 'v-you-are-not-alone-poster.jpg', cat: '90s' },
    { titulo: 'Earth Song', data: 'Nov 1995', yt: 'XAi3VTSdTxU', poster: 'v-earth-song-poster.jpg', cat: '90s' },
    { titulo: 'They Don’t Care About Us (versão brasileira)', data: 'Mar 1996', yt: 'QNJL6nfu__Q', poster: 'v-dont-care-about-us-poster.jpg', cat: '90s' },
    { titulo: 'Stranger in Moscow', data: 'Nov 1996', yt: 'pEEMi2j6lYE', poster: 'v-stranger-in-moscow-poster.jpg', cat: '90s' },
    { titulo: 'Blood On The Dance Floor', data: 'Nov 1997', yt: 'c3_NntYhzV4', poster: 'v-blood-on-the-dancefloor-poster.jpg', cat: '90s' },
    { titulo: 'Ghosts', data: 'Nov 1997', yt: 'Xh9Cp4rd7mI', poster: 'v-ghosts-poster.jpg', cat: '90s' },
    { titulo: 'You Rock My World', data: 'Nov 2001', yt: '1-7ABIM2qjU', poster: 'v-rock-my-world-poster.jpg', cat: '00s' },
    { titulo: 'Cry', data: 'Nov 2001', yt: 'mj3MfUR35CM', poster: 'v-cry-poster.jpg', cat: '00s' }
  ],

  /* ---------------------------------------------------------------
     3. CRONOLOGIA — os momentos que explicam a pessoa
     --------------------------------------------------------------- */
  cronologia: [
    { ano: '1958', titulo: 'Nasce em Gary, Indiana', texto: 'A 29 de agosto, no auge da indústria siderúrgica do Midwest. É o oitavo de dez filhos de Katherine e Joseph Jackson.' },
    { ano: '1964', titulo: 'Nasce o Jackson 5', texto: 'Formados por Jackie, Tito, Jermaine, Marlon e Michael. A Motown transforma cinco irmãos de Gary num fenómeno nacional.' },
    { ano: '1972', titulo: 'Primeiro êxito a solo', texto: '"Got to Be There", com 13 anos, abre a porta à carreira individual dentro do catálogo da Motown.' },
    { ano: '1979', titulo: 'Off the Wall', texto: 'Primeiro álbum na Epic, depois de deixar a Motown em 1975. Com Quincy Jones descobre o seu próprio som: funky, elegante, preciso.' },
    { ano: '1982', titulo: 'Thriller', texto: 'O álbum mais vendido de sempre, com Eddie Van Halen em "Beat It" e Paul McCartney em "The Girl Is Mine".' },
    { ano: '1983', titulo: 'O moonwalk no Motown 25', texto: 'A 16 de março, nos 25 anos da Motown, o passo que viria a ser marca registada entra em direto para o público.' },
    { ano: '1984', titulo: 'Oito Grammys numa noite', texto: 'A 28 de fevereiro recebe oito Grammy, incluindo o de Álbum do Ano por Thriller — um recorde para um artista na altura.' },
    { ano: '1985', titulo: '"We Are the World"', texto: 'Co-escreve com Lionel Richie o tema de USA for Africa; Quincy Jones produz. A vertente humanitária entra no discurso público.' },
    { ano: '1987', titulo: 'Bad e o corpo como instrumento', texto: '"Smooth Criminal" fixa o "leaning"; o álbum dá cinco canções seguidas no primeiro lugar nos EUA.' },
    { ano: '1988', titulo: 'Neverland', texto: 'Compra a propriedade de Santa Bárbara, com parque temático e zoo, pensada para receber crianças e para servir de refúgio.' },
    { ano: '1991', titulo: 'Dangerous e a Sony', texto: 'Em março anuncia um novo contrato com a Sony, um dos mais valiosos da época. O álbum chega em novembro, com "Black or White" como primeiro tema divulgado.' },
    { ano: '1992', titulo: 'Heal the World Foundation', texto: 'A canção dá nome a uma fundação dedicada a causas infantis, que apoia projetos nos EUA e no estrangeiro.' },
    { ano: '1993', titulo: 'Super Bowl XXVII', texto: 'A 31 de janeiro, o intervalo do jogo é visto por cerca de 133 milhões de pessoas nos EUA e torna-se um marco da televisão.' },
    { ano: '1996', titulo: 'Rio de Janeiro', texto: 'A digressão chega ao Brasil. Grava no Rio e em Salvador a versão brasileira de "They Don’t Care About Us", com pessoas das comunidades locais.' },
    { ano: '1997', titulo: 'HIStory e a digressão mundial', texto: 'A HIStory World Tour soma 82 concertos em 35 países. "Blood on the Dance Floor" transforma o som em espetáculo de arena.' },
    { ano: '2001', titulo: 'Invincible e os 30 anos', texto: 'Último álbum de material original em vida, seguido do concerto de aniversário no Madison Square Garden.' },
    { ano: '2003', titulo: 'O processo', texto: 'É acusado de abuso de menores e o processo judicial passa a dominar a imprensa mundial, ofuscando a música.' },
    { ano: '2005', titulo: 'Absolvição', texto: 'A 13 de junho é absolvido de todas as acusações em Santa Maria, na Califórnia.' },
    { ano: '2009', titulo: 'Junho de 2009', texto: 'Morre a 25 de junho, aos 50 anos. Em outubro chega aos cinemas o filme dos ensaios, "This Is It".' },
    { ano: '2014', titulo: 'Xscape', texto: 'O catálogo tratado como arquivo reeditável, com instrumentação nova sobre a voz original.' },
    { ano: '2022', titulo: '40 anos de Thriller', texto: '"Beat It" e "Thriller" são convertidos para 4K. Na Broadway, estreia MJ The Musical.' },
    { ano: '2026', titulo: 'O biopic', texto: 'Estreia o filme biográfico. A vida de Michael Jackson continua a ser recontada.' }
  ],

  /* ---------------------------------------------------------------
     4. GUIÃO DO TRABALHO — todas as perguntas e onde são respondidas
     --------------------------------------------------------------- */
  guiao: [
    { bloco: 'A Pessoa', pergunta: 'Quem foi Michael Jackson?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-quem' },
    { bloco: 'A Pessoa', pergunta: 'Onde nasceu e quando?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-nascimento' },
    { bloco: 'A Pessoa', pergunta: 'O que ele fazia? A sua área?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-area' },
    { bloco: 'A Pessoa', pergunta: 'Porque é conhecido?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-conhecido' },
    { bloco: 'A Pessoa', pergunta: 'Quais foram os principais momentos da sua vida?', resposta: 'A — Cronologia', href: 'biografia.html#q-momentos' },
    { bloco: 'A Pessoa', pergunta: 'Quais são as suas características?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-caracteristicas' },
    { bloco: 'A Pessoa', pergunta: 'Que valores defende?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-valores' },
    { bloco: 'A Pessoa', pergunta: 'Que dificuldades e desafios enfrentou?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-dificuldades' },
    { bloco: 'A Pessoa', pergunta: 'Que acontecimentos contribuíram para a pessoa que se tornou?', resposta: 'A — Identidade e percurso', href: 'biografia.html#q-acontecimentos' },
    { bloco: 'A Pessoa', pergunta: 'Que decisões tiveram maior impacto na sua vida?', resposta: 'A — Decisões', href: 'biografia.html#q-decisoes' },
    { bloco: 'A Cultura', pergunta: 'Em que contexto cultural cresceu?', resposta: 'B — Contexto', href: 'cultura.html#q-contexto' },
    { bloco: 'A Cultura', pergunta: 'Como é que a cultura influenciou a sua vida?', resposta: 'B — Contexto', href: 'cultura.html#q-influencia-cultura' },
    { bloco: 'A Cultura', pergunta: 'De que forma contribuiu para a cultura?', resposta: 'B — Contribuição', href: 'cultura.html#q-contribuicao' },
    { bloco: 'A Cultura', pergunta: 'A sua obra representa alguma cultura, tradição ou forma de pensar?', resposta: 'B — Contribuição', href: 'cultura.html#q-obra-cultura' },
    { bloco: 'A Cultura', pergunta: 'Teve influência na forma como outras pessoas veem determinado tema?', resposta: 'B — Contribuição', href: 'cultura.html#q-temas' },
    { bloco: 'A Comunidade', pergunta: 'Que impacto teve na sociedade?', resposta: 'C — Impacto', href: 'comunidade.html#q-impacto-sociedade' },
    { bloco: 'A Comunidade', pergunta: 'Participou em causas sociais?', resposta: 'C — Impacto', href: 'comunidade.html#q-causas' },
    { bloco: 'A Comunidade', pergunta: 'Ajudou ou inspirou outras pessoas?', resposta: 'C — Impacto', href: 'comunidade.html#q-inspirou' },
    { bloco: 'A Comunidade', pergunta: 'Teve influência numa comunidade específica?', resposta: 'C — Comunidade', href: 'comunidade.html#q-comunidade-especifica' },
    { bloco: 'A Comunidade', pergunta: 'Contribui para comportamentos, ideias ou mentalidades?', resposta: 'C — Comunidade', href: 'comunidade.html#q-comportamentos' },
    { bloco: 'Os 3 conceitos', pergunta: 'Pessoa, Cultura e Comunidade: como se relacionam?', resposta: 'D — O modelo relacional', href: 'comunidade.html#q-tres-conceitos' },
    { bloco: 'Os 3 conceitos', pergunta: 'Como a pessoa é influenciada pela cultura e pode influenciar a comunidade?', resposta: 'D — O modelo relacional', href: 'comunidade.html#q-influencia-influencia' },
    { bloco: 'O método', pergunta: 'Não basta apresentar a biografia: como é que o trabalho estabelece relações?', resposta: 'Introdução + caixas «Ligação»', href: 'index.html#metodo' },
    { bloco: 'O Impacto', pergunta: 'Qual foi o impacto desta personalidade?', resposta: 'E — Legado', href: 'legado.html#q-impacto' },
    { bloco: 'O Impacto', pergunta: 'O que deixou para as próximas gerações?', resposta: 'E — Legado', href: 'legado.html#q-geracoes' },
    { bloco: 'O Impacto', pergunta: 'Continua a influenciar pessoas atualmente?', resposta: 'E — Legado', href: 'legado.html#q-atualmente' },
    { bloco: 'O Impacto', pergunta: 'Porque merece ser estudada?', resposta: 'E — Legado', href: 'legado.html#q-estudar' },
    { bloco: 'Conclusão', pergunta: 'Porque escolhemos esta personalidade?', resposta: 'F — Conclusão', href: 'conclusao.html#q-porque-escolhemos' },
    { bloco: 'Conclusão', pergunta: 'O que aprendemos com ele?', resposta: 'F — Conclusão', href: 'conclusao.html#q-aprendizado' },
    { bloco: 'Conclusão', pergunta: 'Opinião de cada elemento do grupo', resposta: 'F — Conclusão', href: 'conclusao.html#q-opiniao' },
    { bloco: 'Conclusão', pergunta: 'A linha contínua: porque é que tudo isto se liga?', resposta: 'F — Conclusão', href: 'conclusao.html#q-linha-continua' }
  ]
};

window.DADOS = DADOS;
