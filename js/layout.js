// organiza el mapa a dos lados desde el nodo elegido
const GX = 300, GY = 150;

function levels(root) {
  const m = new Map([[root, { d: 0, s: 0 }]]), q = [root];
  let i = 0;
  while (q.length) {
    const a = q.shift(), p = m.get(a);
    S.links.forEach(l => {
      const b = l.a === a ? l.b : l.b === a ? l.a : null;
      if (!b || m.has(b)) return;
      m.set(b, { d: p.d + 1, s: p.d ? p.s : (i++ % 2 ? -1 : 1) });
      q.push(b);
    });
  }
  return m;
}

function layout() {
  if (!S.nodes.length) return;
  const m = levels(S.sel || S.nodes[0].id), cols = {};
  const extra = Math.max(...[...m.values()].map(v => v.d)) + 1;
  change(() => {
    S.nodes.forEach(n => { const v = m.get(n.id) || { d: extra, s: 1 }; (cols[v.d * v.s] ||= []).push(n); });
    Object.entries(cols).forEach(([c, ns]) => ns.forEach((n, i) => {
      n.x = c * GX;
      n.y = (i - (ns.length - 1) / 2) * GY;
    }));
  });
  redraw(); fit();
}
