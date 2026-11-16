/**
 * Reto visual: seis errores escondidos en una pantalla de ejemplo.
 */
import { qs, qsa } from './utils.js';

const ISSUES = [
  { title: 'Falta un título claro', why: '“panel de ventas” está en minúsculas y sin jerarquía: no se sabe qué es, para quién es ni cuál es el periodo.' },
  { title: 'Contraste insuficiente', why: 'La etiqueta “Cumplimiento” casi desaparece sobre el fondo. El color debe resaltar información, no esconderla.' },
  { title: 'Cuatro acciones con el mismo peso', why: 'Actualizar, Exportar, Filtrar y Ver compiten entre sí. Debe existir una acción principal y las demás, subordinadas.' },
  { title: 'Cifras sin formato ni unidades', why: '“4820” no dice moneda, separador de miles ni comparación. Los números se alinean a la derecha y llevan unidad.' },
  { title: 'Error ilegible: rojo sobre verde', why: 'Es una de las combinaciones menos legibles y, además, el mensaje no explica cómo recuperarse del fallo.' },
  { title: 'Instrucción en mayúsculas y lejos del campo', why: 'Un párrafo largo en mayúsculas se lee lento. La ayuda debe ir junto al campo que la necesita y en minúsculas.' },
];

export function initReto() {
  const list = qs('#gameList');
  const count = qs('#gameCount');
  const hotspots = qsa('.hotspot');
  if (!list || !count || !hotspots.length) return;

  let found = {};

  function render() {
    found = {};
    count.textContent = '0 / 6 encontrados';

    for (const hotspot of hotspots) {
      hotspot.classList.remove('found');
      hotspot.disabled = false;
    }

    list.innerHTML = ISSUES.map((issue, index) =>
      '<div class="game-slot" data-slot="' + index + '"><b>Punto ' + (index + 1) + ' · sin identificar</b>Toca el punto correspondiente en el panel.</div>'
    ).join('');
  }

  function reveal(index) {
    if (found[index]) return;
    found[index] = true;

    const hotspot = hotspots.find((item) => item.dataset.issue === String(index));
    if (hotspot) {
      hotspot.classList.add('found');
      hotspot.disabled = true;
    }

    const slot = list.querySelector('[data-slot="' + index + '"]');
    if (slot) {
      slot.classList.add('found');
      slot.innerHTML = '<b>Punto ' + (index + 1) + ' · ' + ISSUES[index].title + '</b>' + ISSUES[index].why;
    }

    const total = Object.keys(found).length;
    count.textContent = total + ' / 6 encontrados' + (total === 6 ? ' · ¡inspección completa!' : '');
  }

  for (const hotspot of hotspots) {
    hotspot.addEventListener('click', () => reveal(parseInt(hotspot.dataset.issue, 10)));
  }

  qs('#gameReveal').addEventListener('click', () => {
    ISSUES.forEach((_, index) => reveal(index));
  });
  qs('#gameReset').addEventListener('click', render);
  render();
}
