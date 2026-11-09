/**
 * Lista de comprobación previa a construir el sistema.
 */
import { qsa } from './utils.js';

export function initChecklist() {
  const inputs = qsa('.check-input');
  const bar = document.getElementById('checkBar');
  const text = document.getElementById('checkText');
  if (!inputs.length || !bar || !text) return;

  function update() {
    const done = inputs.filter((input) => input.checked).length;
    bar.style.width = (done / inputs.length * 100) + '%';
    text.textContent = done + ' / ' + inputs.length + (done === inputs.length ? ' · listo' : '');

    for (const input of inputs) {
      const label = input.closest('.check-item');
      if (label) label.classList.toggle('done', input.checked);
    }
  }

  for (const input of inputs) input.addEventListener('change', update);
  update();
}
