/**
 * AFLOR — main.js
 * Interações gerais: menu, cabeçalho, animações suaves, WhatsApp flutuante,
 * links do ecossistema (Jardim Ciranda), documentos de transparência,
 * aviso de privacidade (LGPD) e mapas sob demanda.
 * Baseado no main.js do Jardim Ciranda. Sem dependências. Sem innerHTML.
 */
(function () {
  'use strict';

  var CFG = window.AFLOR_CONFIG || {};
  var doc = document;
  var root = doc.documentElement;
  root.classList.add('js');

  /* ---------- Defesa contra clickjacking ----------
     GitHub Pages não permite o cabeçalho X-Frame-Options e "frame-ancestors" é ignorado em <meta> CSP.
     Se a página for embutida em um iframe de outro site, saímos dele. */
  if (window.top !== window.self) {
    try { window.top.location.replace(window.self.location.href); } catch (e) { doc.body.hidden = true; }
  }

  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Aceita apenas URLs https absolutas (evita javascript:, data:, etc. vindos da configuração). */
  function safeHttpsUrl(value) {
    try {
      var u = new URL(String(value || ''));
      return u.protocol === 'https:' ? u.href : '';
    } catch (e) { return ''; }
  }

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Links para o Jardim Waldorf Ciranda (constante única em config.js) ---------- */
  var jardimUrl = safeHttpsUrl(CFG.jardimUrl);
  if (jardimUrl) {
    $$('[data-jardim-link]').forEach(function (a) { a.href = jardimUrl; });
  }

  /* ---------- Campanha Dia de Doar (temporária; data em config.js → diaDeDoar.encerraEm) ----------
     Tudo que tem [data-dia-de-doar] nasce oculto no HTML e só aparece ANTES da data de encerramento.
     Depois dela, os elementos são removidos do DOM e [data-dia-de-doar-encerrado] é exibido.
     Teste do estado encerrado: acrescente ?simular=encerrado à URL. */
  var ddd = CFG.diaDeDoar || {};
  var dddEnd = Date.parse(ddd.encerraEm || '');
  var dddActive = isFinite(dddEnd) && Date.now() < dddEnd &&
    !/[?&]simular=encerrado(&|$)/.test(window.location.search);

  $$('[data-dia-de-doar]').forEach(function (el) {
    if (dddActive) el.hidden = false;
    else el.remove();
  });
  $$('[data-dia-de-doar-encerrado]').forEach(function (el) {
    if (dddActive) el.remove();
    else el.hidden = false;
  });

  if (dddActive) {
    // QR Code PIX: só imagens locais (img-src 'self' na CSP)
    var qrSrc = String(ddd.pixQr || '');
    if (/^assets\/img\/[\w.-]+\.(png|webp|jpe?g|svg)$/i.test(qrSrc)) {
      $$('[data-pix-qr]').forEach(function (qrBox) {
        var qrImg = doc.createElement('img');
        qrImg.src = qrSrc;
        qrImg.width = 260;
        qrImg.height = 260;
        qrImg.alt = 'QR Code PIX para doar à AFLOR';
        qrImg.decoding = 'async';
        qrBox.textContent = '';
        qrBox.appendChild(qrImg);
        qrBox.classList.add('is-ready');
      });
    }

    // Chave PIX em texto + botão copiar
    var pixKey = String(ddd.pixChave || '').trim().slice(0, 120);
    if (pixKey) {
      $$('[data-pix-chave]').forEach(function (keyBox) {
        var keyValue = $('[data-pix-chave-valor]', keyBox);
        if (keyValue) keyValue.textContent = pixKey;
        keyBox.hidden = false;
        var copyBtn = $('[data-pix-copiar]', keyBox);
        if (copyBtn && navigator.clipboard) {
          copyBtn.addEventListener('click', function () {
            navigator.clipboard.writeText(pixKey).then(function () {
              copyBtn.textContent = 'Chave copiada ✓';
              window.setTimeout(function () { copyBtn.textContent = 'Copiar chave'; }, 2500);
            });
          });
        } else if (copyBtn) {
          copyBtn.hidden = true;
        }
      });
    }

    if (ddd.pixFavorecido) {
      $$('[data-pix-favorecido]').forEach(function (el) { el.textContent = String(ddd.pixFavorecido).slice(0, 140); });
    }

    // Popup de reforço do PIX ao entrar em dia-de-doar.html
    var dddModal = $('[data-ddd-modal]');
    if (dddModal) {
      var closeBtn = $('.ddd-modal__close', dddModal);
      var closeModal = function () {
        if (dddModal.hidden) return;
        dddModal.hidden = true;
        doc.body.classList.remove('has-modal-open');
        if (banner && !readConsent()) window.setTimeout(showBanner, 400);
      };

      doc.body.classList.add('has-modal-open');
      if (closeBtn) {
        window.setTimeout(function () { closeBtn.focus(); }, 60);
      }

      $$('[data-ddd-modal-close]', dddModal).forEach(function (el) {
        el.addEventListener('click', closeModal);
      });

      doc.addEventListener('keydown', function (e) {
        if (dddModal.hidden) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
          return;
        }
        if (e.key === 'Tab') {
          var focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', dddModal)
            .filter(function (el) { return !el.hidden && el.offsetParent !== null; });
          if (!focusables.length) return;
          var first = focusables[0];
          var last = focusables[focusables.length - 1];
          if (e.shiftKey && doc.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && doc.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }
  }

  /* ---------- Links de WhatsApp com mensagem padrão ---------- */
  function buildWaUrl(message) {
    var number = String(CFG.whatsappNumber || '').replace(/\D/g, '');
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message || '');
  }
  window.AFLOR_buildWaUrl = buildWaUrl; // reutilizado por form.js

  var waMessages = CFG.whatsappMessages || {};
  $$('[data-wa-link]').forEach(function (a) {
    var key = a.getAttribute('data-wa-link');
    var msg = key && Object.prototype.hasOwnProperty.call(waMessages, key) ? waMessages[key] : CFG.whatsappDefaultMessage;
    a.href = buildWaUrl(msg);
  });

  /* ---------- Documentos de transparência ---------- */
  var docs = CFG.docs || {};
  $$('[data-doc]').forEach(function (a) {
    var url = safeHttpsUrl(docs[a.getAttribute('data-doc')]);
    if (url) {
      a.href = url;
      a.removeAttribute('aria-disabled');
      a.classList.remove('is-pending');
      var ready = a.getAttribute('data-label-ready');
      var label = a.querySelector('[data-label]');
      if (ready && label) label.textContent = ready;
    } else if (a.getAttribute('aria-disabled') === 'true') {
      a.removeAttribute('href');
      a.addEventListener('click', function (e) { e.preventDefault(); });
    }
  });

  /* ---------- Garante rel seguro em TODOS os links externos ---------- */
  $$('a[href^="http"]').forEach(function (a) {
    if (a.host !== window.location.host) {
      a.rel = 'noopener noreferrer';
      if (!a.target) a.target = '_blank';
    }
  });

  /* ---------- Menu mobile ---------- */
  var toggle = $('.nav-toggle');
  var nav = $('#menu-principal');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Cabeçalho + WhatsApp flutuante conforme rolagem ---------- */
  var header = $('.site-header');
  var waFloat = $('.wa-float');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 48);
    if (waFloat) waFloat.classList.toggle('is-visible', y > 420);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Destaque do item de menu ativo ---------- */
  if ('IntersectionObserver' in window) {
    var links = $$('.nav__list a[href^="#"]');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Animações de entrada (suaves, respeitam reduced-motion) ---------- */
  var reveals = $$('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Atalhos "Quero participar" → pré-seleciona o formulário ---------- */
  $$('[data-motivo]').forEach(function (el) {
    el.addEventListener('click', function () {
      doc.dispatchEvent(new CustomEvent('aflor:preselect', {
        detail: {
          motivo: el.getAttribute('data-motivo'),
          categoria: el.getAttribute('data-categoria') || '',
          doacao: el.getAttribute('data-doacao') || '',
        },
      }));
    });
  });

  /* =====================================================================
     PRIVACIDADE (LGPD)
     - Nenhum cookie é criado por este site.
     - A escolha do visitante fica no localStorage (apenas no próprio navegador).
     - "externos" libera o carregamento dos mapas (OpenStreetMap).
     ===================================================================== */
  var CONSENT_KEY = 'aflor-privacidade';
  var banner = $('#aviso-privacidade');

  function readConsent() {
    try {
      var raw = window.localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.v !== CFG.consentVersion) return null;
      return data.choice === 'externos' || data.choice === 'essencial' ? data.choice : null;
    } catch (e) { return null; }
  }

  function saveConsent(choice) {
    try {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ v: CFG.consentVersion, choice: choice, at: new Date().toISOString() }));
    } catch (e) { /* modo privado: segue sem persistir */ }
  }

  function updateBannerOffset() {
    if (!banner) return;
    var visible = !banner.hidden;
    doc.body.classList.toggle('has-consent-banner', visible && window.innerWidth < 700);
    if (visible) root.style.setProperty('--banner-h', (banner.offsetHeight + 16) + 'px');
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
    updateBannerOffset();
  }
  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
    updateBannerOffset();
  }

  if (banner) {
    if (!readConsent() && !doc.body.classList.contains('has-modal-open')) window.setTimeout(showBanner, 900);
    $$('[data-consent]', banner).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var choice = btn.getAttribute('data-consent') === 'externos' ? 'externos' : 'essencial';
        saveConsent(choice);
        hideBanner();
        if (choice === 'externos') maybeAutoLoadMaps();
      });
    });
    window.addEventListener('resize', updateBannerOffset, { passive: true });
  }
  $$('[data-open-consent]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showBanner();
      var first = banner && banner.querySelector('button');
      if (first) first.focus();
    });
  });

  /* =====================================================================
     MAPAS SOB DEMANDA (facade / click-to-load)
     Cada [data-map-box="chave"] usa CFG.maps[chave]. O iframe só é criado após
     clique, ou automaticamente (com lazy-loading) se o visitante permitiu externos.
     ===================================================================== */
  var mapBoxes = $$('[data-map-box]');

  function loadMap(box) {
    if (!box || box.getAttribute('data-loaded') === 'true') return;
    var m = (CFG.maps || {})[box.getAttribute('data-map-box')];
    if (!m || typeof m.lat !== 'number' || typeof m.lng !== 'number') return;
    box.setAttribute('data-loaded', 'true');
    var src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + encodeURIComponent(m.bbox) +
      '&layer=mapnik&marker=' + encodeURIComponent(m.lat + ',' + m.lng);
    var iframe = doc.createElement('iframe');
    iframe.src = src;
    iframe.title = String(m.title || 'Mapa');
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
    box.textContent = '';
    box.appendChild(iframe);
  }

  function maybeAutoLoadMaps() {
    if (!mapBoxes.length || readConsent() !== 'externos') return;
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { loadMap(entry.target); mo.unobserve(entry.target); }
        });
      }, { rootMargin: '300px' });
      mapBoxes.forEach(function (b) { mo.observe(b); });
    } else {
      mapBoxes.forEach(loadMap);
    }
  }

  $$('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Clique explícito = consentimento para este conteúdo
      loadMap($('[data-map-box="' + btn.getAttribute('data-map-load').replace(/[^a-z0-9-]/gi, '') + '"]'));
    });
  });
  maybeAutoLoadMaps();
})();
