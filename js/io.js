// abrir, guardar y exportar (PNG se pinta en canvas, sin librerias)
function down(name, href) {
  const a = document.createElement('a');
  a.download = name;
  a.href = href;
  a.click();
}

function saveJSON() {
  down('mapa.json', URL.createObjectURL(new Blob([snap()], { type: 'application/json' })));
}

function openJSON(file) {
  file.text().then(t => {
    try { JSON.parse(t); } catch (e) { return; }
    change(() => put(t));
    redraw(); fit();
  });
}

function wrap(g, s, w) {
  const out = [];
  s.split('\n').forEach(p => {
    let l = '';
    p.split(' ').forEach(t => {
      const x = l ? l + ' ' + t : t;
      if (g.measureText(x).width > w && l) { out.push(l); l = t; } else l = x;
    });
    out.push(l);
  });
  return out;
}

function paintLink(g, l) {
  const a = byId(l.a), b = byId(l.b);
  if (!a || !b) return;
  const pa = port(a, b), pb = port(b, a);
  g.strokeStyle = g.fillStyle = '#59627a';
  g.lineWidth = 2.5;
  g.stroke(new Path2D(curve(pa, pb)));
  g.beginPath();
  g.moveTo(pb.x, pb.y); g.lineTo(pb.x + pb.d * 10, pb.y - 5); g.lineTo(pb.x + pb.d * 10, pb.y + 5);
  g.fill();
}

function paintNode(g, n, f) {
  g.beginPath();
  g.roundRect(n.x, n.y, W, n.h, 8);
  g.fillStyle = '#171a21'; g.fill();
  g.strokeStyle = '#2a2f3a'; g.lineWidth = 1; g.stroke();
  g.save(); g.clip();
  g.fillStyle = COLORS[n.c]; g.fillRect(n.x, n.y, W, 3);
  g.restore();
  g.beginPath(); g.arc(n.x + 16, n.y + 23, 6, 0, 7); g.fill();
  g.fillStyle = '#e8eaf0'; g.font = '600 14px ' + f;
  g.fillText(n.t, n.x + 30, n.y + 28, W - 40);
  g.fillStyle = '#8a93a6'; g.font = '14px ' + f;
  wrap(g, n.b, W - 20).forEach((t, i) => g.fillText(t, n.x + 10, n.y + 54 + i * 20));
}

function savePNG() {
  if (!S.nodes.length) return;
  const pad = 60, k = 2, f = '"IBM Plex Sans",system-ui,sans-serif';
  const x0 = Math.min(...S.nodes.map(n => n.x)) - pad, x1 = Math.max(...S.nodes.map(n => n.x + W)) + pad;
  const y0 = Math.min(...S.nodes.map(n => n.y)) - pad, y1 = Math.max(...S.nodes.map(n => n.y + n.h)) + pad;
  const c = document.createElement('canvas'), g = c.getContext('2d');
  c.width = (x1 - x0) * k; c.height = (y1 - y0) * k;
  g.scale(k, k); g.translate(-x0, -y0);
  g.fillStyle = '#0e1014'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  S.links.forEach(l => paintLink(g, l));
  S.nodes.forEach(n => paintNode(g, n, f));
  down('mapa.png', c.toDataURL());
}
