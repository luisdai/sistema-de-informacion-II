/**
 * Laboratorio de formularios: validación del formulario con jerarquía y
 * mensaje genérico del formulario sin jerarquía.
 */
import { qs } from './utils.js';

export function initFormularios() {
  initGoodForm();
  initBadForm();
}

function initGoodForm() {
  const form = qs('#goodForm');
  if (!form) return;

  const name = qs('#goodName');
  const email = qs('#goodEmail');
  const qty = qs('#goodQty');
  const message = qs('#goodFormMsg');

  function setFieldState(fieldId, ok) {
    const field = document.getElementById(fieldId);
    field.classList.toggle('invalid', !ok);
    field.classList.toggle('valid', ok);
    const input = field.querySelector('input');
    if (input) input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  }

  function validate() {
    const nameOK = name.value.trim().length >= 3;
    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const parsed = Number(qty.value);
    const qtyOK = Number.isInteger(parsed) && parsed >= 1 && parsed <= 99;

    setFieldState('fName', nameOK);
    setFieldState('fEmail', emailOK);
    setFieldState('fQty', qtyOK);

    return {
      ok: nameOK && emailOK && qtyOK,
      name: name.value.trim(),
      qty: parsed,
      first: !nameOK ? name : (!emailOK ? email : (!qtyOK ? qty : null)),
    };
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = validate();

    if (!result.ok) {
      message.className = 'form-msg err show';
      message.textContent = 'Revisa los campos marcados: el mensaje te dice exactamente qué corregir.';
      if (result.first) result.first.focus();
      return;
    }

    message.className = 'form-msg ok show';
    message.textContent = '✓ Entrada registrada: ' + result.name + ' · ' + result.qty + ' unidad(es). El costo se recuperó del catálogo; no se pidió al usuario.';
    name.value = '';
    email.value = '';
    qty.value = '1';

    for (const id of ['fName', 'fEmail', 'fQty']) {
      document.getElementById(id).classList.remove('valid', 'invalid');
    }
  });

  for (const id of ['goodName', 'goodEmail', 'goodQty']) {
    document.getElementById(id).addEventListener('input', function onInput() {
      const field = this.closest('.field');
      field.classList.remove('invalid', 'valid');
      this.setAttribute('aria-invalid', 'false');
      message.className = 'form-msg';
    });
  }

  qs('#goodClear').addEventListener('click', () => {
    form.reset();
    qty.value = '1';
    for (const id of ['fName', 'fEmail', 'fQty']) {
      document.getElementById(id).classList.remove('valid', 'invalid');
    }
    message.className = 'form-msg';
  });
}

function initBadForm() {
  const form = qs('#badForm');
  if (!form) return;

  const message = qs('#badFormMsg');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = 'Error: no se pudo guardar. Verifique los datos e intente de nuevo.';
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      message.textContent = '';
    }, 0);
  });
}
