/**
 * Modo clase: cinco paradas guiadas para proyectar la página.
 */
import { qs } from './utils.js';

const STOPS = [
  { id: 'ruta', title: 'El plano antes del píxel' },
  { id: 'campo', title: 'Anatomía de un campo' },
  { id: 'controles', title: 'El control correcto' },
  { id: 'formularios', title: 'Malo contra bueno' },
  { id: 'reto', title: 'Encuentra los errores' },
  { id: 'quiz', title: 'Audita el banco', audit: true },
];

export function initPresentacion() {
  const fab = qs('#presentBtn');
  const menuButton = qs('#presentMenu');
  const hud = qs('#classHud');
  if (!fab || !hud) return;

  const step = qs('#hudStep');
  const title = qs('#hudTitle');
  const prev = qs('#hudPrev');
  const next = qs('#hudNext');
  const exit = qs('#hudExit');

  let active = false;
  let index = 0;

  function go(target) {
    index = Math.max(0, Math.min(STOPS.length - 1, target));
    step.textContent = 'Parada ' + (index + 1) + ' de ' + STOPS.length;
    title.textContent = STOPS[index].title;

    if (STOPS[index].audit) {
      const open = document.getElementById('auditOpen');
      if (open) open.click();
      return;
    }

    const section = document.getElementById(STOPS[index].id);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function closeMenu() {
    const menu = qs('#navLinks');
    const toggle = qs('#navToggle');
    if (menu && toggle && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  function start() {
    active = true;
    document.body.classList.add('presenting');
    document.documentElement.classList.add('presenting-root');
    fab.setAttribute('aria-pressed', 'true');
    if (menuButton) menuButton.setAttribute('aria-pressed', 'true');
    hud.hidden = false;
    closeMenu();
    go(0);
    next.focus({ preventScroll: true });
  }

  function stop() {
    active = false;
    document.body.classList.remove('presenting');
    document.documentElement.classList.remove('presenting-root');
    fab.setAttribute('aria-pressed', 'false');
    if (menuButton) menuButton.setAttribute('aria-pressed', 'false');
    hud.hidden = true;
    fab.focus({ preventScroll: true });
  }

  function toggle() {
    if (active) stop();
    else start();
  }

  fab.addEventListener('click', toggle);
  if (menuButton) menuButton.addEventListener('click', toggle);

  next.addEventListener('click', () => go(index + 1));
  prev.addEventListener('click', () => go(index - 1));
  exit.addEventListener('click', stop);

  document.addEventListener('keydown', (event) => {
    if (!active) return;
    const audit = document.getElementById('auditScreen');
    if (audit && !audit.hidden) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      go(index + 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      go(index - 1);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      go(0);
    }
    if (event.key === 'End') {
      event.preventDefault();
      go(STOPS.length - 1);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      stop();
    }
  });
}
