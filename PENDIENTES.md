# Pendientes — sitio AFLOR

## Antes de producción
- [x] **Clave de Web3Forms:** sustituir `SUA_CHAVE_WEB3FORMS_AQUI` en `assets/js/config.js` (`web3formsAccessKey`) **y** en el campo oculto `access_key` de `index.html`. Hasta entonces, el envío por correo usa el respaldo `mailto:`.
- [ ] **Documentos:** añadir los enlaces de *Última Assembleia* y *Orçamento* en `docs` de `assets/js/config.js` (mientras estén vacíos, los botones muestran "Em breve").
- [x] **Textos de servicios:** revisar/confirmar las descripciones de *Consultoria em Pedagogia Waldorf* y *Projetos Sociais* en `index.html` (no venían en el contenido oficial). *Contraturno escolar* ya lleva "Oferecido pelo Jardim Ciranda."
- [x] **Dirección del Jardim:** confirmar dirección y coordenadas del Jardim Waldorf Ciranda (`maps.jardim` en `config.js` y el texto en `index.html`). Ahora usa la misma ubicación que la sede.
- [ ] **Opcional:** añadir CNPJ y clave PIX si se quieren mostrar.
- [ ] **Comprobar la consola del navegador** (F12) para ver si hay errores de la política de seguridad (CSP). No llegué a verificarlo.

- [x] **Fotos y logo reales del proyecto:** procesadas desde `assets/img/Prepare/` con [build_raizes_photos.py](file:///d:/DEV/Aflor/.agents/scripts/build_raizes_photos.py). Logo integrado en la tarjeta de [index.html](file:///d:/DEV/Aflor/index.html#L729) y en el hero badge de [projeto-raizes.html](file:///d:/DEV/Aflor/projeto-raizes.html#L235). Las 6 fotos reales fueron exportadas en WebP (640 y 1280 px) limpias y sin filtros automáticos de desenfoque, y se eliminaron las leyendas de texto superpuestas en la galería *Vivências*.
- [x] **Revisión / desenfoque manual de rostros (ECA/LGPD):** revisar y aplicar desenfoque o recorte manual en las fotos de [projeto-raizes.html](file:///d:/DEV/Aflor/projeto-raizes.html) antes de publicación definitiva si fuera necesario.
- [x] **Validar textos de la Fundação Fritz Müller:** confirmar la redacción de agradecimiento por el financiamiento 2026 en `index.html` (sección Parceiros y tarjeta de Raízes) y en `projeto-raizes.html` (ficha técnica y bloque institucional de patrocinio).
- [x] **Validar el párrafo del CTA final** ("Fale com a AFLOR para inscrever uma criança…"), redactado para el sitio. El resto es el texto enviado, solo reordenado.
- [ ] **Cita de Ruth Rocha:** está cortada con "..." como en el texto enviado; completar si se quiere la frase entera.
- Mensaje de WhatsApp pre-rellenado: `whatsappMessages.raizes` en `assets/js/config.js`.

## Valores
- La sección muestra solo los 7 nombres. Los textos de cada valor y las *perguntas norteadoras* se quitaron del HTML (siguen en el historial de git si se quieren recuperar).

## Campaña Dia de Doar (`dia-de-doar.html`)
- [x] **QR PIX:** `assets/img/pix-aflor.png` (limpio con `python .agents/scripts/build_pix_qr.py <imagen>`), clave CNPJ 58.981.530/0001-48 en `config.js`. QR estático sin valor fijo, descripción `Campanha Dia de Doar - AFLOR`, identificador `diadedoar` (CRC `1A34`).
- [x] **Popup de refuerzo con QR PIX:** al entrar en `dia-de-doar.html` (mientras la campaña esté activa) se abre un modal (`#modal-dia-de-doar`) con el código QR, la clave PIX copiable y botones para cerrar o ir al formulario `#seus-dados`, manteniendo intacta la sección `#pix` dentro de la página.
- [x] **Nueva estructura oficial de la página (`dia-de-doar.html`):**
  1. **Abertura + Projeto Raízes do Aprender** (con logo oficial, *Como fazemos isso*, indicadores de evaluación, espacio para el selo *O Farol* y llamadas a la acción).
  2. **Modalidades de apoyo (*O Farol Joinville*):** *Embaixadores AFLOR* (**Taísa Rodrigues**; los espacios vacíos de Embaixador 2, 3 y 4 se retiraron hasta que existan), *Patrocínio Frutificar*, *Parceria que Germinar*, *Vizinho Amigo Dá Flor* y *Doação Semente* (con los pasos del brinde de la bolsa ecológica para donaciones > R$ 80,00).
  3. **Aflorômetro:** velocímetro/hodómetro semicircular en SVG con los 5 marcos de recaudación + barra flotante compacta (`#aflorometro-fixo`) durante el scroll.
  4. **PIX + Cadastro de la campaña (`#seus-dados`):** formulario actualizado con *Nome completo*, *Instagram*, *WhatsApp*, *E-mail*, *Como ficou sabendo da Campanha*, *Filhos ou netos em idade escolar* (selección múltiple), *Aceito receber novidades* y consentimiento LGPD.
  5. **Sobre a AFLOR** + **Sobre a Campanha do Dia de Doar** (`#o-que-e`).
- [ ] **Imágenes y datos pendientes de cargar en `assets/js/config.js` (`diaDeDoar`):**
  - [x] `seloFarolImg`: imagen del sello *O Farol* (`assets/img/selo-o-farol.webp` y `.png` con fondo transparente) integrada en `dia-de-doar.html` y `config.js`.
  - [ ] `bolsaImg`: subir foto de la bolsa ecológica del Jardim Waldorf Ciranda a `assets/img/`.
  - [ ] `postDoacaoSementeUrl`: pegar el enlace al post de Instagram donde se etiqueta a 5 personas.
  - [ ] `aflorometro.valorAtual` y `aflorometro.atualizadoEm`: actualizar conforme avance la recaudación.
  - [x] `embaixadores`: **Taísa Rodrigues** ya integrada con foto, depoimento, bio y contactos (`@taicomunica` / `47988643373`). Se retiraron las tarjetas vacías de Embaixador 2, 3 y 4 (se añadirán más adelante cuando existan).
  - [ ] `patrocinadores`, `parcerias` (ya incluida **Sarah Pinnow / Felice Granola e Poesia** en `dia-de-doar.html`) y `vizinhos`: añadir logos, declaraciones de apoyo y contactos conforme se sumen más empresas.
- [x] **Fecha confirmada:** 1 de diciembre de 2026 (primera terça-feira tras la Black Friday, según el material oficial).
- [ ] **Confirmar la descripción del PL de Joinville** (tarjeta "Joinville também doa"); el PDF todavía no se ha leído.
- Fin automático: el botón, la tarjeta y el enlace del pie desaparecen el 06/12/2026 a las 00:00 (`diaDeDoar.encerraEm`). Para probarlo, añade `?simular=encerrado` a la URL.

## En el proyecto JardimCiranda
- [ ] Añadir el enlace de vuelta a AFLOR en el `index.html` de JardimCiranda, en la primera columna del footer, después del párrafo descriptivo:

```html
<p><a href="https://donxergio.github.io/AFLOR/" target="_blank" rel="noopener noreferrer" id="footer-aflor">Uma iniciativa mantida pela AFLOR — Associação Pedagógica Antroposófica Ciranda das Flores ↗</a></p>
```

## Al pasar a dominio propio
- [ ] Cambiar `jardimUrl` en `assets/js/config.js` a `https://www.jardimciranda.com.br`.
- [ ] Buscar y reemplazar `donxergio.github.io/JardimCiranda` en `index.html` (los `href` escritos en el HTML son los que leen los buscadores).
- [ ] En `404.html`, cambiar `<base href="/AFLOR/">` por `<base href="/">`.
- [ ] Actualizar las URLs de `sitemap.xml`, `robots.txt` y las etiquetas OG / canonical de `index.html`.
- [ ] Crear el archivo `CNAME` con el dominio de AFLOR (no creado a propósito en esta etapa).


Archivos


index.html
: el sitio completo, de la portada al contacto.


styles.css
: las secciones 1–20 son copia literal del CSS del Jardim; desde la 21 están los componentes de AFLOR.


config.js
: todos los valores configurables.


main.js
 y 

form.js
: interacción de la página y formulario (WhatsApp + Web3Forms, con correo como respaldo).


politica-de-privacidade.html
, 

404.html
, site.webmanifest, robots.txt, sitemap.xml, .nojekyll, 

README.md
.
Imágenes: reutilicé fotos del Jardim y añadí 4 nuevas (manos sembrando, flor al sol, ronda comunitaria y acuarela Lazur), sin rostros de niños identificables. A la de manos sembrando le recorté la parte de arriba para quitar el mentón de un niño.
No creé el archivo CNAME.