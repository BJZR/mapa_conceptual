// nodos: crear, dibujar, editar, borrar
const els = {};
const HTML = '<header><i data-a="color" title="Cambiar color"></i><b contenteditable="true" data-f="t"></b>'
  + '<button data-a="del" title="Borrar">×</button></header>'
  + '<p contenteditable="true" data-f="b" data-ph="Detalle"></p><u data-a="link" title="Arrastra para conectar"></u><u class="l" data-a="link" title="Arrastra para conectar"></u>';

function mkNode(x, y, t, c) {
  const n = { id: 'n' + S.id++, x: x - W / 2, y: y - 45, t, b: '', c };
  S.nodes.push(n);
  return n;
}

function draw(n) {
  let e = els[n.id];
  if (!e) {
    e = els[n.id] = document.createElement('div');
    e.className = 'node';
    e.dataset.id = n.id;
    e.innerHTML = HTML;
    e.querySelector('[data-f=t]').textContent = n.t;
    e.querySelector('[data-f=b]').textContent = n.b;
    $('nodes').appendChild(e);
  }
  e.style.transform = `translate(${n.x}px,${n.y}px)`;
  e.style.setProperty('--c', COLORS[n.c]);
  e.classList.toggle('sel', S.sel === n.id);
  n.h = e.offsetHeight;
}

function redraw() {
  $('nodes').innerHTML = '';
  Object.keys(els).forEach(k => delete els[k]);
  if (!byId(S.sel)) S.sel = null;
  S.nodes.forEach(draw);
  drawLinks();
}

function pick(id) {
  const old = S.sel;
  S.sel = id;
  [old, id].forEach(k => { const n = byId(k); if (n) draw(n); });
}

function focusTitle(id) {
  const t = els[id].querySelector('[data-f=t]');
  t.focus();
  getSelection().selectAllChildren(t);
}

function addNode(x, y) {
  let n;
  change(() => { n = mkNode(x, y, 'Concepto', 0); });
  draw(n); pick(n.id); focusTitle(n.id);
}

function child(dir = 1) {
  const p = byId(S.sel);
  if (!p) return;
  const k = S.links.filter(l => l.a === p.id).length;
  let c;
  change(() => {
    c = mkNode(p.x + dir * GX + W / 2, p.y + 45 + k * GY, 'Concepto', p.c);
    S.links.push({ id: 'l' + Date.now(), a: p.id, b: c.id });
  });
  draw(c); drawLinks(); pick(c.id); focusTitle(c.id);
}

function edit(id, f, v) {
  const n = byId(id);
  if (!n || n[f] === v) return;
  change(() => { n[f] = v; });
  draw(n); drawLinks();
}

function recolor(id) {
  const n = byId(id);
  change(() => { n.c = (n.c + 1) % COLORS.length; });
  draw(n);
}

function delNode(id) {
  change(() => {
    S.nodes = S.nodes.filter(n => n.id !== id);
    S.links = S.links.filter(l => l.a !== id && l.b !== id);
  });
  redraw();
}
