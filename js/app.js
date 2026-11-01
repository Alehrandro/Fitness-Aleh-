/* Disciplina Fit — aplicativo (HTML/CSS/JS puro, dados salvos no próprio navegador) */
(() => {
  'use strict';

  const D = window.DF;
  const KEY = 'disciplinafit:v1';

  /* ---------- utilidades ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, '0');
  const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const MON_S = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const WD = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const key = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => key(new Date());
  const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const longDate = (k) => { const d = parseKey(k); return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`; };
  const uid = () => 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const mmss = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
  function fmtDur(sec) {
    let h = Math.floor(sec / 3600);
    let m = Math.round((sec % 3600) / 60);
    if (m === 60) { h += 1; m = 0; }
    return h ? `${h}h ${pad(m)}min` : `${m}min`;
  }
  const plural = (n, a, b) => (n === 1 ? a : b);

  /* ---------- ícones ---------- */
  const I = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    chevR: '<path d="M9 6l6 6-6 6"/>',
    chevL: '<path d="M15 6l-6 6 6 6"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    logout: '<path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9M16 8l4 4-4 4M20 12H9"/>',
    chart: '<path d="M5 20V11M12 20V5M19 20v-7"/>',
    build: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 15.5l.5-2.5 5.5-5.5 2 2L11.5 15z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z"/><path d="M10 21h4"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    download: '<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/>',
    upload: '<path d="M12 15V4M7.5 8L12 3.5 16.5 8M5 20h14"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/>',
    rest: '<path d="M4 12h3l2-5 4 10 2-5h5"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    flame: '<path d="M12 3c.8 3.8 5 5.2 5 9.8a5 5 0 0 1-10 0c0-1.9.9-3.1 2-4 0 1.8.9 2.7 2 2.7 0-3-.9-5 1-8.5z"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',
    swap: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>'
  };
  const icon = (n, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

  /* ---------- armazenamento ---------- */
  function defaults() {
    return {
      v: 1, onboarded: false, admin: null, favs: {}, week: D.DEFAULT_WEEK.slice(),
      profile: { name: '', since: todayKey(), avatar: null, weightKg: null, heightCm: null, birth: '' },
      settings: { notifications: false, units: 'metric', reminderTime: '08:00', passwordHash: null, lastReminder: '' },
      monthlyGoal: 20,
      workouts: D.seedWorkouts(),
      schedule: {}, logs: {}, lastLoad: {}, session: null
    };
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && raw.v === 1) {
        const d = defaults();
        return Object.assign(d, raw, { profile: Object.assign(d.profile, raw.profile), settings: Object.assign(d.settings, raw.settings) });
      }
    } catch (e) { /* ignora */ }
    return defaults();
  }
  let S = load();
  let storageWarned = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { if (!storageWarned) { storageWarned = true; toast('Não foi possível salvar os dados neste navegador.'); } }
  }

  /* ---------- imagens (capa e exercícios) ---------- */
  // Os arquivos ficam em icons/ e são listados em icons/media.json (lido por todos os usuários).
  // No aparelho do admin também fica uma cópia no IndexedDB, para pré-visualização imediata.
  const COVER_FILE = 'capa-inicio.jpg';
  const exFile = (id) => `ex-${id}.jpg`;
  const IMG = { cover: null, ex: {} };
  let MANIFEST = { cover: null, exercises: {} };
  let dirHandle = null;
  const localUrl = {};

  function idb() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('disciplinafit-media', 1);
      r.onupgradeneeded = () => { r.result.createObjectStore('kv'); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  }
  async function kv(mode, fn) {
    const db = await idb();
    return new Promise((res, rej) => {
      const tx = db.transaction('kv', mode), rq = fn(tx.objectStore('kv'));
      tx.oncomplete = () => { db.close(); res(rq ? rq.result : undefined); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    });
  }
  const kvGet = (k) => kv('readonly', (s) => s.get(k));
  const kvSet = (k, v) => kv('readwrite', (s) => s.put(v, k));
  const kvDel = (k) => kv('readwrite', (s) => s.delete(k));
  const kvKeys = () => kv('readonly', (s) => s.getAllKeys());

  const readManifest = (j) => ({
    cover: j && j.cover && j.cover.file ? j.cover : null,
    exercises: j && j.exercises && typeof j.exercises === 'object' ? j.exercises : {}
  });
  function rebuildIMG() {
    const ok = (m) => m && /^[\w.-]+$/.test(m.file || '');
    const url = (m) => `icons/${m.file}?v=${m.v || 0}`;
    IMG.cover = localUrl['img:cover'] || (ok(MANIFEST.cover) ? url(MANIFEST.cover) : null);
    IMG.ex = {};
    Object.keys(MANIFEST.exercises).forEach((id) => { if (D.MAP[id] && ok(MANIFEST.exercises[id])) IMG.ex[id] = url(MANIFEST.exercises[id]); });
    Object.keys(localUrl).forEach((k) => { if (k.startsWith('img:ex:') && D.MAP[k.slice(7)]) IMG.ex[k.slice(7)] = localUrl[k]; });
  }
  async function loadMedia() {
    try {
      const r = await fetch('icons/media.json', { cache: 'no-store' });
      if (r.ok) MANIFEST = readManifest(await r.json());
    } catch (e) { /* sem manifesto ainda */ }
    try {
      const keys = await kvKeys();
      for (const k of keys) {
        if (typeof k === 'string' && k.startsWith('img:')) { const b = await kvGet(k); if (b) localUrl[k] = URL.createObjectURL(b); }
      }
      dirHandle = (await kvGet('dir')) || null;
    } catch (e) { /* IndexedDB indisponível */ }
    rebuildIMG();
  }
  async function clearMedia() {
    try { const keys = await kvKeys(); for (const k of keys) await kvDel(k); } catch (e) { /* ignora */ }
    Object.keys(localUrl).forEach((k) => { URL.revokeObjectURL(localUrl[k]); delete localUrl[k]; });
    dirHandle = null; rebuildIMG();
  }

  function processImage(file, max) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * sc)), h = Math.max(1, Math.round(img.height * sc));
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
        const ctx = cv.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        cv.toBlob((b) => (b ? res(b) : rej(new Error('blob'))), 'image/jpeg', 0.85);
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('img')); };
      img.src = url;
    });
  }
  async function getDir(interactive) {
    if (!dirHandle) return null;
    try {
      if (typeof dirHandle.queryPermission !== 'function') return dirHandle;
      let p = await dirHandle.queryPermission({ mode: 'readwrite' });
      if (p !== 'granted' && interactive) p = await dirHandle.requestPermission({ mode: 'readwrite' });
      return p === 'granted' ? dirHandle : null;
    } catch (e) { return null; }
  }
  async function writeFile(dir, name, data) {
    const fh = await dir.getFileHandle(name, { create: true }), w = await fh.createWritable();
    await w.write(data); await w.close();
  }
  const saveManifest = (dir) => writeFile(dir, 'media.json', JSON.stringify(MANIFEST, null, 2));
  async function syncLocal(dir) {
    const keys = (await kvKeys()).filter((k) => typeof k === 'string' && k.startsWith('img:'));
    for (const k of keys) {
      const b = await kvGet(k); if (!b) continue;
      const cover = k === 'img:cover', id = k.slice(7), name = cover ? COVER_FILE : exFile(id), entry = { file: name, v: Date.now() };
      if (!cover && !D.MAP[id]) continue;
      await writeFile(dir, name, b);
      if (cover) MANIFEST.cover = entry; else MANIFEST.exercises[id] = entry;
    }
    await saveManifest(dir); rebuildIMG(); return keys.length;
  }
  async function connectDir() {
    if (!window.showDirectoryPicker) throw new Error('unsupported');
    const h = await window.showDirectoryPicker({ mode: 'readwrite', id: 'disciplinafit-icons' });
    const dir = h.name === 'icons' ? h : await h.getDirectoryHandle('icons', { create: true });
    dirHandle = dir; try { await kvSet('dir', dir); } catch (e) { /* ignora */ }
    try { MANIFEST = readManifest(JSON.parse(await (await dir.getFileHandle('media.json')).getFile().then((f) => f.text()))); } catch (e) { /* pasta sem manifesto */ }
    const n = await syncLocal(dir); return n;
  }
  // Salva a imagem (redimensionada) em icons/ — ou baixa o arquivo, se não houver pasta conectada.
  async function setImage(kind, id, file) {
    const cover = kind === 'cover', name = cover ? COVER_FILE : exFile(id), key = cover ? 'img:cover' : 'img:ex:' + id;
    const blob = await processImage(file, cover ? 1280 : 800), entry = { file: name, v: Date.now() };
    if (localUrl[key]) URL.revokeObjectURL(localUrl[key]);
    try { await kvSet(key, blob); } catch (e) { /* sem IndexedDB */ }
    localUrl[key] = URL.createObjectURL(blob);
    if (cover) MANIFEST.cover = entry; else MANIFEST.exercises[id] = entry;
    rebuildIMG();
    const dir = await getDir(true);
    if (dir) {
      try { await writeFile(dir, name, blob); await saveManifest(dir); return 'folder'; } catch (e) { /* cai no download */ }
    }
    download(name, blob, 'image/jpeg'); return 'download';
  }
  async function delImage(kind, id) {
    const cover = kind === 'cover', name = cover ? COVER_FILE : exFile(id), key = cover ? 'img:cover' : 'img:ex:' + id;
    try { await kvDel(key); } catch (e) { /* ignora */ }
    if (localUrl[key]) { URL.revokeObjectURL(localUrl[key]); delete localUrl[key]; }
    if (cover) MANIFEST.cover = null; else delete MANIFEST.exercises[id];
    rebuildIMG();
    const dir = await getDir(true);
    if (dir) {
      try { try { await dir.removeEntry(name); } catch (e) { /* já não existia */ } await saveManifest(dir); return 'folder'; } catch (e) { /* ignora */ }
    }
    return 'local';
  }

  /* ---------- unidades ---------- */
  const imp = () => S.settings.units === 'imperial';
  const wU = () => (imp() ? 'lb' : 'kg');
  const hU = () => (imp() ? 'in' : 'cm');
  const r1 = (n) => Math.round(n * 10) / 10;
  const wDisp = (kg) => (kg == null ? '' : String(r1(imp() ? kg * 2.20462 : kg)));
  const wParse = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) && n >= 0 ? (imp() ? n / 2.20462 : n) : null; };
  const hDisp = (cm) => (cm == null ? '' : String(r1(imp() ? cm / 2.54 : cm)));
  const hParse = (v) => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) && n > 0 ? (imp() ? n * 2.54 : n) : null; };

  /* ---------- treinos, plano e estatísticas ---------- */
  const getW = (id) => S.workouts.find((w) => w.id === id);
  // Plano semanal: índice 0 = segunda … 6 = domingo; valor = id do treino, 'rest' ou null
  const wdi = (k) => (parseKey(k).getDay() + 6) % 7;
  function planFor(k) {
    const v = S.schedule[k];
    if (v === 'rest') return { rest: true };
    const w = v && getW(v);
    if (w) return { w, explicit: true };
    const wk = (S.week || [])[wdi(k)];
    if (wk === 'rest') return { rest: true, weekly: true };
    const ww = wk && getW(wk);
    if (ww) return { w: ww, explicit: false, weekly: true };
    return {};
  }
  const isDone = (k) => !!(S.logs[k] && S.logs[k].done);
  const doneKeys = () => Object.keys(S.logs).filter((k) => S.logs[k].done).sort();
  function streaks() {
    const ks = doneKeys(); const set = new Set(ks);
    let cur = 0; const d = new Date(); d.setHours(12, 0, 0, 0);
    if (!set.has(key(d))) d.setDate(d.getDate() - 1);
    while (set.has(key(d))) { cur++; d.setDate(d.getDate() - 1); }
    let best = 0, run = 0, prev = null;
    ks.forEach((k) => {
      const dt = parseKey(k);
      run = prev && Math.round((dt - prev) / 864e5) === 1 ? run + 1 : 1;
      best = Math.max(best, run); prev = dt;
    });
    return { cur, best };
  }
  function monthStats(y, m) {
    const pre = `${y}-${pad(m + 1)}-`;
    const ks = doneKeys().filter((k) => k.startsWith(pre));
    return { keys: ks, count: ks.length, sec: ks.reduce((a, k) => a + (S.logs[k].durationSec || 0), 0) };
  }
  const totalSec = () => doneKeys().reduce((a, k) => a + (S.logs[k].durationSec || 0), 0);
  const pctOf = (n, goal) => clamp(Math.round((n / Math.max(1, goal)) * 100), 0, 100);

  /* ---------- UI: componentes ---------- */
  const head = (title, o = {}) => `<header class="head">${o.back ? `<button class="iconbtn back" data-a="go" data-r="${o.back}" aria-label="Voltar">${icon('chevL')}</button>` : ''}<div class="ht"><h1>${title}</h1>${o.sub ? `<p>${o.sub}</p>` : ''}</div>${o.right || ''}</header>`;
  const avatar = (cls = '') => `<span class="avatar ${cls}">${S.profile.avatar ? `<img alt="" src="${esc(S.profile.avatar)}">` : esc((S.profile.name || 'A').trim().charAt(0).toUpperCase())}</span>`;
  const tile = (c = '', id) => (id && IMG.ex[id]
    ? `<span class="tile ${c} has-img"><img src="${esc(IMG.ex[id])}" alt="" loading="lazy"></span>`
    : `<span class="tile ${c}">${icon('dumbbell', 22)}</span>`);
  const chip = (label, on, a, data = '') => `<button class="chip ${on ? 'on' : ''}" data-a="${a}" ${data}>${esc(label)}</button>`;
  function ring(p, size, sw, label, fs) {
    const r = (size - sw) / 2, c = 2 * Math.PI * r;
    return `<div class="ringw" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#2a2a2d" stroke-width="${sw}"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="#ff7a1a" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - p / 100)).toFixed(2)}"/></svg><span style="font-size:${fs || 12}px">${label}</span></div>`;
  }
  const UNIT_W = { rep: 'repetições', s: 'segundos', min: 'minutos' }, UNIT_S = { rep: 'reps', s: 'seg', min: 'min' };
  const repsText = (it) => {
    const e = D.MAP[it.id], r = it.repsMin === it.repsMax ? it.repsMin : it.repsMin + '-' + it.repsMax;
    if (e && e.unit === 'min') return it.sets > 1 ? `${it.sets} × ${r} minutos` : `${r} minutos`;
    return `${it.sets} ${plural(it.sets, 'série', 'séries')} • ${r} ${e ? UNIT_W[e.unit] : 'repetições'}`;
  };
  const exName = (id) => (D.MAP[id] ? D.MAP[id].name : id);

  /* ---------- sheets, toast ---------- */
  const sheetEl = $('#sheet');
  let ss = null; // estado do sheet atual
  function openSheet(html) {
    sheetEl.innerHTML = `<div class="sheet-bd" data-a="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
    sheetEl.classList.add('open');
  }
  function closeSheet(skipRender) {
    sheetEl.classList.remove('open'); sheetEl.innerHTML = ''; ss = null;
    if (!skipRender) render();
  }
  let toastT;
  function toast(m) {
    const t = $('#toast'); t.textContent = m; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800);
  }
  function confirmSheet(title, text, action, data, label, danger) {
    const attrs = Object.keys(data || {}).map((k) => `data-${k}="${esc(data[k])}"`).join(' ');
    openSheet(`<h2>${esc(title)}</h2><p class="sub">${esc(text)}</p><div class="stack"><button class="btn ${danger ? 'danger' : ''}" data-a="${action}" ${attrs}>${esc(label)}</button><button class="btn ghost" data-a="closeSheet">Cancelar</button></div>`);
  }

  /* ---------- roteador ---------- */
  const go = (r) => { if (location.hash === '#/' + r) render(); else location.hash = '#/' + r; };
  const locked = () => !!S.settings.passwordHash && !sessionStorage.getItem('df:unlocked');
  const TAB = { inicio: 'inicio', treino: 'treino', exercicios: 'treino', montar: 'treino', 'meus-treinos': 'treino', calendario: 'calendario', perfil: 'perfil', 'meus-dados': 'perfil', config: 'perfil', ajuda: 'perfil', progresso: 'perfil', privacidade: 'perfil', admin: 'perfil', escolher: 'treino' };
  const NAV = [['inicio', 'home', 'Início'], ['treino', 'dumbbell', 'Treino'], ['calendario', 'calendar', 'Calendário'], ['perfil', 'user', 'Perfil']];
  let lastRoute = '';

  function render() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    let route = parts[0] || ''; const arg = parts[1];
    if (!route) route = S.onboarded && !sessionStorage.getItem('df:out') ? 'inicio' : 'bem-vindo';
    if (!S.onboarded || sessionStorage.getItem('df:out')) route = 'bem-vindo';
    const screens = { 'bem-vindo': welcome, inicio: home, treino, calendario, perfil, exercicios, montar, 'meus-treinos': meus, 'meus-dados': dados, config, ajuda, progresso, privacidade, admin, escolher };
    if (!screens[route]) route = 'inicio';
    if (locked()) route = 'lock';
    const prev = $('.screen'); const keepScroll = prev && lastRoute === route ? prev.scrollTop : 0;
    const noNav = route === 'bem-vindo' || route === 'lock';
    const body = route === 'lock' ? lock() : screens[route](arg);
    $('#app').innerHTML = body + (noNav ? '' : `<nav class="nav" aria-label="Navegação principal">${NAV.map(([r, ic, l]) => `<button class="${TAB[route] === r ? 'on' : ''}" data-a="go" data-r="${r}">${icon(ic, 24)}<span>${l}</span></button>`).join('')}</nav>`);
    const sc = $('.screen'); if (sc && keepScroll) sc.scrollTop = keepScroll;
    const pgr = $('.pager');
    if (pgr) { const i = Math.max(0, S.workouts.findIndex((w) => w.id === tSel)); pgr.scrollLeft = pgr.clientWidth * i; }
    lastRoute = route;
  }

  /* ---------- telas ---------- */
  function welcome() {
    return `<main class="welcome ${IMG.cover ? 'has-cover' : ''}" ${IMG.cover ? `style="--cover:url('${IMG.cover}')"` : ''}><div class="hero"><svg viewBox="0 0 320 240" fill="none" stroke="#ff7a1a" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a4d"/><stop offset="1" stop-color="#d65a05"/></linearGradient></defs>
      <g stroke="url(#g)" stroke-width="10"><path d="M95 70v100M225 70v100M60 95v50M260 95v50M95 120h130"/></g>
      <g stroke="#ff7a1a" stroke-opacity=".25" stroke-width="2"><circle cx="160" cy="120" r="108"/><circle cx="160" cy="120" r="84"/></g></svg></div>
      <div class="wbody"><h1>DISCIPLINA<br>HOJE,<br>RESULTADOS<br>AMANHÃ.</h1><p>Seu treino, sua rotina,<br>seu progresso.</p><button class="btn outline" data-a="start">Começar</button></div></main>`;
  }

  function home() {
    const tk = todayKey(), p = planFor(tk), now = new Date();
    const ms = monthStats(now.getFullYear(), now.getMonth());
    const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const pct = pctOf(ms.count, S.monthlyGoal), st = streaks();
    const first = esc((S.profile.name || 'Atleta').split(' ')[0]);
    const done = isDone(tk);
    const wname = p.rest ? 'Dia de descanso' : p.w ? esc(p.w.name) : 'Sem treino';
    return `<main class="screen">
      ${head('Olá, ' + first, { sub: 'Vamos treinar hoje?', right: `<button data-a="go" data-r="perfil" aria-label="Perfil">${avatar()}</button>` })}
      ${IMG.cover ? `<div class="cover" style="background-image:url('${IMG.cover}')" role="img" aria-label="Capa"></div>` : ''}
      <section class="card today"><div class="top"><div><b>Treino do dia</b><small>${longDate(tk)}</small></div><button data-a="go" data-r="treino" aria-label="Abrir treino">${icon('arrowR', 20)}</button></div>
        <div class="wname">${icon(p.rest ? 'rest' : 'dumbbell', 28)}<span>${wname}</span></div>
        <button class="btn outline sm" data-a="go" data-r="treino">${done ? 'Treino concluído ✓' : p.rest ? 'Ver dia' : 'Ver treino'}</button></section>
      <div class="stats3">
        <div class="stat"><small>Dias<br>concluídos</small><b>${ms.count}/${dim}</b></div>
        <div class="stat"><small>Sequência<br>atual</small><b>${st.cur} ${plural(st.cur, 'dia', 'dias')}</b></div>
        <div class="stat"><small>Meta do mês</small>${ring(pct, 46, 5, pct + '%', 11)}</div>
      </div>
      <h2 class="sec">Atalhos</h2>
      <div class="tiles4">
        <button data-a="newW"><span class="tile">${icon('build', 24)}</span>Montar treino</button>
        <button data-a="go" data-r="exercicios"><span class="tile">${icon('dumbbell', 24)}</span>Exercícios</button>
        <button data-a="go" data-r="calendario"><span class="tile">${icon('calendar', 24)}</span>Mensal</button>
        <button data-a="go" data-r="progresso"><span class="tile">${icon('chart', 24)}</span>Progresso</button>
      </div></main>`;
  }

  /* --- Treino do dia --- */
  const sessionFor = (w) => (S.session && S.session.date === todayKey() && S.session.workoutId === w.id ? S.session : null);
  function ensureSession(w) {
    if (!sessionFor(w)) S.session = { date: todayKey(), workoutId: w.id, startedAt: null, sets: {} };
    return S.session;
  }
  function setsFor(sess, it) {
    let a = sess.sets[it.id];
    if (!a) a = sess.sets[it.id] = [];
    while (a.length < it.sets) a.push({ d: false, w: S.lastLoad[it.id] != null ? S.lastLoad[it.id] : null, r: null });
    if (a.length > it.sets) a.length = it.sets;
    return a;
  }
  function progressOf(w) {
    const sess = sessionFor(w); let total = 0, done = 0;
    w.items.forEach((it) => { total += it.sets; done += sess && sess.sets[it.id] ? sess.sets[it.id].slice(0, it.sets).filter((s) => s.d).length : 0; });
    return { total, done };
  }

  /* --- Treino: um cartão por treino (carrossel) --- */
  const WDN = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  let tSel = null, scrollRaf = 0;
  const wStats = (w) => {
    const sec = w.items.reduce((a, it) => {
      const e = D.MAP[it.id];
      if (e && e.unit === 'min') return a + it.sets * ((it.repsMin + it.repsMax) / 2) * 60 + Math.max(0, it.sets - 1) * it.rest;
      return a + it.sets * (45 + it.rest);
    }, 0);
    const min = Math.max(1, Math.round(sec / 60));
    return { n: w.items.length, min, cal: Math.round(min * 4) };
  };
  function whenLabel(w) {
    const p = planFor(todayKey());
    if (p.w && p.w.id === w.id) return 'Hoje';
    const d = new Date(); d.setHours(12, 0, 0, 0);
    for (let i = 1; i < 7; i++) {
      d.setDate(d.getDate() + 1);
      const pl = planFor(key(d)); if (pl.w && pl.w.id === w.id) return i === 1 ? 'Amanhã' : WDN[d.getDay()];
    }
    return 'Sem dia agendado';
  }
  const thumb = (id) => (IMG.ex[id]
    ? `<span class="thumb"><img src="${esc(IMG.ex[id])}" alt="" loading="lazy"></span>`
    : `<span class="thumb">${icon('dumbbell', 28)}</span>`);

  // Mini figura com o grupo muscular em destaque (laranja do tema)
  const MB_BODY = '<g fill="#3a3a40"><circle cx="23" cy="7.5" r="3.6"/><path d="M13 13.5Q23 10 33 13.5L31.5 27.5H14.5Z"/></g><path d="M12.6 14.5L8 26M33.4 14.5L38 26M18 27.5L17 45M28 27.5L29 45" fill="none" stroke="#3a3a40" stroke-width="5" stroke-linecap="round"/>';
  const MB_ARMS = '<ellipse cx="10.4" cy="20" rx="2.3" ry="4.4" transform="rotate(14 10.4 20)"/><ellipse cx="35.6" cy="20" rx="2.3" ry="4.4" transform="rotate(-14 35.6 20)"/>';
  const MB_FORE = '<ellipse cx="9.4" cy="23.6" rx="2" ry="3.6" transform="rotate(8 9.4 23.6)"/><ellipse cx="36.6" cy="23.6" rx="2" ry="3.6" transform="rotate(-8 36.6 23.6)"/>';
  const MB_THIGH = (cy, ry) => `<ellipse cx="18.2" cy="${cy}" rx="3.3" ry="${ry}"/><ellipse cx="27.8" cy="${cy}" rx="3.3" ry="${ry}"/>`;
  const MB = {
    Peito: '<ellipse cx="18.3" cy="17.5" rx="4.6" ry="3.2"/><ellipse cx="27.7" cy="17.5" rx="4.6" ry="3.2"/>',
    Ombros: '<circle cx="13" cy="14.8" r="3.3"/><circle cx="33" cy="14.8" r="3.3"/>',
    'Bíceps': MB_ARMS,
    'Tríceps': MB_ARMS,
    Antebraço: MB_FORE,
    'Abdômen': '<rect x="19.3" y="20.5" width="7.4" height="8" rx="2.5"/>',
    'Quadríceps': MB_THIGH(35, 6.3),
    Posterior: MB_THIGH(36.5, 5),
    'Trapézio': '<path d="M23 11.2c-5 .4-8.4 1.7-10.2 3.4l3 1.4c1.8-1.5 4.2-2.3 7.2-2.5 3 .2 5.4 1 7.2 2.5l3-1.4c-1.8-1.7-5.2-3-10.2-3.4z"/>',
    Costas: '<ellipse cx="18.8" cy="20" rx="4.4" ry="6.2"/><ellipse cx="27.2" cy="20" rx="4.4" ry="6.2"/>',
    Lombar: '<rect x="19.6" y="23" width="6.8" height="5.4" rx="2.2"/>',
    'Glúteos': '<ellipse cx="19.6" cy="30.5" rx="3.7" ry="3.1"/><ellipse cx="26.4" cy="30.5" rx="3.7" ry="3.1"/>',
    Panturrilha: '<ellipse cx="17.3" cy="41.5" rx="2.6" ry="3.8"/><ellipse cx="28.7" cy="41.5" rx="2.6" ry="3.8"/>',
    Cardio: '<path d="M23 33.5C14.5 28 14 20.5 19 19c2.2-.6 3.6.7 4 2 .4-1.3 1.8-2.6 4-2 5 1.5 4.5 9-4 14.5z"/>'
  };
  const BACK_GROUPS = ['Costas', 'Trapézio', 'Lombar', 'Glúteos', 'Posterior', 'Panturrilha', 'Tríceps'];
  const muscleBadge = (g) => `<svg class="mbadge" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="22.5" fill="#1b1b1e" stroke="#2c2c30"/>${MB_BODY}${BACK_GROUPS.includes(g) ? '<path d="M23 11.5V28" stroke="#55555c" stroke-width=".9" stroke-dasharray="1.4 1.4" fill="none"/>' : ''}<g fill="#ff7a1a">${MB[g] || ''}</g></svg>`;

  function slideHTML(w) {
    const tk = todayKey(), p = planFor(tk), isToday = !!(p.w && p.w.id === w.id), done = isToday && isDone(tk), sess = isToday ? sessionFor(w) : null;
    const st = wStats(w);
    const rows = w.items.map((it) => {
      const e = D.MAP[it.id]; if (!e) return '';
      const n = sess && sess.sets[it.id] ? sess.sets[it.id].slice(0, it.sets).filter((s) => s.d).length : 0;
      const badge = done || (n && n >= it.sets) ? `<span class="badge2 ok">${icon('check', 18)}</span>` : n ? `<span class="badge2">${n}/${it.sets}</span>` : '';
      return `<button class="trow" data-a="openEx" data-id="${esc(it.id)}" data-w="${esc(w.id)}">${thumb(it.id)}<div class="grow"><div class="t">${esc(e.name)}</div><div class="s">${repsText(it)}</div></div>${badge}${muscleBadge(e.group)}</button>`;
    }).join('');
    return `<section class="slide" aria-label="${esc(w.name)}"><div class="wcard">
      <div class="wday">${esc(whenLabel(w))}</div><h2 class="wtitle">${esc(w.name)}</h2>
      <div class="wstats"><span>${icon('bolt', 18)} ${st.n} ${plural(st.n, 'Exercício', 'Exercícios')}</span><span>${icon('clock', 18)} ${st.min} Min</span><span>${icon('flame', 18)} ${st.cal} Cal</span></div>
      <div class="tlist">${rows || `<div class="empty" style="padding:30px 0">Este treino ainda não tem exercícios.</div>`}</div></div></section>`;
  }
  function tbarHTML(w) {
    const tk = todayKey(), p = planFor(tk), isToday = !!(p.w && p.w.id === w.id), done = isToday && isDone(tk);
    if (!w.items.length) return `<button class="btn big" data-a="editW" data-id="${esc(w.id)}">Adicionar exercícios</button>`;
    if (done) return `<div class="donebar">${icon('check', 20)} Treino concluído${S.logs[tk].durationSec ? ' · ' + fmtDur(S.logs[tk].durationSec) : ''}</div><button class="btn ghost sm" data-a="redo">Refazer treino</button>`;
    const pr = isToday ? progressOf(w) : { done: 0, total: 0 };
    if (isToday && pr.done) return `<button class="btn big" data-a="startW" data-id="${esc(w.id)}">Continuar treino</button><button class="btn ghost sm" data-a="finish">Concluir treino (${pr.done}/${pr.total} séries)</button>`;
    return `<button class="btn big" data-a="startW" data-id="${esc(w.id)}">Iniciar treino</button>`;
  }
  function treino() {
    const tk = todayKey(), p = planFor(tk);
    const h = `<header class="head" style="padding:0 20px"><div class="ht"><h1>Meu Treino</h1><p>${longDate(tk)}</p></div><button class="linkbtn" data-a="editSel">Personalizar</button><button class="iconbtn ring" data-a="newW" aria-label="Criar treino">${icon('plus', 20)}</button></header>`;
    if (!S.workouts.length) return `<main class="tscreen">${h}<div class="empty" style="flex:1">${icon('dumbbell', 44)}Você ainda não tem treinos.<div class="stack" style="margin-top:22px"><button class="btn" data-a="newW">Criar treino</button></div></div></main>`;
    if (!tSel || !getW(tSel)) tSel = (p.w || S.workouts[0]).id;
    const cur = getW(tSel);
    return `<main class="tscreen">${h}
      ${p.rest && !isDone(tk) ? `<div class="restnote">${icon('rest', 18)} Hoje está marcado como descanso — você pode treinar mesmo assim.</div>` : ''}
      <div class="pager">${S.workouts.map(slideHTML).join('')}</div>
      <div class="dots" aria-hidden="true">${S.workouts.map((w) => `<i class="${w.id === tSel ? 'on' : ''}"></i>`).join('')}</div>
      <div class="tbar" id="tbar">${tbarHTML(cur)}</div></main>`;
  }

  /* --- Exercício em execução (séries, carga, descanso) --- */
  function runnerHTML(it) {
    const e = D.MAP[it.id], arr = setsFor(S.session, it);
    const target = e.unit === 's' ? String(it.repsMax) : `${it.repsMin}-${it.repsMax}`;
    const rows = arr.map((s, i) => `<div class="setrow ${s.d ? 'on' : ''}" id="sr-${i}"><span class="sn">${i + 1}</span>
      ${e.unit === 'min' ? '<span></span>' : `<label class="fld"><input inputmode="decimal" data-c="setf" data-ex="${esc(it.id)}" data-i="${i}" data-f="w" value="${esc(wDisp(s.w))}" placeholder="0" aria-label="Carga da série ${i + 1}"><small>${wU()}</small></label>`}
      <label class="fld"><input inputmode="numeric" data-c="setf" data-ex="${esc(it.id)}" data-i="${i}" data-f="r" value="${s.r == null ? '' : s.r}" placeholder="${esc(target)}" aria-label="Repetições da série ${i + 1}"><small>${UNIT_S[e.unit]}</small></label>
      <button class="chk ${s.d ? 'on' : ''}" data-a="togSet" data-ex="${esc(it.id)}" data-i="${i}" aria-label="Concluir série ${i + 1}">${icon('check', 20)}</button></div>`).join('');
    return `${exImg(it.id)}<h2>${esc(e.name)}</h2><span class="tag">${esc(e.group)}</span><p class="sub" style="margin-bottom:6px">${repsText(it)}${it.rest ? ' • descanso ' + it.rest + 's' : ''}</p>
      <div>${rows}</div><p class="tip" style="margin-top:12px">${esc(e.tip)}</p><button class="btn" data-a="closeSheet">Concluído</button>`;
  }
  function infoHTML(id, canAdd) {
    const e = D.MAP[id];
    return `${exImg(id)}<h2>${esc(e.name)}</h2><span class="tag">${esc(e.group)}</span><p class="tip">${esc(e.tip)}</p>${isAdmin() ? `<button class="btn ghost sm" data-a="admPick" data-k="ex" data-id="${esc(id)}" style="margin-bottom:14px">${icon('camera', 18)} ${IMG.ex[id] ? 'Trocar' : 'Adicionar'} imagem (admin)</button>` : ''}
      <p class="sub">Sugestão: ${e.sets} séries × ${e.rmin === e.rmax ? e.rmax : e.rmin + '-' + e.rmax} ${UNIT_W[e.unit]}${e.rest ? ' · descanso ' + e.rest + 's' : ''}</p>
      ${canAdd ? `<button class="btn" data-a="addToWList" data-id="${esc(id)}">${icon('plus', 20)} Adicionar a um treino</button>` : `<button class="btn ghost" data-a="closeSheet">Fechar</button>`}`;
  }

  /* --- Calendário --- */
  let cal = null;
  function calState() { if (!cal) { const n = new Date(); cal = { y: n.getFullYear(), m: n.getMonth(), sel: todayKey() }; } return cal; }
  function calendario() {
    const c = calState(), tk = todayKey();
    const first = new Date(c.y, c.m, 1), dim = new Date(c.y, c.m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7;
    let cells = WD.map((d) => `<div class="wd">${d}</div>`).join('') + '<div></div>'.repeat(lead);
    for (let d = 1; d <= dim; d++) {
      const k = `${c.y}-${pad(c.m + 1)}-${pad(d)}`, done = isDone(k), sched = !!planFor(k).w;
      cells += `<button class="d ${k === tk ? 'today' : ''} ${k === c.sel ? 'sel' : ''} ${done ? 'done' : ''}" data-a="selDay" data-k="${k}" aria-label="${longDate(k)}">${d}${done || sched ? '<i></i>' : ''}</button>`;
    }
    const k = c.sel, log = S.logs[k], p = planFor(k);
    let name, status, ok = false;
    if (log && log.done) { name = esc(log.name); status = 'Concluído'; ok = true; }
    else if (p.rest) { name = 'Dia de descanso'; status = 'Descanso'; }
    else if (p.w) { name = esc(p.w.name); status = k < tk ? 'Não realizado' : 'Agendado'; }
    else { name = 'Sem treino'; status = 'Toque para agendar'; }
    return `<main class="screen">${head('Calendário Mensal')}
      <div class="calhead"><button class="iconbtn" data-a="calMove" data-d="-1" aria-label="Mês anterior">${icon('chevL', 20)}</button><span>${MONTHS[c.m]} ${c.y}</span><button class="iconbtn" data-a="calMove" data-d="1" aria-label="Próximo mês">${icon('chevR', 20)}</button></div>
      <div class="calgrid">${cells}</div>
      <button class="card daycard" data-a="dayMenu"><h3>${longDate(k)}</h3><div class="r">${tile('sm')}<div style="flex:1"><div>${name}</div><div class="st ${ok ? 'ok' : ''}">${ok ? icon('check', 14) : ''}${status}</div></div><span class="muted">${icon('chevR', 18)}</span></div></button></main>`;
  }
  function dayMenuHTML(k) {
    const log = S.logs[k], p = planFor(k), cur = S.schedule[k];
    const opts = S.workouts.map((w) => `<button class="opt ${cur === w.id ? 'on' : ''}" data-a="assign" data-k="${k}" data-w="${esc(w.id)}"><span class="grow">${esc(w.name)}<small>${w.items.length} exercícios</small></span>${cur === w.id ? icon('check', 20) : ''}</button>`).join('');
    const extra = [];
    if (k <= todayKey() && p.w && !(log && log.done)) extra.push(`<button class="btn ghost sm" data-a="markDone" data-k="${k}">${icon('check', 18)} Marcar como concluído</button>`);
    if (log && log.done) extra.push(`<button class="btn ghost sm" data-a="unmarkDone" data-k="${k}">Desmarcar conclusão</button>`);
    if (k === todayKey() && p.w && !(log && log.done)) extra.push(`<button class="btn sm" data-a="goTreino">Ir para o treino</button>`);
    return `<h2>${longDate(k)}</h2><p class="sub">Escolha o treino deste dia.</p>${opts}
      <button class="opt ${cur === 'rest' ? 'on' : ''}" data-a="assign" data-k="${k}" data-w="rest"><span class="grow">Dia de descanso</span>${cur === 'rest' ? icon('check', 20) : ''}</button>
      <div class="stack" style="margin-top:16px">${extra.join('')}${cur ? `<button class="btn ghost sm" data-a="assign" data-k="${k}" data-w="">Remover agendamento</button>` : ''}</div>`;
  }

  /* --- Montar treino --- */
  let draft = null;
  const newDraft = () => ({ id: null, name: '', groups: [], days: [], items: [], cfg: Object.assign({}, D.DEFAULT_CFG) });
  const WDS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const daysOf = (id) => (S.week || []).map((v, i) => (v === id ? i : -1)).filter((i) => i >= 0);
  const groupsOf = (items) => { const g = []; items.forEach((it) => { const e = D.MAP[it.id]; if (e && !g.includes(e.group)) g.push(e.group); }); return g; };
  const rng = (a, b, u) => (a === b ? `${a}${u}` : `${a}–${b}${u}`);
  function montar(arg) {
    if (!draft || (arg || null) !== draft.id) {
      if (arg && getW(arg)) { draft = clone(getW(arg)); draft.days = daysOf(draft.id); } else draft = newDraft();
    }
    if (!draft.days) draft.days = [];
    const c = draft.cfg;
    const items = draft.items.map((it, i) => `<button class="row" data-a="editItem" data-i="${i}">${tile('sm', it.id)}<div class="grow"><div class="t">${esc(exName(it.id))}</div><div class="s">${repsText(it)} • ${it.rest}s</div></div><span class="muted">${icon('chevR', 18)}</span></button>`).join('');
    return `<main class="screen">${head(draft.id ? 'Editar Treino' : 'Montar Treino', { back: 'treino' })}
      <label class="flabel" for="wname">Nome do treino</label>
      <input id="wname" class="field" data-i="wname" maxlength="40" placeholder="Ex: Superior / Inferior" value="${esc(draft.name)}" autocomplete="off">
      <div class="lbl" style="font-weight:600">Treinar em</div>
      <div class="chips days">${WDS.map((n, i) => chip(n, draft.days.includes(i), 'togDay', `data-d="${i}"`)).join('')}</div>
      <div class="lbl" style="font-weight:600">Exercícios${draft.items.length ? ` (${draft.items.length})` : ''}</div>
      ${draft.items.length ? `<div class="list">${items}</div><div class="chips" style="margin-top:12px">${groupsOf(draft.items).map((g) => `<span class="chip on">${esc(g)}</span>`).join('')}</div>` : `<p class="muted" style="font-size:13px;line-height:1.5">Escolha os exercícios no mapa muscular: toque no músculo e depois nos exercícios.</p>`}
      <button class="addbtn" data-a="addEx">${icon('plus', 18)} Selecionar exercícios</button>
      <div class="lbl">Configurações</div>
      <div class="list">
        <button class="range-row" data-a="cfg" data-k="sets"><span>Séries</span><span class="end muted">${rng(c.setsMin, c.setsMax, '')} ${icon('chevR', 16)}</span></button>
        <button class="range-row" data-a="cfg" data-k="reps"><span>Repetições</span><span class="end muted">${rng(c.repsMin, c.repsMax, '')} ${icon('chevR', 16)}</span></button>
        <button class="range-row" data-a="cfg" data-k="rest"><span>Descanso</span><span class="end muted">${rng(c.restMin, c.restMax, 's')} ${icon('chevR', 16)}</span></button>
      </div>
      <div style="margin-top:22px"><button class="btn" data-a="saveW">Salvar treino</button></div></main>`;
  }
  const stepper = (label, n, v, min, max, step, suf) => `<div class="stepper-row"><span>${label}</span><div class="stepper"><button data-a="step" data-n="${n}" data-d="${-step}" aria-label="Diminuir">−</button><b data-v="${n}" data-s="${suf || ''}">${v}${suf || ''}</b><button data-a="step" data-n="${n}" data-d="${step}" aria-label="Aumentar">+</button></div></div>`;
  const LIM = { sets: [1, 12], repsMin: [1, 100], repsMax: [1, 100], rest: [10, 300], setsMin: [1, 12], setsMax: [1, 12], repsMin_: [1, 100], restMin: [10, 300], restMax: [10, 300] };
  const limFor = (n) => (n === 'repsMin' || n === 'repsMax' ? [1, 100] : LIM[n] || [0, 999]);

  /* --- Seletor de exercícios (mapa corporal + grade) --- */
  let pick = { side: 'front', mode: 'map', group: null, q: '', fav: false };
  const starIcon = (on, s = 22) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">${I.star}</svg>`;
  const normTxt = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const HEART = { g: 'Cardio', side: 'R', y: 96, dot: [262, 84], heart: true };
  const BM_FRONT = [
    { g: 'Ombros', side: 'L', y: 96, dot: [127, 119] },
    { g: 'Peito', side: 'L', y: 152, dot: [163, 146] },
    { g: 'Antebraço', side: 'L', y: 252, dot: [102, 236] },
    { g: 'Quadríceps', side: 'L', y: 340, dot: [158, 350] },
    HEART,
    { g: 'Bíceps', side: 'R', y: 172, dot: [252, 168] },
    { g: 'Abdômen', side: 'R', y: 232, dot: [182, 214] }
  ];
  const BM_BACK = [
    { g: 'Trapézio', side: 'L', y: 96, dot: [152, 112] },
    { g: 'Tríceps', side: 'L', y: 172, dot: [108, 170] },
    { g: 'Glúteos', side: 'L', y: 290, dot: [160, 302] },
    { g: 'Posterior', side: 'L', y: 376, dot: [158, 362] },
    { g: 'Panturrilha', side: 'L', y: 456, dot: [157, 468] },
    HEART,
    { g: 'Costas', side: 'R', y: 172, dot: [206, 168] },
    { g: 'Lombar', side: 'R', y: 248, dot: [186, 238] }
  ];
  const BM_FIG = `<defs><linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34343a"/><stop offset="1" stop-color="#222226"/></linearGradient>
    <path id="bmarm" d="M124 114Q98 122 92 172Q88 218 82 264L102 270Q114 222 122 182Q130 152 140 128Z"/>
    <path id="bmleg" d="M144 290Q132 362 146 432Q142 472 148 514L168 514Q172 472 168 432Q182 362 180 290Z"/></defs>
    <g fill="url(#skin)" stroke="#44444c" stroke-width="1.2" stroke-linejoin="round">
      <ellipse cx="180" cy="58" rx="24" ry="29"/><rect x="168" y="82" width="24" height="22" rx="8"/>
      <path d="M128 110Q180 96 232 110L240 152Q234 204 216 254L224 294H136L144 254Q126 204 120 152Z"/>
      <use href="#bmarm"/><use href="#bmarm" transform="translate(360 0) scale(-1 1)"/>
      <use href="#bmleg"/><use href="#bmleg" transform="translate(360 0) scale(-1 1)"/>
      <path d="M137 262H223L231 340L186 330L180 306L174 330L129 340Z" fill="#141416" stroke="#2b2b30"/>
    </g>`;
  const BM_HL_FRONT = '<ellipse cx="163" cy="142" rx="21" ry="15"/><ellipse cx="197" cy="142" rx="21" ry="15"/><circle cx="127" cy="120" r="14"/><circle cx="233" cy="120" r="14"/><ellipse cx="108" cy="168" rx="10" ry="26" transform="rotate(10 108 168)"/><ellipse cx="252" cy="168" rx="10" ry="26" transform="rotate(-10 252 168)"/><ellipse cx="97" cy="238" rx="8" ry="25" transform="rotate(8 97 238)"/><ellipse cx="263" cy="238" rx="8" ry="25" transform="rotate(-8 263 238)"/><rect x="167" y="172" width="26" height="74" rx="12"/><ellipse cx="158" cy="350" rx="19" ry="56"/><ellipse cx="202" cy="350" rx="19" ry="56"/>';
  const BM_HL_BACK = '<ellipse cx="180" cy="114" rx="40" ry="13"/><ellipse cx="154" cy="174" rx="20" ry="40" transform="rotate(8 154 174)"/><ellipse cx="206" cy="174" rx="20" ry="40" transform="rotate(-8 206 174)"/><rect x="164" y="222" width="32" height="30" rx="10"/><ellipse cx="108" cy="168" rx="10" ry="26" transform="rotate(10 108 168)"/><ellipse cx="252" cy="168" rx="10" ry="26" transform="rotate(-10 252 168)"/><ellipse cx="160" cy="302" rx="20" ry="18"/><ellipse cx="200" cy="302" rx="20" ry="18"/><ellipse cx="158" cy="362" rx="19" ry="42"/><ellipse cx="202" cy="362" rx="19" ry="42"/><ellipse cx="156" cy="470" rx="11" ry="32"/><ellipse cx="204" cy="470" rx="11" ry="32"/>';
  const groupCount = (g) => draft.items.filter((it) => D.MAP[it.id] && D.MAP[it.id].group === g).length;

  function bodySVG() {
    const back = pick.side === 'back', items = back ? BM_BACK : BM_FRONT;
    const marks = items.map((m) => {
      const L = m.side === 'L', x = L ? 14 : 346, [dx, dy] = m.dot, n = groupCount(m.g);
      return `<g class="bm" data-a="bmGroup" data-g="${m.g}" role="button" aria-label="${m.g}">
        <rect x="${L ? 0 : dx}" y="${m.y - 22}" width="${L ? dx : 360 - dx}" height="40" fill="transparent"/>
        <path class="bm-line" d="M${x} ${m.y + 8}H${dx}V${dy}"/>
        <text class="bm-txt" x="${x}" y="${m.y}" text-anchor="${L ? 'start' : 'end'}">${m.g}${n ? `<tspan class="bm-n"> · ${n}</tspan>` : ''}</text>
        ${m.heart ? `<path class="bm-dot" transform="translate(${dx} ${dy}) scale(1.25)" d="M0 7C-12 -2 -9 -11 0 -5.5 9 -11 12 -2 0 7Z"/>` : `<circle class="bm-dot" cx="${dx}" cy="${dy}" r="8.5"/>`}</g>`;
    }).join('');
    return `<svg class="bodymap" viewBox="0 0 360 540" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Mapa muscular ${back ? '(costas)' : '(frente)'}">${BM_FIG}<g class="hl">${back ? BM_HL_BACK : BM_HL_FRONT}</g>${marks}</svg>`;
  }
  function bmItems() {
    const q = normTxt(pick.q.trim()); S.favs = S.favs || {};
    return D.EXERCISES.filter((e) => (!pick.group || e.group === pick.group) && (!pick.fav || S.favs[e.id]) && (!q || normTxt(e.name).includes(q)));
  }
  function bmGrid() {
    const l = bmItems();
    if (!l.length) return `<div class="empty" style="grid-column:1/-1;padding:34px 0">${pick.fav ? 'Nenhum favorito ainda. Toque na estrela de um exercício.' : 'Nenhum exercício encontrado.'}</div>`;
    return l.map((e) => {
      const on = draft.items.some((i) => i.id === e.id), fav = !!S.favs[e.id];
      return `<div class="xcard ${on ? 'on' : ''}" data-a="bmEx" data-id="${e.id}" role="button" aria-pressed="${on}" aria-label="${esc(e.name)}">
        <div class="xph">${IMG.ex[e.id] ? `<img src="${esc(IMG.ex[e.id])}" alt="" loading="lazy">` : icon('dumbbell', 46)}
          ${on ? `<span class="xck">${icon('check', 16)}</span>` : ''}
          <button class="xstar ${fav ? 'on' : ''}" data-a="bmFav" data-id="${e.id}" aria-label="Favorito">${starIcon(fav, 22)}</button>
          <button class="xinfo" data-a="bmInfo" data-id="${e.id}" aria-label="Como executar">i</button></div>
        <div class="xn">${esc(e.name)}<span class="xg">${esc(e.group)}</span></div></div>`;
    }).join('');
  }
  function escolher() {
    if (!draft) draft = newDraft();
    S.favs = S.favs || {};
    const n = draft.items.length;
    const star = `<button class="iconbtn star ${pick.fav ? 'on' : ''}" data-a="bmFavFilter" aria-label="Mostrar favoritos" aria-pressed="${pick.fav}">${starIcon(pick.fav, 26)}</button>`;
    if (pick.mode === 'list') {
      const title = pick.group ? pick.group.toUpperCase() : pick.fav ? 'FAVORITOS' : 'BUSCA';
      return `<main class="screen pad-b"><header class="head"><button class="iconbtn back" data-a="bmBack" aria-label="Voltar">${icon('chevL')}</button><div class="ht center"><h1 style="font-size:16px;letter-spacing:.8px;color:#cfcfd2">${esc(title)}</h1></div>${star}</header>
        <div class="searchbox">${icon('search', 18)}<input class="field" data-i="bmq" placeholder="Buscar exercício..." value="${esc(pick.q)}" autocomplete="off"></div>
        <div class="xgrid" id="bmgrid">${bmGrid()}</div></main>
        <div class="pkbar"><button class="btn big" data-a="bmDone">Adicionar ao treino (${n})</button></div>`;
    }
    return `<main class="tscreen"><header class="head" style="padding:0 20px"><button class="iconbtn back" data-a="bmDone" aria-label="Voltar">${icon('chevL')}</button><div class="ht"><h1>Exercícios</h1></div>${star}<button class="chip on" data-a="bmDone">Concluir (${n})</button></header>
      <div class="bmwrap"><button class="iconbtn" data-a="bmSearch" aria-label="Buscar exercício" style="position:absolute;left:16px;top:0;z-index:2">${icon('search', 24)}</button>${bodySVG()}
        <button class="roundbtn l" data-a="bmSwap" aria-label="${pick.side === 'front' ? 'Ver costas' : 'Ver frente'}">${icon('swap', 26)}</button>
        <button class="roundbtn r" data-a="bmDone" aria-label="Concluir seleção">${icon('check', 26)}<span class="cnt">${n}</span></button></div></main>`;
  }
  const backToMontar = () => go(draft && draft.id ? 'montar/' + draft.id : 'montar');

  /* --- Exercícios --- */
  let exq = '', exg = 'Todos';
  function exList() {
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = norm(exq.trim());
    const l = D.EXERCISES.filter((e) => (exg === 'Todos' || e.group === exg) && (!q || norm(e.name).includes(q)));
    if (!l.length) return '<div class="empty" style="padding:30px 0">Nenhum exercício encontrado.</div>';
    return l.map((e) => `<button class="row" data-a="info" data-id="${e.id}">${tile('sm', e.id)}<div class="grow"><div class="t">${esc(e.name)}</div><div class="s">${esc(e.group)}</div></div><span class="muted">${icon('chevR', 18)}</span></button>`).join('');
  }
  function exercicios() {
    return `<main class="screen">${head('Exercícios', { back: 'treino' })}
      <div class="searchbox">${icon('search', 18)}<input class="field" data-i="exq" placeholder="Buscar exercício..." value="${esc(exq)}" autocomplete="off"></div>
      <div class="chips scroll" id="exchips">${['Todos'].concat(D.GROUPS).map((g) => chip(g, exg === g, 'exg', `data-g="${g}"`)).join('')}</div>
      <div class="list" id="exlist" style="margin-top:10px">${exList()}</div></main>`;
  }

  /* --- Perfil e subtelas --- */
  function perfil() {
    const now = new Date(), ms = monthStats(now.getFullYear(), now.getMonth()), st = streaks();
    const since = parseKey(S.profile.since || todayKey());
    const menu = [['meus-treinos', 'dumbbell', 'Meus treinos'], ['meus-dados', 'user', 'Meus dados'], ['config', 'gear', 'Configurações'], ['ajuda', 'help', 'Ajuda']]
      .map(([r, ic, l]) => `<button class="row plain" data-a="go" data-r="${r}">${icon(ic, 22)}<span class="grow t" style="flex:1">${l}</span><span class="muted">${icon('chevR', 18)}</span></button>`).join('');
    return `<main class="screen"><div class="profile-top"><button data-a="pickAvatar" aria-label="Alterar foto">${avatar('xl')}</button>
      <h2>${esc(S.profile.name || 'Atleta')}</h2><small>Membro desde ${MONTHS[since.getMonth()]} de ${since.getFullYear()}</small></div>
      <input type="file" accept="image/*" class="hide" id="avatarIn" data-c="avatar">
      <div class="stats3 flat"><div class="stat"><b>${doneKeys().length}</b><small>Treinos feitos</small></div><div class="stat"><b>${st.cur}</b><small>Dias de sequência</small></div><div class="stat"><b>${ms.count}</b><small>Dias no mês</small></div></div>
      <div class="list" style="margin-top:14px">${menu}<button class="row plain" data-a="logout">${icon('logout', 22)}<span class="grow t" style="flex:1">Sair</span><span class="muted">${icon('chevR', 18)}</span></button></div></main>`;
  }
  function meus() {
    const rows = S.workouts.map((w) => `<button class="row" data-a="wMenu" data-id="${esc(w.id)}">${tile()}<div class="grow"><div class="t">${esc(w.name)}</div><div class="s">${w.items.length} ${plural(w.items.length, 'exercício', 'exercícios')}</div></div><span class="muted">${icon('chevR', 18)}</span></button>`).join('');
    return `<main class="screen">${head('Meus Treinos', { back: 'perfil' })}<div class="list">${rows || '<div class="empty">Nenhum treino criado ainda.</div>'}</div>
      <div style="margin-top:22px"><button class="btn outline" data-a="newW">${icon('plus', 18)} Criar novo treino</button></div></main>`;
  }
  function wMenuHTML(id) {
    const w = getW(id); if (!w) return '';
    const l = w.items.map((it) => `<div class="row" style="padding:9px 0">${tile('sm', it.id)}<div class="grow"><div class="t">${esc(exName(it.id))}</div><div class="s">${repsText(it)}</div></div></div>`).join('');
    return `<h2>${esc(w.name)}</h2><p class="sub">${w.groups.length ? esc(w.groups.join(' • ')) : 'Treino personalizado'}</p><div class="list" style="max-height:34vh;overflow:auto">${l || '<p class="muted">Sem exercícios.</p>'}</div>
      <div class="stack" style="margin-top:14px"><button class="btn" data-a="setToday" data-id="${esc(id)}">Definir como treino de hoje</button><button class="btn ghost" data-a="editW" data-id="${esc(id)}">Editar</button><button class="btn ghost" data-a="dupW" data-id="${esc(id)}">${icon('copy', 18)} Duplicar</button><button class="btn danger" data-a="delW" data-id="${esc(id)}">Excluir treino</button></div>`;
  }
  function dados() {
    const p = S.profile;
    return `<main class="screen">${head('Meus Dados', { back: 'perfil' })}
      <label class="flabel" for="d-name">Nome</label><input id="d-name" class="field" maxlength="40" value="${esc(p.name)}" autocomplete="name">
      <label class="flabel" for="d-birth">Data de nascimento</label><input id="d-birth" type="date" class="field" value="${esc(p.birth)}" max="${todayKey()}">
      <label class="flabel" for="d-weight">Peso (${wU()})</label><input id="d-weight" class="field" inputmode="decimal" value="${esc(wDisp(p.weightKg))}" placeholder="Ex: 78">
      <label class="flabel" for="d-height">Altura (${hU()})</label><input id="d-height" class="field" inputmode="decimal" value="${esc(hDisp(p.heightCm))}" placeholder="Ex: 178">
      <label class="flabel" for="d-goal">Meta mensal (treinos por mês)</label><input id="d-goal" class="field" inputmode="numeric" value="${S.monthlyGoal}">
      <div style="margin-top:24px"><button class="btn" data-a="saveDados">Salvar dados</button></div></main>`;
  }
  function config() {
    const s = S.settings;
    return `<main class="screen">${head('Configurações', { back: 'perfil' })}
      <div class="lbl" style="margin-top:6px;font-weight:600">Geral</div>
      <div class="list">
        <button class="row plain" data-a="togNotif"><span class="grow t" style="flex:1">Notificações</span><span class="switch ${s.notifications ? 'on' : ''}" role="switch" aria-checked="${s.notifications}"></span></button>
        <button class="row plain" data-a="unitSheet"><span class="grow t" style="flex:1">Unidade de medida</span><span class="end">${imp() ? 'lb / in' : 'kg / cm'} ${icon('chevR', 16)}</span></button>
        <label class="row plain"><span class="grow t" style="flex:1">Lembrete de treino</span><span class="end"><input type="time" class="tm" data-c="remind" value="${esc(s.reminderTime)}"></span></label>
      </div>
      <div class="lbl" style="font-weight:600">Conta</div>
      <div class="list">
        <button class="row plain" data-a="pwSheet"><span class="grow t" style="flex:1">${s.passwordHash ? 'Alterar senha' : 'Definir senha'}</span><span class="muted">${icon('chevR', 18)}</span></button>
        <button class="row plain" data-a="go" data-r="privacidade"><span class="grow t" style="flex:1">Privacidade</span><span class="muted">${icon('chevR', 18)}</span></button>
        <button class="row plain" data-a="go" data-r="admin"><span class="grow t" style="flex:1">Administrador</span><span class="muted">${icon('chevR', 18)}</span></button>
        <button class="row plain" data-a="delAccount"><span class="grow t" style="flex:1;color:var(--danger)">Excluir conta</span><span class="muted">${icon('chevR', 18)}</span></button>
      </div></main>`;
  }
  function privacidade() {
    const hasDemo = Object.keys(S.logs).some((k) => S.logs[k].demo);
    return `<main class="screen">${head('Privacidade', { back: 'config' })}
      <div class="card"><div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--or)">${icon('shield', 24)}</span><p style="font-size:13.5px;line-height:1.55;color:#cfcfd2">Seus dados (treinos, histórico, perfil e foto) ficam salvos <b>somente neste navegador</b>. Nada é enviado para servidores. Limpar os dados do navegador apaga tudo — por isso, exporte um backup de vez em quando.</p></div></div>
      <div class="stack" style="margin-top:18px">
        <button class="btn ghost" data-a="exportData">${icon('download', 18)} Exportar backup</button>
        <button class="btn ghost" data-a="importPick">${icon('upload', 18)} Importar backup</button>
        <input type="file" accept="application/json,.json" class="hide" id="importIn" data-c="import">
        <button class="btn ghost" data-a="${hasDemo ? 'rmDemo' : 'demo'}">${hasDemo ? 'Remover dados de exemplo' : 'Gerar dados de exemplo'}</button>
      </div></main>`;
  }
  let prog = 'm';
  function progresso() {
    const now = new Date(), y = now.getFullYear(), m = now.getMonth(), goal = S.monthlyGoal, ms = monthStats(y, m), st = streaks();
    let pct, cap, k1, k2, k3, evoT, vals, labels;
    if (prog === 'm') {
      pct = pctOf(ms.count, goal); cap = 'do seu objetivo mensal';
      k1 = ['Treinos concluídos', `${ms.count}/${goal}`]; k2 = ['Dias de sequência', `${st.cur} ${plural(st.cur, 'dia', 'dias')}`]; k3 = ['Tempo de treino', fmtDur(ms.sec)];
      evoT = 'Evolução (semanas do mês)';
      const weeks = Math.ceil(new Date(y, m + 1, 0).getDate() / 7); vals = Array(weeks).fill(0);
      ms.keys.forEach((k) => { vals[Math.floor((parseInt(k.slice(8), 10) - 1) / 7)]++; });
      labels = vals.map((_, i) => 'S' + (i + 1));
    } else {
      vals = []; labels = [];
      for (let i = 5; i >= 0; i--) { const d = new Date(y, m - i, 1); vals.push(monthStats(d.getFullYear(), d.getMonth()).count); labels.push(MON_S[d.getMonth()]); }
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      pct = pctOf(avg, goal); cap = 'da meta mensal (média de 6 meses)';
      k1 = ['Treinos concluídos (total)', String(doneKeys().length)]; k2 = ['Melhor sequência', `${st.best} ${plural(st.best, 'dia', 'dias')}`]; k3 = ['Tempo total de treino', fmtDur(totalSec())];
      evoT = 'Evolução (últimos 6 meses)';
    }
    const max = Math.max(1, ...vals);
    return `<main class="screen">${head('Progresso', { back: 'perfil' })}
      <div class="seg"><button class="${prog === 'm' ? 'on' : ''}" data-a="progTab" data-t="m">Mensal</button><button class="${prog === 'g' ? 'on' : ''}" data-a="progTab" data-t="g">Geral</button></div>
      <div class="bigring">${ring(pct, 128, 10, pct + '%', 30)}<small>${cap}</small></div>
      <div class="kpis"><div><small>${k1[0]}</small><b>${k1[1]}</b></div><div><small>${k2[0]}</small><b>${k2[1]}</b></div><div><small>${k3[0]}</small><b>${k3[1]}</b></div></div>
      <div class="evo"><h3>${evoT}</h3><div class="bars">${vals.map((v) => `<div class="b"><em>${v || ''}</em><i style="height:${Math.round((v / max) * 82)}%"></i></div>`).join('')}</div><div class="bars-x">${labels.map((l) => `<span>${l}</span>`).join('')}</div></div></main>`;
  }
  /* ---------- administrador ---------- */
  const ADMIN_USER = 'AlehS';
  const isAdmin = () => !!S.admin && sessionStorage.getItem('df:admin') === '1';
  const adminHash = (u, p) => sha('adm|' + u.trim().toLowerCase() + '|' + p);
  const exImg = (id) => (IMG.ex[id] ? `<img class="eximg" src="${esc(IMG.ex[id])}" alt="${esc(exName(id))}">` : '');
  let admq = '', pendingImg = null;

  function adminLogin() {
    const first = !S.admin;
    return `<main class="screen">${head('Administrador', { back: 'config' })}
      <div class="card"><div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--or)">${icon('shield', 24)}</span><p style="font-size:13.5px;line-height:1.55;color:#cfcfd2">${first ? 'Primeiro acesso: crie a senha do administrador <b>AlehS</b>. Ela fica salva apenas neste aparelho.' : 'Acesso restrito ao administrador do aplicativo.'}</p></div></div>
      <label class="flabel" for="a-user">Usuário</label><input id="a-user" class="field" autocomplete="username" autocapitalize="off" value="${first ? ADMIN_USER : ''}" placeholder="Usuário">
      <label class="flabel" for="a-pw">${first ? 'Criar senha (mín. 4 caracteres)' : 'Senha'}</label><input id="a-pw" type="password" class="field" autocomplete="${first ? 'new-password' : 'current-password'}" data-c="adminenter">
      ${first ? `<label class="flabel" for="a-pw2">Confirmar senha</label><input id="a-pw2" type="password" class="field" autocomplete="new-password" data-c="adminenter">` : ''}
      <p id="a-err" style="color:var(--danger);font-size:12.5px;min-height:20px;margin:8px 0"></p>
      <button class="btn" data-a="${first ? 'admCreate' : 'admLogin'}">${first ? 'Criar senha e entrar' : 'Entrar'}</button>
      ${first ? '' : '<button class="btn ghost" style="margin-top:10px" data-a="admReset">Esqueci a senha</button>'}</main>`;
  }
  function admList() {
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = norm(admq.trim());
    const l = D.EXERCISES.filter((e) => !q || norm(e.name).includes(q) || norm(e.group).includes(q));
    if (!l.length) return '<div class="empty" style="padding:24px 0">Nenhum exercício encontrado.</div>';
    return l.map((e) => `<div class="row">${tile('sm', e.id)}<div class="grow"><div class="t">${esc(e.name)}</div><div class="s">${esc(e.group)}${IMG.ex[e.id] ? ' • com imagem' : ''}</div></div>
      <button class="iconbtn sq" data-a="admPick" data-k="ex" data-id="${e.id}" aria-label="${IMG.ex[e.id] ? 'Trocar' : 'Adicionar'} imagem de ${esc(e.name)}">${icon('camera', 18)}</button>
      ${IMG.ex[e.id] ? `<button class="iconbtn sq del" data-a="admDel" data-k="ex" data-id="${e.id}" aria-label="Remover imagem de ${esc(e.name)}">${icon('trash', 18)}</button>` : ''}</div>`).join('');
  }
  function admin() {
    if (!isAdmin()) return adminLogin();
    const supported = !!window.showDirectoryPicker;
    return `<main class="screen">${head('Administrador', { back: 'config', sub: 'Conectado como ' + ADMIN_USER })}
      <div class="card">
        <div style="font-size:14px;font-weight:650;margin-bottom:6px">Pasta das imagens (icons)</div>
        <p style="font-size:13px;line-height:1.5;color:#bdbdc2;margin-bottom:12px">${dirHandle ? '<b style="color:var(--ok)">Conectada.</b> Toda imagem enviada é gravada direto na pasta <b>icons</b> do projeto, junto com o arquivo <b>media.json</b>. Depois é só fazer commit e push.' : supported ? 'Conecte a pasta <b>icons</b> do projeto (ou a pasta raiz do projeto) para as imagens serem gravadas nela automaticamente.' : 'Este navegador não grava direto em pastas (use Chrome ou Edge no computador). As imagens serão <b>baixadas</b> — coloque-as na pasta <b>icons</b> do projeto.'}</p>
        <div class="stack">
          ${supported ? `<button class="btn ghost sm" data-a="admConnect">${icon('upload', 18)} ${dirHandle ? 'Trocar pasta' : 'Conectar pasta icons'}</button>` : ''}
          ${dirHandle ? `<button class="btn ghost sm" data-a="admAuth">Reautorizar acesso à pasta</button>` : ''}
          <button class="btn ghost sm" data-a="admManifest">${icon('download', 18)} Baixar media.json</button>
        </div></div>
      <div class="lbl">Capa da aba inicial</div>
      <div class="covprev" ${IMG.cover ? `style="background-image:url('${IMG.cover}')"` : ''}>${IMG.cover ? '' : 'Sem capa'}</div>
      <div class="stack" style="margin-top:10px"><button class="btn sm" data-a="admPick" data-k="cover">${icon('camera', 18)} ${IMG.cover ? 'Trocar capa' : 'Escolher capa'}</button>${IMG.cover ? '<button class="btn danger sm" data-a="admDel" data-k="cover">Remover capa</button>' : ''}</div>
      <div class="lbl">Imagens dos exercícios</div>
      <div class="searchbox">${icon('search', 18)}<input class="field" data-i="admq" placeholder="Buscar exercício..." value="${esc(admq)}" autocomplete="off"></div>
      <div class="list" id="admlist">${admList()}</div>
      <button class="btn danger" style="margin-top:22px" data-a="admLogout">Sair do modo administrador</button></main>`;
  }

  function ajuda() {
    const q = [
      ['Como começar?', 'Em Treino você vê o treino do dia. Toque em um exercício, preencha carga e repetições e marque cada série. Ao terminar, toque em “Concluir treino”.'],
      ['Como montar um treino?', 'Vá em Início → Montar treino (ou Meus treinos → Criar novo treino). Dê um nome, escolha os grupos musculares, adicione os exercícios e ajuste séries, repetições e descanso.'],
      ['Como agendar treinos na semana?', 'No Calendário, toque no dia e escolha o treino (ou dia de descanso). O treino de hoje também pode ser trocado em Treino, tocando no nome do treino.'],
      ['O cronômetro de descanso', 'Ao marcar uma série como feita, o descanso do exercício começa automaticamente (com aviso sonoro e vibração quando termina, se o aparelho permitir).'],
      ['Meus dados estão seguros?', 'Tudo fica salvo apenas no seu navegador. Use Configurações → Privacidade para exportar ou importar um backup.'],
      ['Como instalar no celular?', 'No Chrome (Android) use “Instalar app” / “Adicionar à tela inicial”. No Safari (iPhone) use Compartilhar → “Adicionar à Tela de Início”. Depois disso, funciona também offline.'],
      ['Lembrete de treino', 'Ative Notificações em Configurações e defina o horário. O aviso aparece quando o app estiver aberto ou em segundo plano no aparelho, sem servidor externo.']
    ];
    return `<main class="screen">${head('Ajuda', { back: 'perfil' })}${q.map(([a, b]) => `<details class="faq"><summary>${a}</summary><p>${b}</p></details>`).join('')}<p class="muted center" style="margin-top:26px;font-size:12px">Disciplina Fit · versão 1.0.0</p></main>`;
  }
  function lock() {
    return `<main class="screen" style="display:flex;flex-direction:column;justify-content:center"><div class="center" style="margin-bottom:26px"><div style="color:var(--or);display:inline-block">${icon('lock', 44)}</div><h1 style="margin-top:14px;font-size:22px">Disciplina Fit</h1><p class="muted" style="margin-top:6px;font-size:13px">Digite sua senha para continuar</p></div>
      <input id="lockpw" type="password" class="field" placeholder="Senha" autocomplete="current-password" data-c="lockenter">
      <p id="lockerr" class="center" style="color:var(--danger);font-size:12.5px;min-height:20px;margin:8px 0"></p>
      <button class="btn" data-a="unlock">Entrar</button><button class="btn ghost" style="margin-top:10px" data-a="forgot">Esqueci a senha</button></main>`;
  }

  /* ---------- descanso, sons e lembretes ---------- */
  let rest = null, restTimer = null;
  function beep() {
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      const ac = new C(), o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination); o.frequency.value = 880; g.gain.value = 0.15;
      o.start(); o.stop(ac.currentTime + 0.25); setTimeout(() => ac.close && ac.close(), 600);
    } catch (e) { /* ignora */ }
  }
  const vibrate = (p) => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ignora */ } };
  function startRest(sec) { rest = { end: Date.now() + sec * 1000 }; tickRest(); if (!restTimer) restTimer = setInterval(tickRest, 250); }
  function stopRest() { rest = null; clearInterval(restTimer); restTimer = null; $('#rest').innerHTML = ''; }
  function tickRest() {
    const el = $('#rest'); if (!rest) { stopRest(); return; }
    const left = Math.ceil((rest.end - Date.now()) / 1000);
    if (left <= 0) { stopRest(); beep(); vibrate([200, 100, 200]); toast('Descanso finalizado — próxima série!'); return; }
    if (!$('.restbar', el)) el.innerHTML = `<div class="restbar"><span>${icon('clock', 16)} Descanso <b data-t>00:00</b></span><button data-a="restAdd">+15s</button><button data-a="restSkip">Pular</button></div>`;
    $('[data-t]', el).textContent = mmss(left);
  }
  function notify(title, body) {
    toast(`${title} ${body}`);
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
          navigator.serviceWorker.getRegistration().then((r) => { if (r) r.showNotification(title, { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' }); else new Notification(title, { body }); });
        } else new Notification(title, { body });
      }
    } catch (e) { /* ignora */ }
  }
  function checkReminder() {
    const s = S.settings; if (!s.notifications || !S.onboarded) return;
    const now = new Date(), tk = todayKey(); if (s.lastReminder === tk || isDone(tk)) return;
    const [h, m] = s.reminderTime.split(':').map(Number), diff = now.getHours() * 60 + now.getMinutes() - (h * 60 + m);
    if (diff < 0 || diff > 59) return;
    s.lastReminder = tk; save();
    const p = planFor(tk); if (p.rest) return;
    notify('Hora de treinar! 💪', p.w ? p.w.name : 'Seu treino está esperando.');
  }

  /* ---------- senha ---------- */
  async function sha(str) {
    if (window.crypto && crypto.subtle) {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('df|' + str));
      return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
    }
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57; const s = 'df|' + str;
    for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
    return 'f' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
  }
  function pwSheet() {
    const has = !!S.settings.passwordHash;
    openSheet(`<h2>${has ? 'Alterar senha' : 'Definir senha'}</h2><p class="sub">A senha protege o acesso ao app neste aparelho. Ela não pode ser recuperada — se esquecer, será preciso apagar os dados.</p>
      ${has ? `<label class="flabel" for="pw0">Senha atual</label><input id="pw0" type="password" class="field" autocomplete="current-password">` : ''}
      <label class="flabel" for="pw1">Nova senha (mín. 4 caracteres)</label><input id="pw1" type="password" class="field" autocomplete="new-password">
      <label class="flabel" for="pw2">Confirmar nova senha</label><input id="pw2" type="password" class="field" autocomplete="new-password">
      <p id="pwerr" style="color:var(--danger);font-size:12.5px;min-height:20px;margin:8px 0"></p>
      <div class="stack"><button class="btn" data-a="savePw">Salvar senha</button>${has ? '<button class="btn ghost" data-a="rmPw">Remover senha</button>' : ''}</div>`);
  }

  /* ---------- dados de exemplo / backup ---------- */
  function genDemo() {
    const names = S.workouts.map((w) => w); if (!names.length) return;
    const now = new Date(); now.setHours(12, 0, 0, 0);
    for (let i = 1; i <= 75; i++) {
      if (i % 7 === 0 || i % 7 === 3) continue;
      const d = new Date(now); d.setDate(d.getDate() - i); const k = key(d);
      if (S.logs[k]) continue;
      const w = names[i % names.length];
      S.logs[k] = { done: true, demo: true, workoutId: w.id, name: w.name, durationSec: 2400 + ((i * 137) % 1800), finishedAt: d.getTime() };
    }
  }
  function download(name, text, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- ações (cliques) ---------- */
  const A = {
    go: (el) => { closeSheet(true); go(el.dataset.r); },
    closeSheet: () => closeSheet(),
    start() {
      if (!S.onboarded) {
        openSheet(`<h2>Bem-vindo(a)!</h2><p class="sub">Como podemos te chamar?</p><input id="nm" class="field" maxlength="40" placeholder="Seu nome" autocomplete="given-name" data-c="nameenter"><div style="margin-top:16px"><button class="btn" data-a="saveName">Continuar</button></div>`);
        setTimeout(() => { const i = $('#nm'); if (i) i.focus(); }, 50);
      } else { sessionStorage.removeItem('df:out'); go('inicio'); }
    },
    saveName() {
      const v = ($('#nm').value || '').trim(); if (!v) { toast('Digite seu nome para continuar.'); return; }
      S.profile.name = v; S.profile.since = todayKey(); S.onboarded = true; save();
      sessionStorage.removeItem('df:out'); closeSheet(true); go('inicio');
    },
    logout() { confirmSheet('Sair', 'Você voltará para a tela inicial. Seus dados continuam salvos neste aparelho.', 'doLogout', {}, 'Sair'); },
    doLogout() { sessionStorage.setItem('df:out', '1'); sessionStorage.removeItem('df:unlocked'); closeSheet(true); location.hash = '#/bem-vindo'; render(); },
    newW() { draft = newDraft(); closeSheet(true); go('montar'); },
    editW(el) { draft = null; closeSheet(true); go('montar/' + el.dataset.id); },
    /* treino do dia */
    pickToday() {
      const tk = todayKey(), cur = S.schedule[tk];
      openSheet(`<h2>Treino de hoje</h2><p class="sub">${longDate(tk)}</p>${S.workouts.map((w) => `<button class="opt ${planFor(tk).w && planFor(tk).w.id === w.id ? 'on' : ''}" data-a="assign" data-k="${tk}" data-w="${esc(w.id)}" data-back="1"><span class="grow">${esc(w.name)}<small>${w.items.length} exercícios</small></span></button>`).join('')}<button class="opt ${cur === 'rest' ? 'on' : ''}" data-a="assign" data-k="${tk}" data-w="rest"><span class="grow">Dia de descanso</span></button>`);
    },
    openEx(el) {
      const id = el.dataset.id, tk = todayKey(), p = planFor(tk);
      const isToday = !!(p.w && (!el.dataset.w || p.w.id === el.dataset.w));
      if (!isToday || isDone(tk)) { openSheet(infoHTML(id, false)); return; }
      const it = p.w.items.find((x) => x.id === id); if (!it) return;
      ensureSession(p.w); openSheet(runnerHTML(it));
    },
    /* seletor de exercícios (mapa corporal) */
    bmGroup(el) { pick.mode = 'list'; pick.group = el.dataset.g; pick.q = ''; pick.fav = false; render(); },
    bmSearch() { pick.mode = 'list'; pick.group = null; pick.q = ''; render(); setTimeout(() => { const i = $('[data-i=bmq]'); if (i) i.focus(); }, 50); },
    bmBack() { pick.mode = 'map'; pick.group = null; pick.q = ''; pick.fav = false; render(); },
    bmSwap() { pick.side = pick.side === 'front' ? 'back' : 'front'; render(); },
    bmFavFilter() {
      pick.fav = !pick.fav;
      if (pick.fav && pick.mode === 'map') { pick.mode = 'list'; pick.group = null; pick.q = ''; }
      render();
    },
    bmFav(el) { S.favs = S.favs || {}; const id = el.dataset.id; if (S.favs[id]) delete S.favs[id]; else S.favs[id] = 1; save(); render(); },
    bmInfo(el) { openSheet(infoHTML(el.dataset.id, false)); },
    bmEx(el) {
      const id = el.dataset.id, i = draft.items.findIndex((x) => x.id === id);
      if (i >= 0) draft.items.splice(i, 1);
      else {
        const e = D.MAP[id], c = draft.cfg, rep = e.unit === 'rep', cardio = e.unit === 'min';
        draft.items.push({ id, sets: cardio ? e.sets : clamp(e.sets, c.setsMin, c.setsMax), repsMin: rep ? clamp(e.rmin, c.repsMin, c.repsMax) : e.rmin, repsMax: rep ? clamp(e.rmax, c.repsMin, c.repsMax) : e.rmax, rest: cardio ? e.rest : clamp(e.rest, c.restMin, c.restMax) });
        if (!draft.groups.includes(e.group)) draft.groups.push(e.group);
      }
      render();
    },
    bmDone() { backToMontar(); },
    startW(el) {
      const w = getW(el.dataset.id); if (!w || !w.items.length) return;
      const tk = todayKey(), p = planFor(tk);
      if (!p.w || p.w.id !== w.id) { S.schedule[tk] = w.id; S.session = null; save(); }
      const sess = ensureSession(w);
      const next = w.items.find((it) => setsFor(sess, it).some((s) => !s.d)) || w.items[0];
      tSel = w.id; save(); render(); A.openEx({ dataset: { id: next.id, w: w.id } });
    },
    editSel() { const w = getW(tSel) || S.workouts[0]; if (w) A.editW({ dataset: { id: w.id } }); else A.newW(); },
    togSet(el) {
      const tk = todayKey(), p = planFor(tk), it = p.w.items.find((x) => x.id === el.dataset.ex), i = +el.dataset.i;
      const sess = ensureSession(p.w), arr = setsFor(sess, it), s = arr[i];
      s.d = !s.d; if (s.d && !sess.startedAt) sess.startedAt = Date.now();
      if (s.d && s.w) S.lastLoad[it.id] = s.w;
      save();
      el.classList.toggle('on', s.d); const row = el.closest('.setrow'); if (row) row.classList.toggle('on', s.d);
      if (s.d && it.rest > 0 && arr.some((x) => !x.d)) startRest(it.rest); else if (!s.d) stopRest();
      if (s.d && arr.every((x) => x.d)) { stopRest(); vibrate(80); toast(`${exName(it.id)} concluído!`); }
    },
    restAdd() { if (rest) rest.end += 15000; tickRest(); },
    restSkip() { stopRest(); },
    finish() {
      const p = planFor(todayKey()), pr = progressOf(p.w);
      if (pr.done === 0) { confirmSheet('Concluir treino?', 'Nenhuma série foi marcada. Quer concluir mesmo assim?', 'doFinish', {}, 'Concluir mesmo assim'); }
      else if (pr.done < pr.total) { confirmSheet('Concluir treino?', `Faltam ${pr.total - pr.done} ${plural(pr.total - pr.done, 'série', 'séries')}. Deseja concluir assim mesmo?`, 'doFinish', {}, 'Concluir treino'); }
      else A.doFinish();
    },
    doFinish() {
      const tk = todayKey(), p = planFor(tk), sess = sessionFor(p.w);
      const dur = sess && sess.startedAt ? Math.round((Date.now() - sess.startedAt) / 1000) : 0;
      S.logs[tk] = { done: true, workoutId: p.w.id, name: p.w.name, durationSec: dur, finishedAt: Date.now() };
      if (!S.schedule[tk]) S.schedule[tk] = p.w.id;
      S.session = null; save(); stopRest(); closeSheet(true); render(); toast('Treino concluído! 💪');
    },
    redo() { delete S.logs[todayKey()]; S.session = null; save(); render(); },
    /* exercícios */
    info(el) { openSheet(infoHTML(el.dataset.id, true)); },
    addToWList(el) {
      openSheet(`<h2>Adicionar a qual treino?</h2><p class="sub">${esc(exName(el.dataset.id))}</p>${S.workouts.map((w) => `<button class="opt" data-a="addToW" data-w="${esc(w.id)}" data-id="${esc(el.dataset.id)}"><span class="grow">${esc(w.name)}<small>${w.items.length} exercícios</small></span>${icon('plus', 20)}</button>`).join('')}`);
    },
    addToW(el) {
      const w = getW(el.dataset.w), e = D.MAP[el.dataset.id];
      if (w.items.some((i) => i.id === e.id)) { toast('Esse exercício já está no treino.'); return; }
      w.items.push({ id: e.id, sets: e.sets, repsMin: e.rmin, repsMax: e.rmax, rest: e.rest });
      if (!w.groups.includes(e.group)) w.groups.push(e.group);
      save(); closeSheet(true); toast(`Adicionado a “${w.name}”.`);
    },
    exg(el) { exg = el.dataset.g; $$('#exchips .chip').forEach((c) => c.classList.toggle('on', c.dataset.g === exg)); $('#exlist').innerHTML = exList(); },
    /* calendário */
    calMove(el) { const c = calState(); c.m += +el.dataset.d; if (c.m < 0) { c.m = 11; c.y--; } if (c.m > 11) { c.m = 0; c.y++; } render(); },
    selDay(el) { calState().sel = el.dataset.k; render(); },
    dayMenu() { openSheet(dayMenuHTML(calState().sel)); },
    assign(el) {
      const k = el.dataset.k, w = el.dataset.w;
      if (w) S.schedule[k] = w; else delete S.schedule[k];
      save(); closeSheet(true); render();
      if (el.dataset.back) toast(w === 'rest' ? 'Hoje é dia de descanso.' : 'Treino de hoje atualizado.');
    },
    markDone(el) {
      const k = el.dataset.k, p = planFor(k); if (!p.w) return;
      S.logs[k] = { done: true, manual: true, workoutId: p.w.id, name: p.w.name, durationSec: 0, finishedAt: Date.now() };
      if (!S.schedule[k]) S.schedule[k] = p.w.id; save(); closeSheet(true); render(); toast('Dia marcado como concluído.');
    },
    unmarkDone(el) { delete S.logs[el.dataset.k]; save(); closeSheet(true); render(); },
    goTreino() { closeSheet(true); go('treino'); },
    /* montar treino */
    togDay(el) { const d = +el.dataset.d, i = draft.days.indexOf(d); if (i < 0) draft.days.push(d); else draft.days.splice(i, 1); render(); },
    addEx() { pick = { side: 'front', mode: 'map', group: null, q: '', fav: false }; go('escolher'); },
    editItem(el) {
      const i = +el.dataset.i, it = draft.items[i], uw = { rep: 'Repetições', s: 'Segundos', min: 'Minutos' }[(D.MAP[it.id] || {}).unit || 'rep'];
      ss = { kind: 'item', i, sets: it.sets, repsMin: it.repsMin, repsMax: it.repsMax, rest: it.rest };
      openSheet(`<h2>${esc(exName(it.id))}</h2><p class="sub">Ajuste este exercício no treino.</p>${stepper('Séries', 'sets', it.sets, 1, 12, 1)}${stepper(uw + ' (mín.)', 'repsMin', it.repsMin, 1, 100, 1)}${stepper(uw + ' (máx.)', 'repsMax', it.repsMax, 1, 100, 1)}${stepper('Descanso', 'rest', it.rest, 10, 300, 5, 's')}
        <div class="stack" style="margin-top:14px"><button class="btn" data-a="applyItem">Aplicar</button><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px"><button class="btn ghost sm" data-a="moveItem" data-d="-1" aria-label="Mover para cima">${icon('up', 18)}</button><button class="btn ghost sm" data-a="moveItem" data-d="1" aria-label="Mover para baixo">${icon('down', 18)}</button><button class="btn danger sm" data-a="removeItem" aria-label="Remover">${icon('trash', 18)}</button></div></div>`);
    },
    applyItem() { const it = draft.items[ss.i]; it.sets = ss.sets; it.repsMin = ss.repsMin; it.repsMax = ss.repsMax; it.rest = ss.rest; closeSheet(); },
    moveItem(el) {
      const i = ss.i, j = i + +el.dataset.d; if (j < 0 || j >= draft.items.length) return;
      const t = draft.items[i]; draft.items[i] = draft.items[j]; draft.items[j] = t; closeSheet();
    },
    removeItem() { draft.items.splice(ss.i, 1); closeSheet(); },
    cfg(el) {
      const k = el.dataset.k, c = draft.cfg, map = { sets: ['Séries', 1, 12, 1, ''], reps: ['Repetições', 1, 100, 1, ''], rest: ['Descanso', 10, 300, 5, 's'] }[k];
      const a = k + 'Min', b = k + 'Max'; ss = { kind: 'cfg', k, [a]: c[a], [b]: c[b], step: map[3] };
      openSheet(`<h2>${map[0]}</h2><p class="sub">Intervalo usado ao adicionar exercícios ao treino.</p>${stepper('Mínimo', a, c[a], map[1], map[2], map[3], map[4])}${stepper('Máximo', b, c[b], map[1], map[2], map[3], map[4])}<div style="margin-top:16px"><button class="btn" data-a="applyCfg">Aplicar</button></div>`);
    },
    applyCfg() {
      const k = ss.k, a = k + 'Min', b = k + 'Max'; draft.cfg[a] = ss[a]; draft.cfg[b] = ss[b]; const c = draft.cfg;
      draft.items.forEach((it) => {
        if (k === 'sets') it.sets = clamp(it.sets, c.setsMin, c.setsMax);
        if (k === 'reps') { it.repsMin = clamp(it.repsMin, c.repsMin, c.repsMax); it.repsMax = clamp(it.repsMax, c.repsMin, c.repsMax); }
        if (k === 'rest') it.rest = clamp(it.rest, c.restMin, c.restMax);
      });
      closeSheet();
    },
    step(el) {
      if (!ss) return; const n = el.dataset.n, [lo, hi] = limFor(n);
      ss[n] = clamp(ss[n] + +el.dataset.d, lo, hi);
      const base = n.replace(/(Min|Max)$/, '');
      if (/Min$/.test(n) && ss[base + 'Max'] != null && ss[n] > ss[base + 'Max']) ss[base + 'Max'] = ss[n];
      if (/Max$/.test(n) && ss[base + 'Min'] != null && ss[n] < ss[base + 'Min']) ss[base + 'Min'] = ss[n];
      $$('[data-v]').forEach((b) => { b.textContent = ss[b.dataset.v] + (b.dataset.s || ''); });
    },
    saveW() {
      const name = ($('#wname').value || '').trim(); draft.name = name;
      if (!name) { toast('Dê um nome ao treino.'); $('#wname').focus(); return; }
      if (!draft.items.length) { toast('Adicione pelo menos um exercício.'); return; }
      const w = clone(draft); w.name = name; w.groups = groupsOf(w.items); const days = w.days || []; delete w.days;
      if (w.id && getW(w.id)) S.workouts[S.workouts.findIndex((x) => x.id === w.id)] = w;
      else { w.id = uid(); S.workouts.push(w); }
      S.week = (S.week || D.DEFAULT_WEEK).slice(); while (S.week.length < 7) S.week.push(null);
      for (let i = 0; i < 7; i++) { if (days.includes(i)) S.week[i] = w.id; else if (S.week[i] === w.id) S.week[i] = null; }
      S.session = S.session && S.session.workoutId === w.id ? null : S.session;
      tSel = w.id; save(); draft = null; toast('Treino salvo!'); go('treino');
    },
    /* meus treinos */
    wMenu(el) { openSheet(wMenuHTML(el.dataset.id)); },
    setToday(el) { S.schedule[todayKey()] = el.dataset.id; save(); closeSheet(true); go('treino'); toast('Treino de hoje definido.'); },
    dupW(el) { const w = clone(getW(el.dataset.id)); w.id = uid(); w.name = (w.name + ' (cópia)').slice(0, 40); S.workouts.push(w); save(); closeSheet(); toast('Treino duplicado.'); },
    delW(el) { confirmSheet('Excluir treino?', `“${getW(el.dataset.id).name}” será removido. O histórico de treinos já realizados é mantido.`, 'doDelW', { id: el.dataset.id }, 'Excluir', true); },
    doDelW(el) {
      const id = el.dataset.id; S.workouts = S.workouts.filter((w) => w.id !== id); S.week = (S.week || []).map((v) => (v === id ? null : v));
      Object.keys(S.schedule).forEach((k) => { if (S.schedule[k] === id) delete S.schedule[k]; });
      if (S.session && S.session.workoutId === id) S.session = null; save(); closeSheet(); toast('Treino excluído.');
    },
    /* perfil e configurações */
    pickAvatar() { $('#avatarIn').click(); },
    saveDados() {
      const name = ($('#d-name').value || '').trim(); if (!name) { toast('O nome não pode ficar vazio.'); return; }
      const goal = parseInt($('#d-goal').value, 10);
      if (!(goal >= 1 && goal <= 31)) { toast('A meta mensal deve ficar entre 1 e 31 treinos.'); return; }
      S.profile.name = name; S.profile.birth = $('#d-birth').value || '';
      const wv = $('#d-weight').value.trim();
      S.profile.weightKg = wv && wParse(wv) > 0 ? wParse(wv) : null;
      S.profile.heightCm = hParse($('#d-height').value); S.monthlyGoal = goal; save(); toast('Dados salvos!');
    },
    togNotif() {
      const s = S.settings;
      if (s.notifications) { s.notifications = false; save(); render(); return; }
      if (!('Notification' in window)) { toast('Este navegador não suporta notificações.'); return; }
      const ok = () => { s.notifications = true; save(); render(); toast(`Lembrete diário às ${s.reminderTime}.`); };
      if (Notification.permission === 'granted') ok();
      else if (Notification.permission === 'denied') toast('Notificações bloqueadas. Libere nas permissões do site.');
      else Notification.requestPermission().then((r) => { if (r === 'granted') ok(); else toast('Permissão de notificações negada.'); });
    },
    unitSheet() {
      openSheet(`<h2>Unidade de medida</h2><p class="sub">Afeta peso e altura exibidos no app.</p><button class="opt ${!imp() ? 'on' : ''}" data-a="setUnit" data-u="metric"><span class="grow">Métrico<small>kg / cm</small></span>${!imp() ? icon('check', 20) : ''}</button><button class="opt ${imp() ? 'on' : ''}" data-a="setUnit" data-u="imperial"><span class="grow">Imperial<small>lb / in</small></span>${imp() ? icon('check', 20) : ''}</button>`);
    },
    setUnit(el) { S.settings.units = el.dataset.u; save(); closeSheet(); },
    pwSheet,
    async savePw() {
      const err = (m) => { $('#pwerr').textContent = m; };
      const has = !!S.settings.passwordHash;
      if (has && (await sha($('#pw0').value)) !== S.settings.passwordHash) return err('Senha atual incorreta.');
      const a = $('#pw1').value, b = $('#pw2').value;
      if (a.length < 4) return err('A nova senha precisa ter ao menos 4 caracteres.');
      if (a !== b) return err('As senhas não coincidem.');
      S.settings.passwordHash = await sha(a); sessionStorage.setItem('df:unlocked', '1'); save(); closeSheet(); toast('Senha salva.');
    },
    async rmPw() {
      if ((await sha($('#pw0').value)) !== S.settings.passwordHash) { $('#pwerr').textContent = 'Informe a senha atual para remover.'; return; }
      S.settings.passwordHash = null; save(); closeSheet(); toast('Senha removida.');
    },
    async unlock() {
      const v = $('#lockpw').value;
      if ((await sha(v)) === S.settings.passwordHash) { sessionStorage.setItem('df:unlocked', '1'); render(); }
      else { $('#lockerr').textContent = 'Senha incorreta.'; $('#lockpw').select(); }
    },
    forgot() { confirmSheet('Esqueci a senha', 'Não é possível recuperar a senha. Para voltar a usar o app, todos os dados deste aparelho serão apagados.', 'wipe', {}, 'Apagar dados e entrar', true); },
    delAccount() { confirmSheet('Excluir conta?', 'Todos os seus dados (perfil, treinos e histórico) serão apagados deste aparelho. Esta ação não pode ser desfeita.', 'wipe', {}, 'Excluir tudo', true); },
    wipe() { try { localStorage.removeItem(KEY); sessionStorage.clear(); } catch (e) { /* ignora */ } clearMedia(); S = defaults(); draft = null; cal = null; closeSheet(true); location.hash = '#/bem-vindo'; render(); },
    exportData() { download(`disciplina-fit-backup-${todayKey()}.json`, JSON.stringify(S, null, 2), 'application/json'); toast('Backup exportado.'); },
    importPick() { $('#importIn').click(); },
    demo() { genDemo(); save(); render(); toast('Dados de exemplo gerados.'); },
    rmDemo() { Object.keys(S.logs).forEach((k) => { if (S.logs[k].demo) delete S.logs[k]; }); save(); render(); toast('Dados de exemplo removidos.'); },
    progTab(el) { prog = el.dataset.t; render(); }
  };

  Object.assign(A, {
    async admLogin() {
      const err = (m) => { $('#a-err').textContent = m; };
      const u = $('#a-user').value, p = $('#a-pw').value;
      if (u.trim().toLowerCase() !== ADMIN_USER.toLowerCase() || (await adminHash(ADMIN_USER, p)) !== S.admin.hash) return err('Usuário ou senha incorretos.');
      sessionStorage.setItem('df:admin', '1'); render();
    },
    async admCreate() {
      const err = (m) => { $('#a-err').textContent = m; };
      const u = $('#a-user').value, p = $('#a-pw').value, p2 = $('#a-pw2').value;
      if (u.trim().toLowerCase() !== ADMIN_USER.toLowerCase()) return err('Somente o administrador AlehS pode criar este acesso.');
      if (p.length < 4) return err('A senha precisa ter ao menos 4 caracteres.');
      if (p !== p2) return err('As senhas não coincidem.');
      S.admin = { user: ADMIN_USER, hash: await adminHash(ADMIN_USER, p) }; save();
      sessionStorage.setItem('df:admin', '1'); render(); toast('Acesso de administrador criado.');
    },
    admLogout() { sessionStorage.removeItem('df:admin'); render(); },
    admReset() { confirmSheet('Redefinir senha do admin?', 'A senha atual será apagada e você poderá criar uma nova no próximo acesso. As imagens já salvas não são afetadas.', 'doAdmReset', {}, 'Redefinir senha', true); },
    doAdmReset() { S.admin = null; save(); sessionStorage.removeItem('df:admin'); closeSheet(); toast('Senha removida. Crie uma nova.'); },
    async admConnect() {
      try {
        const n = await connectDir(); render();
        toast(n ? `Pasta conectada. ${n} ${plural(n, 'imagem enviada', 'imagens enviadas')} para icons/.` : 'Pasta conectada: as imagens serão gravadas em icons/.');
      } catch (e) { if (!e || e.name !== 'AbortError') toast('Não foi possível acessar a pasta.'); }
    },
    async admAuth() { const d = await getDir(true); toast(d ? 'Acesso à pasta autorizado.' : 'Acesso à pasta negado.'); },
    admManifest() { download('media.json', JSON.stringify(MANIFEST, null, 2), 'application/json'); toast('Coloque o media.json na pasta icons/.'); },
    admPick(el) {
      if (!isAdmin()) return;
      pendingImg = { kind: el.dataset.k, id: el.dataset.id || '' }; $('#admFile').click();
    },
    admDel(el) {
      const cover = el.dataset.k === 'cover';
      confirmSheet('Remover imagem?', cover ? 'A capa da aba inicial será removida.' : `A imagem de “${exName(el.dataset.id)}” será removida.`, 'doAdmDel', { k: el.dataset.k, id: el.dataset.id || '' }, 'Remover', true);
    },
    async doAdmDel(el) {
      if (!isAdmin()) return;
      const r = await delImage(el.dataset.k, el.dataset.id); closeSheet(true); render();
      toast(r === 'folder' ? 'Imagem removida da pasta icons.' : 'Removida aqui. Baixe o media.json e apague o arquivo em icons/.');
    }
  });

  /* ---------- eventos ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-a]'); if (!t) return;
    const f = A[t.dataset.a]; if (f) { e.preventDefault(); f(t, e); }
  });
  document.addEventListener('input', (e) => {
    const t = e.target, i = t.dataset && t.dataset.i; if (!i) return;
    if (i === 'wname' && draft) draft.name = t.value;
    else if (i === 'exq') { exq = t.value; $('#exlist').innerHTML = exList(); }
    else if (i === 'bmq') { pick.q = t.value; $('#bmgrid').innerHTML = bmGrid(); }
    else if (i === 'admq') { admq = t.value; $('#admlist').innerHTML = admList(); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target, c = t.dataset && t.dataset.c; if (!c) return;
    if (c === 'setf') {
      const sess = S.session; if (!sess) return;
      const arr = sess.sets[t.dataset.ex]; if (!arr) return; const s = arr[+t.dataset.i];
      if (t.dataset.f === 'w') { s.w = wParse(t.value); if (s.d && s.w) S.lastLoad[t.dataset.ex] = s.w; }
      else { const n = parseInt(t.value, 10); s.r = isFinite(n) && n >= 0 ? n : null; }
      save();
    } else if (c === 'remind') {
      if (/^\d{2}:\d{2}$/.test(t.value)) { S.settings.reminderTime = t.value; S.settings.lastReminder = ''; save(); toast(`Lembrete definido para ${t.value}.`); }
    } else if (c === 'avatar') {
      const f = t.files && t.files[0]; if (!f) return;
      const img = new Image(), url = URL.createObjectURL(f);
      img.onload = () => {
        const n = 256, cv = document.createElement('canvas'); cv.width = cv.height = n;
        const s = Math.min(img.width, img.height), ctx = cv.getContext('2d');
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, n, n);
        S.profile.avatar = cv.toDataURL('image/jpeg', 0.82); URL.revokeObjectURL(url); save(); render();
      };
      img.onerror = () => toast('Não foi possível ler essa imagem.'); img.src = url;
    } else if (c === 'adminimg') {
      const f = t.files && t.files[0], p = pendingImg; t.value = ''; pendingImg = null;
      if (!f || !p || !isAdmin()) return;
      if (!/^image\//.test(f.type)) { toast('Escolha um arquivo de imagem.'); return; }
      toast('Processando imagem…');
      setImage(p.kind, p.id, f).then((r) => {
        closeSheet(true); render();
        toast(r === 'folder' ? 'Imagem salva na pasta icons.' : 'Imagem salva aqui e baixada — coloque o arquivo (e o media.json) em icons/.');
      }).catch(() => toast('Não foi possível usar essa imagem.'));
    } else if (c === 'import') {
      const f = t.files && t.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => {
        try {
          const d = JSON.parse(r.result);
          if (!d || d.v !== 1 || !Array.isArray(d.workouts) || typeof d.logs !== 'object') throw new Error('x');
          confirmImport = d; confirmSheet('Importar backup?', 'Os dados atuais deste aparelho serão substituídos pelos do backup.', 'doImport', {}, 'Importar');
        } catch (er) { toast('Arquivo de backup inválido.'); }
      };
      r.readAsText(f); t.value = '';
    }
  });
  let confirmImport = null;
  A.doImport = () => {
    if (!confirmImport) return; const d = defaults();
    S = Object.assign(d, confirmImport, { profile: Object.assign(d.profile, confirmImport.profile), settings: Object.assign(d.settings, confirmImport.settings) });
    confirmImport = null; save(); closeSheet(true); render(); toast('Backup importado.');
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheetEl.classList.contains('open')) closeSheet();
    if (e.key === 'Enter') {
      const c = e.target.dataset && e.target.dataset.c;
      if (c === 'lockenter') A.unlock(); else if (c === 'nameenter') A.saveName();
      else if (c === 'adminenter') (S.admin ? A.admLogin() : A.admCreate());
    }
  });
  // Carrossel de treinos: atualiza pontos e botão ao deslizar
  document.addEventListener('scroll', (e) => {
    const t = e.target; if (!t.classList || !t.classList.contains('pager')) return;
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      const i = Math.round(t.scrollLeft / Math.max(1, t.clientWidth)), w = S.workouts[i];
      if (!w || w.id === tSel) return;
      tSel = w.id; $$('.dots i').forEach((d, j) => d.classList.toggle('on', j === i)); $('#tbar').innerHTML = tbarHTML(w);
    });
  }, true);
  window.addEventListener('hashchange', () => { closeSheet(true); render(); });

  /* ---------- início ---------- */
  render();
  loadMedia().then(() => { if (!sheetEl.classList.contains('open')) render(); });
  setInterval(checkReminder, 30000); checkReminder();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
