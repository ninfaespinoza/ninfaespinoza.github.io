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

// Enlace "Inquire" del visor
const inquireLink  = document.querySelector('#lightbox-inquire');
const ARTIST_EMAIL = 'ninfaespinozam@gmail.com';

// Arma el enlace mailto para una obra: asunto con el titulo y un
// mensaje por defecto que el visitante puede editar antes de enviar.
function buildInquireHref(title) {
  const subject = 'Inquire: ' + title;
  const body =
    'Hello Ninfa,\n\n' +
    'I am interested in "' + title + '". ' +
    'Could you tell me more about its availability and price?\n\n' +
    'Thank you.';
  return 'mailto:' + ARTIST_EMAIL +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);
}

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

    // El enlace "Inquire" solo aparece en obras con titulo (las pinturas).
    // La instalacion no tiene titulo por figura y no esta a la venta,
    // asi que ahi lo ocultamos.
    if (titleEl) {
      inquireLink.href = buildInquireHref(titleEl.textContent);
      inquireLink.hidden = false;
    } else {
      inquireLink.hidden = true;
    }

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

// Clic en el fondo (pero no sobre la obra ni el panel) tambien cierra
lightbox.addEventListener('click', function (event) {
  if (event.target === lightbox ||
      event.target.classList.contains('lightbox-content') ||
      event.target.classList.contains('lightbox-stage')) {
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
