/**
 * Validación en tres capas: navegador, aplicación y servidor.
 */
import { qs } from './utils.js';

const CATALOG = ['ART-101', 'ART-205', 'ART-310'];

export function initValidacion() {
  const form = qs('#valForm');
  if (!form) return;

  const code = qs('#valCode');
  const qty = qs('#valQty');
  const log = qs('#valLog');
  const payload = qs('#valPayload');
  const browserState = qs('#layerBrowser');
  const appState = qs('#layerApp');
  const serverState = qs('#layerServer');

  const layers = {
    browser: qs('[data-layer="browser"]'),
    app: qs('[data-layer="app"]'),
    server: qs('[data-layer="server"]'),
  };

  function resetLayers() {
    for (const key of Object.keys(layers)) {
      layers[key].classList.remove('is-ok', 'is-fail', 'is-skip');
    }
    browserState.textContent = 'Pendiente';
    appState.textContent = 'Pendiente';
    serverState.textContent = 'Pendiente';
    log.innerHTML = '';
  }

  function mark(key, result) {
    layers[key].classList.remove('is-ok', 'is-fail', 'is-skip');
    const label = { ok: 'Pasó', fail: 'Falló', skip: 'Saltada' }[result];
    layers[key].classList.add('is-' + (result === 'ok' ? 'ok' : result === 'fail' ? 'fail' : 'skip'));
    const target = key === 'browser' ? browserState : key === 'app' ? appState : serverState;
    target.textContent = label;
    addLog(key, result);
  }

  function addLog(key, result) {
    const names = { browser: 'Navegador', app: 'Aplicación', server: 'Servidor' };
    const texts = {
      ok: 'revisó el dato y lo dejó pasar',
      fail: 'rechazó el envío',
      skip: 'no se ejecutó',
    };
    const row = document.createElement('div');
    row.className = 'val-row ' + result;
    row.textContent = names[key] + ': ' + texts[result];
    log.appendChild(row);
  }

  function browserPasses() {
    return code.validity.valid && qty.validity.valid;
  }

  function appPasses() {
    const codeValue = code.value.trim().toUpperCase();
    const quantity = Number(qty.value);
    return /^ART-[0-9]{3}$/.test(codeValue) && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
  }

  function serverPasses() {
    const codeValue = code.value.trim().toUpperCase();
    const quantity = Number(qty.value);
    const valid = /^ART-[0-9]{3}$/.test(codeValue) &&
      Number.isInteger(quantity) && quantity >= 1 && quantity <= 99 &&
      CATALOG.includes(codeValue);
    return { valid, code: codeValue, qty: quantity };
  }

  function renderPayload(payloadValue, response) {
    payload.textContent = 'Enviado:  ' + JSON.stringify(payloadValue) + '\nRespuesta: ' + JSON.stringify(response);
  }

  function send(useBrowser, useApp) {
    resetLayers();
    const codeValue = code.value.trim().toUpperCase();
    const quantity = Number(qty.value);
    const body = { code: codeValue, qty: quantity };

    if (useBrowser) {
      if (!browserPasses()) {
        mark('browser', 'fail');
        mark('app', 'skip');
        mark('server', 'skip');
        renderPayload(body, { status: 400, error: 'El navegador detuvo el envío.' });
        return;
      }
      mark('browser', 'ok');
    } else {
      mark('browser', 'skip');
    }

    if (useApp) {
      if (!appPasses()) {
        mark('app', 'fail');
        mark('server', 'skip');
        renderPayload(body, { status: 400, error: 'La aplicación detuvo el envío.' });
        return;
      }
      mark('app', 'ok');
    } else {
      mark('app', 'skip');
    }

    // El servidor revalida todo: no confía en las capas anteriores.
    const result = serverPasses();
    if (result.valid) {
      mark('server', 'ok');
      renderPayload(body, { status: 201, message: 'Entrada registrada.' });
    } else {
      mark('server', 'fail');
      renderPayload(body, { status: 400, error: 'El código no existe en el catálogo.' });
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    send(true, true);
  });

  qs('#valBypass').addEventListener('click', () => {
    send(false, false);
  });
}
