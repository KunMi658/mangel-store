# MangelStore — Landing Page de Conversión (WhatsApp-First)

Este proyecto está estructurado bajo la fusión de estilos **"The Jensen Huang"** (cuadrícula técnica, estructura calculada, función sobre forma y estabilidad corporativa) y **"The Steve Jobs"** (espacio en blanco intencional, sans-serif esbelta y eliminación radical de elementos superfluos).

El sitio prioriza la compra por WhatsApp. Las métricas se comprueban con Lighthouse y pruebas de navegador; no son garantías de rendimiento para cada conexión.

---

## 🎨 Principios de Diseño Gobernado

1. **Contenedor Controlado:** Máximo `1200px` centrado con padding simétrico.
2. **Paleta Sobria:** Base grafito (`#09090B`, `#121215`, `#18181B`), bordes neutros de 1px sólido (`#27272A`) y un **único color de acento funcional de compra y acción** (`#22C55E` verde WhatsApp). Cero gradientes agresivos ni estéticas de neón.
3. **Tarjetas de Catálogo (4 Niveles Estrictos):**
   - Nivel 1: Identidad visual del software (icono/portada) + badge compacto.
   - Nivel 2: Título exacto + tipo de suscripción.
   - Nivel 3: Chips compactos de compatibilidad y entrega inmediata.
   - Nivel 4: Precio en COP + garantía real específica + CTA de compra (`margin-top: auto` para alturas uniformes).
   - *Nota:* Las listas detalladas de especificaciones se ubican en su propia matriz técnica debajo del grid.
4. **Garantías Reales por Producto:**
   - **CapCut PRO:** Garantía completa durante tus 28 días.
   - **Google AI PRO:** Garantía completa durante tus 18 meses.
   - **Canva PRO:** Garantía completa durante 1 año.
5. **Video Vertical (9:16) y Sección Fundador:**
   - Video vertical HTML5 nativo en aspect-ratio 9:16 hosteado en Cloudinary.
   - Loop infinito con reproducción en mute (`autoplay muted loop playsinline`). Cero dependencias de reproductores externos y cero saltos a videos no deseados.
   - Primer bloque de contenido, antes del catálogo y los testimonios.
   - En desktop: 2 columnas con espacio generoso (video izquierda, identidad y pilares derecha).
   - En móvil: apilado con el **video primero**, seguido de la identidad y cita de Miguel Q.

---

## 🚀 Despliegue (Cloudflare Pages)

El proyecto está configurado para **Cloudflare Pages** usando un *layout canónico* de Assets Estáticos. 

- Toda la página pública vive dentro de la carpeta `/public`.
- `wrangler.jsonc` en la raíz apunta al directorio `./public`.
- Cualquier cambio en la rama `master` dispara el despliegue automático en segundos.

---

## 🎥 Cómo actualizar el video del fundador
- El video está hosteado en **Cloudinary**.
- URL actual: `https://res.cloudinary.com/zgqfedz5/video/upload/v1789221703/MI_MODEL.mp4`
- Para cambiar el video: reemplazar la URL en el `<source>` del elemento `<video class="founder-video">` en `public/index.html`.
- Atributos obligatorios:
  - `autoplay`: inicia la reproducción al cargar.
  - `muted`: indispensable para que los navegadores móviles y desktop permitan autoplay sin requerir clic.
  - `loop`: garantiza reproducción continua en bucle infinito.
  - `playsinline`: evita que iOS Safari / Android fuercen modo pantalla completa.
  - `preload="metadata"`: carga ligera y optimizada de metadatos de video.

---

## 🖼️ Mantenimiento: Carrusel de Testimonios

El carrusel cuenta con un comportamiento gobernado:
- **Sin imágenes en `public/testimonios/`:** El contenedor marquee se mantiene completamente **oculto** (`display: none;`) en el DOM. Cero cajas vacías o placeholders con texto "Testimonio Cliente 1..12". Solo se visualizan los testimonios estáticos destacados.
- **Con imágenes en `public/testimonios/`:**
  1. Agrega tus capturas reales (`01-nombre-cliente.jpg`, etc.) a `public/testimonios/`.
  2. Ejecuta en la terminal:
     ```bash
     npm run build:testimonios
     ```
  3. El script `scripts/build-testimonios.js` generará automáticamente el marcado HTML con el track duplicado para scroll infinito y removerá el `display: none;`.
  4. Haz `git commit` y `git push` a `master`.

---

## 🛡️ Estándares de Código y Validación

### Regla Permanente de Validación de Scripts
Todo cambio o edición futura a bloques `<script>` inline en `public/index.html` debe validarse obligatoriamente extrayendo el código y ejecutando `node --check` antes de realizar commit.


## Rondas de calidad — 12 de septiembre de 2026

1. Navegación y accesibilidad: anclas nativas, menú progresivo, FAQ nativa, reveal visible por defecto, targets y foco, posición segura de WhatsApp.
2. Rendimiento y claridad: medios, fuentes, contraste, metadatos y mantenimiento del carrusel.
3. Verificación final: pruebas de regresión y métricas de producción.

### Mantenimiento de navegación

- Ejecutar `npm run check` antes de **cada commit**. Extrae todos los scripts inline y ejecuta `node --check`, valida JSON-LD, h1 único y destinos de anclas.
- FAQ usa `details/summary`: teclado y modo sin JavaScript funcionan sin inicialización. No añadir `hidden` a las respuestas.
- Menú móvil solo se colapsa con `html.menu-ready`, después de registrar sus handlers. Escape cierra y devuelve el foco al botón.
- `.reveal` siempre es visible. El observer añade una animación de entrada que no oculta contenido si falla JavaScript. `3.800+` permanece estático.
- Los enlaces internos usan scroll CSS; no interceptarlos con `querySelector(href)` ni forzar smooth desde JS.
- WhatsApp respeta safe-area y VisualViewport. La página no tiene campos de texto propios; comprobar también con teclado virtual real cuando se introduzcan formularios.
- `Ver Catálogo` ya no dispara un evento Lead: ese evento corresponde a los CTAs de WhatsApp.

### Pruebas de navegador

Con Playwright disponible (`npm install --no-save --package-lock=false playwright`, solo herramienta local):

```sh
npm run audit:browser -- http://127.0.0.1:8788 /ruta/a/informes
npm run audit:browser -- https://mangelstore.shop/ /ruta/a/informes-produccion
```

El script usa Chrome instalado, perfiles aislados y viewports 375 y 1280. Comprueba anclas, targets, menú/Escape, FAQ con teclado, sonido, teléfono/mensajes y ausencia de errores JS. Incluye escenarios sin JavaScript, fallo del bootstrap y movimiento reducido; guarda JSON y capturas. Las pruebas no envían mensajes.

Baseline Lighthouse 13.4.1 / Chrome 152: móvil P73 / A92 / BP73 / SEO100, LCP 5,2 s, CLS 0; desktop P95 / A92 / BP73 / SEO100, LCP 1,4 s, CLS 0,00117. Perfiles estándar Lighthouse; 375/1280 se comprueban por separado.

Ruido externo observado: Meta Pixel puede generar avisos de cookies de terceros. Cancelaciones `ERR_ABORTED` de peticiones Range del video pueden ocurrir al navegar/cerrar la página; no equivalen a un 404. El favicon ausente quedó corregido con SVG local; fuentes, video y contraste se abordan en la ronda 2.
