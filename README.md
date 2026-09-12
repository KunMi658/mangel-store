# MangelStore — Landing Page de Conversión (WhatsApp-First)

Este proyecto está estructurado bajo la fusión de estilos **"The Jensen Huang"** (cuadrícula técnica, estructura calculada, función sobre forma y estabilidad corporativa) y **"The Steve Jobs"** (espacio en blanco intencional, sans-serif esbelta y eliminación radical de elementos superfluos).

Está optimizado para transmitir máxima autoridad, confianza y conversión inmediata a través de WhatsApp, con métricas perfectas de Core Web Vitals (< 2s en móvil).

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
   - Video vertical optimizado en aspect-ratio 9:16 con parámetros anti-cola (`queue-enable=false&endscreen-enable=false&sharing-enable=false&ui-start-screen-info=false`).
   - Ubicada estratégicamente **antes** de los testimonios.
   - En desktop: 2 columnas con espacio generoso (video izquierda, identidad y pilares derecha).
   - En móvil: apilado con el **video primero**, seguido de la identidad y cita de Miguel Q.

---

## 🚀 Despliegue (Cloudflare Pages)

El proyecto está configurado para **Cloudflare Pages** usando un *layout canónico* de Assets Estáticos. 

- Toda la página pública vive dentro de la carpeta `/public`.
- `wrangler.jsonc` en la raíz apunta al directorio `./public`.
- Cualquier cambio en la rama `master` dispara el despliegue automático en segundos.

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

## 🛡️ Estándares de Código y Ruido Conocido

### Ruido Conocido de Terceros (Dailymotion)
Los errores o warnings en consola relacionados con `dmp.photon`, `about:blank sandbox`, o `cm.adform.net` son ruido interno originado por el iframe del reproductor embebido de Dailymotion. No deben tocarse, no provienen de la lógica de MangelStore y no afectan la funcionalidad ni conversión de la landing.

### Regla Permanente de Validación de Scripts
Todo cambio o edición futura a bloques `<script>` inline en `public/index.html` debe validarse obligatoriamente extrayendo el código y ejecutando `node --check` antes de realizar commit.
