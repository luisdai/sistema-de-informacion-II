/**
 * Acceso a localStorage con clave del proyecto y manejo de errores.
 * En modo privado o con el almacenamiento lleno, la página sigue funcionando.
 */

const PREFIX = 'sii:';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
