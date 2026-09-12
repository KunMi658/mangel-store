const fs = require('fs');
const path = require('path');

const TESTIMONIOS_DIR = path.join(__dirname, '../public/testimonios');
const INDEX_HTML = path.join(__dirname, '../public/index.html');

function buildTestimonios() {
  console.log('Iniciando build de testimonios...');

  // 1. Check if folder exists
  if (!fs.existsSync(TESTIMONIOS_DIR)) {
    console.warn(`[!] La carpeta '${TESTIMONIOS_DIR}' no existe. Creándola...`);
    fs.mkdirSync(TESTIMONIOS_DIR, { recursive: true });
  }

  // 2. Read images
  const files = fs.readdirSync(TESTIMONIOS_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort();

  if (files.length === 0) {
    console.log('[i] No se encontraron imágenes en la carpeta testimonios. Saltando...');
    return;
  }

  console.log(`[i] Encontrados ${files.length} testimonios.`);

  // 3. Generate HTML
  let imagesHtml = '';
  files.forEach(file => {
    // Extraer nombre (ej: "01-juan-perez.jpg" -> "Juan Perez")
    let altText = file.replace(/^\d+-/, '').replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/-/g, ' ');
    altText = altText.replace(/\b\w/g, c => c.toUpperCase());
    
    imagesHtml += `\n          <img src="testimonios/${file}" alt="Testimonio de ${altText}" loading="lazy">`;
  });

  // Duplicar para efecto marquee infinito
  imagesHtml = imagesHtml + imagesHtml;

  // 4. Inject into index.html
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  
  // Expresión regular para encontrar y reemplazar el contenido de marquee-track
  const regex = /(<div class="marquee-track" id="marquee-track">)[\s\S]*?(<\/div>)/;
  
  if (regex.test(html)) {
    html = html.replace(regex, `$1${imagesHtml}\n        $2`);
    
    // Quitar display: none del contenedor si tiene al menos 1 imagen
    html = html.replace(/(<div class="marquee-container[^>]+)style="display:\s*none;"/, '$1');
    
    fs.writeFileSync(INDEX_HTML, html, 'utf8');
    console.log('✅ Build exitoso: index.html actualizado con testimonios dinámicos.');
  } else {
    console.error('❌ Error: No se encontró el contenedor <div class="marquee-track" id="marquee-track"> en index.html');
  }
}

buildTestimonios();
