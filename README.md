# elementabdl

Sitio web de Elementa BDL, www.elementabdl.cl

Sitio estático bilingüe (español en `/`, inglés en `/en/`), reconstruido desde el respaldo Joomla del 11 de junio de 2019. Se publica en Azure Static Web Apps con cada push a `main`.

- `index.html` y carpetas: páginas del sitio, con las mismas URLs del sitio original.
- `assets/`: estilos, script y el índice del buscador.
- `images/`: imágenes usadas por el contenido.
- `staticwebapp.config.json`: redirecciones 301 desde URLs antiguas y página 404.
- `sitemap.xml` y `robots.txt`.

Vista local: `python -m http.server 8765` en la raíz del repositorio y luego abrir http://localhost:8765/
