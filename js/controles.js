/**
 * Selector de controles: cada caso de uso con su control recomendado.
 */
import { qs } from './utils.js';
import { icon } from './icons.js';

const CASES = [
  {
    label: 'Nombre completo',
    icon: 'type',
    title: 'Nombre completo',
    control: '<label for="ctlNombre">Nombre completo</label><input id="ctlNombre" type="text" autocomplete="name" placeholder="Ana Ruiz">',
    why: 'Texto libre con autocompletado de nombre. El navegador puede rellenarlo y el corrector no estorba.',
    mistake: 'Un solo campo para nombre y apellido cuando luego necesitas ordenarlos o buscar por apellido.',
  },
  {
    label: 'Correo electrónico',
    icon: 'mail',
    title: 'Correo electrónico',
    control: '<label for="ctlEmail">Correo electrónico</label><input id="ctlEmail" type="email" autocomplete="email" inputmode="email" placeholder="nombre@empresa.com">',
    why: 'El tipo email activa el teclado con arroba, valida el formato y permite el autocompletado. En el teléfono cambia el teclado.',
    mistake: 'Usar type="text" y validar el correo con una expresión regular propia en cada pantalla.',
  },
  {
    label: 'Teléfono',
    icon: 'phone',
    title: 'Teléfono',
    control: '<label for="ctlTel">Teléfono</label><input id="ctlTel" type="tel" autocomplete="tel" inputmode="tel" placeholder="+58 412 123 4567">',
    why: 'type="tel" abre el teclado numérico y permite signos como +, espacios y guiones. No fuerza un formato que varía por país.',
    mistake: 'type="number": borra el + y los ceros a la izquierda, y muestra flechas que no sirven para un teléfono.',
  },
  {
    label: 'Fecha',
    icon: 'calendar',
    title: 'Fecha de nacimiento',
    control: '<label for="ctlFecha">Fecha de nacimiento</label><input id="ctlFecha" type="date" autocomplete="bday">',
    why: 'El selector nativo de fecha respeta el formato local, valida días imposibles y evita el teclado libre.',
    mistake: 'Tres campos de texto para día, mes y año, sin validar que la fecha exista.',
  },
  {
    label: 'Cantidad',
    icon: 'hash',
    title: 'Cantidad',
    control: '<label for="ctlCantidad">Cantidad</label><input id="ctlCantidad" type="number" min="1" max="99" step="1" value="1" inputmode="numeric">',
    why: 'number con mínimo, máximo y paso entero. El rango se declara una vez y el navegador ayuda, aunque el servidor debe revalidar.',
    mistake: 'Un campo de texto y comparar cadenas: "10" es menor que "9" si se comparan como texto.',
  },
  {
    label: 'Código postal',
    icon: 'hash',
    title: 'Código postal',
    control: '<label for="ctlPostal">Código postal</label><input id="ctlPostal" type="text" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{4,5}" placeholder="1010">',
    why: 'texto con teclado numérico y patrón. Se conservan los ceros a la izquierda, que en un número desaparecen.',
    mistake: 'type="number": el código 01234 se guarda como 1234 y ya no coincide con el domicilio.',
  },
  {
    label: 'Contraseña',
    icon: 'lock',
    title: 'Contraseña nueva',
    control: '<label for="ctlPass">Contraseña</label><input id="ctlPass" type="password" autocomplete="new-password" minlength="8" placeholder="Mínimo 8 caracteres">',
    why: 'password oculta el valor y autocomplete permite que el gestor de contraseñas lo rellene y lo guarde.',
    mistake: 'autocomplete="off" y sin opción de mostrarla: la persona escribe a ciegas y termina usando una clave débil.',
  },
  {
    label: 'Búsqueda',
    icon: 'search',
    title: 'Búsqueda',
    control: '<label for="ctlBuscar">Buscar artículo</label><input id="ctlBuscar" type="search" placeholder="Código o nombre">',
    why: 'type="search" ofrece el botón nativo de limpiar y algunos navegadores muestran sugerencias.',
    mistake: 'Un text normal con un botón de borrar inventado que no se comporta igual con el teclado.',
  },
  {
    label: 'Comentario',
    icon: 'text-cursor-input',
    title: 'Comentario',
    control: '<label for="ctlNota">Comentario</label><textarea id="ctlNota" maxlength="120" placeholder="Máximo 120 caracteres"></textarea>',
    why: 'textarea permite varias líneas y maxlength comunica y aplica el límite. Conviene mostrar el contador.',
    mistake: 'Un input de una línea para una observación que la persona necesita explicar con detalle.',
  },
  {
    label: 'Una opción',
    icon: 'circle-dot',
    title: 'Elegir una opción',
    control: '<label for="ctlPlan">Plan</label><select id="ctlPlan"><option>Básico</option><option>Profesional</option><option>Empresa</option></select>',
    why: 'Con pocas opciones y una sola elección, un select ahorra espacio. Si son dos o tres, los radios visibles evitan un clic extra.',
    mistake: 'Un select para dos opciones que la persona necesita comparar; los radios muestran todo de una vez.',
  },
  {
    label: 'Varias opciones',
    icon: 'list-checks',
    title: 'Elegir varias opciones',
    control: '<span class="check-line"><input id="ctlA" type="checkbox" checked><label for="ctlA">Facturar</label></span><span class="check-line"><input id="ctlB" type="checkbox"><label for="ctlB">Enviar por correo</label></span>',
    why: 'Casillas independientes: cada una se activa sola y se entiende que se pueden marcar varias.',
    mistake: 'select multiple: en el teléfono es difícil de usar y mucha gente no descubre que puede elegir más de una.',
  },
  {
    label: 'Sí o no',
    icon: 'toggle-right',
    title: 'Sí o no',
    control: '<span class="check-line"><input id="ctlAcepta" type="checkbox"><label for="ctlAcepta">Acepto los términos y condiciones</label></span>',
    why: 'Una casilla con etiqueta clara para una decisión binaria. El texto explica qué implica marcarla.',
    mistake: 'Dos radios para sí y no, o una casilla sin texto que obligue a adivinar qué se acepta.',
  },
];

export function initControles() {
  const list = qs('#controlList');
  const preview = qs('#controlPreview');
  if (!list || !preview) return;

  let active = 0;

  function renderList() {
    list.innerHTML = CASES.map((item, index) =>
      '<button type="button" class="control-item' + (index === active ? ' is-active' : '') + '" data-index="' + index + '" aria-pressed="' + (index === active) + '">' +
        '<span class="ci-ic" aria-hidden="true">' + icon(item.icon) + '</span>' +
        '<span>' + item.label + '</span>' +
      '</button>'
    ).join('');
  }

  function renderPreview(index) {
    const item = CASES[index];
    preview.innerHTML =
      '<div class="cp-head"><span class="tag">Recomendado</span><h3>' + item.title + '</h3></div>' +
      '<p class="cp-intro">Así se vería el control dentro de un formulario real.</p>' +
      '<div class="cp-control">' + item.control + '</div>' +
      '<div class="cp-block"><h4>Por qué</h4><p>' + item.why + '</p></div>' +
      '<div class="cp-block bad"><h4>Error típico</h4><p>' + item.mistake + '</p></div>' +
      '<pre class="cp-code"><code></code></pre>';
    preview.querySelector('.cp-code code').textContent = item.control.replace(/></g, '>\n<');
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('.control-item');
    if (!button) return;
    active = Number(button.dataset.index);
    renderList();
    renderPreview(active);
  });

  renderList();
  renderPreview(active);
}
