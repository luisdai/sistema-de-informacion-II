/**
 * Cuestionario final con explicación por respuesta y memoria local.
 */
import { qs } from './utils.js';
import { load, save } from './storage.js';

const QUESTIONS = [
  {
    q: '¿Cuál de estos datos NO debería capturarse en una venta?',
    opts: ['Cantidad vendida', 'Costo unitario del artículo', 'ID del artículo', 'Fecha de la transacción'],
    correct: 1,
    exp: 'El costo ya vive en el catálogo: se recupera con la llave. Pedirlo otra vez duplica el trabajo y crea inconsistencias.',
  },
  {
    q: 'Captura de datos es…',
    opts: ['Teclear la información en la computadora', 'Identificar y adquirir el dato en su origen', 'Validar que el formulario esté completo', 'Imprimir el comprobante de la transacción'],
    correct: 1,
    exp: 'La captura ocurre donde nace el dato (la venta, la recepción). El ingreso es traducirlo a un formato legible por la computadora.',
  },
  {
    q: 'La “regla del propósito” en el diseño de salidas dice que…',
    opts: ['Toda salida debe imprimirse para tener valor', 'Si la salida no es funcional, no debe crearse', 'Cuantos más datos incluya, mejor', 'El color es más importante que el contenido'],
    correct: 1,
    exp: 'Cada salida cuesta tiempo y recursos. Si nadie decide o actúa con ella, sobra. Más no siempre es mejor.',
  },
  {
    q: 'Según el diseño de pantallas, la zona más visible es…',
    opts: ['La esquina inferior derecha', 'El centro exacto de la pantalla', 'La esquina superior izquierda', 'La barra inferior de estado'],
    correct: 2,
    exp: 'Por eso allí van los encabezados y las explicaciones importantes. Los mensajes e instrucciones se ubican abajo.',
  },
  {
    q: 'Ante un inicio de sesión fallido, lo correcto es…',
    opts: ['Decir “ese usuario no existe” para ser claro', 'Mostrar un mensaje genérico y no confirmar si la cuenta existe', 'Pedir la contraseña dos veces', 'Desactivar la cuenta tras un intento'],
    correct: 1,
    exp: 'Un mensaje específico le confirma a un atacante qué cuentas son válidas. Autentica sin filtrar información.',
  },
];

const STORAGE_KEY = 'quiz';

export function initQuiz() {
  const list = qs('#quizList');
  const scoreText = qs('#quizScoreText');
  const bar = qs('#quizBar');
  if (!list || !scoreText || !bar) return;

  let answered = {};
  let score = 0;

  function updateScore() {
    scoreText.textContent = score + ' de 5';
    bar.style.width = (score / 5 * 100) + '%';
  }

  function applyAnswer(questionIndex, optionIndex) {
    const block = list.querySelector('[data-qblock="' + questionIndex + '"]');
    if (!block) return;

    const buttons = Array.from(block.querySelectorAll('.quiz-opt'));
    const item = QUESTIONS[questionIndex];

    buttons.forEach((option, index) => {
      option.disabled = true;
      option.classList.remove('correct', 'wrong');
      if (index === item.correct) option.classList.add('correct');
    });

    if (optionIndex !== item.correct && buttons[optionIndex]) buttons[optionIndex].classList.add('wrong');
    block.querySelector('.quiz-exp').classList.add('show');
  }

  function render() {
    score = 0;

    list.innerHTML = QUESTIONS.map((item, questionIndex) => {
      const options = item.opts.map((option, optionIndex) =>
        '<button type="button" class="quiz-opt" data-q="' + questionIndex + '" data-o="' + optionIndex + '"><span class="qo-letter">' + String.fromCharCode(65 + optionIndex) + '</span><span>' + option + '</span></button>'
      ).join('');

      return '<div class="quiz-q" data-qblock="' + questionIndex + '">' +
        '<div class="qq-title"><span>' + (questionIndex + 1) + '.</span><span>' + item.q + '</span></div>' +
        '<div class="quiz-opts">' + options + '</div>' +
        '<div class="quiz-exp" id="quizExp' + questionIndex + '">' + item.exp + '</div>' +
      '</div>';
    }).join('');

    answered = load(STORAGE_KEY, {}) || {};

    for (const [key, value] of Object.entries(answered)) {
      const questionIndex = Number(key);
      if (!QUESTIONS[questionIndex] || !Number.isInteger(value)) continue;
      applyAnswer(questionIndex, value);
      if (value === QUESTIONS[questionIndex].correct) score++;
    }

    updateScore();
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('.quiz-opt');
    if (!button) return;

    const questionIndex = parseInt(button.dataset.q, 10);
    const optionIndex = parseInt(button.dataset.o, 10);
    if (answered[questionIndex] !== undefined) return;

    answered[questionIndex] = optionIndex;
    save(STORAGE_KEY, answered);
    applyAnswer(questionIndex, optionIndex);
    if (optionIndex === QUESTIONS[questionIndex].correct) score++;
    updateScore();
  });

  qs('#quizReset').addEventListener('click', () => {
    answered = {};
    save(STORAGE_KEY, answered);
    render();
  });

  render();
}
