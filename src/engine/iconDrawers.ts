import type { IconName } from '../types';

export const STROKE_COLOR = '#8b7355'; // Parchment brown

function setStrokeStyles(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = STROKE_COLOR;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export function drawDragon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  setStrokeStyles(ctx);
  ctx.beginPath();
  
  // Center coordinates relative to size
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  // Head and neck
  ctx.moveTo(cx - r * 0.1, cy - r * 0.5);
  ctx.quadraticCurveTo(cx - r * 0.4, cy - r * 0.8, cx - r * 0.2, cy - r * 0.9); // head curve
  ctx.lineTo(cx - r * 0.1, cy - r * 0.95); // horn
  ctx.moveTo(cx - r * 0.2, cy - r * 0.9);
  ctx.lineTo(cx - r * 0.4, cy - r * 0.9); // snout
  ctx.lineTo(cx - r * 0.3, cy - r * 0.8);
  ctx.quadraticCurveTo(cx + r * 0.1, cy - r * 0.7, cx - r * 0.05, cy - r * 0.3); // neck down

  // Body spine
  ctx.quadraticCurveTo(cx - r * 0.2, cy + r * 0.2, cx + r * 0.2, cy + r * 0.3);
  // Tail
  ctx.quadraticCurveTo(cx + r * 0.6, cy + r * 0.5, cx + r * 0.4, cy + r * 0.8);
  ctx.quadraticCurveTo(cx + r * 0.1, cy + r * 0.9, cx + r * 0.3, cy + r * 0.6);

  // Wings (Left Wing)
  ctx.moveTo(cx - r * 0.1, cy - r * 0.3);
  ctx.bezierCurveTo(cx - r * 0.7, cy - r * 0.7, cx - r * 0.8, cy - r * 0.1, cx - r * 0.3, cy + r * 0.1);
  ctx.moveTo(cx - r * 0.5, cy - r * 0.45);
  ctx.lineTo(cx - r * 0.3, cy + r * 0.1);
  ctx.moveTo(cx - r * 0.65, cy - r * 0.3);
  ctx.lineTo(cx - r * 0.3, cy + r * 0.1);

  // Wings (Right Wing)
  ctx.moveTo(cx - r * 0.1, cy - r * 0.3);
  ctx.bezierCurveTo(cx + r * 0.5, cy - r * 0.8, cx + r * 0.7, cy - r * 0.3, cx + r * 0.2, cy + r * 0.1);
  ctx.moveTo(cx + r * 0.3, cy - r * 0.55);
  ctx.lineTo(cx + r * 0.2, cy + r * 0.1);
  ctx.moveTo(cx + r * 0.45, cy - r * 0.4);
  ctx.lineTo(cx + r * 0.2, cy + r * 0.1);

  // Legs
  ctx.moveTo(cx - r * 0.1, cy + r * 0.15);
  ctx.lineTo(cx - r * 0.2, cy + r * 0.45);
  ctx.lineTo(cx - r * 0.3, cy + r * 0.4);
  
  ctx.moveTo(cx + r * 0.15, cy + r * 0.25);
  ctx.lineTo(cx + r * 0.1, cy + r * 0.5);
  ctx.lineTo(cx, cy + r * 0.48);

  ctx.stroke();
  ctx.restore();
}

export function drawCastle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  setStrokeStyles(ctx);
  ctx.beginPath();

  const pad = size * 0.1;
  const w = size - 2 * pad;
  const h = size - 2 * pad;
  const bx = x + pad;
  const by = y + pad;

  // Left Tower
  ctx.rect(bx, by + h * 0.2, w * 0.25, h * 0.8);
  // Left Tower Battlements
  ctx.moveTo(bx, by + h * 0.2);
  ctx.lineTo(bx, by + h * 0.1);
  ctx.lineTo(bx + w * 0.08, by + h * 0.1);
  ctx.lineTo(bx + w * 0.08, by + h * 0.15);
  ctx.lineTo(bx + w * 0.17, by + h * 0.15);
  ctx.lineTo(bx + w * 0.17, by + h * 0.1);
  ctx.lineTo(bx + w * 0.25, by + h * 0.1);
  ctx.lineTo(bx + w * 0.25, by + h * 0.2);

  // Right Tower
  ctx.rect(bx + w * 0.75, by + h * 0.2, w * 0.25, h * 0.8);
  // Right Tower Battlements
  ctx.moveTo(bx + w * 0.75, by + h * 0.2);
  ctx.lineTo(bx + w * 0.75, by + h * 0.1);
  ctx.lineTo(bx + w * 0.83, by + h * 0.1);
  ctx.lineTo(bx + w * 0.83, by + h * 0.15);
  ctx.lineTo(bx + w * 0.92, by + h * 0.15);
  ctx.lineTo(bx + w * 0.92, by + h * 0.15);
  ctx.lineTo(bx + w * 0.92, by + h * 0.1);
  ctx.lineTo(bx + w * w, by + h * 0.1); // end edge
  ctx.lineTo(bx + w, by + h * 0.1);
  ctx.lineTo(bx + w, by + h * 0.2);

  // Center Wall
  ctx.rect(bx + w * 0.25, by + h * 0.4, w * 0.5, h * 0.6);
  // Center Wall Battlements
  ctx.moveTo(bx + w * 0.25, by + h * 0.4);
  ctx.lineTo(bx + w * 0.25, by + h * 0.33);
  ctx.lineTo(bx + w * 0.35, by + h * 0.33);
  ctx.lineTo(bx + w * 0.35, by + h * 0.4);
  ctx.lineTo(bx + w * 0.45, by + h * 0.4);
  ctx.lineTo(bx + w * 0.45, by + h * 0.33);
  ctx.lineTo(bx + w * 0.55, by + h * 0.33);
  ctx.lineTo(bx + w * 0.55, by + h * 0.4);
  ctx.lineTo(bx + w * 0.65, by + h * 0.4);
  ctx.lineTo(bx + w * 0.65, by + h * 0.33);
  ctx.lineTo(bx + w * 0.75, by + h * 0.33);
  ctx.lineTo(bx + w * 0.75, by + h * 0.4);

  // Center Gate Archway
  ctx.moveTo(bx + w * 0.4, by + h);
  ctx.lineTo(bx + w * 0.4, by + h * 0.7);
  ctx.quadraticCurveTo(bx + w * 0.5, by + h * 0.58, bx + w * 0.6, by + h * 0.7);
  ctx.lineTo(bx + w * 0.6, by + h);

  // Windows in Left Tower
  ctx.moveTo(bx + w * 0.12, by + h * 0.35);
  ctx.lineTo(bx + w * 0.12, by + h * 0.45);
  ctx.moveTo(bx + w * 0.12, by + h * 0.6);
  ctx.lineTo(bx + w * 0.12, by + h * 0.7);

  // Windows in Right Tower
  ctx.moveTo(bx + w * 0.88, by + h * 0.35);
  ctx.lineTo(bx + w * 0.88, by + h * 0.45);
  ctx.moveTo(bx + w * 0.88, by + h * 0.6);
  ctx.lineTo(bx + w * 0.88, by + h * 0.7);

  ctx.stroke();
  ctx.restore();
}

export function drawQuill(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  setStrokeStyles(ctx);
  ctx.beginPath();

  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  // Diagonal shaft (from top right to bottom left)
  const xStart = cx + r * 0.7;
  const yStart = cy - r * 0.7;
  const xEnd = cx - r * 0.8;
  const yEnd = cy + r * 0.8;

  ctx.moveTo(xStart, yStart);
  ctx.lineTo(xEnd, yEnd); // Main shaft/quill stem

  // Quill Nib details
  ctx.moveTo(xEnd, yEnd);
  ctx.lineTo(xEnd + r * 0.15, yEnd - r * 0.05);
  ctx.lineTo(xEnd + r * 0.05, yEnd - r * 0.15);
  ctx.closePath();

  // Feather body (drawn as curves bulging out on both sides of the shaft)
  // Left side curves
  ctx.moveTo(xStart - r * 0.08, yStart + r * 0.08);
  ctx.bezierCurveTo(
    cx + r * 0.1, cy - r * 0.5,
    cx - r * 0.5, cy + r * 0.1,
    xEnd + r * 0.25, yEnd - r * 0.25
  );

  // Right side curves
  ctx.moveTo(xStart + r * 0.04, yStart - r * 0.04);
  ctx.bezierCurveTo(
    cx + r * 0.7, cy - r * 0.1,
    cx + r * 0.1, cy + r * 0.5,
    xEnd + r * 0.35, yEnd - r * 0.15
  );

  // Feather barbs/lines (drawn diagonally inwards)
  const steps = 6;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const px = xStart + (xEnd - xStart) * t;
    const py = yStart + (yEnd - yStart) * t;
    
    // Left barb
    ctx.moveTo(px, py);
    ctx.lineTo(px - r * 0.25, py - r * 0.05);
    
    // Right barb
    ctx.moveTo(px, py);
    ctx.lineTo(px + r * 0.05, py + r * 0.25);
  }

  ctx.stroke();
  ctx.restore();
}

export function drawCandle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  setStrokeStyles(ctx);
  ctx.beginPath();

  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  // Base stand / Holder
  ctx.moveTo(cx - r * 0.6, cy + r * 0.7);
  ctx.lineTo(cx + r * 0.6, cy + r * 0.7);
  ctx.quadraticCurveTo(cx, cy + r * 0.9, cx - r * 0.6, cy + r * 0.7); // tray bottom
  
  // Holder handle (finger ring)
  ctx.moveTo(cx + r * 0.5, cy + r * 0.7);
  ctx.arc(cx + r * 0.65, cy + r * 0.55, r * 0.18, 0, Math.PI * 2);

  // Candle Body
  ctx.rect(cx - r * 0.2, cy - r * 0.3, r * 0.4, r * 1.0);

  // Melted wax drips
  ctx.moveTo(cx - r * 0.2, cy - r * 0.1);
  ctx.quadraticCurveTo(cx - r * 0.1, cy + r * 0.1, cx - r * 0.1, cy);
  ctx.quadraticCurveTo(cx - r * 0.1, cy - r * 0.1, cx, cy - r * 0.1);
  
  ctx.moveTo(cx + r * 0.2, cy);
  ctx.quadraticCurveTo(cx + r * 0.15, cy + r * 0.2, cx + r * 0.1, cy + r * 0.1);
  ctx.quadraticCurveTo(cx + r * 0.08, cy, cx, cy);

  // Wick
  ctx.moveTo(cx, cy - r * 0.3);
  ctx.lineTo(cx, cy - r * 0.45);

  // Flame
  ctx.moveTo(cx, cy - r * 0.45);
  ctx.quadraticCurveTo(cx - r * 0.15, cy - r * 0.6, cx, cy - r * 0.8); // left flame curve
  ctx.quadraticCurveTo(cx + r * 0.15, cy - r * 0.6, cx, cy - r * 0.45); // right flame curve

  // Inner flame detail
  ctx.moveTo(cx, cy - r * 0.48);
  ctx.quadraticCurveTo(cx - r * 0.06, cy - r * 0.58, cx, cy - r * 0.7);
  ctx.quadraticCurveTo(cx + r * 0.06, cy - r * 0.58, cx, cy - r * 0.48);

  ctx.stroke();
  ctx.restore();
}

export function drawCompassRose(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  setStrokeStyles(ctx);
  ctx.beginPath();

  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2;

  // Outer Ring
  ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
  // Inner Ring
  ctx.moveTo(cx + r * 0.75, cy);
  ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);

  // Compass center hub
  ctx.moveTo(cx + r * 0.08, cy);
  ctx.arc(cx, cy, r * 0.08, 0, Math.PI * 2);

  // Principal Points (N, S, E, W)
  // North Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.72);
  ctx.lineTo(cx - r * 0.1, cy - r * 0.2);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + r * 0.1, cy - r * 0.2);
  ctx.lineTo(cx, cy - r * 0.72);

  // South Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + r * 0.72);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.2);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + r * 0.1, cy + r * 0.2);
  ctx.lineTo(cx, cy + r * 0.72);

  // East Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.72, cy);
  ctx.lineTo(cx + r * 0.2, cy - r * 0.1);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + r * 0.2, cy + r * 0.1);
  ctx.lineTo(cx + r * 0.72, cy);

  // West Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - r * 0.72, cy);
  ctx.lineTo(cx - r * 0.2, cy - r * 0.1);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - r * 0.2, cy + r * 0.1);
  ctx.lineTo(cx - r * 0.72, cy);

  // Half-winds (NE, NW, SE, SW)
  const diagLength = r * 0.5;
  const dOffset = r * 0.07;

  // NE Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + diagLength, cy - diagLength);
  ctx.lineTo(cx + dOffset * 1.5, cy - dOffset * 0.2);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + dOffset * 0.2, cy - dOffset * 1.5);
  ctx.lineTo(cx + diagLength, cy - diagLength);

  // NW Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - diagLength, cy - diagLength);
  ctx.lineTo(cx - dOffset * 1.5, cy - dOffset * 0.2);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - dOffset * 0.2, cy - dOffset * 1.5);
  ctx.lineTo(cx - diagLength, cy - diagLength);

  // SE Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + diagLength, cy + diagLength);
  ctx.lineTo(cx + dOffset * 1.5, cy + dOffset * 0.2);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + dOffset * 0.2, cy + dOffset * 1.5);
  ctx.lineTo(cx + diagLength, cy + diagLength);

  // SW Point
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - diagLength, cy + diagLength);
  ctx.lineTo(cx - dOffset * 1.5, cy + dOffset * 0.2);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - dOffset * 0.2, cy + dOffset * 1.5);
  ctx.lineTo(cx - diagLength, cy + diagLength);

  ctx.stroke();
  ctx.restore();
}

export function drawIconByName(ctx: CanvasRenderingContext2D, name: IconName, x: number, y: number, size: number) {
  switch (name) {
    case 'dragon':
      drawDragon(ctx, x, y, size);
      break;
    case 'castle':
      drawCastle(ctx, x, y, size);
      break;
    case 'quill':
      drawQuill(ctx, x, y, size);
      break;
    case 'candle':
      drawCandle(ctx, x, y, size);
      break;
    case 'compass':
      drawCompassRose(ctx, x, y, size);
      break;
  }
}
