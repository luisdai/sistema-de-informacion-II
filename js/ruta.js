/**
 * Ruta de diseño: pasos del proceso y panel de detalle.
 */
import { qs, qsa } from './utils.js';

const ROUTE_DATA = {
  1: {
    title: 'Entender la transacción',
    body: 'Antes de dibujar una pantalla, describe la transacción en voz alta: quién la ejecuta, dónde ocurre, qué datos nacen en ese momento y cuáles ya existen en el sistema. La guía lo llama identificar datos variables (cambian en cada operación) y datos de identificación (la llave única). El costo, el nombre del cliente y las existencias no se capturan: se recuperan.',
    deliverable: 'Lista de campos con su origen: variable, llave o recuperado.',
    question: '¿Cuál es el dato mínimo que identifica esta transacción?',
    risk: 'Si saltas este paso, la pantalla pedirá datos que el sistema ya tiene y el usuario tecleará el doble.',
  },
  2: {
    title: 'Mapear el diálogo',
    body: 'Una interfaz típica tiene muchas pantallas: se abren en cierto orden, se alternan y algunas solo aparecen bajo condiciones. Dibuja el mapa antes de programar: qué pantalla lleva a cuál, dónde se cancela, qué pasa si el usuario se equivoca y cómo vuelve. Así evitas callejones sin salida y ventanas huérfanas.',
    deliverable: 'Mapa de pantallas y transiciones, con estados de error y cancelación.',
    question: '¿Puede la persona volver atrás sin perder lo que escribió?',
    risk: 'Sin mapa aparecen los clásicos: dos pantallas que hacen lo mismo, un “guardar” que cierra todo y un error sin salida.',
  },
  3: {
    title: 'Prototipar entradas y salidas',
    body: 'Construye bocetos rápidos de formularios, reportes y mensajes. Un prototipo no necesita seguridad ni toda la lógica: sirve para conversar. La guía advierte que estos prototipos rara vez son funcionales; justamente por eso son baratos de cambiar. Diseña la salida antes de la entrada: la salida define qué datos hacen falta capturar.',
    deliverable: 'Prototipo navegable (aunque sea en papel) de cada pantalla clave.',
    question: '¿Esta salida se puede producir con los datos que planeo capturar?',
    risk: 'Prototipar solo la pantalla bonita y dejar el reporte para el final produce entradas incompletas y retrabajo.',
  },
  4: {
    title: 'Probar con usuarios reales',
    body: 'Pon el prototipo frente a alguien que hará el trabajo, no frente a quien lo encargó. Pídele que complete una tarea y observa dónde duda, qué lee primero y qué error comete. La retroalimentación del usuario es esencial: no preguntes “¿te gusta?”, pide que lo use. Después vuelve al mapa y al prototipo con lo aprendido.',
    deliverable: 'Registro de observaciones y lista priorizada de cambios.',
    question: '¿La persona terminó la tarea sin que le explicaras cómo?',
    risk: 'Validar con el jefe o con el equipo de sistemas confirma tus suposiciones, no la usabilidad real.',
  },
  5: {
    title: 'Especificar y construir',
    body: 'Documenta lo que el prototipo no muestra: reglas de validación, mensajes exactos, longitud de campos, permisos por rol, quién puede ver qué y qué ocurre ante cada error. La guía incluye aquí procedimientos de entrada, manejo de errores, seguridad y respaldo. Con esa especificación, programar es traducir, no adivinar.',
    deliverable: 'Especificación de interfaz y reglas, más criterios de prueba.',
    question: '¿Un programador podría construir esto sin preguntarte nada?',
    risk: 'Dejar la validación “para después” termina en reglas distintas en cada pantalla y datos inconsistentes.',
  },
};

export function initRuta() {
  const steps = qsa('.route-step');
  if (!steps.length) return;

  const index = qs('#routeIndex');
  const title = qs('#routeTitle');
  const body = qs('#routeBody');
  const deliverable = qs('#routeDeliverable');
  const question = qs('#routeQuestion');
  const risk = qs('#routeRiskText');

  function setRoute(step) {
    for (const button of steps) {
      button.setAttribute('aria-selected', String(button.dataset.step === String(step)));
    }

    const data = ROUTE_DATA[step];
    index.textContent = 'Paso ' + step + ' de 5';
    title.textContent = data.title;
    body.textContent = data.body;
    deliverable.textContent = data.deliverable;
    question.textContent = data.question;
    risk.textContent = data.risk;
  }

  for (const button of steps) {
    button.addEventListener('click', () => setRoute(button.dataset.step));
  }

  setRoute(1);
}
