# Pendientes — sitio AFLOR

## Antes de producción
- [ ] **Clave de Web3Forms:** sustituir `SUA_CHAVE_WEB3FORMS_AQUI` en `assets/js/config.js` (`web3formsAccessKey`) **y** en el campo oculto `access_key` de `index.html`. Hasta entonces, el envío por correo usa el respaldo `mailto:`.
- [ ] **Documentos:** añadir los enlaces de *Última Assembleia* y *Orçamento* en `docs` de `assets/js/config.js` (mientras estén vacíos, los botones muestran "Em breve").
- [ ] **Textos de servicios:** revisar/confirmar las descripciones de *Contraturno escolar*, *Consultoria em Pedagogia Waldorf* y *Projetos Sociais* en `index.html` (no venían en el contenido oficial).
- [ ] **Dirección del Jardim:** confirmar dirección y coordenadas del Jardim Waldorf Ciranda (`maps.jardim` en `config.js` y el texto en `index.html`). Ahora usa la misma ubicación que la sede.
- [ ] **Opcional:** añadir CNPJ y clave PIX si se quieren mostrar.
- [ ] **Comprobar la consola del navegador** (F12) para ver si hay errores de la política de seguridad (CSP). No llegué a verificarlo.

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