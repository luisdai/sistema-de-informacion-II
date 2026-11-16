/**
 * Anatomía de un campo: partes, estados e inspector de atributos.
 */
import { qs, qsa } from './utils.js';

const PARTS = {
  label: {
    title: 'La etiqueta',
    body: 'Se lee antes del control y debe estar siempre visible. El placeholder puede imitar una etiqueta, pero desaparece cuando la persona escribe; por eso no lo reemplaza. La etiqueta además es el nombre accesible del campo.',
  },
  control: {
    title: 'El control',
    body: 'El tipo correcto activa el teclado adecuado, la validación nativa y el autocompletado. Un correo se escribe distinto que un teléfono o una fecha. Elegir mal el control obliga a validar a mano lo que el navegador ya sabía hacer.',
  },
  hint: {
    title: 'La ayuda',
    body: 'Explica el formato o para qué se usa el dato antes de que la persona falle. Va entre la etiqueta y el control, o justo debajo. Debe ser breve y no repetir la etiqueta.',
  },
  error: {
    title: 'El error',
    body: 'Aparece junto al campo, dice qué pasó y cómo corregirlo. No se muestra con una alerta global ni en otro idioma. El campo se marca con aria-invalid y el mensaje se asocia con aria-describedby.',
  },
  required: {
    title: 'Lo obligatorio',
    body: 'Se marca de forma explícita y se explica al inicio del formulario. El asterisco solo no basta: las personas con lectores de pantalla necesitan el atributo required y un texto que lo indique.',
  },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SNIPPET = `<div class="df-row">
  <label class="df-label" for="dfEmail">
    Correo corporativo <span class="req">*</span>
  </label>
  <input class="df-input" id="dfEmail" name="email" type="email"
         placeholder="nombre@empresa.com"
         autocomplete="email" required
         aria-required="true"
         aria-describedby="dfHint dfError">
  <span class="df-hint" id="dfHint">
    Lo usamos para enviarte el comprobante.
  </span>
  <span class="df-error" id="dfError">
    Escribe un correo con el formato nombre@empresa.com.
  </span>
</div>`;

export function initCampo() {
  const form = qs('#demoField');
  if (!form) return;

  const input = qs('#dfEmail');
  const error = qs('#dfError');
  const message = qs('#dfMsg');
  const inspector = qs('#fieldInspector');
  const title = qs('#partTitle');
  const body = qs('#partBody');
  const snippet = qs('#fieldSnippet');

  if (snippet) snippet.textContent = SNIPPET;

  function renderInspector() {
    if (!inspector) return;
    const rows = [
      ['type', input.type],
      ['name', input.name],
      ['id', input.id],
      ['autocomplete', input.getAttribute('autocomplete')],
      ['required', input.required ? 'sí' : 'no'],
      ['aria-describedby', input.getAttribute('aria-describedby')],
      ['aria-invalid', input.getAttribute('aria-invalid') || 'no'],
    ];
    inspector.innerHTML =
      '<div class="inspector-title">Lo que ve el navegador</div>' +
      '<div class="inspector-list">' +
      rows.map(([key, value]) => '<div><code>' + key + '</code><span>' + value + '</span></div>').join('') +
      '</div>';
  }

  function setState(state) {
    form.classList.remove('is-error', 'is-ok');
    message.className = 'df-msg';
    message.textContent = '';
    input.removeAttribute('aria-invalid');

    for (const chip of qsa('.state-row .chip')) {
      chip.classList.toggle('is-active', chip.dataset.state === state);
    }

    if (state === 'error') {
      form.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');
      error.textContent = 'Escribe un correo con el formato nombre@empresa.com.';
    }

    if (state === 'ok') {
      form.classList.add('is-ok');
      input.setAttribute('aria-invalid', 'false');
      message.className = 'df-msg ok show';
      message.textContent = 'Se ve bien. El campo tiene etiqueta, tipo correcto, ayuda y un mensaje de error asociado.';
    }

    renderInspector();
  }

  function validate() {
    const valid = EMAIL_PATTERN.test(input.value.trim());
    if (valid) {
      setState('ok');
      return;
    }

    setState('error');
    message.className = 'df-msg err show';
    message.textContent = 'El correo no tiene el formato esperado. El mensaje está junto al campo y el foco vuelve a él.';
    input.focus();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    validate();
  });

  input.addEventListener('input', () => {
    form.classList.remove('is-error', 'is-ok');
    message.className = 'df-msg';
    message.textContent = '';
    input.removeAttribute('aria-invalid');
    renderInspector();
  });

  input.addEventListener('focus', renderInspector);
  input.addEventListener('blur', renderInspector);

  for (const chip of qsa('.state-row .chip')) {
    chip.addEventListener('click', () => {
      if (chip.dataset.state === 'normal') {
        setState('normal');
        return;
      }
      if (chip.dataset.state === 'error') {
        setState('error');
        return;
      }
      input.value = 'ana.ruiz@empresa.com';
      setState('ok');
    });
  }

  for (const button of qsa('.part')) {
    button.addEventListener('click', () => {
      const part = button.dataset.part;
      for (const other of qsa('.part')) other.classList.toggle('is-active', other === button);
      for (const marked of qsa('[data-part]')) {
        marked.classList.toggle('is-highlight', marked.dataset.part === part);
      }
      const data = PARTS[part];
      if (!data) return;
      title.textContent = data.title;
      body.textContent = data.body;
      if (part === 'control') input.focus();
    });
  }

  setState('normal');
  renderInspector();
}
