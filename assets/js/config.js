/**
 * AFLOR — configuração central (edite apenas este arquivo).
 * Objeto congelado: não pode ser alterado por outros scripts em tempo de execução.
 */
(function () {
  'use strict';

  window.AFLOR_CONFIG = Object.freeze({
    /**
     * 🔗 URL do site irmão (Jardim Waldorf Ciranda).
     * Etapa de validação: GitHub Pages. Em produção, troque por:
     *   'https://www.jardimciranda.com.br/'
     * Todos os links com [data-jardim-link] no HTML são atualizados automaticamente a partir daqui.
     * (O href estático no HTML é só o fallback para quem navega sem JavaScript.)
     */
    jardimUrl: 'https://donxergio.github.io/JardimCiranda/',

    /** WhatsApp da AFLOR: DDI + DDD + número, só dígitos. */
    whatsappNumber: '5547988916765',

    /** Mensagem usada pelos botões genéricos de WhatsApp (flutuante, rodapé). */
    whatsappDefaultMessage: 'Olá! Vim pelo site da AFLOR e gostaria de saber mais sobre a associação. 🌸',

    /** E-mail institucional (usado no fallback mailto:). */
    email: 'contato.aflor@gmail.com',

    /**
     * Envio por e-mail (alternativo ao WhatsApp):
     *   'web3forms' → https://web3forms.com  (gratuito). Crie a chave com o e-mail
     *                 contato.aflor@gmail.com — as mensagens chegam nessa caixa.
     *   'formspree' → https://formspree.io
     *   ''          → desativa o envio via API (resta WhatsApp + mailto).
     */
    emailProvider: 'web3forms',

    /** Chave PÚBLICA do Web3Forms (é feita para ficar no front-end). Restrinja o domínio no painel. */
    web3formsAccessKey: '8ec07629-2668-4e26-a514-a80079ef59cd',

    /** ID do formulário Formspree, ex.: 'xyzabcd' (usado só se emailProvider = 'formspree'). */
    formspreeFormId: '',

    /** Intervalo mínimo entre envios por e-mail no mesmo navegador (anti-flood de UX). */
    emailCooldownSeconds: 60,

    /** Tempo mínimo (ms) entre exibir o formulário e enviar — bots costumam ser instantâneos. */
    minFillTimeMs: 2500,

    /**
     * Documentos de transparência. Deixe '' para exibir o botão como "Em breve".
     * Use apenas links https (Google Drive, etc.).
     */
    docs: {
      estatuto: 'https://drive.google.com/drive/folders/17uXQIuZGNfTxKL-hNsOTFFr9UEyERPCq?usp=drive_link',
      assembleia: '',
      orcamento: '',
    },

    /**
     * Mapas (OpenStreetMap) — sem cookies de rastreamento.
     * ⚠️ CONFIRMAR as coordenadas de cada endereço antes de publicar.
     */
    maps: {
      sede: {
        lat: -26.2799649,
        lng: -48.8545398,
        bbox: '-48.8585,-26.2825,-48.8505,-26.2775',
        title: 'Mapa: sede administrativa da AFLOR na Rua General Andrade Neves, 462 — Sala 1, América, Joinville',
      },
      jardim: {
        lat: -26.2799649,
        lng: -48.8545398,
        bbox: '-48.8585,-26.2825,-48.8505,-26.2775',
        title: 'Mapa: localização do Jardim Waldorf Ciranda em Joinville',
      },
    },

    /** Versão do aviso de privacidade: incremente para pedir nova escolha aos visitantes. */
    consentVersion: 1,
  });
})();
