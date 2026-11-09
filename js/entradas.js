/**
 * Sección de entradas: recorrido de una transacción, simulador y clasificador.
 */
import { qs, qsa, formatMoney } from './utils.js';

const FLOW_DATA = {
  1: {
    title: '1. Captura de datos',
    tag: 'Origen',
    desc: 'El dato se identifica y se adquiere lo más cerca posible del momento en que ocurre: al vender, al recibir mercancía o al registrar un cliente. Puede ser un documento fuente de papel, una pantalla táctil, un lector de código de barras o una tarjeta. Capturar tarde es capturar mal.',
  },
  2: {
    title: '2. Ingreso de datos',
    tag: 'Interfaz',
    desc: 'Es traducir lo capturado a un formato legible por la computadora. Aquí entra el diseño de entrada: teclado, ratón, menús, casillas y listas. Cada control debe reducir la posibilidad de error, no aumentarla: elegir de una lista es más seguro que teclear un código libre.',
  },
  3: {
    title: '3. Validación',
    tag: 'Control',
    desc: 'El sistema comprueba campos obligatorios, formato, rangos y reglas de negocio. La guía habla de controles de edición para garantizar la exactitud. Un buen mensaje dice qué campo falló, por qué y cómo corregirlo; nunca solo “datos inválidos”.',
  },
  4: {
    title: '4. Procesamiento',
    tag: 'Cálculo',
    desc: 'Con la llave, el sistema recupera lo que ya sabe (costo, existencias, nombre del cliente), calcula totales, aplica descuentos y cruza la transacción con otras tablas. El usuario no hace estas cuentas: el sistema las hace y las muestra para confirmar.',
  },
  5: {
    title: '5. Almacenamiento y salida',
    tag: 'Persistencia',
    desc: 'El registro se guarda con su llave y sus datos variables. Inmediatamente se produce una salida: un comprobante, una confirmación en pantalla o una actualización del inventario. La salida de esta fase puede ser la entrada de la siguiente.',
  },
};

const CATALOG = {
  'ART-101': { name: 'Base para laptop', price: 18.5 },
  'ART-205': { name: 'Teclado USB', price: 32.0 },
  'ART-310': { name: 'Monitor 24"', price: 149.0 },
};

const DEFAULT_FEEDBACK = '<span>El sistema te pedirá dos datos. El costo unitario <strong>no se captura</strong>: se busca en el catálogo con la llave.</span>';

const CLASS_ITEMS = [
  { icon: '🔢', label: 'Cantidad retirada', sub: '5 unidades', type: 'variable', exp: 'Cambia en cada transacción: es un dato variable.' },
  { icon: '🏷️', label: 'ID del artículo', sub: 'ART-101', type: 'ident', exp: 'Identifica de forma única el artículo: es la llave.' },
  { icon: '💲', label: 'Costo unitario', sub: '$18,50', type: 'recovered', exp: 'Ya está en el catálogo: se recupera con la llave, no se teclea.' },
  { icon: '🧑', label: 'Nombre y teléfono del cliente', sub: 'ya registrado', type: 'recovered', exp: 'Viven en el maestro de clientes; se recuperan con su ID, no se vuelven a pedir.' },
  { icon: '🕒', label: 'Fecha y hora de la transacción', sub: '09/11/2026 08:40', type: 'variable', exp: 'Es propia de cada operación: dato variable.' },
  { icon: '📦', label: 'Descripción del artículo', sub: '"Teclado inalámbrico"', type: 'recovered', exp: 'Vive en el catálogo. Escribirla otra vez duplica datos y genera inconsistencias.' },
];

const CLASS_LABELS = { variable: 'Variable', ident: 'Identificación', recovered: 'Recuperado' };

export function initEntradas() {
  initFlowAndSimulator();
  initClassifier();
}

function initFlowAndSimulator() {
  const nodes = qsa('.flow-node');
  if (!nodes.length) return;

  const flowTitle = qs('#flowTitle');
  const flowDesc = qs('#flowDesc');
  const flowTag = qs('#flowTag');
  const feedback = qs('#simFeedback');
  let timers = [];
  let submitButton = null;

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function paintFlow(step) {
    for (const node of nodes) {
      node.classList.toggle('is-active', node.dataset.step === String(step) && !node.classList.contains('is-error'));
    }

    const data = FLOW_DATA[step];
    if (!data) return;
    flowTitle.textContent = data.title;
    flowDesc.textContent = data.desc;
    flowTag.textContent = data.tag;
  }

  function resetFlowStates() {
    for (const node of nodes) node.classList.remove('is-active', 'is-done', 'is-error');
  }

  for (const node of nodes) {
    node.addEventListener('click', () => {
      clearTimers();
      if (submitButton) submitButton.disabled = false;
      resetFlowStates();
      paintFlow(node.dataset.step);
      feedback.className = 'sim-feedback';
      feedback.innerHTML = DEFAULT_FEEDBACK;
    });
  }

  paintFlow(1);

  const form = qs('#simForm');
  if (!form) return;

  const idInput = qs('#simId');
  const qtyInput = qs('#simQty');
  submitButton = form.querySelector('button[type="submit"]');

  function setFeedback(kind, html) {
    feedback.className = 'sim-feedback ' + kind;
    feedback.innerHTML = html;
  }

  for (const button of qsa('.catalog-item')) {
    button.addEventListener('click', () => {
      idInput.value = button.dataset.id;
      idInput.removeAttribute('aria-invalid');
      idInput.focus();
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimers();
    resetFlowStates();
    submitButton.disabled = true;
    idInput.removeAttribute('aria-invalid');

    const id = idInput.value.trim().toUpperCase();
    const qty = Number(qtyInput.value);
    const item = CATALOG[id];

    if (!id) {
      idInput.setAttribute('aria-invalid', 'true');
      idInput.focus();
      paintFlow(1);
      setFeedback('err', '<span aria-hidden="true">⚠️</span><span><strong>Falta la llave.</strong> Sin el ID del artículo no se puede recuperar el costo ni registrar la transacción.</span>');
      submitButton.disabled = false;
      return;
    }

    if (!item) {
      for (const node of nodes) {
        if (node.dataset.step === '3') node.classList.add('is-error');
      }
      paintFlow(3);
      for (const node of nodes) {
        if (node.dataset.step === '3') node.classList.add('is-error');
      }
      setFeedback('err', '<span aria-hidden="true">⚠️</span><span><strong>La llave no existe en el catálogo.</strong> Prueba con <strong>ART-101</strong>, <strong>ART-205</strong> o <strong>ART-310</strong>. El sistema no inventa el costo: lo busca.</span>');
      submitButton.disabled = false;
      return;
    }

    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      paintFlow(3);
      for (const node of nodes) {
        if (node.dataset.step === '3') node.classList.add('is-error');
      }
      setFeedback('err', '<span aria-hidden="true">⚠️</span><span><strong>Cantidad fuera de rango.</strong> Debe ser un número entero entre 1 y 99. Validar en el origen evita registro basura.</span>');
      submitButton.disabled = false;
      return;
    }

    setFeedback('', '<span aria-hidden="true">⏳</span><span>Procesando <strong>' + qty + ' × ' + id + '</strong>…</span>');

    const sequence = [2, 3, 4, 5];
    sequence.forEach((step, index) => {
      timers.push(setTimeout(() => {
        resetFlowStates();
        for (const node of nodes) {
          if (parseInt(node.dataset.step, 10) < step) node.classList.add('is-done');
        }
        paintFlow(step);
      }, 350 * (index + 1)));
    });

    timers.push(setTimeout(() => {
      const total = qty * item.price;
      for (const node of nodes) {
        node.classList.add('is-done');
        node.classList.remove('is-active');
      }
      flowDesc.textContent = 'Registro guardado. La llave ' + id + ' permitió recuperar "' + item.name + '" y su costo unitario. El total se calculó en el sistema: ' + formatMoney(total) + '. La salida inmediata es la confirmación y el descuento de existencias.';
      flowTitle.textContent = '5. Almacenamiento y salida';
      flowTag.textContent = 'Listo';
      setFeedback('ok', '<span aria-hidden="true">✓</span><span><strong>Entrada registrada.</strong> ' + qty + ' × ' + item.name + ' (' + id + ') · costo recuperado ' + formatMoney(item.price) + ' · total ' + formatMoney(total) + '. Solo se capturaron dos datos: llave y cantidad.</span>');
      submitButton.disabled = false;
    }, 1800));
  });
}

function initClassifier() {
  const rows = qs('#classRows');
  if (!rows) return;

  const score = qs('#classScore');
  let solved = {};

  function render() {
    rows.innerHTML = '';
    solved = {};
    score.textContent = '0 de 6';

    CLASS_ITEMS.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'class-row';
      row.dataset.idx = index;
      row.innerHTML =
        '<div class="field-desc"><i aria-hidden="true">' + item.icon + '</i>' +
          '<span>' + item.label + '<small>' + item.sub + '</small></span></div>' +
        '<div class="class-opts">' +
          ['variable', 'ident', 'recovered'].map((type) =>
            '<button type="button" class="class-opt" data-type="' + type + '">' + CLASS_LABELS[type] + '</button>'
          ).join('') +
        '</div>';
      rows.appendChild(row);
    });
  }

  rows.addEventListener('click', (event) => {
    const button = event.target.closest('.class-opt');
    if (!button) return;

    const row = button.closest('.class-row');
    const index = parseInt(row.dataset.idx, 10);
    const item = CLASS_ITEMS[index];
    if (solved[index]) return;

    if (button.dataset.type === item.type) {
      solved[index] = true;
      row.classList.add('solved');
      row.querySelectorAll('.class-opt').forEach((option) => {
        option.disabled = true;
        option.classList.remove('wrong');
      });
      button.classList.add('correct');
      const sub = row.querySelector('.field-desc small');
      sub.textContent = item.exp;
      sub.style.color = 'var(--good)';
      const count = Object.keys(solved).length;
      score.textContent = count + ' de 6' + (count === 6 ? ' · ¡completo!' : '');
    } else {
      button.classList.add('wrong');
      setTimeout(() => button.classList.remove('wrong'), 900);
    }
  });

  qs('#classReset').addEventListener('click', render);
  render();
}
