// arranque y acciones de la barra
const mid = () => { const r = $('stage').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

const ACT = {
  add: () => { const w = toWorld(...mid()); addNode(w.x, w.y); },
  layout, fit, undo, redo, png: savePNG, json: saveJSON,
  open: () => $('file').click(),
  zin: () => zoomAt(1.2, ...mid()),
  zout: () => zoomAt(1 / 1.2, ...mid()),
  wipe: () => { change(() => { S.nodes = []; S.links = []; }); redraw(); fit(); },
};

function seed() {
  const a = mkNode(0, 0, 'Nexus', 0);
  a.b = 'Mapas conceptuales rápidos. Todo se guarda solo.';
  [['Conectar', 'Arrastra el punto lateral hasta otro nodo.', 1],
   ['Tab', 'Con un nodo elegido crea un hijo ya enlazado.', 2],
   ['Organizar', 'La tecla L ordena todo en columnas.', 3]].forEach(([t, b, c], i) => {
    const n = mkNode(GX, (i - 1) * GY, t, c);
    n.b = b;
    S.links.push({ id: 'l' + i, a: a.id, b: n.id });
  });
}

function boot() {
  if (!restore()) seed();
  redraw(); fit(); bind();
  document.querySelectorAll('[data-do]').forEach(b => { b.onclick = ACT[b.dataset.do]; });
  $('file').onchange = e => { if (e.target.files[0]) openJSON(e.target.files[0]); e.target.value = ''; };
}

window.onload = boot;
