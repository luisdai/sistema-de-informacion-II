# Diseño de entradas, salidas e interfaz

Guía interactiva del módulo III de **Sistemas de Información II**. Explica, con demos que se pueden tocar, cómo se diseña un formulario, una pantalla, una salida y un inicio de sesión. Está pensada para dar una clase y para que el estudiante explore después por su cuenta.

## Cómo abrirla

La página usa módulos ES, así que necesita servirse por HTTP. No funciona abriendo el archivo con doble clic.

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`. En GitHub Pages funciona sin configuración adicional.

## Estructura

```
index.html          Marcado de la guía
css/
  tokens.css        Variables, reset y tipografía
  layout.css        Navegación, hero, rejillas y pie
  components.css    Botones, avisos, etiquetas e iconos
  sections.css      Estilos de las secciones originales
  features.css      Demos nuevas, modo clase y rúbrica
  responsive.css    Ajustes por tamaño de pantalla
js/
  main.js           Punto de entrada
  icons.js          Sprite SVG generado desde Lucide
  utils.js          Helpers compartidos
  storage.js        Acceso a localStorage
  nav.js            Progreso, scroll y menú móvil
  ruta.js           Pasos del proceso de diseño
  entradas.js       Recorrido, simulador y clasificador
  pantalla.js       Anatomía de la pantalla
  formularios.js    Laboratorio malo contra bueno
  campo.js          Anatomía de un campo
  controles.js      Selector de controles
  validacion.js     Validación en tres capas
  salidas.js        Reporte y recomendador
  uxui.js           Modo sin UI
  contraste.js      Verificador de contraste
  sin-css.js        Demostración sin hoja de estilos
  login.js          Comparación de inicios de sesión
  reto.js           Reto de los seis errores
  quiz.js           Cuestionario final
  rubrica.js        Rúbrica de diez criterios
  auditoria.js      Auditoría del formulario bancario
  presentacion.js   Modo clase
docs/
  GUIA-DOCENTE.md   Guion de clase de 90 minutos
```

## Qué incluye

- Nueve secciones de contenido y cuatro demos de formularios: anatomía del campo, selector de controles, validación en tres capas y laboratorio malo contra bueno.
- Simulador de entrada, clasificador de datos, reporte comparativo, login, reto de seis errores, cuestionario y rúbrica.
- Verificador de contraste WCAG y modo sin CSS.
- Modo clase con seis paradas, navegación con flechas y salida con `Escape`.
- Auditoría de un formulario bancario con siete problemas reales y tres señuelos, con resultado por cobertura y precisión.
- Progreso de la rúbrica y del cuestionario guardado en el navegador.

## Accesibilidad

Formularios con etiquetas visibles, ayudas asociadas, errores junto al campo y `aria-invalid`. El recorrido es una lista ordenada, los pasos de la ruta funcionan como tabs con teclado, las barras decorativas están ocultas para lectores de pantalla y el menú móvil informa su estado con `aria-expanded`.

## Créditos

Iconos de [Lucide](https://lucide.dev), licencia ISC. El contenido se basa en la guía del módulo III de Sistemas de Información II.
