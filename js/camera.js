// camara: pan, zoom y ajuste
function apply() {
  const c = S.cam, s = $('stage');
  $('world').style.transform = `translate(${c.x}px,${c.y}px) scale(${c.k})`;
  s.style.backgroundPosition = `${c.x}px ${c.y}px`;
  s.style.backgroundSize = `${32 * c.k}px ${32 * c.k}px`;
  $('zoom').textContent = Math.round(c.k * 100) + '%';
}

function toWorld(px, py) {
  const r = $('stage').getBoundingClientRect();
  return { x: (px - r.left - S.cam.x) / S.cam.k, y: (py - r.top - S.cam.y) / S.cam.k };
}

function zoomAt(f, px, py) {
  const r = $('stage').getBoundingClientRect(), c = S.cam;
  const k = Math.min(3, Math.max(0.2, c.k * f)), x = px - r.left, y = py - r.top;
  c.x = x - (x - c.x) * k / c.k;
  c.y = y - (y - c.y) * k / c.k;
  c.k = k;
  apply();
}

function fit() {
  const r = $('stage').getBoundingClientRect(), pad = 90;
  if (!S.nodes.length) { S.cam = { x: r.width / 2, y: r.height / 2, k: 1 }; return apply(); }
  const x0 = Math.min(...S.nodes.map(n => n.x)), x1 = Math.max(...S.nodes.map(n => n.x + W));
  const y0 = Math.min(...S.nodes.map(n => n.y)), y1 = Math.max(...S.nodes.map(n => n.y + (n.h || 90)));
  const k = Math.min(1.2, (r.width - pad * 2) / (x1 - x0), (r.height - pad * 2) / (y1 - y0));
  S.cam = { k, x: r.width / 2 - (x0 + x1) / 2 * k, y: r.height / 2 - (y0 + y1) / 2 * k };
  apply();
}
