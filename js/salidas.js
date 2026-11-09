/**
 * Sección de salidas: reporte comparativo y recomendador del método de salida.
 */
import { qs, formatMoney, formatNumber } from './utils.js';

const SALES = [
  { name: 'Marta Sosa', initials: 'MS', zone: 'Centro', ventas: 3750, meta: 3500, code: 'V-03' },
  { name: 'Ana Ruiz', initials: 'AR', zone: 'Norte', ventas: 4820, meta: 5000, code: 'V-01' },
  { name: 'Luis Prado', initials: 'LP', zone: 'Sur', ventas: 3910, meta: 4500, code: 'V-02' },
  { name: 'Diego Paz', initials: 'DP', zone: 'Este', ventas: 2100, meta: 4000, code: 'V-04' },
];

export function initSalidas() {
  initReport();
  initMethod();
}

function initReport() {
  const stage = qs('#reportStage');
  const badButton = qs('#reportBadBtn');
  const goodButton = qs('#reportGoodBtn');
  if (!stage || !badButton || !goodButton) return;

  function buildBadReport() {
    const rows = SALES.map((sale) =>
      '<tr><td>' + sale.name + '</td><td>' + sale.zone + '</td><td>' + sale.code + '</td><td>' + formatNumber(sale.ventas) + '</td><td>' + formatNumber(sale.meta) + '</td><td>' + Math.round(sale.ventas / sale.meta * 100) + '</td><td>ok</td><td>' + formatNumber(Math.round(sale.ventas * 0.05)) + '</td></tr>'
    ).join('');

    stage.className = 'report-stage bad';
    stage.innerHTML =
      '<div class="r-head">reporte de ventas — octubre</div>' +
      '<div class="r-para">A continuación se presentan los datos correspondientes al período indicado, los cuales deberán ser revisados por el departamento encargado antes de su distribución a las demás áreas de la organización. <span class="r-stamp">confidencial</span></div>' +
      '<table class="r-table"><thead><tr><th>vendedor</th><th>zona</th><th>cod</th><th>ventas</th><th>meta</th><th>%</th><th>estado</th><th>com</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="r-foot">página 1 de 1 — generado por el sistema — no modificar</div>';
  }

  function buildGoodReport() {
    const sorted = SALES.slice().sort((a, b) => b.ventas - a.ventas);
    const rows = sorted.map((sale) => {
      const percent = Math.round(sale.ventas / sale.meta * 100);
      const level = percent >= 100 ? '' : (percent < 60 ? ' crit' : ' low');
      const tag = percent >= 100
        ? '<span class="tag good">Sobre meta</span>'
        : (percent < 60 ? '<span class="tag bad">Crítico</span>' : '<span class="tag amber">Atención</span>');

      return '<tr>' +
        '<td><span class="who"><span class="avatar">' + sale.initials + '</span>' + sale.name + '</span></td>' +
        '<td>' + sale.zone + '</td>' +
        '<td class="num">' + formatMoney(sale.ventas) + '</td>' +
        '<td class="num">' + formatMoney(sale.meta) + '</td>' +
        '<td><span class="bar-wrap"><span class="bar-bg"><span class="bar-fg' + level + '" style="display:block;width:' + Math.min(percent, 100) + '%"></span></span><span class="pct' + (level === ' crit' ? ' crit' : '') + '">' + percent + '%</span></span></td>' +
        '<td class="num">' + tag + '</td>' +
      '</tr>';
    }).join('');

    stage.className = 'report-stage good';
    stage.innerHTML =
      '<div class="r-top"><div><span class="tag">Octubre 2026</span><h3>Ventas por vendedor</h3><p>Meta mensual ' + formatMoney(17000) + ' · 4 vendedores · actualizado 09/11/2026 08:40</p></div><span class="tag good">Listo para decidir</span></div>' +
      '<div class="kpis">' +
        '<div class="kpi"><div class="k-label">Ventas del mes</div><div class="k-value">' + formatMoney(14580) + '</div><div class="k-delta up">▲ 8,4% vs. septiembre</div></div>' +
        '<div class="kpi"><div class="k-label">Cumplimiento de meta</div><div class="k-value">86%</div><div class="k-delta warn">Faltan ' + formatMoney(2420) + '</div></div>' +
        '<div class="kpi"><div class="k-label">Mejor cumplimiento</div><div class="k-value">107%</div><div class="k-delta up">Marta Sosa · Centro</div></div>' +
      '</div>' +
      '<table class="r-table-good"><thead><tr><th>Vendedor</th><th>Zona</th><th style="text-align:right">Ventas</th><th style="text-align:right">Meta</th><th>Cumplimiento</th><th style="text-align:right">Estado</th></tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td colspan="2">Total</td><td class="num">' + formatMoney(14580) + '</td><td class="num">' + formatMoney(17000) + '</td><td>86%</td><td></td></tr></tfoot></table>' +
      '<div class="r-foot-good"><span>Fuente: ventas_mensuales · 4 de 4 vendedores</span><span>Unidades: USD · Corte: 31/10/2026</span></div>';
  }

  badButton.addEventListener('click', () => {
    badButton.setAttribute('aria-pressed', 'true');
    goodButton.setAttribute('aria-pressed', 'false');
    buildBadReport();
  });

  goodButton.addEventListener('click', () => {
    goodButton.setAttribute('aria-pressed', 'true');
    badButton.setAttribute('aria-pressed', 'false');
    buildGoodReport();
  });

  buildBadReport();
}

function initMethod() {
  const who = qs('#mWho');
  const need = qs('#mNeed');
  const freq = qs('#mFreq');
  const result = qs('#methodResult');
  if (!who || !need || !freq || !result) return;

  function updateMethod() {
    let title = '';
    let text = '';
    let icon = '💡';

    if (need.value === 'legal') {
      icon = '🖨️';
      title = 'Documento impreso controlado (o PDF firmado equivalente)';
      text = 'Una norma exige el formato y su conservación. La guía recuerda que la ley puede dictar la tecnología de salida: no la sustituyas por una pantalla. Diseña el formulario pensando en que debe imprimirse y archivarse correctamente.';
    } else if (who.value === 'externo') {
      icon = '🌐';
      title = 'Documento web o PDF descargable';
      text = 'Va hacia clientes o proveedores, probablemente muchos y en distintos lugares. Un documento web con el logotipo y los colores de la empresa llega a todos y cada quien decide si lo imprime. Para un comprobante puntual, la factura impresa sigue siendo válida.';
    } else if (freq.value === 'diaria') {
      icon = '🖥️';
      title = 'Salida en pantalla (panel en línea)';
      text = 'Se consulta con urgencia y muchas veces al día. La pantalla en línea permite ver el dato actualizado, filtrar y actuar. Complementa con exportación a PDF solo cuando alguien necesite archivar.';
    } else if (freq.value === 'ocasional') {
      icon = '📄';
      title = 'Reporte bajo demanda (pantalla o PDF)';
      text = 'Pocos usuarios y baja frecuencia. No hace falta imprimir por defecto ni mantener un panel permanente: genera el reporte cuando se pida, con filtros claros y fecha de corte. Revisa si conviene conservarlo por normativa.';
    } else {
      icon = '📊';
      title = 'Reporte periódico en pantalla, con opción de imprimir';
      text = 'Uso interno y frecuencia semanal o mensual. Preséntalo en pantalla con resumen primero y detalle después; ofrece impresión o PDF para juntas. La guía insiste en no producir más papel del necesario.';
    }

    result.innerHTML = '<span class="mr-ic" aria-hidden="true">' + icon + '</span><div><h4>' + title + '</h4><p>' + text + '</p></div>';
  }

  for (const select of [who, need, freq]) select.addEventListener('change', updateMethod);
  qs('#mCalc').addEventListener('click', updateMethod);
  updateMethod();
}
