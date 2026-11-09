/**
 * Demostración de la página sin la hoja de estilos.
 * El aviso usa estilos en línea a propósito: debe seguir visible sin CSS.
 */
import { qs, qsa } from './utils.js';

export function initSinCss() {
  const button = qs('#noCssBtn');
  if (!button) return;

  let banner = null;

  function restore() {
    for (const link of qsa('link[rel="stylesheet"]')) link.disabled = false;
    if (banner) {
      banner.remove();
      banner = null;
    }
    button.disabled = false;
  }

  function activate() {
    for (const link of qsa('link[rel="stylesheet"]')) link.disabled = true;

    banner = document.createElement('div');
    banner.id = 'noCssBanner';
    banner.setAttribute('role', 'status');
    banner.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;background:#11162b;color:#fff;padding:14px 16px;border-radius:10px;font:14px/1.5 system-ui,sans-serif;box-shadow:0 20px 40px rgba(0,0,0,.35)';

    const text = document.createElement('span');
    text.textContent = 'Así se ve el documento sin CSS. El contenido sigue en orden y se puede leer: eso significa que el HTML tiene estructura y no solo cajas.';
    banner.appendChild(text);

    const restoreButton = document.createElement('button');
    restoreButton.type = 'button';
    restoreButton.textContent = 'Restaurar estilos';
    restoreButton.style.cssText = 'border:0;border-radius:999px;padding:10px 16px;background:#fff;color:#11162b;font:inherit;font-weight:700;cursor:pointer;flex-shrink:0';
    restoreButton.addEventListener('click', restore);
    banner.appendChild(restoreButton);

    document.body.appendChild(banner);
    button.disabled = true;
  }

  button.addEventListener('click', activate);
}
