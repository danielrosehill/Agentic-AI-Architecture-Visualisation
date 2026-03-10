/**
 * D3.js implementation of the Agentic AI Architecture Map.
 *
 * This renderer reads the canonical data model from data/architecture.json
 * and produces an interactive SVG diagram with zoom, pan, and tooltips.
 *
 * Usage:
 *   Serve this directory (or the repo root) with any static server:
 *     npx serve .
 *   Then open implementations/d3/index.html
 */

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

// ── Load data ──
const data = await fetch('../../data/architecture.json').then(r => r.json());

// ── Layout constants ──
const W = 960, H = 860;
const COL_LEFT = 90, COL_RIGHT = 800;
const centerW = 380;
const centerX = (W - centerW) / 2;
const centerCX = W / 2;

// Y positions for center layers (keyed by layer id)
const layerY = {
  'prompts':       { y: 20,  h: 55 },
  'models':        { y: 95,  h: 60 },
  'inference':     { y: 175, h: 60 },
  'agents':        { y: 255, h: 85 },
  'mcp':           { y: 372, h: 50 },
  'hitl':          { y: 454, h: 28 },
  'integrations':  { y: 512, h: 85 },
  'storage':       { y: 630, h: 80 },
  'context-store': { y: 750, h: 65 },
};

// ── Container ──
const container = document.getElementById('diagram');
const svg = d3.select(container)
  .append('svg')
  .attr('viewBox', `0 0 ${W} ${H}`)
  .attr('preserveAspectRatio', 'xMidYMid meet');

const g = svg.append('g');

const zoom = d3.zoom()
  .scaleExtent([0.4, 2.5])
  .on('zoom', (event) => g.attr('transform', event.transform));
svg.call(zoom);

// ── Tooltip ──
const tooltipEl = document.createElement('div');
tooltipEl.className = 'tooltip';
document.body.appendChild(tooltipEl);

function showTooltip(evt, text) {
  tooltipEl.textContent = text;
  tooltipEl.style.opacity = '1';
  let left = evt.clientX - 110;
  let top = evt.clientY - 60;
  if (top < 8) top = evt.clientY + 20;
  if (left < 8) left = 8;
  if (left + 220 > window.innerWidth - 8) left = window.innerWidth - 228;
  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = top + 'px';
}

function hideTooltip() {
  tooltipEl.style.opacity = '0';
}

// ── Drawing helpers ──
let gradId = 0;
const defs = svg.append('defs');

function makeGradient(c1, c2) {
  const id = `g-${gradId++}`;
  const grad = defs.append('linearGradient')
    .attr('id', id)
    .attr('x1', '0%').attr('y1', '0%')
    .attr('x2', '100%').attr('y2', '100%');
  grad.append('stop').attr('offset', '0%').attr('stop-color', c1);
  grad.append('stop').attr('offset', '100%').attr('stop-color', c2);
  return id;
}

function darken(hex, amt = 30) {
  let r = parseInt(hex.slice(1, 3), 16) - amt;
  let g = parseInt(hex.slice(3, 5), 16) - amt;
  let b = parseInt(hex.slice(5, 7), 16) - amt;
  return `#${Math.max(0,r).toString(16).padStart(2,'0')}${Math.max(0,g).toString(16).padStart(2,'0')}${Math.max(0,b).toString(16).padStart(2,'0')}`;
}

function addChip(parent, x, y, label, color, tooltip) {
  const chipG = parent.append('g').style('cursor', 'default');
  const textW = label.length * 7.2 + 20;
  const chipH = 28;
  const chipX = x - textW / 2;
  const gid = makeGradient(color, darken(color));

  chipG.append('rect')
    .attr('x', chipX).attr('y', y)
    .attr('width', textW).attr('height', chipH)
    .attr('rx', 6).attr('fill', `url(#${gid})`);

  chipG.append('text')
    .attr('x', x).attr('y', y + chipH / 2 + 1)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '11')
    .attr('font-weight', '600')
    .text(label);

  if (tooltip) {
    chipG
      .on('mousemove', (evt) => showTooltip(evt, tooltip))
      .on('mouseleave', hideTooltip);
  }
}

function addLayerBox(parent, x, y, w, h, color, label, opts = {}) {
  const alpha = opts.bgAlpha || '06';
  const rect = parent.append('rect')
    .attr('x', x).attr('y', y).attr('width', w).attr('height', h)
    .attr('rx', 12)
    .attr('fill', color + alpha)
    .attr('stroke', color)
    .attr('stroke-width', 2);
  if (opts.dashed) rect.attr('stroke-dasharray', '6 4');

  parent.append('rect')
    .attr('x', x + 16).attr('y', y - 8)
    .attr('width', label.length * 7.5 + 12).attr('height', 16)
    .attr('fill', '#fff');
  parent.append('text')
    .attr('x', x + 22).attr('y', y + 3)
    .attr('fill', opts.labelColor || '#666')
    .attr('font-size', '10')
    .attr('font-weight', '600')
    .attr('letter-spacing', '0.1em')
    .text(label.toUpperCase());

  if (opts.rightLabel) {
    parent.append('rect')
      .attr('x', x + w - opts.rightLabel.length * 7 - 22).attr('y', y - 8)
      .attr('width', opts.rightLabel.length * 7 + 12).attr('height', 16)
      .attr('fill', '#fff');
    parent.append('text')
      .attr('x', x + w - 16).attr('y', y + 3)
      .attr('text-anchor', 'end')
      .attr('fill', color)
      .attr('font-size', '9')
      .attr('font-weight', '600')
      .attr('letter-spacing', '0.12em')
      .text(opts.rightLabel.toUpperCase());
  }
}

function addCard(parent, cx, y, w, h, color, icon, title, tooltip) {
  const cardG = parent.append('g').style('cursor', 'pointer');
  const x = cx - w / 2;
  const gid = makeGradient(color, darken(color));

  cardG.append('rect')
    .attr('x', x).attr('y', y).attr('width', w).attr('height', h)
    .attr('rx', 10).attr('fill', `url(#${gid})`);

  cardG.append('text')
    .attr('x', cx).attr('y', y + h / 2 - 6)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '18')
    .text(icon);
  cardG.append('text')
    .attr('x', cx).attr('y', y + h / 2 + 12)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '12')
    .attr('font-weight', '700')
    .text(title);

  if (tooltip) {
    cardG
      .on('mousemove', (evt) => showTooltip(evt, tooltip))
      .on('mouseleave', hideTooltip);
  }

  return { x, y, w, h, cx, cy: y + h / 2 };
}

function addSubChips(parent, cx, y, items, color) {
  const chipH = 20, gap = 4;
  const totalW = items.reduce((s, t) => s + t.length * 6 + 16 + gap, -gap);
  let startX = cx - totalW / 2;
  items.forEach(item => {
    const chipW = item.length * 6 + 16;
    parent.append('rect')
      .attr('x', startX).attr('y', y)
      .attr('width', chipW).attr('height', chipH)
      .attr('rx', 5)
      .attr('fill', color + '14')
      .attr('stroke', color + '4d')
      .attr('stroke-width', 1.5);
    parent.append('text')
      .attr('x', startX + chipW / 2).attr('y', y + chipH / 2 + 1)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', color)
      .attr('font-size', '8.5')
      .attr('font-weight', '600')
      .text(item);
    startX += chipW + gap;
  });
}

function drawConnection(arrowsG, x1, y1, x2, y2, color, opts = {}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  let d;
  if (Math.abs(y2 - y1) > Math.abs(x2 - x1)) {
    d = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
  } else {
    d = `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
  }
  if (opts.curved === 'horizontal') {
    d = `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`;
  }

  arrowsG.append('path')
    .attr('d', d)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('opacity', opts.opacity ?? 0.7)
    .attr('stroke-dasharray', opts.dashed ? '6 4' : 'none');

  if (!opts.noArrow) {
    const angle = Math.atan2(y2 - midY, x2 - midX);
    const hl = 7;
    arrowsG.append('polygon')
      .attr('points', `${x2},${y2} ${x2 - hl * Math.cos(angle - 0.4)},${y2 - hl * Math.sin(angle - 0.4)} ${x2 - hl * Math.cos(angle + 0.4)},${y2 - hl * Math.sin(angle + 0.4)}`)
      .attr('fill', color)
      .attr('opacity', opts.opacity ?? 0.7);
  }

  if (opts.label) {
    arrowsG.append('text')
      .attr('x', midX).attr('y', midY - 4)
      .attr('text-anchor', 'middle')
      .attr('fill', color)
      .attr('font-size', '9')
      .attr('font-weight', '700')
      .text(opts.label);
  }
}

// ══════════════════════════
// ── RENDER FROM DATA ──
// ══════════════════════════

const arrowsG = g.append('g');
const nodesG = g.append('g');

// Helper to find a layer by id
function L(id) { return data.layers.find(l => l.id === id); }

// ── Center column layers ──
const centerLayers = data.layers.filter(l => l.position === 'center');
centerLayers.forEach(layer => {
  const pos = layerY[layer.id];
  if (!pos) return;

  if (layer.style === 'checkpoint') {
    // HITL special rendering
    const hitlG = nodesG.append('g');
    const hitlW = 180;
    hitlG.append('rect')
      .attr('x', centerCX - hitlW / 2).attr('y', pos.y)
      .attr('width', hitlW).attr('height', pos.h)
      .attr('rx', 14)
      .attr('fill', layer.color + '0f')
      .attr('stroke', layer.color)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4 3');
    hitlG.append('text')
      .attr('x', centerCX).attr('y', pos.y + pos.h / 2 + 1)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', layer.color)
      .attr('font-size', '9.5')
      .attr('font-weight', '700')
      .text('\u{1F6D1} HUMAN-IN-THE-LOOP');
    hitlG
      .on('mousemove', (evt) => showTooltip(evt, layer.description))
      .on('mouseleave', hideTooltip);
    return;
  }

  // Standard layer box
  addLayerBox(nodesG, centerX, pos.y, centerW, pos.h, layer.color, layer.label, {
    dashed: layer.style === 'dashed',
    labelColor: layer.id === 'mcp' ? '#d4920e' : undefined,
    rightLabel: layer.tags?.includes('backend') ? 'Backend' : undefined,
  });

  // Render nodes as chips
  const nodes = layer.nodes || [];
  const count = nodes.length;

  if (layer.id === 'agents') {
    // Custom two-row layout for agents
    addChip(nodesG, centerCX, pos.y + 20, nodes[0].label, layer.color, nodes[0].description);
    nodes.slice(1).forEach((n, i) => {
      const offset = (i - 1) * 80;
      addChip(nodesG, centerCX + offset, pos.y + 52, n.label, layer.color, n.description);
    });
  } else if (layer.id === 'storage') {
    // Two-row layout for storage
    nodes.slice(0, 3).forEach((n, i) => {
      const offset = (i - 1) * 105;
      addChip(nodesG, centerCX + offset, pos.y + 18, n.label, layer.color, n.description);
    });
    addChip(nodesG, centerCX - 80, pos.y + 50, nodes[3].label, layer.color, nodes[3].description);
    addChip(nodesG, centerCX + 70, pos.y + 50, nodes[4].label, layer.color, nodes[4].description);
  } else if (layer.id === 'integrations') {
    addChip(nodesG, centerCX - 80, pos.y + 22, nodes[0].label, layer.color, nodes[0].description);
    addChip(nodesG, centerCX + 70, pos.y + 22, nodes[1].label, layer.color, nodes[1].description);
    addChip(nodesG, centerCX, pos.y + 54, nodes[2].label, layer.color, nodes[2].description);
  } else if (layer.id === 'context-store') {
    addChip(nodesG, centerCX - 65, pos.y + 25, nodes[0].label, layer.color, nodes[0].description);
    addChip(nodesG, centerCX + 75, pos.y + 25, nodes[1].label, layer.color, nodes[1].description);
  } else {
    // Default: single row, evenly spaced
    nodes.forEach((n, i) => {
      const spacing = 200 / Math.max(count - 1, 1);
      const offset = count === 1 ? 0 : (i - (count - 1) / 2) * spacing;
      addChip(nodesG, centerCX + offset * 0.55, pos.y + (pos.h > 50 ? 20 : 16), n.label, layer.color, n.description);
    });
  }
});

// ── Left column: Frontends ──
const feLayer = L('frontends');
const feCard = addCard(nodesG, COL_LEFT, layerY.models.y + 20, 130, 65,
  feLayer.color, '\u{1F4BB}', 'Frontends', feLayer.description);
const feItems = feLayer.sub_items || [];
for (let i = 0; i < feItems.length; i += 2) {
  const row = feItems.slice(i, i + 2);
  addSubChips(nodesG, COL_LEFT, feCard.y + feCard.h + 8 + (i / 2) * 26, row, feLayer.color);
}

// ── Right column: Safety ──
const safetyLayer = L('safety');
const safetyCard = addCard(nodesG, COL_RIGHT, layerY.models.y + 20, 130, 65,
  safetyLayer.color, '\u{1F6E1}\uFE0F', 'Safety', safetyLayer.description);
(safetyLayer.sub_items || []).forEach((item, i) => {
  addSubChips(nodesG, COL_RIGHT, safetyCard.y + safetyCard.h + 8 + i * 26, [item], safetyLayer.color);
});

// ── Right column: Observability ──
const obsLayer = L('observability');
const obsCard = addCard(nodesG, COL_RIGHT, layerY.agents.y - 10, 130, 65,
  obsLayer.color, '\u{1F4CA}', 'Observability', obsLayer.description);
addSubChips(nodesG, COL_RIGHT, obsCard.y + obsCard.h + 8, ['Eval', 'Logging'], obsLayer.color);
addSubChips(nodesG, COL_RIGHT, obsCard.y + obsCard.h + 34, ['Monitoring'], obsLayer.color);

// ══════════════════════════
// ── CONNECTIONS ──
// ══════════════════════════

// Vertical center stack
drawConnection(arrowsG, centerCX, layerY.prompts.y + layerY.prompts.h, centerCX, layerY.models.y, '#4a6fa5');
drawConnection(arrowsG, centerCX, layerY.models.y + layerY.models.h, centerCX, layerY.inference.y, '#8b5cf6');
drawConnection(arrowsG, centerCX, layerY.inference.y + layerY.inference.h, centerCX, layerY.agents.y, '#6366f1');
drawConnection(arrowsG, centerCX, layerY.agents.y + layerY.agents.h, centerCX, layerY.mcp.y, '#e85d26');
drawConnection(arrowsG, centerCX, layerY.mcp.y + layerY.mcp.h, centerCX, layerY.hitl.y, '#f5a623', { noArrow: true });
drawConnection(arrowsG, centerCX, layerY.hitl.y + layerY.hitl.h, centerCX, layerY.integrations.y, '#b91c1c');

// "TAKING ACTIONS" label
arrowsG.append('text')
  .attr('x', centerCX + 75)
  .attr('y', (layerY.mcp.y + layerY.mcp.h + layerY.hitl.y) / 2 + 2)
  .attr('text-anchor', 'start')
  .attr('fill', '#f5a623')
  .attr('font-size', '9')
  .attr('font-weight', '700')
  .attr('letter-spacing', '0.05em')
  .text('TAKING ACTIONS');

// Agents → Storage (side path)
drawConnection(arrowsG, centerCX + 100, layerY.agents.y + layerY.agents.h, centerCX + 100, layerY.storage.y, '#14b8a6', { dashed: true, opacity: 0.45 });

// Storage → Context Store
drawConnection(arrowsG, centerCX, layerY.storage.y + layerY.storage.h, centerCX, layerY['context-store'].y, '#2563eb', { dashed: true, label: 'CONTEXT-MINING' });

// Context Store → Agents (feedback loop)
arrowsG.append('path')
  .attr('d', `M${centerX - 4},${layerY['context-store'].y + layerY['context-store'].h / 2} C${centerX - 55},${layerY['context-store'].y + layerY['context-store'].h / 2} ${centerX - 55},${layerY.agents.y + layerY.agents.h / 2} ${centerX},${layerY.agents.y + layerY.agents.h / 2}`)
  .attr('fill', 'none')
  .attr('stroke', '#2563eb')
  .attr('stroke-width', 1.5)
  .attr('stroke-dasharray', '4 3')
  .attr('opacity', 0.45);
arrowsG.append('polygon')
  .attr('points', `${centerX},${layerY.agents.y + layerY.agents.h / 2} ${centerX - 7},${layerY.agents.y + layerY.agents.h / 2 + 4} ${centerX - 7},${layerY.agents.y + layerY.agents.h / 2 - 4}`)
  .attr('fill', '#2563eb')
  .attr('opacity', 0.45);

// Safety & Observability → Agents
drawConnection(arrowsG, COL_RIGHT - 65, safetyCard.cy, centerX + centerW, layerY.agents.y + 30, '#b91c1c', { curved: 'horizontal' });
drawConnection(arrowsG, COL_RIGHT - 65, obsCard.cy, centerX + centerW, layerY.agents.y + 55, '#065f46', { curved: 'horizontal' });

// INPUT: Frontends → Prompts
const inX1 = COL_LEFT + 65, inY1 = feCard.y + feCard.h * 0.3;
const inX2 = centerCX - 20, inY2 = layerY.prompts.y;
arrowsG.append('path')
  .attr('d', `M${inX1},${inY1} C${inX1 + 40},${inY1} ${inX2},${inY1} ${inX2},${inY2}`)
  .attr('fill', 'none').attr('stroke', '#4a6fa5')
  .attr('stroke-width', 2).attr('stroke-dasharray', '6 3').attr('opacity', 0.6);
arrowsG.append('polygon')
  .attr('points', `${inX2},${inY2} ${inX2 - 5},${inY2 + 8} ${inX2 + 5},${inY2 + 8}`)
  .attr('fill', '#4a6fa5').attr('opacity', 0.6);
arrowsG.append('text')
  .attr('x', (inX1 + inX2) / 2 + 15).attr('y', inY1 - 6)
  .attr('text-anchor', 'middle').attr('fill', '#4a6fa5')
  .attr('font-size', '9').attr('font-weight', '700').text('INPUT');

// OUTPUT: Agents → Frontends
const outX1 = centerX, outY1 = layerY.agents.y + layerY.agents.h * 0.65;
const outX2 = COL_LEFT + 65, outY2 = feCard.y + feCard.h * 0.7;
arrowsG.append('path')
  .attr('d', `M${outX1},${outY1} C${(outX1 + outX2) / 2},${outY1} ${(outX1 + outX2) / 2},${outY2} ${outX2},${outY2}`)
  .attr('fill', 'none').attr('stroke', '#e85d26')
  .attr('stroke-width', 2).attr('stroke-dasharray', '6 3').attr('opacity', 0.6);
arrowsG.append('polygon')
  .attr('points', `${outX2},${outY2} ${outX2 + 7},${outY2 - 4} ${outX2 + 7},${outY2 + 4}`)
  .attr('fill', '#e85d26').attr('opacity', 0.6);
arrowsG.append('text')
  .attr('x', (outX1 + outX2) / 2).attr('y', outY1 + 14)
  .attr('text-anchor', 'middle').attr('fill', '#e85d26')
  .attr('font-size', '9').attr('font-weight', '700').text('OUTPUT');
