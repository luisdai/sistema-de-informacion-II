# Guía docente · 90 minutos

Material de apoyo para la clase de diseño de formularios y pantallas. La página se proyecta y los estudiantes también pueden abrirla en su teléfono o laptop.

## Objetivo

Al terminar, cada estudiante debe poder tomar un formulario real y justificar por escrito qué cambiaría, con criterios y no con opiniones.

## Antes de la clase

1. Sirve la página con `python3 -m http.server 8000` o publica el repositorio en GitHub Pages.
2. Abre la página en el navegador y pulsa el botón flotante de **Modo clase**.
3. Comprueba que el proyector muestra el texto a tamaño cómodo. La tecla `Escape` sale del modo.
4. Ten a mano la rúbrica impresa o en pantalla. La sección de cierre la genera y permite copiarla.

El modo clase tiene seis paradas y se recorre con las flechas izquierda y derecha. Las secciones fuera de la ruta quedan para consulta.

## Guion

### 0 a 5 minutos · Abrir con una molestia

Pregunta al salón: "¿Cuál es el último formulario que te hizo perder tiempo?". Deja dos o tres respuestas. Anota en el pizarrón qué se repite: campos que ya deberían existir, mensajes que no dicen nada, botones que no se sabe cuál pulsar.

Idea para cerrar la apertura: un formulario no se juzga por lo bonito, se juzga por cuántos errores evita y cuánto tiempo ahorra.

### 5 a 15 minutos · Parada 1: el plano

Sección **Antes de tocar código**.

- Recorre los cinco pasos del proceso y detente en dos: los datos variables contra los recuperados, y la prueba con usuarios reales.
- Pregunta: "Si el sistema ya sabe el costo del artículo, ¿por qué se lo vamos a pedir a la persona?".
- Deja claro que la salida se diseña antes que la entrada.

### 15 a 30 minutos · Parada 2: anatomía de un campo

Sección **Anatomía de un campo**.

- Pulsa cada parte: etiqueta, control, ayuda, error y obligatorio. El inspector muestra lo que ve el navegador.
- Cambia a **Con error** y muestra que el mensaje está junto al campo y que el campo queda marcado.
- Pregunta: "¿Qué pasa si la etiqueta es solo un placeholder?".
- Cierra con el HTML del campo. Que vean que la accesibilidad está en cuatro atributos, no en un curso aparte.

### 30 a 45 minutos · Parada 3: el control correcto

Sección **Elige el control correcto**.

- Empieza por el teléfono y el código postal. Son los dos errores más frecuentes por usar `type="number"` donde no va.
- Pasa por fecha, contraseña y cantidad.
- Pide al salón que elija el control para tres casos nuevos: cédula, monto de una factura, hora de una cita.
- Insiste: el teclado del teléfono es parte del diseño.

### 45 a 60 minutos · Parada 4: malo contra bueno

Sección **Laboratorio de entrada**.

- Llena el formulario malo y luego el bueno. El contraste se siente.
- Pregunta qué cambió: no es el color, es la jerarquía, la validación y la cantidad de campos.
- Aprovecha para comentar la regla: una acción primaria por pantalla.

### 60 a 70 minutos · Validación en tres capas

Sección **Validación**.

- Envía `ART-999`. El navegador y la aplicación dejan pasar; el servidor rechaza.
- Pulsa **Saltarme el navegador** con un campo vacío. El servidor vuelve a rechazar.
- Mensaje clave: lo que se puede desactivar desde el inspector no es una defensa.

### 70 a 80 minutos · Parada 5: el reto

Sección **Reto visual**.

- Deja que el salón busque los seis errores. Pista: están a la vista.
- Al revelar cada punto, no leas la explicación: pide que la digan ellos.
- Cierra con el error de contraste y el del mensaje de error. Son los que más se repiten en los proyectos.

### 80 a 88 minutos · Parada 6: auditoría del banco

Sección **Cierre**, botón **Abrir la auditoría**.

- Proyecta el formulario del Banco del Sur. Son dos pantallas: acceso y transferencia.
- La lista tiene diez afirmaciones: siete describen problemas reales y tres son cosas que están bien. La instrucción es marcar solo lo que sea un problema.
- Deja tres o cuatro minutos para que cada uno marque. En parejas funciona mejor: tienen que justificar cada marca.
- Pulsa **Ver resultado** y lee el desglose. El puntaje resta los falsos positivos: marcar todo no sirve.
- Detente en los tres señuelos. Que expliquen por qué el enlace de recuperación, el aviso de conexión segura y el titular precargado no son problemas.
- Cierra con la idea: una auditoría mide dos cosas, lo que encuentras y lo que descartas.

### 88 a 90 minutos · Cierre

Sección **Cierre**.

- Cinco preguntas del cuestionario, en voz alta y con explicación.
- Presenta la rúbrica de diez criterios. Que la usen como lista de revisión de su propio proyecto.
- Tarea: auditar el formulario del banco, de la universidad o de una tienda. Traer tres problemas y una propuesta de mejora con la rúbrica.

## Preguntas para el salón

- ¿Qué dato de este formulario ya existe en el sistema?
- ¿Qué mensaje de error te dice qué hacer y cuál solo te regaña?
- ¿Cuál es la acción principal de esta pantalla? ¿Y las secundarias?
- ¿Qué pasa si la persona se equivoca y quiere volver atrás?
- ¿Esta salida ayuda a decidir algo o solo acumula datos?
- ¿Qué se rompe si abres esta página sin CSS? ¿Y sin JavaScript?

## Evaluación sugerida

Usa la rúbrica de la página (10 criterios, 0 a 2 puntos, total 20). La puntuación no es una nota final: es un diagnóstico de dónde poner el esfuerzo antes de programar.

La auditoría del banco sirve como evaluación rápida de la clase: cobertura de los siete problemas y precisión al descartar los tres señuelos. El resultado queda guardado en el navegador del estudiante.

Criterios que suelen fallar en los proyectos:

- Datos que se piden y ya existen en el sistema.
- Mensajes de error globales en lugar de junto al campo.
- Varias acciones con el mismo peso visual.
- Salidas sin título, periodo ni unidades.
- Inicios de sesión que revelan si la cuenta existe.

## Notas técnicas

- Los módulos ES requieren HTTP. Si un estudiante descarga el proyecto y abre `index.html` con doble clic, la página no cargará los scripts. Indica el servidor local o el enlace de Pages.
- El progreso de la rúbrica y del cuestionario se guarda en el navegador, no en un servidor.
- La sección de herramientas enlaza sitios externos; revisa la conexión antes de la clase.
