# AFLOR — Associação Pedagógica Antroposófica Ciranda das Flores

Site institucional estático (HTML5 + CSS + JavaScript Vanilla, zero backend), irmão visual do
[Jardim Waldorf Ciranda](https://donxergio.github.io/JardimCiranda/). Hospedagem: GitHub Pages.

## Estrutura

```
index.html                  Página única (âncoras: #quem-somos, #direcionadores, #governanca,
                            #atuacao, #transparencia, #faca-parte, #formulario, #contato)
politica-de-privacidade.html
404.html                    Usa <base href="/AFLOR/"> (trocar para "/" com domínio próprio)
assets/css/styles.css       Seções 1–20 = design system idêntico ao Jardim Ciranda; 21+ = AFLOR
assets/js/config.js         ⚙️ ÚNICO arquivo de configuração
assets/js/main.js           Menu, animações, LGPD, mapas sob demanda, links do ecossistema
assets/js/form.js           Formulário "Faça Parte" (WhatsApp / Web3Forms / mailto)
assets/fonts/               Lora + Nunito self-hosted (mesmas do Jardim)
assets/img/                 Imagens WebP responsivas, sem rostos de crianças
```

## Configuração rápida (`assets/js/config.js`)

| Chave | Para quê |
|---|---|
| `jardimUrl` | Link do Jardim. Hoje `https://donxergio.github.io/JardimCiranda/`; em produção `https://www.jardimciranda.com.br/` |
| `web3formsAccessKey` | Crie em web3forms.com com o e-mail **contato.aflor@gmail.com** (repita no `<input name="access_key">` do `index.html`, usado sem JS) |
| `docs.assembleia` / `docs.orcamento` | Cole o link https do documento → o botão "Em breve" vira "Abrir" automaticamente |
| `maps.sede` / `maps.jardim` | Coordenadas dos mapas (confirmar) |

> Os `href` estáticos no HTML com `data-jardim-link` são só fallback sem JavaScript.
> Ao migrar para o domínio, faça também um *buscar e substituir* de `donxergio.github.io/JardimCiranda/`.

## Publicar no GitHub Pages

1. Envie o conteúdo desta pasta para o repositório `donxergio/AFLOR` (branch `main`).
2. *Settings → Pages → Deploy from a branch → main / (root)*.
3. Acesse `https://donxergio.github.io/AFLOR/`.

Sem `CNAME` nesta etapa. Ao migrar para domínio próprio: criar `CNAME`, trocar `<base>` do `404.html`
para `/`, e atualizar `canonical`, `og:*`, JSON-LD, `robots.txt` e `sitemap.xml`.

## Link recíproco no Jardim Ciranda

No `index.html` do JardimCiranda, dentro da 1ª coluna do rodapé (logo após o parágrafo descritivo):

```html
<p><a href="https://donxergio.github.io/AFLOR/" target="_blank" rel="noopener noreferrer" id="footer-aflor">
  Uma iniciativa mantida pela AFLOR — Associação Pedagógica Antroposófica Ciranda das Flores ↗</a></p>
```

## Pendências antes de produção

- [ ] Chave Web3Forms
- [ ] Links de "Última Assembleia" e "Orçamento"
- [ ] Confirmar textos de Contraturno, Consultoria e Projetos Sociais
- [ ] Confirmar endereço/coordenadas do Jardim e da Sede
- [ ] CNPJ na Política de Privacidade; chave PIX (opcional) no cartão "Doação Livre"
