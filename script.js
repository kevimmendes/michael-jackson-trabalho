/* =====================================================================
   MICHAEL JACKSON — TRABALHO DE GRUPO
   Pessoa · Cultura · Comunidade
   ---------------------------------------------------------------------
   Comportamento da página: cabeçalho, menu, animações, renderização
   do catálogo a partir de dados.js, modal de vídeo, sumário e
   impressão. Sem dependências externas.
   ===================================================================== */

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* Marca que o script arrancou: a salvaguarda no HTML usa isto para saber
     se deve revelar o conteúdo em vez de esperar pelas animações. */
  document.documentElement.setAttribute('data-js', 'on');

  /* -----------------------------------------------------------------
     1. CABEÇALHO: estado fixo + barra de progresso de leitura
     ----------------------------------------------------------------- */
  const header = $('.header');
  const progress = $('.progress');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
    spy();
  }

  /* -----------------------------------------------------------------
     2. MENU MOBILE
     ----------------------------------------------------------------- */
  const toggle = $('.nav__toggle');
  const panel  = $('.nav__panel');

  function closeMenu() {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    header.classList.remove('is-menu-open');
    document.body.classList.remove('is-locked');
  }

  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
      header.classList.toggle('is-menu-open', !open);
      document.body.classList.toggle('is-locked', !open);
    });
    $$('a', panel).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* -----------------------------------------------------------------
     3. ANIMAÇÕES DE ENTRADA
     ----------------------------------------------------------------- */
  /* Os cartões da discografia, videoclipes e cronologia só existem depois
     de serem renderizados, por isso a função é chamada outra vez depois de
     cada renderização. Sem isso ficariam invisíveis (opacity: 0). */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })
    : null;

  function observarReveals() {
    $$('.reveal:not(.is-visible)').forEach(el => {
      if (el.dataset.revealObservado) return;
      if (!io) { el.classList.add('is-visible'); return; }
      el.dataset.revealObservado = '1';
      io.observe(el);
    });
  }

  observarReveals();

  /* -----------------------------------------------------------------
     4. SUMÁRIO LATERAL — marca o item ativo
     ----------------------------------------------------------------- */
  const tocLinks = $$('.toc__list a');
  const spyTargets = tocLinks
    .map(a => {
      const id = a.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function spy() {
    if (!spyTargets.length) return;
    let current = null;
    const offset = 140;
    spyTargets.forEach(el => {
      if (el.getBoundingClientRect().top - offset <= 0) current = el.id;
    });
    tocLinks.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }

  /* -----------------------------------------------------------------
     5. ACORDEÃO
     ----------------------------------------------------------------- */
  $$('.accordion__trigger').forEach(trigger => {
    const panelEl = trigger.nextElementSibling;
    if (!panelEl) return;
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      if (open) {
        panelEl.style.height = panelEl.scrollHeight + 'px';
        requestAnimationFrame(() => {
          panelEl.style.height = '0px';
          trigger.setAttribute('aria-expanded', 'false');
        });
      } else {
        panelEl.style.height = panelEl.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
        panelEl.addEventListener('transitionend', function done(e) {
          if (e.propertyName !== 'height') return;
          panelEl.removeEventListener('transitionend', done);
          if (trigger.getAttribute('aria-expanded') === 'true') panelEl.style.height = 'auto';
        });
      }
    });
  });

  /* -----------------------------------------------------------------
     6. RENDERIZAÇÃO: DISCOGRAFIA
     ----------------------------------------------------------------- */
  function albumCard(a) {
    return (
      '<a class="card album-card reveal" href="album.html?id=' + a.id + '" data-cat="' + (a.cat || '') + '">' +
        '<div class="card__media">' +
          '<span class="album-card__year">' + a.ano + '</span>' +
          '<img src="' + a.capa + '" alt="Capa do álbum ' + a.titulo + '" loading="lazy" width="640" height="640">' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="card__meta">' + a.data + '</span>' +
          '<h3 class="card__title">' + a.titulo + '</h3>' +
          '<p class="card__text">' + a.resumo + '</p>' +
        '</div>' +
      '</a>'
    );
  }

  const gridAlbuns = $('[data-albuns]');
  if (gridAlbuns && window.DADOS) {
    const limite = parseInt(gridAlbuns.getAttribute('data-albuns'), 10) || 0;
    const lista = limite ? DADOS.albuns.slice(0, limite) : DADOS.albuns;
    gridAlbuns.innerHTML = lista.map(albumCard).join('');
    observarReveals();
  }

  /* -----------------------------------------------------------------
     7. RENDERIZAÇÃO: VIDEOCLIPES
     ----------------------------------------------------------------- */
  function videoCard(v) {
    return (
      '<article class="card video-card reveal" data-yt="' + v.yt + '" data-titulo="' + v.titulo + '" data-data="' + v.data + '" data-cat="' + (v.cat || '') + '" tabindex="0" role="button" aria-label="Reproduzir ' + v.titulo + '">' +
        '<div class="card__media">' +
          '<img src="assets/posters/' + v.poster + '" alt="Cartaz do videoclipe ' + v.titulo + '" loading="lazy" width="640" height="800">' +
          '<div class="video-card__play"><span>&#9654;</span></div>' +
        '</div>' +
        '<div class="card__body">' +
          '<span class="card__meta">' + v.data + '</span>' +
          '<h3 class="card__title">' + v.titulo + '</h3>' +
        '</div>' +
      '</article>'
    );
  }

  const gridVideos = $('[data-videos]');
  if (gridVideos && window.DADOS) {
    const limite = parseInt(gridVideos.getAttribute('data-videos'), 10) || 0;
    const lista = limite ? DADOS.videos.slice(0, limite) : DADOS.videos;
    gridVideos.innerHTML = lista.map(videoCard).join('');
    observarReveals();
  }

  /* -----------------------------------------------------------------
     8. MODAL DE VÍDEO (YouTube)
     ----------------------------------------------------------------- */
  const modal = $('#modal-video');
  const modalFrame = $('#modal-video-frame');
  const modalTitle = $('#modal-video-title');
  const modalDate = $('#modal-video-date');

  function abrirVideo(yt, titulo, data) {
    if (!modal) return;
    if (modalFrame) {
      modalFrame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + yt +
        '?autoplay=1&rel=0&modestbranding=1" title="' + titulo +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    }
    if (modalTitle) modalTitle.textContent = titulo;
    if (modalDate) modalDate.textContent = data || '';
    modal.classList.add('is-open');
    document.body.classList.add('is-locked');
    modal.setAttribute('aria-hidden', 'false');
    document.dispatchEvent(new Event('player:stop'));
  }

  function fecharVideo() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    modal.setAttribute('aria-hidden', 'true');
    if (modalFrame) modalFrame.innerHTML = '';
  }

  document.addEventListener('click', e => {
    const card = e.target.closest('[data-yt]');
    if (card) {
      abrirVideo(card.getAttribute('data-yt'), card.getAttribute('data-titulo'), card.getAttribute('data-data'));
    }
    if (e.target.closest('[data-close-modal]')) fecharVideo();
    if (e.target === modal) fecharVideo();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) fecharVideo();
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest && e.target.closest('[data-yt]');
    if (card) {
      e.preventDefault();
      abrirVideo(card.getAttribute('data-yt'), card.getAttribute('data-titulo'), card.getAttribute('data-data'));
    }
  });

  /* -----------------------------------------------------------------
     9. RENDERIZAÇÃO: CRONOLOGIA
     ----------------------------------------------------------------- */
  const elCronologia = $('[data-cronologia]');
  if (elCronologia && window.DADOS) {
    elCronologia.innerHTML = DADOS.cronologia.map(c =>
      '<div class="timeline__item reveal">' +
        '<div class="timeline__year">' + c.ano + '</div>' +
        '<h3 class="timeline__title">' + c.titulo + '</h3>' +
        '<p class="timeline__text">' + c.texto + '</p>' +
      '</div>'
    ).join('');
    observarReveals();
  }

  /* -----------------------------------------------------------------
     10. RENDERIZAÇÃO: GUIÃO DO TRABALHO
     ----------------------------------------------------------------- */
  const elGuiao = $('[data-guiao]');
  if (elGuiao && window.DADOS) {
    let atual = '';
    elGuiao.innerHTML = DADOS.guiao.map(g => {
      const head = g.bloco !== atual
        ? '<div class="guiao__head"><span class="guiao__bloco">' + g.bloco + '</span></div>'
        : '';
      atual = g.bloco;
      return head +
        '<div class="guiao__row">' +
          '<span class="guiao__bloco">' + g.bloco + '</span>' +
          '<span class="guiao__pergunta">' + g.pergunta + '</span>' +
          '<span class="guiao__resposta"><a href="' + g.href + '">' + g.resposta + ' &rarr;</a></span>' +
        '</div>';
    }).join('');
    observarReveals();
  }

  /* -----------------------------------------------------------------
     11. PÁGINA DE ÁLBUM (album.html?id=...)
     ----------------------------------------------------------------- */
  const albumId = new URLSearchParams(window.location.search).get('id');
  const albumBox = $('[data-album]');
  if (albumBox && window.DADOS) {
    const album = DADOS.albuns.find(a => a.id === albumId) || DADOS.albuns[0];
    document.title = album.titulo + ' — Michael Jackson | Trabalho de Grupo';

    const idx = DADOS.albuns.indexOf(album);
    const anterior = DADOS.albuns[(idx - 1 + DADOS.albuns.length) % DADOS.albuns.length];
    const seguinte = DADOS.albuns[(idx + 1) % DADOS.albuns.length];

    albumBox.innerHTML =
      '<div class="grid grid--2" style="align-items:start">' +
        '<div>' +
          '<img src="' + album.capa + '" alt="Capa do álbum ' + album.titulo + '" style="width:100%;border-radius:10px">' +
        '</div>' +
        '<div>' +
          '<span class="eyebrow">' + album.data + '</span>' +
          '<h1 class="h1" style="font-size:clamp(2.6rem,7vw,5.5rem);margin-bottom:1rem">' + album.titulo + '</h1>' +
          '<p class="lead" style="margin-bottom:1.8rem">' + album.resumo + '</p>' +
          '<div class="specs" style="margin-bottom:1.8rem">' +
            '<div class="specs__cell"><div class="specs__k">Lançamento</div><div class="specs__v">' + album.data + '</div></div>' +
            '<div class="specs__cell"><div class="specs__k">Faixas</div><div class="specs__v">' + album.tracks.length + '</div></div>' +
            '<div class="specs__cell"><div class="specs__k">Peso na obra</div><div class="specs__v">Capítulo da análise</div></div>' +
          '</div>' +
          '<a class="btn btn--solid" href="index.html#disco"><span>Voltar à discografia</span><span class="btn__arrow">&rarr;</span></a>' +
        '</div>' +
      '</div>' +
      '<h2 class="h3" style="margin:clamp(2.5rem,5vw,4rem) 0 1.5rem">Track List</h2>' +
      '<ol class="tracklist">' +
        album.tracks.map((t, i) =>
          '<li class="tracklist__row">' +
            '<span class="tracklist__num">' + String(i + 1).padStart(2, '0') + '</span>' +
            '<span class="tracklist__name">' + t + '</span>' +
            '<span class="tracklist__dur">' + album.ano + '</span>' +
          '</li>'
        ).join('') +
      '</ol>' +
      '<div class="grid grid--2" style="margin-top:clamp(2.5rem,5vw,4rem)">' +
        '<a class="card" href="album.html?id=' + anterior.id + '">' +
          '<div class="card__body"><span class="card__meta">&larr; Álbum anterior</span><h3 class="card__title">' + anterior.titulo + '</h3></div>' +
        '</a>' +
        '<a class="card" href="album.html?id=' + seguinte.id + '">' +
          '<div class="card__body"><span class="card__meta">Próximo álbum &rarr;</span><h3 class="card__title">' + seguinte.titulo + '</h3></div>' +
        '</a>' +
      '</div>';
    observarReveals();
  }

  /* -----------------------------------------------------------------
     12. FILTRO DE ÁLBUNS E VÍDEOS
     ----------------------------------------------------------------- */
  const filtro = $('[data-filtro]');
  if (filtro) {
    const alvo = document.querySelector(filtro.getAttribute('data-filtro'));
    const botoes = $$('[data-filtro-btn]');
    botoes.forEach(btn => {
      btn.addEventListener('click', () => {
        botoes.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const valor = btn.getAttribute('data-filtro-btn');
        if (!alvo) return;
        $$('[data-cat]', alvo).forEach(item => {
          item.style.display = (valor === 'todos' || item.getAttribute('data-cat') === valor) ? '' : 'none';
        });
      });
    });
  }

  /* -----------------------------------------------------------------
     13. NEWSLETTER (demonstração, sem servidor)
     ----------------------------------------------------------------- */
  $$('.newsletter__form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nota = form.parentElement.querySelector('.newsletter__note');
      const input = form.querySelector('input');
      if (nota) nota.textContent = 'Obrigado! Esta é uma demonstração — a entrega é local e não envia dados.';
      if (input) input.value = '';
    });
  });

  /* -----------------------------------------------------------------
     14. LEITOR DE PRÉVIAS (30 s, Apple Music / iTunes)
     ----------------------------------------------------------------- */
  const playerEl = $('[data-player]');
  if (playerEl) {
    const FAIXAS = [
      { titulo: 'Billie Jean', album: 'Thriller', ano: '1982', capa: 'assets/albuns/album-cover_thriller-640x640.jpg' },
      { titulo: 'Beat It', album: 'Thriller', ano: '1982', capa: 'assets/albuns/album-cover_thriller-640x640.jpg' },
      { titulo: 'Smooth Criminal', album: 'Bad', ano: '1987', capa: 'assets/albuns/album-bad-640x640.png' },
      { titulo: 'Black or White', album: 'Dangerous', ano: '1991', capa: 'assets/albuns/album-cover_dangerous-640x640.jpg' },
      { titulo: 'Earth Song', album: 'HIStory', ano: '1995', capa: 'assets/albuns/album-cover_history-640x640.jpg' },
      { titulo: 'Don’t Stop ’Til You Get Enough', album: 'Off the Wall', ano: '1979', capa: 'assets/albuns/album-cover_offthewall-640x640.jpg' }
    ];

    const audio = new Audio();
    audio.preload = 'none';

    const elCapa = $('[data-player-cover]', playerEl);
    const elTitulo = $('[data-player-title]', playerEl);
    const elMeta = $('[data-player-meta]', playerEl);
    const elBar = $('[data-player-bar]', playerEl);
    const elFill = $('[data-player-fill]', playerEl);
    const elAtual = $('[data-player-current]', playerEl);
    const elNota = $('[data-player-note]', playerEl);
    const elLista = $('[data-player-list]', playerEl);
    const btnPlay = $('[data-player-play]', playerEl);
    const btnPrev = $('[data-player-prev]', playerEl);
    const btnNext = $('[data-player-next]', playerEl);

    const cache = new Map();
    let atual = 0;
    let pedido = 0;

    function relogio(seg) {
      const s = Math.max(0, Math.floor(seg || 0));
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }

    function pintar() {
      const f = FAIXAS[atual];
      elTitulo.textContent = f.titulo;
      elMeta.textContent = f.album + ' · ' + f.ano;
      elCapa.src = f.capa;
      elCapa.alt = 'Capa de ' + f.album;
      elAtual.textContent = relogio(audio.currentTime);
      elFill.style.width = (audio.duration ? (audio.currentTime / audio.duration) * 100 : 0) + '%';
      elBar.setAttribute('aria-valuenow', String(Math.round(audio.currentTime)));
      playerEl.classList.toggle('is-playing', !audio.paused);
      btnPlay.setAttribute('aria-label', audio.paused ? 'Reproduzir prévia' : 'Pausar prévia');
      $$('.player__track', playerEl).forEach((b, i) => b.classList.toggle('is-active', i === atual));
    }

    function normalizar(texto) {
      return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    }

    /* A API de pesquisa do iTunes permite CORS e devolve prévias de 30 s. */
    function previa(i) {
      if (cache.has(i)) return Promise.resolve(cache.get(i));
      const titulo = FAIXAS[i].titulo;
      const consulta = encodeURIComponent('Michael Jackson ' + titulo);
      const url = 'https://itunes.apple.com/search?term=' + consulta + '&entity=song&limit=10';

      return fetch(url)
        .then(r => (r.ok ? r.json() : Promise.reject(new Error('falha de rede'))))
        .then(dados => {
          const resultados = (dados.results || []).filter(t =>
            t.previewUrl && /michael jackson/i.test(t.artistName || '')
          );
          const alvo = normalizar(titulo);
          const faixa = resultados.find(t => normalizar(t.trackName || '') === alvo) || resultados[0];
          if (!faixa) throw new Error('sem prévia');
          cache.set(i, faixa.previewUrl);
          return faixa.previewUrl;
        });
    }

    function parar() {
      pedido++;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      elNota.textContent = 'Prévia de 30 segundos · Apple Music';
      pintar();
    }

    function tocar(i) {
      atual = (i + FAIXAS.length) % FAIXAS.length;
      const marca = ++pedido;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      elNota.textContent = 'A carregar prévia…';
      pintar();

      previa(atual).then(url => {
        if (marca !== pedido) return;
        audio.src = url;
        return audio.play();
      }).then(() => {
        if (marca !== pedido) return;
        elNota.textContent = 'Prévia de 30 segundos · Apple Music';
        pintar();
      }).catch(() => {
        if (marca !== pedido) return;
        elNota.textContent = 'Prévia indisponível. Tenta outra faixa.';
        pintar();
      });
    }

    elLista.innerHTML = FAIXAS.map((f, i) =>
      '<li>' +
        '<button class="player__track" type="button" data-track="' + i + '" aria-label="Tocar prévia de ' + f.titulo + '">' +
          '<span class="player__num">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span class="player__name">' + f.titulo + '</span>' +
          '<span class="player__year">' + f.ano + '</span>' +
        '</button>' +
      '</li>'
    ).join('');

    elLista.addEventListener('click', e => {
      const b = e.target.closest('[data-track]');
      if (b) tocar(parseInt(b.getAttribute('data-track'), 10));
    });

    btnPlay.addEventListener('click', () => {
      if (!audio.getAttribute('src')) { tocar(atual); return; }
      if (audio.paused) audio.play().catch(() => tocar(atual));
      else audio.pause();
    });

    btnPrev.addEventListener('click', () => tocar(atual - 1));
    btnNext.addEventListener('click', () => tocar(atual + 1));

    elBar.addEventListener('click', e => {
      if (!audio.duration) return;
      const r = elBar.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      audio.currentTime = p * audio.duration;
      pintar();
    });

    elBar.addEventListener('keydown', e => {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + 3); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 3); e.preventDefault(); }
    });

    audio.addEventListener('timeupdate', pintar);
    audio.addEventListener('play', pintar);
    audio.addEventListener('pause', pintar);
    audio.addEventListener('ended', () => tocar(atual + 1));
    audio.addEventListener('error', () => {
      if (!audio.getAttribute('src')) return;
      elNota.textContent = 'Prévia indisponível. Tenta outra faixa.';
      pintar();
    });

    document.addEventListener('player:stop', parar);

    pintar();
  }

  /* -----------------------------------------------------------------
     15. ARRANQUE
     ----------------------------------------------------------------- */
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
