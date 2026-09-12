# Testimonios de MangelStore

Esta carpeta almacena las imágenes de los clientes que se muestran en el carrusel infinito (Marquee) de la página web.

## ¿Cómo agregar nuevos testimonios?

1. **Guarda la imagen:** Toma una captura de pantalla del testimonio (idealmente desde Facebook, WhatsApp o Instagram) y guárdala en esta carpeta.
2. **Nombra el archivo correctamente:** Para que el alt-text sea accesible y haya un orden, usa el siguiente formato:
   `01-nombre-apellido.jpg` (o `.png`, `.webp`)
   
   *Ejemplo:* `01-juan-perez.jpg`, `02-maria-lopez.png`.

3. **Ejecuta el script:** Una vez que las imágenes estén aquí, debes actualizar el HTML de la página web. Abre la terminal en la raíz del proyecto y corre:
   ```bash
   npm run build:testimonios
   ```
   (O alternativamente: `node scripts/build-testimonios.js`)

¡Listo! El script insertará y duplicará automáticamente las imágenes en el `index.html` para generar el efecto de carrusel infinito.
