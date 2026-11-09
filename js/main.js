/**
 * Punto de entrada de la guía.
 * Cada módulo inicializa su sección y no falla si esa sección no existe.
 */
import { mountSprite } from './icons.js';
import { initNav } from './nav.js';
import { initRuta } from './ruta.js';
import { initEntradas } from './entradas.js';
import { initPantalla } from './pantalla.js';
import { initFormularios } from './formularios.js';
import { initSalidas } from './salidas.js';
import { initUxUi } from './uxui.js';
import { initLogin } from './login.js';
import { initReto } from './reto.js';
import { initQuiz } from './quiz.js';
import { initChecklist } from './checklist.js';
import { initCampo } from './campo.js';
import { initControles } from './controles.js';
import { initValidacion } from './validacion.js';
import { initContraste } from './contraste.js';
import { initSinCss } from './sin-css.js';

mountSprite();
initNav();
initRuta();
initEntradas();
initPantalla();
initFormularios();
initSalidas();
initUxUi();
initLogin();
initReto();
initQuiz();
initChecklist();
initCampo();
initControles();
initValidacion();
initContraste();
initSinCss();
