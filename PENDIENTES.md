# Pendientes — sitio AFLOR

## Antes de producción
- [x] **Clave de Web3Forms:** sustituir `SUA_CHAVE_WEB3FORMS_AQUI` en `assets/js/config.js` (`web3formsAccessKey`) **y** en el campo oculto `access_key` de `index.html`. Hasta entonces, el envío por correo usa el respaldo `mailto:`.
- [ ] **Documentos:** añadir los enlaces de *Última Assembleia* y *Orçamento* en `docs` de `assets/js/config.js` (mientras estén vacíos, los botones muestran "Em breve").
- [ ] **Textos de servicios:** revisar/confirmar las descripciones de *Consultoria em Pedagogia Waldorf* y *Projetos Sociais* en `index.html` (no venían en el contenido oficial). *Contraturno escolar* ya lleva "Oferecido pelo Jardim Ciranda."
- [ ] **Dirección del Jardim:** confirmar dirección y coordenadas del Jardim Waldorf Ciranda (`maps.jardim` en `config.js` y el texto en `index.html`). Ahora usa la misma ubicación que la sede.
- [ ] **Opcional:** añadir CNPJ y clave PIX si se quieren mostrar.
- [ ] **Comprobar la consola del navegador** (F12) para ver si hay errores de la política de seguridad (CSP). No llegué a verificarlo.

## Projeto Raízes do Aprender (`projeto-raizes.html`)
- [ ] **Foto real** del proyecto (sin rostros). Por ahora usa imágenes existentes: `horta-colheita` (hero), `maos-tecendo-la` (card de la home y pilar 1), `pintura-aquarela` y `caminho-no-jardim`.
- [ ] **Validar textos de la Fundação Fritz Müller:** confirmar la redacción de agradecimiento por el financiamiento 2026 en `index.html` (sección Parceiros y tarjeta de Raízes) y en `projeto-raizes.html` (ficha técnica y bloque institucional de patrocinio).
- [ ] **Validar el párrafo del CTA final** ("Fale com a AFLOR para inscrever uma criança…"), redactado para el sitio. El resto es el texto enviado, solo reordenado.
- [ ] **Cita de Ruth Rocha:** está cortada con "..." como en el texto enviado; completar si se quiere la frase entera.
- Mensaje de WhatsApp pre-rellenado: `whatsappMessages.raizes` en `assets/js/config.js`.

## Valores
- La sección muestra solo los 7 nombres. Los textos de cada valor y las *perguntas norteadoras* se quitaron del HTML (siguen en el historial de git si se quieren recuperar).

## Campaña Dia de Doar (`dia-de-doar.html`)
- [x] **QR PIX:** `assets/img/pix-aflor.png` (limpio con `python .agents/scripts/build_pix_qr.py <imagen>`), clave CNPJ 58.981.530/0001-48 en `config.js`. QR estático sin valor fijo, identificador `diadedoar`.
- [ ] **Validar los textos de la página:** la sección "O que é" y las cifras de 2024 vienen de la carta-convite oficial del Dia de Doar (carpeta *Materiais para Parcerias*); el resto (portada, "Por que doar", PIX y formulario) es redacción propia.
- [x] **Fecha confirmada:** 1 de diciembre de 2026 (primera terça-feira tras la Black Friday, según el material oficial).
- [ ] **Confirmar la descripción del PL de Joinville** (tarjeta "Joinville também doa"); el PDF todavía no se ha leído.
- [ ] **Opcional:** los modelos de ofício (apoyo financiero / participación / general) de *Materiais para Parcerias* sirven para pedir apoyo a la Prefeitura o a empresas, no para la web.
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