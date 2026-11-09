/**
 * Barra de progreso y resaltado de la sección visible en la navegación.
 */
import { qs, qsa, clamp } from './utils.js';

const SECTION_IDS = [
  'ruta',
  'entradas',
  'pantalla',
  'formularios',
  'salidas',
  'uxui',
  'login',
  'reto',
  'quiz',
];

export function initNav() {
  const progressBar = qs('#progressBar');
  if (!progressBar) return;

  const navLinks = qsa('#navLinks a');

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
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
