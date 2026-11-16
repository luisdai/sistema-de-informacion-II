/**
 * Utilidades compartidas por los módulos de la guía.
 */

/** Devuelve el primer elemento que coincide con el selector. */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/** Devuelve todos los elementos que coinciden con el selector, como arreglo. */
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/** Formatea un número como importe con dos decimales y separador local. */
export function formatMoney(value) {
  return '$' + Number(value).toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formatea un número con separador de miles. */
export function formatNumber(value) {
  return Number(value).toLocaleString('es-ES');
}

/** Limita un valor numérico a un rango cerrado. */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
