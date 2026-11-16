/**
 * Verificador de contraste WCAG con dos colores.
 */
import { qs, qsa } from './utils.js';
import { icon } from './icons.js';

function toRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const { r, g, b } = toRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export function initContraste() {
  const text = qs('#ctText');
  const background = qs('#ctBg');
  const sample = qs('#contrastSample');
  const result = qs('#contrastResult');
  if (!text || !background || !sample || !result) return;

  function badge(label, passes) {
    return '<span class="cr-badge ' + (passes ? 'ok' : 'fail') + '">' + icon(passes ? 'check' : 'x') + ' ' + label +
      '<span class="sr-only">: ' + (passes ? 'cumple' : 'no cumple') + '</span></span>';
  }

  function render() {
    const ratio = contrastRatio(text.value, background.value);
    sample.style.color = text.value;
    sample.style.background = background.value;

    result.innerHTML =
      '<span class="cr-ratio">' + ratio.toFixed(2).replace('.', ',') + ':1</span>' +
      '<span class="cr-badges">' +
        badge('Normal AA', ratio >= 4.5) +
        badge('Normal AAA', ratio >= 7) +
        badge('Grande AA', ratio >= 3) +
        badge('Grande AAA', ratio >= 4.5) +
      '</span>';
  }

  text.addEventListener('input', render);
  background.addEventListener('input', render);

  const presets = {
    bad: { text: '#cfcfcf', bg: '#ffffff' },
    aa: { text: '#6a7288', bg: '#ffffff' },
    aaa: { text: '#3a4258', bg: '#ffffff' },
  };

  for (const button of qsa('.contrast-presets .chip')) {
    button.addEventListener('click', () => {
      const preset = presets[button.dataset.preset];
      text.value = preset.text;
      background.value = preset.bg;
      render();
    });
  }

  render();
}
