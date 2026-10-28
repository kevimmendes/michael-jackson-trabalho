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
  const revealables = $$('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('is-visible'));
  }

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
          '<img class="album-card__vinyl" src="assets/ui/album-vinyl.png" alt="" aria-hidden="true" loading="lazy">' +
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
     14. ARRANQUE
     ----------------------------------------------------------------- */
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
