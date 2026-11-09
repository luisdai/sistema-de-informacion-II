/**
 * Sección de acceso: login descuidado y login con buenas prácticas.
 */
import { qs } from './utils.js';

export function initLogin() {
  initBadLogin();
  initGoodLogin();
}

function initBadLogin() {
  const form = qs('#badLoginForm');
  if (!form) return;

  const message = qs('#badLoginMsg');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = 'El usuario ingresado no existe.';
  });

  qs('#badLoginClear').addEventListener('click', () => {
    qs('#badUser').value = '';
    qs('#badPass').value = '';
    message.textContent = '';
  });
}

function initGoodLogin() {
  const form = qs('#goodLoginForm');
  if (!form) return;

  const email = qs('#loginEmail');
  const password = qs('#loginPass');
  const toggle = qs('#loginToggle');
  const message = qs('#goodLoginMsg');
  const button = qs('#goodLoginBtn');
  const buttonText = qs('#goodLoginText');
  const capsHint = qs('#capsHint');

  capsHint.style.display = 'none';

  toggle.addEventListener('click', () => {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Ocultar' : 'Mostrar';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
    password.focus();
  });

  function updateCaps(event) {
    const active = event && typeof event.getModifierState === 'function'
      ? event.getModifierState('CapsLock')
      : false;
    capsHint.style.display = active ? 'flex' : 'none';
  }

  password.addEventListener('keydown', updateCaps);
  password.addEventListener('keyup', updateCaps);
  password.addEventListener('blur', () => {
    capsHint.style.display = 'none';
  });

  for (const input of [email, password]) {
    input.addEventListener('input', () => {
      message.className = 'lg-msg';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = email.value.trim().toLowerCase();
    const secret = password.value;

    if (!user || !secret) {
      message.className = 'lg-msg err show';
      message.textContent = 'Completa correo y contraseña para continuar.';
      (!user ? email : password).focus();
      return;
    }

    button.disabled = true;
    buttonText.textContent = 'Verificando…';
    message.className = 'lg-msg';

    setTimeout(() => {
      button.disabled = false;
      buttonText.textContent = 'Entrar';

      if (user === 'admin@empresa.com' && secret === 'Demo1234') {
        message.className = 'lg-msg ok show';
        message.textContent = '✓ Sesión iniciada. Tu rol define qué puedes ver y hacer; no tus permisos individuales.';
        email.value = '';
        password.value = '';
      } else {
        message.className = 'lg-msg err show';
        message.textContent = 'Correo o contraseña incorrectos. Si olvidaste tu clave, usa el enlace de recuperación.';
        password.value = '';
        password.focus();
      }
    }, 950);
  });
}
