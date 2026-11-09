/**
 * Rúbrica de diez criterios con puntaje 0 a 2 y persistencia local.
 */
import { qs } from './utils.js';
import { load, save } from './storage.js';

const CRITERIA = [
  { title: 'Definí qué datos son variables, cuáles identifican y cuáles se recuperan.', hint: 'La llave no se teclea si el sistema puede deducirla.' },
  { title: 'Cada campo tiene etiqueta visible y un ejemplo de formato.', hint: 'El placeholder acompaña; nunca reemplaza a la etiqueta.' },
  { title: 'Los campos obligatorios están marcados y explicados.', hint: 'El asterisco viaja con el atributo required y un texto que lo explique.' },
  { title: 'La validación dice qué corregir y aparece junto al campo.', hint: 'No uses una alerta global para un error de un campo.' },
  { title: 'Hay una sola acción primaria por pantalla.', hint: 'El resto son secundarias o terciarias, con menos peso visual.' },
  { title: 'La pantalla respeta encabezado, cuerpo, mensajes y ayuda.', hint: 'La explicación va en la zona superior izquierda.' },
  { title: 'La salida tiene título, periodo, unidades y totales.', hint: 'Sin esos datos, el reporte obliga a hacer cuentas aparte.' },
  { title: 'Eliminé columnas y datos que nadie usa para decidir.', hint: 'Cada columna cuesta lectura; si no cambia una decisión, sobra.' },
  { title: 'El login oculta la contraseña y no revela si la cuenta existe.', hint: 'El mensaje de error debe ser genérico.' },
  { title: 'Probé el flujo con una persona real antes de programarlo.', hint: 'Observar a alguien usarlo vale más que preguntar si le gusta.' },
];

const STORAGE_KEY = 'rubrica';

export function initRubrica() {
  const list = qs('#rubricList');
  const bar = qs('#checkBar');
  const text = qs('#checkText');
  if (!list || !bar || !text) return;

  let scores = load(STORAGE_KEY, []);

  function total() {
    return scores.reduce((sum, value) => sum + (value || 0), 0);
  }

  function render() {
    list.innerHTML = CRITERIA.map((criterion, index) => {
      const value = scores[index] ?? null;
      const levels = [0, 1, 2].map((level) =>
        '<button type="button" class="rubric-btn' + (value === level ? ' is-active' : '') + '" data-index="' + index + '" data-value="' + level + '" aria-pressed="' + (value === level) + '">' + level + '</button>'
      ).join('');

      return '<div class="rubric-item' + (value !== null ? ' is-done' : '') + '" data-item="' + index + '">' +
        '<div class="rubric-top"><span class="rubric-title">' + (index + 1) + '. ' + criterion.title + '</span>' +
        '<span class="rubric-score">' + (value === null ? '—' : value + '/2') + '</span></div>' +
        '<div class="rubric-levels" role="group" aria-label="Puntaje del criterio ' + (index + 1) + '">' + levels + '</div>' +
      '</div>';
    }).join('');

    update();
  }

  function update() {
    const done = scores.filter((value) => typeof value === 'number').length;
    const points = total();
    bar.style.width = (points / (CRITERIA.length * 2) * 100) + '%';
    text.textContent = points + ' / ' + (CRITERIA.length * 2) + (done === CRITERIA.length ? ' · completa' : '');
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('.rubric-btn');
    if (!button) return;
    const index = Number(button.dataset.index);
    const value = Number(button.dataset.value);
    scores[index] = scores[index] === value ? null : value;
    save(STORAGE_KEY, scores);
    render();
  });

  function report() {
    const lines = CRITERIA.map((criterion, index) => {
      const value = scores[index];
      return (index + 1) + '. ' + criterion.title + ' — ' + (value === undefined || value === null ? 'sin evaluar' : value + '/2');
    });
    return 'Rúbrica del formulario\nTotal: ' + total() + ' / ' + (CRITERIA.length * 2) + '\n\n' + lines.join('\n');
  }

  qs('#rubricCopy').addEventListener('click', async () => {
    const button = qs('#rubricCopy');
    try {
      await navigator.clipboard.writeText(report());
      button.textContent = 'Copiado';
    } catch {
      button.textContent = 'No se pudo copiar';
    }
    setTimeout(() => {
      button.textContent = 'Copiar resultado';
    }, 1800);
  });

  qs('#rubricPrint').addEventListener('click', () => window.print());

  qs('#rubricReset').addEventListener('click', () => {
    scores = [];
    save(STORAGE_KEY, scores);
    render();
  });

  render();
}
