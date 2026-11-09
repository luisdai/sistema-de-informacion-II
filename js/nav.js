/**
 * Barra de progreso y resaltado de la sección visible en la navegación.
 */
import { qs, qsa, clamp } from './utils.js';

const SECTION_IDS = [
  'ruta',
  'entradas',
  'pantalla',
  'formularios',
  'campo',
  'controles',
  'validacion',
  'salidas',
  'uxui',
  'login',
  'reto',
  'quiz',
  'herramientas',
];

// Las secciones nuevas de formularios se agrupan bajo el mismo enlace.
const NAV_GROUP = { campo: 'formularios', controles: 'formularios', validacion: 'formularios' };

export function initNav() {
  const progressBar = qs('#progressBar');
  if (!progressBar) return;

  const navLinks = qsa('#navLinks a');
  const menu = qs('#navLinks');
  const toggle = qs('#navToggle');

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de secciones' : 'Abrir menú de secciones');
  }

  if (menu && toggle) {
    toggle.addEventListener('click', () => {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.nav')) setMenu(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = clamp(percent, 0, 100) + '%';

    let current = '';
    for (const id of SECTION_IDS) {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= 150) current = id;
    }

    for (const link of navLinks) {
      const active = link.getAttribute('href') === '#' + (NAV_GROUP[current] || current);
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
