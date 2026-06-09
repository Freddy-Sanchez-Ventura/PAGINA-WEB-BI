# BIM Ingenieros

Sitio estático de BIM Ingenieros publicado en `https://bimingenieros.online`.

## Estructura

- `index.html`: página principal.
- `formacion/`: páginas de cursos con URL limpia.
- `complementos/`: páginas de complementos con URL limpia.
- `blog-tecnico/`: lector e índice del blog.
- `articulos/`: artículos publicados con URL limpia.
- `CURSOS/`: datos JSON de cursos y del índice del blog.
- `DATA/`: datos JSON de complementos.
- `CSS/` y `JS/`: estilos y comportamiento compartido.

Los HTML antiguos se conservan únicamente como redirecciones para no romper enlaces ya publicados.

## Desarrollo local

El sitio debe abrirse mediante un servidor HTTP porque utiliza `fetch()` para cargar JSON:

```powershell
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Edición de contenido

- Cursos: modifica el archivo correspondiente en `CURSOS/`.
- Complementos: modifica `DATA/addons.json` y el JSON individual del complemento.
- Blog: edita `CURSOS/blog.json` y el artículo dentro de `articulos/`.

No edites los HTML antiguos de la raíz ni los archivos de `BLOG/HTML/`: son redirecciones de compatibilidad.

## Validación

```powershell
node tools/validate-site.mjs
```

La validación comprueba JSON, recursos locales, canonical y enlaces internos con extensiones antiguas.
