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

    /**
     * Mensagens específicas: um link com data-wa-link="chave" usa whatsappMessages[chave].
     * Sem chave (ou chave inexistente), vale a whatsappDefaultMessage.
     */
    whatsappMessages: {
      raizes: 'Olá! Gostaria de informações sobre a inscrição no Projeto Raízes do Aprender.',
      patrocinador: 'Olá! Gostaria de saber como ser um Patrocinador Frutificar na Campanha Dia de Doar da AFLOR. 🌱',
      parceria: 'Olá! Gostaria de saber como ser uma Parceria que Germina nossas ações na Campanha Dia de Doar da AFLOR. 🌿',
      vizinho: 'Olá! Gostaria de saber como ser um Vizinho Amigo Dá Flor na Campanha Dia de Doar da AFLOR. 🌸',
    },

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
     * Parceiros institucionais da AFLOR.
     */
    parceiros: [
      {
        nome: 'Fundação Fritz Müller',
        url: 'https://www.fundacaofritzmuller.com.br/sobre-a-fritzmuller/',
        papel: 'Financiadora do Projeto Raízes do Aprender em 2026',
      },
    ],

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

    /**
     * 🎁 Campanha Dia de Doar (página dia-de-doar.html).
     *   encerraEm   → a partir deste instante o botão do menu, o cartão e o link do rodapé
     *                 deixam de aparecer e a página mostra "campanha encerrada".
     *                 (fim do dia 05/12/2026 no horário de Brasília)
     *   pixQr       → imagem do QR Code PIX dentro de assets/img/ (ex.: 'assets/img/pix-aflor.png').
     *                 Deixe '' para mostrar "QR Code em breve".
     *   pixChave    → chave PIX em texto (CNPJ, e-mail ou aleatória). '' para ocultar.
     *   pixFavorecido → nome do favorecido exibido abaixo do QR.
     */
    diaDeDoar: {
      encerraEm: '2026-12-06T00:00:00-03:00',
      // QR estático decodificado: chave CNPJ 58.981.530/0001-48, msg "Campanha Dia de Doar - AFLOR", txid "diadedoar", sem valor fixo
      pixQr: 'assets/img/pix-aflor.png?v=2',
      pixChave: '58.981.530/0001-48',
      pixFavorecido: 'AFLOR — Associação Pedagógica Antroposófica Ciranda das Flores',

      /**
       * Imagens e links pendentes da campanha (deixe '' para mostrar o espaço reservado "Em breve"):
       *   seloFarolImg         → ex.: 'assets/img/selo-o-farol.webp'
       *   bolsaImg             → ex.: 'assets/img/bolsa-ecologica-jardim.webp'
       *   postDoacaoSementeUrl → link https do post no Instagram para marcar 5 pessoas
       */
      seloFarolImg: 'assets/img/selo-o-farol.webp',
      bolsaImg: '',
      postDoacaoSementeUrl: '',

      /**
       * 🎯 Aflorômetro (hodômetro de arrecadação):
       *   valorAtual   → número em reais (ex.: 12500.50). Atualize aqui diariamente.
       *   atualizadoEm → texto opcional da última atualização (ex.: '03/11/2026').
       *   marcos       → os 5 marcos oficiais da campanha.
       */
      aflorometro: {
        valorAtual: 0,
        atualizadoEm: '',
        marcos: [
          { valor: 42463.85, descricao: '6 meses de Projeto Raízes do Aprender' },
          { valor: 74927.70, descricao: '1 ano de Projeto Raízes do Aprender' },
          { valor: 89012.70, descricao: '1 ano de Projeto Raízes do Aprender com atendimento fonológico' },
          { valor: 178025.40, descricao: 'Atendimento para 32 crianças por 1 ano, com atendimento fonológico' },
          { valor: 250000.00, descricao: 'ampliação do espaço físico para possibilitar o atendimento de 48 crianças por dia da semana' },
        ],
      },

      /**
       * 🌸 Embaixadores AFLOR (adicionados conforme forem confirmados).
       * Tamanhos recomendados para harmonia visual dos cartões:
       *   - depoimento: até ~220 caracteres
       *   - bio:        até ~140 caracteres
       * Exemplo de item:
       *   { nome: 'Nome Sobrenome', foto: 'assets/img/embaixador-1.webp', bio: '...', depoimento: '...', instagram: 'https://www.instagram.com/...', whatsapp: '5547999999999' }
       */
      embaixadores: [],

      /**
       * 🌳 Rede de empresas apoiadoras.
       * Exemplo de item para patrocinadores / parcerias / vizinhos:
       *   { nome: 'Nome da Empresa', logo: 'assets/img/empresa.webp', declaracao: 'Ação ou declaração de apoio...', contato: '@empresa · (47) 99999-9999', url: 'https://...' }
       */
      patrocinadores: [],
      parcerias: [],
      vizinhos: [],
    },
  });
})();
