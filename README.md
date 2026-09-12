# MangelStore — Landing Page de Conversión (WhatsApp-First)

Este proyecto está optimizado para generar la máxima conversión a través de WhatsApp, con animaciones sutiles, componentes accesibles, y métricas perfectas (Core Web Vitals).

## 🚀 Despliegue (Cloudflare Pages)

El proyecto está configurado para **Cloudflare Pages** usando un *layout canónico* de Assets Estáticos. 

Toda la página pública vive dentro de la carpeta `/public`.
Cloudflare leerá el archivo `wrangler.jsonc` en la raíz que apunta al directorio `public/`, haciendo que el despliegue sea extremadamente rápido y saltándose la instalación del framework entero de Wrangler.

Cualquier cambio que empujes a la rama `master` en GitHub se publicará automáticamente en producción en segundos.

## 🖼️ Mantenimiento: Carrusel de Testimonios

He creado un sistema híbrido escalable para que agregues nuevos testimonios fácilmente cuando quieras reemplazar los placeholders.

1. **Sube tus capturas:** Agrega tus capturas de pantalla de los testimonios de Facebook o WhatsApp a la carpeta `public/testimonios/`. (Ej: `01-juan.jpg`, `02-maria.png`).
2. **Ejecuta el constructor local:** Abre la terminal en la raíz de este proyecto y ejecuta:
   ```bash
   npm run build:testimonios
   ```
3. **¿Qué hace el script?** El script de Node (`scripts/build-testimonios.js`) escaneará la carpeta `public/testimonios`, extraerá los nombres, e inyectará automáticamente todo el HTML dentro de `public/index.html` para que el carrusel marquee funcione.
4. **Sube a producción:** Finalmente, solo haz `git commit` y `git push` a tu repositorio. Cloudflare tomará el `public/index.html` actualizado y lo publicará.

## ⚡ Optimizaciones Core Web Vitals (SEO)
- **LCP:** La imagen principal del Hero Banner tiene `fetchpriority="high"`.
- **CLS:** Los contenedores de video (Dailymotion) y testimonios tienen el ratio fijo calculado por CSS.
- **Micro-copy de urgencia:** Agregado el badge de `⚡ Activación en menos de 5 min` a todas las tarjetas de producto.
- **Data Estructurada (JSON-LD):** Los productos de CapCut, Canva, Google AI, y el acordeón de FAQ están inyectados en la cabecera del sitio para que Google entienda la tienda perfectamente.
