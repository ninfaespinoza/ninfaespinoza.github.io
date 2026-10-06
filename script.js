/* ============================================================
   INTERACTIVIDAD — Ninfa Espinoza
   ============================================================
   Aqui vive lo que la pagina HACE cuando la usas:
     1. Ampliar una obra al hacerle clic
     2. Marcar en el menu la seccion que estas viendo
     3. Poner el ano actual en el pie de pagina

   Nota: "const" guarda algo con un nombre.
         document.querySelector busca un elemento del HTML.
   ============================================================ */


/* ---------- 1. VISOR DE IMAGENES (lightbox) ---------- */

// Buscamos en el HTML las piezas del visor
const lightbox  = document.querySelector('#lightbox');
const lightImg  = document.querySelector('#lightbox-img');
const lightCap  = document.querySelector('#lightbox-caption');
const closeBtn  = document.querySelector('.lightbox-close');

// Abrir: recorremos cada obra y le decimos que hacer al clic
document.querySelectorAll('.work').forEach(function (work) {
  const img = work.querySelector('img');

  img.addEventListener('click', function () {
    lightImg.src = img.src;
    lightImg.alt = img.alt;

    // Armamos el texto de abajo con el titulo y los datos.
    // Algunas figuras (la instalacion) no tienen h3 o meta, asi que
    // revisamos que existan antes de usarlos.
    const titleEl = work.querySelector('h3');
    const metaEl  = work.querySelector('.work-meta');
    let cap = titleEl ? titleEl.textContent : '';
    if (metaEl) { cap += (cap ? ' — ' : '') + metaEl.textContent; }
    lightCap.textContent = cap;

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';  // congela el scroll de atras
  });
});

// Cerrar: una sola funcion que reutilizamos en los tres casos
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';  // devuelve el scroll
}

closeBtn.addEventListener('click', closeLightbox);

// Clic en el fondo negro (pero no sobre la imagen) tambien cierra
lightbox.addEventListener('click', function (event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// La tecla Escape cierra
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !lightbox.hidden) {
    closeLightbox();
  }
});


/* ---------- 2. MENU QUE SIGUE TU SCROLL ---------- */
/* Subraya en el menu el nombre de la seccion que estas viendo.
   IntersectionObserver avisa cuando una seccion entra en pantalla. */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.site-header nav a');

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (link) {
        const isCurrent = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', isCurrent);
      });
    }
  });
}, {
  // Se activa cuando la seccion cruza la franja media de la pantalla
  rootMargin: '-45% 0px -50% 0px'
});

sections.forEach(function (section) {
  observer.observe(section);
});


/* ---------- 3. ANO AUTOMATICO EN EL PIE ---------- */
/* Asi el "© 2026" se actualiza solo cada ano nuevo. */

document.querySelector('#year').textContent = new Date().getFullYear();
