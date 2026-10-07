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

// Consulta (inquiry) del visor — se envia por Formspree sin salir del sitio.
const inquireLink    = document.querySelector('#lightbox-inquire');
const inquiryForm    = document.querySelector('#inquiry-form');
const inquiryStatus  = document.querySelector('#inquiry-status');
const inquirySubject = document.querySelector('#inquiry-subject');
const inquiryArtwork = document.querySelector('#inquiry-artwork');
const inquiryMessage = inquiryForm.querySelector('textarea[name="message"]');
const ARTIST_EMAIL   = 'ninfaespinozam@gmail.com';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xoejvqoj';
let currentTitle = '';

// Deja la consulta lista para una obra nueva: enlace visible, formulario
// oculto, campos reiniciados y el titulo cargado en el asunto y el mensaje.
function resetInquiry() {
  inquiryForm.reset();
  inquiryForm.hidden = true;
  inquireLink.hidden = false;
  inquiryStatus.textContent = '';
  inquiryStatus.className = 'inquiry-status';
  inquirySubject.value = 'Inquire: ' + currentTitle;
  inquiryArtwork.value = currentTitle;
  inquiryMessage.value =
    'I am interested in "' + currentTitle + '". ' +
    'Could you tell me more about its availability and price?';
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

    // La consulta solo aparece en pinturas disponibles. Se oculta en la
    // instalacion (no esta a la venta) y en las obras marcadas como vendidas.
    const isSold = work.classList.contains('sold');
    currentTitle = titleEl ? titleEl.textContent : '';
    if (currentTitle && !isSold) {
      resetInquiry();
    } else {
      inquireLink.hidden = true;
      inquiryForm.hidden = true;
      inquiryStatus.className = 'inquiry-status';
      inquiryStatus.textContent = isSold ? 'This work is sold.' : '';
    }

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';  // congela el scroll de atras
  });
});

// Al tocar "Inquire" se despliega el formulario.
inquireLink.addEventListener('click', function (event) {
  event.preventDefault();
  inquireLink.hidden = true;
  inquiryForm.hidden = false;
  const emailField = inquiryForm.querySelector('input[name="email"]');
  if (emailField) { emailField.focus(); }
});

// Enviar la consulta por Formspree (sin abrir la app de correo).
inquiryForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const btn = inquiryForm.querySelector('button[type="submit"]');
  inquiryStatus.className = 'inquiry-status';
  inquiryStatus.textContent = 'Sending…';
  if (btn) { btn.disabled = true; }

  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: new FormData(inquiryForm),
    headers: { 'Accept': 'application/json' }
  }).then(function (response) {
    if (response.ok) {
      inquiryForm.hidden = true;
      inquiryStatus.className = 'inquiry-status ok';
      inquiryStatus.textContent = 'Thank you — your message has been sent.';
    } else {
      inquiryStatus.className = 'inquiry-status err';
      inquiryStatus.textContent = 'Something went wrong. Please email ' + ARTIST_EMAIL + '.';
    }
  }).catch(function () {
    inquiryStatus.className = 'inquiry-status err';
    inquiryStatus.textContent = 'Something went wrong. Please email ' + ARTIST_EMAIL + '.';
  }).then(function () {
    if (btn) { btn.disabled = false; }
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
