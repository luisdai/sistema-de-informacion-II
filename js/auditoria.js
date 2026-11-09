/**
 * Auditoría del formulario bancario.
 * Diez afirmaciones: siete describen problemas reales y tres son buenas prácticas.
 * Al enviar se calcula cobertura y precisión, y se explica cada ítem.
 */
import { qs, qsa } from './utils.js';
import { load, save } from './storage.js';

const STORAGE_KEY = 'auditoria';

const ITEMS = [
  {
    id: 'placeholder',
    issue: true,
    text: 'Los campos usan el placeholder como etiqueta; no hay etiqueta visible.',
    exp: 'Sin etiqueta, el placeholder desaparece al escribir y el campo se queda sin nombre. La etiqueta va arriba y siempre visible.',
  },
  {
    id: 'cuenta-origen',
    issue: true,
    text: 'Se pide de nuevo la cuenta de origen, que el banco ya conoce.',
    exp: 'El banco ya sabe cuál es tu cuenta de origen. Pedirla otra vez es trabajo doble y una fuente de errores.',
  },
  {
    id: 'recuperar',
    issue: false,
    text: 'Hay un enlace visible para recuperar la contraseña.',
    exp: 'El enlace de recuperación está visible y es una buena práctica. No era un problema.',
  },
  {
    id: 'monto',
    issue: true,
    text: 'El monto se captura como texto libre y no muestra moneda ni separador.',
    exp: 'Un monto lleva moneda, separador de miles y decimales. En texto libre, 10000 y 10.000 no se leen igual.',
  },
  {
    id: 'botones',
    issue: true,
    text: 'Aceptar y Limpiar, Confirmar y Cancelar, todos tienen el mismo peso.',
    exp: 'Dos acciones con el mismo peso no dicen cuál es la principal. Confirmar debe destacar; cancelar no compite.',
  },
  {
    id: 'conexion',
    issue: false,
    text: 'La pantalla indica que la conexión es segura.',
    exp: 'Comunicar que la conexión es segura es correcto. No era un problema.',
  },
  {
    id: 'error',
    issue: true,
    text: 'El mensaje de error confirma si el usuario existe.',
    exp: 'El mensaje confirma que la cuenta existe y le sirve la información a un atacante. Debe ser genérico.',
  },
  {
    id: 'mayusculas',
    issue: true,
    text: 'La advertencia importante va en mayúsculas y lejos de los campos.',
    exp: 'Un párrafo en mayúsculas se lee lento. La advertencia va junto al campo y en minúsculas.',
  },
  {
    id: 'titular',
    issue: false,
    text: 'El nombre del titular aparece precargado.',
    exp: 'El titular precargado evita teclear lo que el banco ya sabe. No era un problema.',
  },
  {
    id: 'contraste',
    issue: true,
    text: 'El texto de ayuda casi no se lee por el contraste.',
    exp: 'El gris claro sobre blanco no alcanza el contraste mínimo. La ayuda debe leerse sin esfuerzo.',
  },
];

export function initAuditoria() {
  const openButton = qs('#auditOpen');
  const screen = qs('#auditScreen');
  const closeButton = qs('#auditClose');
  const list = qs('#auditList');
  const submit = qs('#auditSubmit');
  const reset = qs('#auditReset');
  const result = qs('#auditResult');
  if (!openButton || !screen || !closeButton || !list || !submit || !reset || !result) return;

  let selected = new Set();
  let done = false;
  let lastFocus = null;

  function persist() {
    save(STORAGE_KEY, { selected: Array.from(selected), done });
  }

  function stateFor(item) {
    const checked = selected.has(item.id);
    if (item.issue && checked) return { state: 'is-correct', label: 'Encontrado' };
    if (item.issue) return { state: 'is-missed', label: 'Se te pasó' };
    if (checked) return { state: 'is-wrong', label: 'Falso positivo' };
    return { state: 'is-correct', label: 'Correcto' };
  }

  function renderList() {
    list.innerHTML = ITEMS.map((item) => {
      const checked = selected.has(item.id);
      const extra = done ? stateFor(item) : { state: checked ? 'is-checked' : '', label: '' };
      const mark = done ? '<span class="ai-state">' + extra.label + '</span>' : '';

      return '<label class="audit-item ' + extra.state + '" data-id="' + item.id + '">' +
        '<input type="checkbox" data-id="' + item.id + '"' + (checked ? ' checked' : '') + (done ? ' disabled' : '') + '>' +
        '<span>' + item.text + '</span>' + mark +
      '</label>';
    }).join('');
  }

  function renderResult() {
    const found = ITEMS.filter((item) => item.issue && selected.has(item.id));
    const wrong = ITEMS.filter((item) => !item.issue && selected.has(item.id));
    const score = Math.max(0, found.length - wrong.length);

    let level = 'bad';
    let verdict = 'Hay que repasar los criterios.';
    if (found.length === 7 && wrong.length === 0) {
      level = 'good';
      verdict = 'Auditoría impecable.';
    } else if (found.length >= 5 && wrong.length <= 1) {
      level = 'good';
      verdict = 'Buen ojo. Se te escaparon detalles.';
    } else if (found.length >= 3) {
      level = 'mid';
      verdict = 'Vas por buen camino, pero hay problemas que se te pasaron.';
    }

    const plural = wrong.length === 1 ? 'cosa que estaba bien' : 'cosas que estaban bien';
    const review = ITEMS.map((item) => {
      const info = stateFor(item);
      return '<div class="audit-review-item ' + info.state.replace('is-', '') + '">' +
        '<b>' + info.label + ' · ' + item.text + '</b><span>' + item.exp + '</span></div>';
    }).join('');

    result.innerHTML =
      '<div class="audit-verdict ' + level + '">' +
        '<span class="audit-score">' + score + ' / 7</span>' +
        '<div><b>' + verdict + '</b><p>Encontraste ' + found.length + ' de 7 problemas y marcaste ' + wrong.length + ' ' + plural + '.</p></div>' +
      '</div>' +
      '<div class="audit-review">' + review + '</div>';

    result.tabIndex = -1;
    result.focus({ preventScroll: true });
  }

  function open() {
    const stored = load(STORAGE_KEY, { selected: [], done: false });
    selected = new Set(Array.isArray(stored.selected) ? stored.selected : []);
    done = Boolean(stored.done);

    lastFocus = document.activeElement;
    screen.hidden = false;
    document.body.classList.add('auditing');
    renderList();

    if (done) {
      renderResult();
      submit.hidden = true;
      reset.hidden = false;
    } else {
      result.innerHTML = '';
      submit.hidden = false;
      reset.hidden = true;
    }

    closeButton.focus({ preventScroll: true });
  }

  function close() {
    screen.hidden = true;
    document.body.classList.remove('auditing');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  }

  function submitResult() {
    done = true;
    persist();
    renderList();
    renderResult();
    submit.hidden = true;
    reset.hidden = false;
  }

  function restart() {
    selected = new Set();
    done = false;
    persist();
    result.innerHTML = '';
    renderList();
    submit.hidden = false;
    reset.hidden = true;
    const first = list.querySelector('input');
    if (first) first.focus();
  }

  list.addEventListener('change', (event) => {
    const input = event.target.closest('input[type="checkbox"]');
    if (!input || done) return;
    const id = input.dataset.id;
    if (input.checked) selected.add(id);
    else selected.delete(id);
    input.closest('.audit-item').classList.toggle('is-checked', input.checked);
    persist();
  });

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  submit.addEventListener('click', submitResult);
  reset.addEventListener('click', restart);

  document.addEventListener('keydown', (event) => {
    if (screen.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusables = qsa('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', screen)
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.offsetWidth > 0);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
