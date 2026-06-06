// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// ── Step 8 verification: renderFixedColumn ────────────────────────────────────
// Log a sample layout to confirm pretext line wrapping produces real substrings.
import { renderFixedColumn } from './engine/layoutEngine';
import { FONTS, BODY_W } from './engine/constants';

const _sampleText =
  'The road had forgotten it was a road. Beneath the canopy of blackthorn and silver ash, it had become something older — a scar in the earth that the forest was slowly reclaiming, one root and one season at a time.';

const _lines = renderFixedColumn(_sampleText, FONTS.body, BODY_W);
console.group('[pretext] renderFixedColumn verification');
_lines.forEach((l, i) => {
  console.log(`Line ${i + 1} (${l.width.toFixed(1)}px): "${l.text}"`);
  const inSource = _sampleText.includes(l.text.trim());
  if (!inSource) {
    console.error('⚠ line text not a substring of source!', l.text);
  }
});
console.log(`Total lines: ${_lines.length}, widths all ≤ ${BODY_W}px:`, _lines.every(l => l.width <= BODY_W + 1));
console.groupEnd();
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
