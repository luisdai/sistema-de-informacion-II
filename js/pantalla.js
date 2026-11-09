/**
 * Anatomía de la pantalla: zonas del wireframe y panel explicativo.
 */
import { qs, qsa } from './utils.js';

const ANATOMY_DATA = {
  header: {
    tag: 'Encabezado',
    title: 'Dónde estoy y qué puedo hacer',
    body: 'El encabezado identifica el software, el archivo abierto y las acciones disponibles. Debe responder en un vistazo: ¿en qué pantalla estoy?, ¿cuál es el contexto?, ¿cómo salgo de aquí?',
    list: [
      'Título de la pantalla y del archivo abierto.',
      'Menús, iconos y accesos a tareas específicas.',
      'Se coloca siempre en la parte superior, sin excepciones.',
    ],
  },
  help: {
    tag: 'Explicación',
    title: 'La esquina que más se mira',
    body: 'La guía señala que la esquina superior izquierda es la zona más visible de la pantalla. Ahí van los encabezados y, si hacen falta, las explicaciones sobre la información presentada. No es una zona para adornos.',
    list: [
      'Explica qué significa un dato o una columna.',
      'Debe ser breve: una frase, no un manual.',
      'Nunca tapa el contenido principal.',
    ],
  },
  body: {
    tag: 'Cuerpo',
    title: 'El orden de lectura ya está decidido',
    body: 'El cuerpo contiene la captura de datos y se organiza de izquierda a derecha y de arriba hacia abajo, porque así leemos. Los títulos y las pistas ayudan a teclear el dato correcto en el lugar correcto.',
    list: [
      'Agrupa campos relacionados.',
      'Etiqueta arriba y ejemplo dentro del campo.',
      'La ayuda contextual aparece junto al campo que la necesita.',
    ],
  },
  messages: {
    tag: 'Mensajes',
    title: 'Habla abajo, pero claro',
    body: 'Los mensajes e instrucciones se ubican en la parte inferior de la pantalla. Deben ser consistentes: el mismo lugar, el mismo tono y el mismo formato para el mismo tipo de aviso. Un error no es una decoración roja.',
    list: [
      'Confirma lo que el sistema hizo.',
      'Explica qué falló y cómo continuar.',
      'Nunca uses solo color para comunicar un estado.',
    ],
  },
  status: {
    tag: 'Barra de estado',
    title: 'El sistema también respira',
    body: 'La línea de estado informa lo que ocurre por dentro: un proceso en marcha, una impresión, una tecla activada. No necesita detalle, pero sí consistencia y una ubicación que llame la atención sin gritar.',
    list: [
      'Muestra procesos en curso.',
      'Avisa de Bloq Mayús, conexión o guardado.',
      'Se mantiene en el mismo lugar siempre.',
    ],
  },
};

export function initPantalla() {
  const regions = qsa('.wire-region');
  if (!regions.length) return;

  const tag = qs('#anatomyTag');
  const title = qs('#anatomyTitle');
  const body = qs('#anatomyBody');
  const list = qs('#anatomyList');

  function setAnatomy(region) {
    for (const item of regions) {
      item.classList.toggle('is-active', item.dataset.region === region);
    }

    const data = ANATOMY_DATA[region];
    if (!data) return;

    tag.textContent = data.tag;
    title.textContent = data.title;
    body.textContent = data.body;
    list.innerHTML = data.list.map((line) => '<div>' + line + '</div>').join('');
  }

  for (const region of regions) {
    region.addEventListener('click', () => setAnatomy(region.dataset.region));
  }

  setAnatomy('header');
}
