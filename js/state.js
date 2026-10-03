// estado global, historial y persistencia
const W = 220;
const KEY = 'nexus.v2';
const COLORS = ['#5b8cff', '#34d3a0', '#ffb454', '#ff6b8b', '#b38cff'];
const S = { nodes: [], links: [], id: 1, sel: null, cam: { x: 0, y: 0, k: 1 } };
const past = [], future = [];

const $ = id => document.getElementById(id);
const snap = () => JSON.stringify({ nodes: S.nodes, links: S.links, id: S.id });
const put = j => Object.assign(S, JSON.parse(j));

function save() { try { localStorage.setItem(KEY, snap()); } catch (e) {} }
function restore() { try { const j = localStorage.getItem(KEY); if (j) put(j); return !!j; } catch (e) { return false; } }
function commit() { past.push(snap()); future.length = 0; if (past.length > 100) past.shift(); }
function change(fn) { commit(); fn(); save(); }
function undo() { if (!past.length) return; future.push(snap()); put(past.pop()); redraw(); save(); }
function redo() { if (!future.length) return; past.push(snap()); put(future.pop()); redraw(); save(); }
