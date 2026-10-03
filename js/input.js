// raton, tactil y teclado
const drag = { m: null };

function onDown(e) {
  const t = e.target, nd = t.closest('.node'), a = t.dataset.a;
  if (!nd) { pick(null); drag.m = { k: 'pan', x: e.clientX, y: e.clientY, cx: S.cam.x, cy: S.cam.y }; return; }
  const id = nd.dataset.id, n = byId(id);
  if (t.closest('[contenteditable]')) return pick(id);
  if (a === 'del') return delNode(id);
  if (a === 'color') return recolor(id);
  pick(id);
  drag.m = a === 'link' ? { k: 'link', id } : { k: 'move', n, x: e.clientX, y: e.clientY, ox: n.x, oy: n.y };
  e.preventDefault();
}

function onMove(e) {
  const m = drag.m;
  if (!m) return;
  if (m.k === 'pan') { S.cam.x = m.cx + e.clientX - m.x; S.cam.y = m.cy + e.clientY - m.y; apply(); }
  if (m.k === 'link') drawTemp(byId(m.id), toWorld(e.clientX, e.clientY));
  if (m.k === 'move') {
    if (!m.did) { commit(); m.did = true; }
    m.n.x = m.ox + (e.clientX - m.x) / S.cam.k;
    m.n.y = m.oy + (e.clientY - m.y) / S.cam.k;
    draw(m.n); drawLinks();
  }
}

function onUp(e) {
  const m = drag.m;
  drag.m = null;
  if (!m) return;
  if (m.k === 'move' && m.did) save();
  if (m.k === 'link') {
    drawTemp();
    const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('.node');
    if (t) link(m.id, t.dataset.id);
  }
}

function onDbl(e) {
  if (e.target.closest('.node')) return;
  const p = e.target.closest('path');
  if (p && p.dataset.id) return unlink(p.dataset.id);
  const w = toWorld(e.clientX, e.clientY);
  addNode(w.x, w.y);
}

function onBlur(e) {
  const f = e.target.dataset.f;
  if (!f) return;
  const v = e.target.innerText.trim();
  if (!v) e.target.textContent = '';
  edit(e.target.closest('.node').dataset.id, f, v);
}

function onKey(e) {
  const t = e.target;
  if (t.closest('[contenteditable]')) {
    if (e.key === 'Escape' || (e.key === 'Enter' && t.dataset.f === 't')) { e.preventDefault(); t.blur(); }
    return;
  }
  const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
  if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
  else if (mod && k === 'y') { e.preventDefault(); redo(); }
  else if (k === 'tab' && S.sel) { e.preventDefault(); child(e.shiftKey ? -1 : 1); }
  else if ((k === 'delete' || k === 'backspace') && S.sel) delNode(S.sel);
  else if (k === 'l') layout();
  else if (k === 'f') fit();
}

function bind() {
  const s = $('stage');
  s.addEventListener('pointerdown', onDown);
  s.addEventListener('dblclick', onDbl);
  s.addEventListener('focusout', onBlur);
  s.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX, e.clientY); }, { passive: false });
  addEventListener('pointermove', onMove);
  addEventListener('pointerup', onUp);
  addEventListener('keydown', onKey);
}
