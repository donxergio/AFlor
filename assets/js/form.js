/**
 * AFLOR — form.js
 * Formulário unificado "Faça Parte" 100% estático (zero backend):
 *   (a) WhatsApp — monta link wa.me com mensagem sanitizada (canal principal);
 *   (b) E-mail   — envia via fetch() para Web3Forms/Formspree (contato.aflor@gmail.com),
 *                  com fallback mailto: se a API não estiver configurada.
 *
 * Segurança (mesmo padrão do Jardim Ciranda):
 *   - Validação estrita (lista de valores permitidos, regex, limites de tamanho).
 *   - Sanitização de todo texto livre antes de usar em URL ou JSON (encodeURIComponent).
 *   - Nunca usa innerHTML: mensagens são criadas com textContent/createElement.
 *   - Honeypot (botcheck) + tempo mínimo de preenchimento + cooldown entre envios.
 *   - Nenhum dado é salvo no navegador nem enviado a analytics.
 */
(function () {
  'use strict';

  var CFG = window.AFLOR_CONFIG || {};
  var form = document.getElementById('form-faca-parte');
  if (!form) return;

  // Com JS ativo, assumimos a validação (mensagens acessíveis em pt-BR)
  form.noValidate = true;

  var statusBox = document.getElementById('form-status');
  var startedAt = Date.now();
  var COOLDOWN_KEY = 'aflor-ultimo-envio';

  /* Listas de valores permitidos (allow-list) → rótulos legíveis */
  var MOTIVOS = {
    associar: 'Quero me associar',
    voluntariado: 'Voluntariado',
    doacao: 'Doação',
  };
  var CATEGORIAS = {
    a: 'a) Empreendedora — trabalha pelo propósito voluntariamente',
    b: 'b) Essencial — trabalha no propósito',
    c: 'c) Apoiadora — é atendida e apoia o propósito',
    d: 'd) Entusiasta — apoia o propósito com doações',
  };
  var DOACOES = {
    'dia-de-doar': 'Dia de Doar',
    livre: 'Doação Livre',
  };
  var FIELDS = ['nome', 'email', 'telefone', 'motivo', 'categoria', 'doacao', 'consentimento'];
  var NAME_RE = /^[\p{L}\p{M}' .-]{3,80}$/u;
  var EMAIL_RE = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
  var has = function (obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); };

  /* ---------------- Sanitização ---------------- */

  /** Remove caracteres de controle/invisíveis, sinais de tag e espaços excedentes. */
  function sanitize(value, max) {
    return String(value == null ? '' : value)
      .normalize('NFC')
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
      .replace(/[<>]/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, max);
  }

  var onlyDigits = function (v) { return String(v || '').replace(/\D/g, ''); };

  function formatPhone(digits) {
    var d = digits.replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /* ---------------- Campos condicionais ---------------- */

  var conditionals = Array.prototype.slice.call(form.querySelectorAll('[data-show-when]'));
  function updateConditionals() {
    var motivo = form.elements.namedItem('motivo').value;
    conditionals.forEach(function (box) {
      box.hidden = box.getAttribute('data-show-when') !== motivo;
    });
  }

  /* ---------------- Leitura + validação ---------------- */

  function readForm() {
    var fd = new FormData(form);
    var motivo = sanitize(fd.get('motivo'), 20);
    return {
      nome: sanitize(fd.get('nome'), 80),
      email: sanitize(fd.get('email'), 120).toLowerCase(),
      telefone: onlyDigits(fd.get('telefone')).slice(0, 13),
      motivo: motivo,
      categoria: motivo === 'associar' ? sanitize(fd.get('categoria'), 2) : '',
      doacao: motivo === 'doacao' ? sanitize(fd.get('doacao'), 20) : '',
      mensagem: sanitize(fd.get('mensagem'), 600),
      consentimento: fd.get('consentimento') === 'sim',
      botcheck: fd.get('botcheck') !== null,
    };
  }

  function validate(data, canal) {
    var errors = {};
    if (!NAME_RE.test(data.nome)) errors.nome = 'Informe seu nome (mínimo 3 letras, sem números).';
    if (!has(MOTIVOS, data.motivo)) errors.motivo = 'Selecione como você quer participar.';
    if (data.motivo === 'associar' && !has(CATEGORIAS, data.categoria)) errors.categoria = 'Escolha a categoria de associado (a, b, c ou d).';
    if (data.motivo === 'doacao' && !has(DOACOES, data.doacao)) errors.doacao = 'Escolha o tipo de doação.';

    if (data.telefone && !/^(55)?[1-9]{2}9?\d{8}$/.test(data.telefone)) {
      errors.telefone = 'Telefone inválido. Use DDD + número, ex.: (47) 99999-9999.';
    }
    if (canal === 'email') {
      if (!data.email) errors.email = 'Para envio por e-mail, informe seu e-mail.';
      else if (!EMAIL_RE.test(data.email)) errors.email = 'Informe um e-mail válido.';
    } else if (data.email && !EMAIL_RE.test(data.email)) {
      errors.email = 'Informe um e-mail válido (ou deixe em branco).';
    }
    if (!data.consentimento) errors.consentimento = 'É preciso aceitar a Política de Privacidade para continuar.';
    return errors;
  }

  function setFieldError(name, message) {
    var target = document.getElementById('campo-' + name) || form.elements.namedItem(name);
    var slot = document.getElementById(name + '-erro');
    if (target && target.setAttribute) {
      if (message) target.setAttribute('aria-invalid', 'true');
      else target.removeAttribute('aria-invalid');
    }
    if (slot) slot.textContent = message || '';
  }

  function showErrors(errors) {
    FIELDS.forEach(function (n) { setFieldError(n, errors[n]); });
    var first = FIELDS.filter(function (n) { return errors[n]; })[0];
    if (first) {
      var el = form.elements.namedItem(first);
      if (el && typeof el.length === 'number' && !el.focus) el = el[0]; // RadioNodeList
      if (el && el.focus) el.focus();
    }
  }

  /* ---------------- Mensagens de status (sem innerHTML) ---------------- */

  function setStatus(type, text, links) {
    if (!statusBox) return;
    statusBox.textContent = '';
    statusBox.className = 'form-status ' + (type === 'ok' ? 'form-status--ok' : 'form-status--err');
    var p = document.createElement('p');
    p.textContent = text;
    p.style.margin = '0'; // CSSOM (permitido pela CSP), não é atributo inline no HTML
    statusBox.appendChild(p);
    (links || []).forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.href;
      if (!/^mailto:/.test(link.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.textContent = link.label;
      var p2 = document.createElement('p');
      p2.style.margin = '0.5rem 0 0';
      p2.appendChild(a);
      statusBox.appendChild(p2);
    });
    statusBox.hidden = false;
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setBusy(button, busy) {
    if (!button) return;
    button.disabled = busy;
    button.setAttribute('aria-busy', String(busy));
  }

  /* ---------------- Mensagem ---------------- */

  function summaryLines(d) {
    var lines = ['• Nome: ' + d.nome, '• Interesse: ' + MOTIVOS[d.motivo]];
    if (d.categoria) lines.push('• Categoria de associado: ' + CATEGORIAS[d.categoria]);
    if (d.doacao) lines.push('• Tipo de doação: ' + DOACOES[d.doacao]);
    if (d.telefone) lines.push('• WhatsApp: ' + formatPhone(d.telefone));
    if (d.email) lines.push('• E-mail: ' + d.email);
    if (d.mensagem) lines.push('', 'Mensagem: ' + d.mensagem);
    return lines;
  }

  function intro(d) {
    if (d.motivo === 'associar') return 'Olá! Quero fazer parte da AFLOR como associado(a). 🌸';
    if (d.motivo === 'voluntariado') return 'Olá! Quero ser voluntário(a) da AFLOR. 🌱';
    return 'Olá! Quero apoiar a AFLOR com uma doação. 💛';
  }

  function buildMessage(d) {
    return [intro(d), ''].concat(summaryLines(d)).join('\n');
  }

  /* ---------------- (a) WhatsApp ---------------- */

  function waUrl(message) {
    if (typeof window.AFLOR_buildWaUrl === 'function') return window.AFLOR_buildWaUrl(message);
    return 'https://wa.me/' + onlyDigits(CFG.whatsappNumber) + '?text=' + encodeURIComponent(message);
  }

  function mailtoUrl(d) {
    var to = EMAIL_RE.test(CFG.email || '') ? CFG.email : 'contato.aflor@gmail.com';
    return 'mailto:' + to +
      '?subject=' + encodeURIComponent('Faça Parte — ' + MOTIVOS[d.motivo] + ' — ' + d.nome) +
      '&body=' + encodeURIComponent(buildMessage(d));
  }

  function openExternal(url) {
    // Âncora temporária: mantém o gesto do usuário (evita bloqueio de pop-up) e garante noopener.
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function sendWhatsApp(data) {
    var url = waUrl(buildMessage(data));
    openExternal(url);
    setStatus('ok', 'Pronto! Abrimos o WhatsApp com sua mensagem — é só tocar em “Enviar”. Bem-vinda! Bem-vindo! 🌸', [
      { href: url, label: 'O WhatsApp não abriu? Toque aqui.' },
    ]);
  }

  /* ---------------- (b) E-mail (Web3Forms / Formspree / mailto) ---------------- */

  function emailEndpoint() {
    if (CFG.emailProvider === 'web3forms' && CFG.web3formsAccessKey && !/SUA_CHAVE/.test(CFG.web3formsAccessKey)) {
      return { url: 'https://api.web3forms.com/submit', provider: 'web3forms' };
    }
    if (CFG.emailProvider === 'formspree' && /^[A-Za-z0-9]{4,20}$/.test(CFG.formspreeFormId || '')) {
      return { url: 'https://formspree.io/f/' + CFG.formspreeFormId, provider: 'formspree' };
    }
    return null;
  }

  function cooldownLeft() {
    try {
      var last = Number(window.sessionStorage.getItem(COOLDOWN_KEY) || 0);
      var left = Math.ceil(((CFG.emailCooldownSeconds || 60) * 1000 - (Date.now() - last)) / 1000);
      return left > 0 ? left : 0;
    } catch (e) { return 0; }
  }

  function sendEmail(data, button) {
    var endpoint = emailEndpoint();
    var fallbacks = [
      { href: mailtoUrl(data), label: 'Abrir no meu aplicativo de e-mail →' },
      { href: waUrl(buildMessage(data)), label: 'Prefere? Envie pelo WhatsApp →' },
    ];

    if (!endpoint) {
      setStatus('err', 'O envio automático por e-mail ainda não está ativo. Você pode escrever direto para contato.aflor@gmail.com:', fallbacks);
      return;
    }
    var wait = cooldownLeft();
    if (wait) {
      setStatus('err', 'Recebemos um envio há pouco. Aguarde ' + wait + 's para enviar novamente.', null);
      return;
    }

    var payload = {
      subject: 'Faça Parte (' + MOTIVOS[data.motivo] + ') — ' + data.nome,
      from_name: 'Site AFLOR',
      name: data.nome,
      email: data.email,
      replyto: data.email,
      interesse: MOTIVOS[data.motivo],
      categoria_associado: data.categoria ? CATEGORIAS[data.categoria] : '—',
      tipo_doacao: data.doacao ? DOACOES[data.doacao] : '—',
      telefone: data.telefone ? formatPhone(data.telefone) : '—',
      mensagem: data.mensagem || '—',
      consentimento_lgpd: 'Sim — ' + new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    };
    if (endpoint.provider === 'web3forms') {
      payload.access_key = CFG.web3formsAccessKey;
      payload.botcheck = false;
    } else {
      payload._replyto = data.email;
      payload._subject = payload.subject;
    }

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 12000) : null;

    setBusy(button, true);
    fetch(endpoint.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin',
      signal: controller ? controller.signal : undefined,
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) {
          var ok = res.ok && (endpoint.provider !== 'web3forms' || body.success === true);
          if (!ok) throw new Error('send-failed');
        });
      })
      .then(function () {
        try { window.sessionStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch (e) { /* ignore */ }
        form.reset();
        updateConditionals();
        updateCounter();
        startedAt = Date.now();
        setStatus('ok', 'Recebemos sua mensagem! Em breve entraremos em contato. Bem-vinda! Bem-vindo! 🌸', null);
      })
      .catch(function () {
        setStatus('err', 'Não conseguimos enviar agora. Por favor, tente por outro canal:', fallbacks);
      })
      .finally(function () {
        if (timer) window.clearTimeout(timer);
        setBusy(button, false);
      });
  }

  /* ---------------- Eventos ---------------- */

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var button = event.submitter || null;
    var canal = button && button.value === 'email' ? 'email' : 'whatsapp';
    var data = readForm();

    // Honeypot: bots recebem "sucesso" silencioso e nada é enviado.
    if (data.botcheck) {
      setStatus('ok', 'Obrigado! Recebemos sua mensagem.', null);
      form.reset();
      return;
    }

    var errors = validate(data, canal);
    showErrors(errors);
    if (Object.keys(errors).length) {
      setStatus('err', 'Quase lá! Verifique os campos destacados.', null);
      return;
    }

    if (canal === 'email' && Date.now() - startedAt < (CFG.minFillTimeMs || 2500)) {
      setStatus('ok', 'Obrigado! Recebemos sua mensagem.', null); // provável bot
      return;
    }

    if (canal === 'whatsapp') sendWhatsApp(data);
    else sendEmail(data, button);
  });

  form.addEventListener('change', function (e) {
    var name = e.target && e.target.name;
    if (name === 'motivo') {
      updateConditionals();
      setFieldError('categoria', '');
      setFieldError('doacao', '');
    }
    if (name === 'categoria' || name === 'doacao' || name === 'motivo') {
      var errs = validate(readForm(), 'whatsapp');
      setFieldError(name, errs[name]);
    }
  });

  // Validação ao sair do campo (feedback gentil, não intrusivo)
  ['nome', 'telefone', 'email', 'consentimento'].forEach(function (name) {
    var el = form.elements.namedItem(name);
    if (!el || !el.addEventListener) return;
    el.addEventListener('blur', function () {
      if (!el.value && el.type !== 'checkbox') return;
      var errs = validate(readForm(), 'whatsapp');
      setFieldError(name, errs[name]);
    });
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true') {
        var errs = validate(readForm(), 'whatsapp');
        setFieldError(name, errs[name]);
      }
    });
  });

  // Atalhos dos cartões ("Quero esta categoria", "Doar no Dia de Doar"...) → pré-seleção
  document.addEventListener('aflor:preselect', function (e) {
    var d = e.detail || {};
    if (!has(MOTIVOS, d.motivo)) return;
    form.elements.namedItem('motivo').value = d.motivo;
    if (has(CATEGORIAS, d.categoria)) {
      var c = form.querySelector('input[name="categoria"][value="' + d.categoria + '"]');
      if (c) c.checked = true;
    }
    if (has(DOACOES, d.doacao)) {
      var r = form.querySelector('input[name="doacao"][value="' + d.doacao + '"]');
      if (r) r.checked = true;
    }
    updateConditionals();
    ['motivo', 'categoria', 'doacao'].forEach(function (n) { setFieldError(n, ''); });
    window.setTimeout(function () {
      var nome = form.elements.namedItem('nome');
      if (nome && !nome.value) nome.focus({ preventScroll: true });
    }, 700);
  });

  // Máscara de telefone
  var phone = form.elements.namedItem('telefone');
  if (phone) {
    phone.addEventListener('input', function () {
      phone.value = formatPhone(onlyDigits(phone.value));
    });
  }

  // Contador de caracteres
  var msg = form.elements.namedItem('mensagem');
  var counter = form.querySelector('[data-counter="mensagem"]');
  function updateCounter() {
    if (msg && counter) counter.textContent = String(msg.value.length);
  }
  if (msg) msg.addEventListener('input', updateCounter);

  updateConditionals();
})();
