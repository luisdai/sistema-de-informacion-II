/**
 * Sección de UX y UI: demostración de la pantalla sin capa visual.
 */
import { qs } from './utils.js';

export function initUxUi() {
  const toggle = qs('#stripToggle');
  const card = qs('#demoCard');
  if (!toggle || !card) return;

  toggle.addEventListener('change', () => {
    card.classList.toggle('is-stripped', toggle.checked);
  });
}
