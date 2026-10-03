// enlaces: curvas con flecha
const NS = 'http://www.w3.org/2000/svg';
const byId = id => S.nodes.find(n => n.id === id);

function port(n, o) {
  const right = o.x > n.x;
  return { x: n.x + (right ? W : 0), y: n.y + (n.h || 90) / 2, d: right ? 1 : -1 };
}

function curve(a, b) {
  const m = Math.max(50, Math.abs(b.x - a.x) / 2);
  return `M${a.x} ${a.y}C${a.x + a.d * m} ${a.y},${b.x + b.d * m} ${b.y},${b.x} ${b.y}`;
}

function drawLinks() {
  const g = $('links');
  g.innerHTML = '';
  S.links.forEach(l => {
    const a = byId(l.a), b = byId(l.b);
    if (!a || !b) return;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', curve(port(a, b), port(b, a)));
    p.dataset.id = l.id;
    g.appendChild(p);
  });
}

function drawTemp(n, p) {
  if (!p) return $('temp').setAttribute('d', '');
  const a = port(n, p);
  $('temp').setAttribute('d', curve(a, { x: p.x, y: p.y, d: -a.d }));
}

function link(a, b) {
  if (a === b || S.links.some(l => (l.a === a && l.b === b) || (l.a === b && l.b === a))) return;
  change(() => S.links.push({ id: 'l' + Date.now(), a, b }));
  drawLinks();
}

function unlink(id) {
  change(() => { S.links = S.links.filter(l => l.id !== id); });
  drawLinks();
}
