// =====================================================================
//  PART 1  (stories 11-25)  -- paste this AFTER the last line of content_story.js
//  Adds new 3D models + sets, then pushes 15 new stories into STORIES.
//  Everything is wrapped in a block so names never clash with other parts.
// =====================================================================
(() => {
  // ---------- new times of day ----------
  TIMES.space = { top: [4, 4, 22], bot: [18, 14, 52], fog: [10, 8, 34], sunCol: [210, 220, 255], stars: 1, clouds: 0, bright: 0.95, amb: 0.64 };
  TIMES.deep = { top: [34, 130, 210], bot: [22, 96, 170], fog: [26, 104, 176], sunCol: [200, 232, 255], clouds: 0, bright: 1.02, fogNear: 12, fogFar: 72 };

  // ---------- helper: add a new person type ----------
  const addHuman = (n, cf) => {
    HP[n] = cf; MINFO[n] = { h: 1.9 * (cf.k || 1), cat: 'people' };
    MODELS[n] = (x, y, z, f, s, o, T, st) => drawHuman(n, x, y, z, f, s == null ? 1 : s, o || {}, T || 0, st || { anim: 'stand' });
  };
  addHuman('runner', { shirt: 'white', pants: 'blue', short: 1, shorts: 1, skin: 'skin4', hair: 'hairBlack', shoes: 'lime' });

  // =====================================================================
  //  NEW MODELS
  // =====================================================================
  const shk = (M, o, T) => (o.shake ? mm(M, mT(Math.sin(T * 43) * 0.06 * o.shake, 0, Math.cos(T * 37) * 0.06 * o.shake)) : M);

  defP('motorwagen', { h: 2.8, r: 2.6, cat: 'vehicles' }, (M, o) => {
    bb(M, 0, 1.0, -0.1, 1.5, 0.22, 3.0, cc(o, 'a', 'dark'), { ne: 1 });
    bb(M, 0, 1.5, -0.2, 1.3, 0.35, 1.1, 'brown', { tex: 'plank', cell: 0.35 });
    bb(M, 0, 2.15, -0.7, 1.3, 1.0, 0.2, 'brown', { tex: 'plank', cell: 0.35 });
    bb(M, 0, 1.35, -1.5, 0.9, 0.9, 0.8, 'dark', { cell: 0.45 });
    bb(M, 0.3, 2.0, -1.5, 0.35, 0.5, 0.35, 'silver', { cell: 0.25 });
    bb(M, 0, 2.0, 0.9, 0.12, 1.2, 0.12, 'silver', { ne: 1 });
    [-1, 1].forEach((d) => cy(mm(M, mm(mT(d * 1.0, 0.95, -0.7), mRz(-d * Math.PI / 2))), 0, -0.12, 0, 0.95, 0.24, 10, 'wood', { capc: 'brown' }));
    cy(mm(M, mm(mT(0, 0.5, 1.3), mRz(Math.PI / 2))), 0, -0.1, 0, 0.5, 0.2, 8, 'wood', { capc: 'brown' });
  });

  defP('flyer', { h: 3, r: 0, cat: 'vehicles', sh: 0 }, (M, o, T) => {
    const cl2 = [236, 228, 200];
    [0.8, 2.4].forEach((y, i) => bb(M, 0, y, 0.3, 12, 0.1, 1.5, cl2, { cell: 1.5, salt: i }));
    [-5.6, -3, 0, 3, 5.6].forEach((x) => bb(M, x, 1.6, 0.3, 0.1, 1.6, 0.1, 'wood', { ne: 1 }));
    bb(M, 0, 1.4, 2.9, 5, 0.08, 0.9, cl2, { cell: 1.2 });
    bb(M, 0, 1.5, 1.9, 0.12, 0.7, 2, 'wood', { ne: 1 });
    bb(M, 0, 1.5, -3.4, 0.08, 1.6, 1.1, cl2, { cell: 0.8 });
    bb(M, 0, 1.6, -1.6, 0.12, 0.12, 3.6, 'wood', { ne: 1 });
    bb(M, 0, 1.2, 0.2, 0.7, 0.5, 0.9, 'dark', { cell: 0.4 });
    bb(M, 0, 0.3, 1.2, 0.2, 0.2, 5.4, 'wood', { ne: 1 });
    [-1.5, 1.5].forEach((x, i) => bb(mm(M, mm(mT(x, 1.5, -1.1), mRz(T * 26 + i))), 0, 0, 0, 0.18, 2.6, 0.06, 'brown', { ne: 1 }));
  });

  defP('paperboat', { h: 0.9, r: 0.6, cat: 'props', sh: 0 }, (M, o, T) => {
    const c = cc(o, 'a', 'white'), M2 = mm(M, mT(0, Math.sin(T * 3) * 0.03, 0));
    bb(M2, 0, 0.12, 0, 0.5, 0.24, 1.2, c, { cell: 0.4 });
    bb(M2, 0, 0.32, 0.35, 0.5, 0.2, 0.5, sh(c, 0.92), { cell: 0.25 });
    bb(M2, 0, 0.32, -0.35, 0.5, 0.2, 0.5, sh(c, 0.92), { cell: 0.25 });
    bb(M2, 0, 0.62, 0, 0.06, 0.6, 0.9, sh(c, 1.04), { ne: 1 });
    bb(M2, 0, 0.5, 0.3, 0.06, 0.4, 0.4, sh(c, 0.96), { ne: 1 });
  });

  defP('balloon', { h: 3, r: 0, cat: 'props', sh: 0 }, (M, o, T) => {
    const c = cc(o, 'a', [236, 58, 54]), M2 = mm(M, mT(Math.sin(T * 1.7) * 0.08, Math.sin(T * 2.3) * 0.05, 0));
    bb(M2, 0, 2.0, 0, 0.75, 0.5, 0.75, c, { cell: 0.25 });
    bb(M2, 0, 2.45, 0, 0.55, 0.4, 0.55, sh(c, 1.1), { cell: 0.2 });
    bb(M2, 0, 2.72, 0, 0.3, 0.2, 0.3, sh(c, 1.15), { cell: 0.15 });
    bb(M2, 0, 1.55, 0, 0.55, 0.4, 0.55, sh(c, 0.92), { cell: 0.2 });
    bb(M2, 0, 1.28, 0, 0.2, 0.15, 0.2, sh(c, 0.8), { ne: 1 });
    bb(M2, 0, 0.64, 0, 0.025, 1.28, 0.025, 'white', { ne: 1 });
  });

  defP('peachbasket', { h: 1, r: 0.6, cat: 'props', sh: 0 }, (M) => {
    cy(M, 0, 0, 0, 0.45, 0.7, 8, [214, 160, 90], { r2: 0.58, rows: 2, tex: 'stripe', cap: false });
    cy(M, 0, 0.02, 0, 0.42, 0.66, 8, [150, 104, 56], { r2: 0.55, cap: false, ts: 1 });
    bb(M, 0, 0.04, 0, 0.8, 0.04, 0.8, 'molasses', { ne: 1 });
  });

  defP('hoop', { h: 4.5, r: 1, cat: 'props', sh: 0 }, (M) => {
    bb(M, 0, 3.7, 0, 3.4, 2.2, 0.15, 'white', { cell: 0.8 });
    bb(M, 0, 3.4, 0.09, 1.2, 0.9, 0.04, [236, 58, 54], { ne: 1 });
    for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU; bb(M, Math.cos(a) * 0.62, 3.05, 0.95 + Math.sin(a) * 0.62, 0.2, 0.12, 0.2, 'orange', { ne: 1 }); }
    cy(M, 0, 2.3, 0.95, 0.38, 0.75, 8, 'white', { r2: 0.6, cap: false, ts: 1 });
    bb(M, 0, 1.9, -0.9, 0.3, 3.8, 0.3, 'dark', { ne: 1 });
  });

  defP('octopus', { h: 3.6, r: 2.4, cat: 'animals' }, (M, o, T, st) => {
    const c = cc(o, 'a', [236, 96, 84]), mv = st && st.moving, sw = mv ? 9 : 2.5, am = mv ? 0.35 : 0.2;
    bb(M, 0, 1.7, 0, 1.7, 1.4, 1.5, c, { tex: 'grass', cell: 0.5 });
    bb(M, 0, 2.6, -0.1, 1.2, 0.7, 1.2, sh(c, 1.1), { tex: 'grass', cell: 0.4, salt: 3 });
    [-0.5, 0.5].forEach((x) => { bb(M, x, 1.9, 0.78, 0.42, 0.42, 0.06, 'white', { ne: 1 }); bb(M, x, 1.9, 0.82, 0.18, 0.2, 0.04, 'black', { ne: 1 }); });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU; let r = 0.55;
      for (let j = 0; j < 4; j++) { const w = Math.sin(T * sw + i * 0.8 + j * 0.9) * am * (j + 1) * 0.5; bb(M, Math.cos(a) * (r + w), 1.0 - j * 0.22, Math.sin(a) * (r + w), 0.42 - j * 0.07, 0.42 - j * 0.06, 0.42 - j * 0.07, sh(c, 0.9 + (j & 1) * 0.1), { ne: 1 }); r += 0.38; }
    }
  });

  defP('coral', { h: 1.6, r: 0.8, cat: 'nature' }, (M, o) => {
    const c = cc(o, 'a', [255, 120, 150]);
    [[0, 0, 0.9], [0.4, 0.2, 1.3], [-0.4, -0.1, 1.1], [0.1, 0.5, 0.7]].forEach(([x, z, h], i) => bb(M, x, h / 2, z, 0.3, h, 0.3, sh(c, 0.9 + i * 0.08), { cell: 0.3, salt: i }));
  });

  defP('fish', { h: 0.6, r: 0.4, cat: 'animals', sh: 0 }, (M, o, T, st) => {
    const c = cc(o, 'a', [255, 160, 40]), w = Math.sin(T * 9 + ((st && st.seed) || 0)) * 0.15;
    bb(M, 0, 0, 0, 0.3, 0.4, 0.8, c, { cell: 0.3 });
    bb(mm(M, mT(w, 0, 0)), 0, 0, -0.55, 0.08, 0.4, 0.35, sh(c, 0.8), { ne: 1 });
    [-0.16, 0.16].forEach((x) => bb(M, x, 0.08, 0.28, 0.04, 0.08, 0.08, 'black', { ne: 1 }));
  });

  defP('train', { h: 4.2, r: 8, cat: 'vehicles' }, (M, o) => {
    bb(M, 0, 2.2, 0, 3.4, 3.4, 12, cc(o, 'a', [60, 150, 90]), { tex: 'stripe', cell: 1.2 });
    bb(M, 0, 4.0, 0, 3.2, 0.3, 11.6, 'silver', { ne: 1 });
    bb(M, 0, 0.7, 0, 3.0, 0.8, 11.6, 'dark', { ne: 1 });
    [-1.72, 1.72].forEach((x) => [-4, -1.5, 1.5, 4].forEach((z) => bb(M, x, 2.7, z, 0.1, 1.2, 1.4, [180, 226, 255], { em: 1, ne: 1 })));
    bb(M, 0, 2.7, 6.02, 2.4, 1.3, 0.1, [180, 226, 255], { em: 1, ne: 1 });
    [-0.9, 0.9].forEach((x) => bb(M, x, 1.4, 6.05, 0.4, 0.3, 0.1, [255, 252, 200], { em: 1, ne: 1 }));
  });

  defP('pedestal', { h: 1.2, r: 1, cat: 'props' }, (M, o) => { bb(M, 0, 0.55, 0, 1.6, 1.1, 1.6, cc(o, 'a', [176, 172, 186]), { tex: 'stone', cell: 0.5 }); bb(M, 0, 1.15, 0, 1.8, 0.14, 1.8, [196, 192, 204], { cell: 0.6 }); });

  defP('emu', { h: 3.2, r: 0.9, cat: 'animals' }, (M, o, T, st) => {
    const mv = st && (st.moving || st.anim === 'run'), g = mv ? Math.sin(T * 12 + ((st && st.seed) || 0)) * 0.7 : 0, c = cc(o, 'a', [124, 94, 70]), nk = [96, 112, 134];
    bb(M, 0, 1.45, 0, 0.9, 0.9, 1.5, c, { tex: 'grass', cell: 0.45 });
    bb(M, 0, 1.55, -0.85, 0.7, 0.6, 0.5, sh(c, 0.8), { cell: 0.3 });
    bb(M, 0, 2.35, 0.6, 0.22, 1.1, 0.22, nk, { ne: 1 });
    bb(M, 0, 2.95, 0.72, 0.32, 0.3, 0.5, nk, { ne: 1 });
    bb(M, 0, 2.92, 1.0, 0.1, 0.08, 0.2, 'dark', { ne: 1 });
    [-0.28, 0.28].forEach((x, i) => { const Ml = mm(M, piv(mRx(g * (i ? 1 : -1)), [x, 1.0, 0])); bb(Ml, x, 0.5, 0, 0.16, 1.0, 0.16, [186, 164, 140], { ne: 1 }); bb(Ml, x, 0.05, 0.12, 0.26, 0.1, 0.4, [60, 50, 44], { ne: 1 }); });
  });

  defP('wheat', { h: 1.4, r: 3, cat: 'nature', sh: 0 }, (M, o, T) => {
    const nx = o.nx || 6, nz = o.nz || 4;
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) { const sw = Math.sin(T * 2 + i * 0.7 + j * 0.5) * 0.08, hh = 1.0 + hf(i, j, 1, 9) * 0.3; bb(M, (i - nx / 2) * 0.8 + sw, hh / 2, (j - nz / 2) * 0.8, 0.28, hh, 0.28, mixc([236, 196, 70], [250, 224, 110], hf(i, j, 2, 9)), { ne: 1 }); }
  });

  defP('rosetta', { h: 3.4, r: 1.6, cat: 'props' }, (M) => {
    bb(M, 0, 1.6, 0, 2.4, 3.2, 0.5, [64, 62, 72], { tex: 'stone', cell: 0.4 });
    bb(M, 0.35, 3.3, 0, 1.6, 0.4, 0.5, [58, 56, 66], { tex: 'stone', cell: 0.4, salt: 4 });
    for (let band = 0; band < 3; band++) for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { if (hf(band, r, c, 7) > 0.25) bb(M, -0.9 + c * 0.3, 3.0 - band * 1.0 - r * 0.25, 0.27, band === 0 ? 0.16 : band === 1 ? 0.28 : 0.2, 0.08, 0.03, [218, 204, 172], { ne: 1 }); }
    [2.2, 1.2].forEach((y) => bb(M, 0, y, 0.26, 2.3, 0.04, 0.03, [150, 140, 120], { ne: 1 }));
  });

  defP('planet', { h: 8, r: 0, cat: 'nature', sh: 0 }, (M, o) => {
    const R = o.r || 4, c = cc(o, 'a', [50, 120, 230]), g = cc(o, 'b', [70, 190, 100]);
    [-0.8, -0.4, 0, 0.4, 0.8].forEach((t, i) => { const rr = R * Math.sqrt(1 - t * t * 0.98), hh = R * 0.42; cy(M, 0, R * t - hh / 2, 0, rr, hh, 16, i % 2 ? mixc(c, g, 0.55) : c, { tex: 'sand', capc: sh(c, 1.1) }); });
  });

  defP('record', { h: 4, r: 0, cat: 'props', sh: 0 }, (M, o, T) => {
    const R = mm(M, mm(mRx(Math.PI / 2), mRy(T * 1.2)));
    cy(R, 0, -0.1, 0, 2, 0.2, 18, [255, 196, 50], { capc: [250, 190, 40] });
    cy(R, 0, 0.1, 0, 1.2, 0.03, 18, [212, 150, 30], { capc: [226, 166, 36] });
    cy(R, 0, 0.13, 0, 0.3, 0.03, 12, [60, 50, 40], { capc: [60, 50, 40] });
    bb(R, 1.5, 0.12, 0, 0.5, 0.04, 0.2, 'white', { ne: 1 });
  });

  defP('voyager', { h: 3.5, r: 0, cat: 'vehicles', sh: 0 }, (M, o, T) => {
    cy(mm(M, mRx(Math.PI / 2)), 0, 0.2, 0, 0.45, 0.9, 12, [226, 226, 236], { r2: 1.7, cap: false, rows: 2 });
    bb(M, 0, 0, -0.5, 1.0, 0.7, 1.0, [220, 176, 60], { cell: 0.5 });
    bb(M, 1.9, 0.1, -0.5, 3.4, 0.08, 0.08, 'dark', { ne: 1 });
    bb(M, 3.7, 0.1, -0.5, 0.25, 0.25, 0.25, 'silver', { ne: 1 });
    bb(M, -1.5, 0, -0.6, 2.0, 0.22, 0.22, 'grey', { cell: 0.5 });
    bb(M, 0, 0.9, -0.5, 0.08, 1.0, 0.08, 'silver', { ne: 1 });
    cy(mm(M, mT(0, 0.37, -0.5)), 0, 0, 0, 0.35, 0.04, 10, [255, 200, 50], { em: 1 });
    if (Math.sin(T * 5) > 0) bb(M, 0.3, 0.1, -1.02, 0.1, 0.1, 0.04, [255, 70, 70], { em: 1, ne: 1 });
  });

  defP('petri', { h: 0.8, r: 0.9, cat: 'props' }, (M, o) => {
    cy(M, 0, 0, 0, 0.65, 0.14, 14, [214, 232, 240], { cap: false });
    cy(M, 0, 0.02, 0, 0.58, 0.08, 14, [236, 214, 120], { capc: [240, 220, 130] });
    const hl = o.halo == null ? 0 : o.halo;
    if (hl > 0.02) cy(M, 0, 0.05, 0, 0.1 + 0.34 * hl, 0.06, 14, [250, 244, 214], { capc: [252, 248, 224] });
    if (o.mold) { bb(M, 0, 0.14, 0, 0.14, 0.1, 0.14, [70, 150, 120], { cell: 0.07 }); bb(M, 0.04, 0.16, -0.03, 0.08, 0.06, 0.08, [110, 190, 150], { ne: 1 }); }
  });

  defP('table', { h: 2.2, r: 1.8, cat: 'props' }, (M, o, T) => {
    const M2 = shk(M, o, T);
    bb(M2, 0, 1.55, 0, 3.4, 0.2, 2.2, 'wood', { tex: 'plank', cell: 0.5 });
    [[-1.5, -0.9], [1.5, -0.9], [-1.5, 0.9], [1.5, 0.9]].forEach(([x, z]) => bb(M2, x, 0.75, z, 0.22, 1.5, 0.22, 'brown', { ne: 1 }));
  });

  defP('sofa', { h: 2.2, r: 2, cat: 'props' }, (M, o, T) => {
    const M2 = shk(M, o, T), c = cc(o, 'a', [90, 130, 210]);
    bb(M2, 0, 0.6, 0, 4, 0.9, 1.6, c, { cell: 0.8 });
    bb(M2, 0, 1.5, -0.6, 4, 1.3, 0.4, sh(c, 0.9), { cell: 0.8 });
    [-2.1, 2.1].forEach((x) => bb(M2, x, 1.0, 0, 0.3, 1.5, 1.6, sh(c, 0.85), { cell: 0.8 }));
  });

  defP('shelf', { h: 5, r: 1.6, cat: 'props' }, (M, o, T) => {
    const M2 = shk(M, o, T);
    bb(M2, 0, 2.5, 0.2, 3, 5, 0.4, 'wood', { tex: 'plank', cell: 0.6 });
    [0.5, 1.9, 3.3].forEach((y, r) => { bb(M2, 0, y, -0.1, 3, 0.1, 0.9, 'brown', { ne: 1 }); for (let k = 0; k < 6; k++) bb(M2, -1.1 + k * 0.42, y + 0.45, -0.1, 0.3, 0.8, 0.5, [[220, 70, 70], [70, 130, 220], [80, 190, 110], [240, 190, 60]][(k + r) % 4], { ne: 1 }); });
  });

  defP('bed', { h: 2, r: 2, cat: 'props' }, (M, o, T) => {
    const M2 = shk(M, o, T);
    bb(M2, 0, 0.6, 0, 2.6, 0.4, 4, 'wood', { tex: 'plank', cell: 0.6 });
    bb(M2, 0, 1.0, 0, 2.4, 0.4, 3.8, [200, 226, 255], { cell: 0.8 });
    bb(M2, 0, 1.3, -1.5, 1.6, 0.3, 0.7, 'white', { cell: 0.5 });
    bb(M2, 0, 1.25, 0.6, 2.4, 0.15, 2.4, [236, 90, 100], { cell: 0.8 });
  });

  defP('doorframe', { h: 4.6, r: 1.4, cat: 'props' }, (M) => {
    [-1.1, 1.1].forEach((x) => bb(M, x, 2.2, 0, 0.3, 4.4, 0.4, 'brown', { ne: 1 }));
    bb(M, 0, 4.45, 0, 2.5, 0.3, 0.4, 'brown', { ne: 1 });
    bb(M, 0, 2.1, 0.1, 1.9, 4.2, 0.05, [250, 226, 150], { em: 1, ne: 1 });
  });

  defP('finish', { h: 7, r: 0, cat: 'props', sh: 0 }, (M) => {
    [-6, 6].forEach((x) => bb(M, x, 3, 0, 0.5, 6, 0.5, 'silver', { cell: 1 }));
    bb(M, 0, 6.2, 0, 12.6, 1.5, 0.3, 'white', { tex: 'check', cell: 0.75 });
    bb(M, 0, 4.9, -0.2, 2.6, 0.9, 0.1, [24, 24, 34], { em: 1, ne: 1 });
    [-0.9, -0.3, 0.3, 0.9].forEach((x) => bb(M, x, 4.9, -0.28, 0.32, 0.5, 0.04, [255, 70, 70], { em: 1, ne: 1 }));
  });

  // =====================================================================
  //  NEW SETS
  // =====================================================================
  const roomSet = (fa, fb, wall, seed, tx, extra) => ({ time: 'day', build() {
    ground(-42, 42, -22, 74, 4, (x, z) => (((Math.floor(x / 4) + Math.floor(z / 4)) & 1) ? fa : fb), seed);
    bb(MI, 0, 15, 74, 86, 30, 1, wall, { tex: tx || 'plank', cell: 6, salt: seed });
    bb(MI, -43, 15, 26, 1, 30, 98, sh(wall, 0.92), { tex: tx || 'plank', cell: 6, salt: seed + 1 });
    bb(MI, 43, 15, 26, 1, 30, 98, sh(wall, 0.92), { tex: tx || 'plank', cell: 6, salt: seed + 2 });
    bb(MI, 0, 30.5, 26, 86, 1, 98, [236, 232, 222], { cell: 10 });
    for (let x = -24; x <= 24; x += 16) bb(MI, x, 17, 73.3, 7, 9, 0.2, [190, 226, 255], { em: 1, ne: 1 });
    if (extra) extra();
  } });
  SETS.gym = roomSet([200, 146, 84], [188, 132, 74], [238, 222, 192], 41, 'plank', () => { bb(MI, 0, 2.8, 72.7, 70, 0.3, 0.8, 'wood', { tex: 'plank', cell: 1.5 }); bb(MI, 0, 0.06, 40, 0.3, 0.05, 60, [255, 255, 255], { ne: 1 }); });
  SETS.lab = roomSet([204, 218, 228], [188, 204, 216], [228, 240, 236], 42, 'tile', () => {
    bb(MI, 0, 2.4, 34, 24, 0.6, 6, [160, 114, 72], { tex: 'plank', cell: 2 });
    [-10.5, 10.5].forEach((x) => bb(MI, x, 1.05, 34, 0.8, 2.1, 5, [110, 80, 50], { ne: 1 }));
    bb(MI, -26, 11, 72.5, 14, 0.4, 1.5, 'wood', { ne: 1 }); bb(MI, 26, 11, 72.5, 14, 0.4, 1.5, 'wood', { ne: 1 });
    for (let k = 0; k < 6; k++) { bb(MI, -31 + k * 2.2, 12, 72.4, 0.8, 1.6, 0.8, [[90, 200, 120], [240, 120, 90], [90, 150, 240]][k % 3], { ne: 1 }); bb(MI, 21 + k * 2.2, 12, 72.4, 0.8, 1.6, 0.8, [[240, 190, 60], [200, 110, 220], [90, 200, 200]][k % 3], { ne: 1 }); }
  });
  SETS.museum = roomSet([214, 200, 172], [200, 186, 158], [212, 198, 168], 43, 'brick', () => { bb(MI, -24, 14, 73.2, 5, 14, 0.2, [150, 40, 56], { ne: 1 }); bb(MI, 24, 14, 73.2, 5, 14, 0.2, [150, 40, 56], { ne: 1 }); bb(MI, 0, 0.07, 36, 12, 0.14, 12, [150, 40, 56], { tex: 'check', cell: 2, ne: 1 }); });
  SETS.livingroom = roomSet([196, 146, 90], [186, 134, 80], [244, 218, 204], 44, 'plank', () => { bb(MI, 0, 0.06, 30, 30, 0.12, 22, [196, 84, 96], { tex: 'check', cell: 3, ne: 1 }); });

  SETS.countryroad = { time: 'day', build() {
    ground(-110, 110, -60, 170, 5, (x, z) => (Math.abs(x) < 6 ? ((Math.floor(z / 5) & 1) ? [198, 164, 108] : [190, 156, 102]) : (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [92, 200, 98] : [80, 188, 90])), 51);
    farM(190, [18, 26, 14], [120, 150, 200]); tufts(80, 52, -60, 60, 2, 100, [40, 160, 70], (x) => Math.abs(x) < 7);
    scat(24, 53, -70, 70, 8, 130, (x, z, q) => put('tree', x, 0, z, q() * 360, 0.9 + q() * 0.5), (x) => Math.abs(x) < 9);
    scat(14, 54, -50, 50, 4, 80, (x, z, q) => put('flower', x, 0, z, 0, 1.5, { c: { a: ['red', 'yellow', 'white'][Math.floor(q() * 3)] } }), (x) => Math.abs(x) < 7);
  } };
  SETS.dunes = { time: 'day', build() {
    ground(-120, 120, -60, 200, 5, (x, z) => (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [240, 222, 170] : [232, 212, 160]), 55);
    put('dune', -60, 0, 80, 0, 1.6); put('dune', 50, 0, 100, 0, 1.8); put('dune', 0, 0, 150, 0, 2.2); put('dune', -90, 0, 150, 0, 1.4);
    tufts(60, 56, -50, 50, 2, 100, [150, 170, 80]);
    bb(MI, 0, 0.1, 30, 0.4, 0.2, 40, 'wood', { ne: 1 }); bb(MI, -24, 1.4, 44, 3, 2.8, 4, 'wood', { tex: 'plank', cell: 0.8 });
  } };
  SETS.everest = { time: 'clear', build() {
    ground(-110, 110, -60, 170, 5, (x, z) => (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [246, 250, 255] : [232, 240, 252]), 57);
    for (let i = 0; i < 6; i++) mount(-120 + i * 48, 190, 44 + (i % 3) * 12, [40, 58, 34][i % 3], [200, 214, 236]);
    put('mountain', 0, 0, 150, 0, 1, { r: 70, h: 62, c: { a: [190, 204, 230] } });
    scat(10, 58, -40, 40, 6, 70, (x, z, q) => put('rock', x, 0, z, q() * 360, 0.8 + q(), { c: { a: [196, 206, 226] } }), (x) => Math.abs(x) < 4);
    scat(12, 59, -60, 60, 10, 110, (x, z, q) => put('pine', x, 0, z, 0, 0.9 + q() * 0.6, { snow: 1 }));
  } };
  SETS.space = { time: 'space', build() { } };
  SETS.ocean = { time: 'deep', build() {
    ground(-90, 90, -30, 120, 5, (x, z) => (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [222, 204, 158] : [208, 190, 146]), 61);
    scat(14, 62, -40, 40, 6, 70, (x, z, q) => put('coral', x, 0, z, q() * 360, 1 + q() * 1.4, { c: { a: ['pink', 'orange', 'magenta', 'purple'][Math.floor(q() * 4)] } }), (x, z) => Math.abs(x) < 5 && z < 30);
    scat(10, 63, -50, 50, 6, 90, (x, z, q) => put('rock', x, 0, z, q() * 360, 1 + q() * 1.5, { c: { a: [120, 130, 150] } }), (x, z) => Math.abs(x) < 5 && z < 26);
  },
  dyn(b, T) {
    for (let k = 0; k < 8; k++) { const x = -34 + k * 10, z = 30 + (k % 3) * 8; for (let j = 0; j < 5; j++) bb(MI, x + Math.sin(T * 1.5 + k + j * 0.6) * 0.25 * j, 0.6 + j * 1.0, z, 0.35, 1.1, 0.25, [40, 150 + j * 10, 90], { ne: 1 }); }
    for (let k = 0; k < 10; k++) bb(MI, -12 + k * 2.6 + Math.sin(T + k) * 0.3, ((T * 1.2 + k * 0.37) % 1) * 9, 18 + (k % 4) * 3, 0.18, 0.18, 0.18, [220, 245, 255], { em: 1, ne: 1 });
  } };
  SETS.station = { time: 'day', build() {
    ground(-80, 80, -30, 26, 4, (x, z) => (z > 22 ? [255, 214, 50] : (((Math.floor(x / 4) + Math.floor(z / 4)) & 1) ? [200, 196, 208] : [186, 182, 196])), 62);
    ground(-80, 80, 26, 40, 4, () => [96, 92, 104], 63); ground(-80, 80, 40, 170, 5, (x, z) => (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [112, 170, 100] : [100, 160, 92]), 64);
    bb(MI, 0, 0.25, 30, 160, 0.2, 0.25, 'grey', { ne: 1 }); bb(MI, 0, 0.25, 31.5, 160, 0.2, 0.25, 'grey', { ne: 1 });
    for (let x = -78; x < 78; x += 3) bb(MI, x, 0.12, 30.75, 0.4, 0.1, 2.2, 'brown', { ne: 1 });
    [[-30, 70, 14, 12, 16, [190, 90, 70]], [-8, 86, 16, 12, 22, [170, 110, 90]], [16, 76, 14, 12, 14, [214, 150, 90]], [40, 90, 16, 12, 26, [150, 100, 120]], [-52, 84, 14, 12, 18, [200, 120, 80]]].forEach(([x, z, w, d, h, c], i) => { bb(MI, x, h / 2, z, w, h, d, c, { tex: 'brick', cell: 2, salt: i }); for (let yy = 3; yy < h - 1; yy += 3.5) for (let k = -w / 2 + 2; k < w / 2 - 1; k += 3.5) bb(MI, x + k, yy, z - d / 2 - 0.06, 1.4, 1.5, 0.1, hf(yy | 0, k | 0, i, 3) > 0.3 ? [255, 226, 130] : [140, 190, 230], { em: 1, ne: 1 }); });
    put('shop', -34, 0, 14, 0, 1.4, { c: { a: [196, 150, 110], b: 'blue' } }); put('lamp', -14, 0, 20, 0, 1); put('lamp', 14, 0, 20, 0, 1); put('bench', 8, 0, 8, 180, 1.2);
  } };
  SETS.avenue = { time: 'day', build() {
    ground(-90, 90, -40, 220, 5, (x, z) => (Math.abs(x) < 9 ? [150, 148, 162] : (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [92, 196, 100] : [80, 184, 92])), 64);
    bb(MI, 0, 0.03, 90, 0.5, 0.05, 280, [250, 250, 250], { ne: 1 });
    for (let z = -20; z < 200; z += 12) [-1, 1].forEach((d) => put('tree', d * 13, 0, z, 0, 1.1 + (((z / 12) | 0) & 1) * 0.3));
    farM(240, [16, 22], [120, 150, 200]);
  } };
  SETS.forest = { time: 'day', build() {
    ground(-110, 110, -60, 170, 5, (x, z) => (((Math.floor(x / 10) + Math.floor(z / 10)) & 1) ? [62, 150, 82] : [54, 138, 74]), 65);
    farM(190, [20, 28, 16], [96, 130, 170]); tufts(80, 66, -60, 60, 2, 100, [30, 120, 60]);
    scat(44, 67, -80, 80, 6, 130, (x, z, q) => put('pine', x, 0, z, 0, 0.9 + q() * 0.8), (x, z) => Math.abs(x) < 8 && z < 40);
    scat(12, 68, -70, 70, 6, 120, (x, z, q) => put('tree', x, 0, z, q() * 360, 0.9 + q() * 0.5), (x, z) => Math.abs(x) < 8 && z < 40);
    scat(8, 69, -30, 30, 6, 60, (x, z, q) => put('rock', x, 0, z, q() * 360, 0.7 + q() * 0.8), (x, z) => Math.abs(x) < 5 && z < 30);
  } };

  window.KITX = { addHuman, roomSet };

  // =====================================================================
  //  STORIES 11-25
  // =====================================================================
  const NEW = [];

  // ---- 11. Bertha Benz (cat 2, Autos & Vehicles) ----
  NEW.push({
    id: 'bertha', kind: 'tale', cat: '2', title: 'The First Road Trip', set: 'countryroad', music: 'fun',
    caption: "In 1888, Bertha Benz took her husband's motorcar on the first long road trip, with her two teenage sons. 🚗 (True story, told briefly.)",
    tags: '#truestory #history #cars #berthabenz #didyouknow #shorts',
    footer: "Based on Bertha Benz's drive from Mannheim to Pforzheim in August 1888 (roughly 100 km each way). Small details vary between sources.",
    beats: [
      { vo: "In 1888, Bertha Benz secretly took her husband's motorcar on a long drive.", time: 'dawn', cam: { mode: 'dolly', from: [-6, 1.8, 4], to: [-2, 1.8, 9], look: [2, 1.4, 24] }, tags: [{ t: [0.15, 0.95], text: 'AUGUST 1888', size: 66 }], sfx: ['birds', 'chime@0.6'],
        actors: [{ id: 'hs', m: 'house', at: [-14, 30], face: 0, s: 1.5, o: { style: 'timber' } }, { id: 'mw', m: 'motorwagen', at: [1, 20], to: [2, 34] }, { id: 'b1', m: 'boy', at: [0, 17], to: [1, 31], anim: 'push', ex: 'determined', c: { shirt: 'green' } }, { id: 'b2', m: 'boy', at: [2.4, 17], to: [3.4, 31], anim: 'push', ex: 'determined', c: { shirt: 'teal' } }, { id: 'bz', m: 'lady', at: [4.6, 19], to: [5.6, 33], ex: 'determined' }] },
      { vo: 'Fuel came only from pharmacies, so one became the first filling station.', time: 'day', cam: { mode: 'static', at: [-6, 2.4, 6], look: [4, 2, 30] }, tags: [{ t: [0.1, 0.95], text: 'FIRST FILLING STATION', size: 50, bg: '#7cf2c0' }], sfx: ['chime@0.5', 'birds'],
        actors: [{ id: 'sh', m: 'shop', at: [12, 34], face: 0, s: 1.1, c: { a: [214, 232, 214], b: 'green' } }, { id: 'mw', m: 'motorwagen', at: [1, 22], face: 150 }, { id: 'bz', m: 'lady', at: [5, 22], face: 160, anim: 'carry', ex: 'smile', o: { hold: 'can' } }, { id: 'b1', m: 'boy', at: [-2, 21], face: 170, anim: 'look', ex: 'smile', c: { shirt: 'green' } }, { id: 'b2', m: 'boy', at: [3.5, 26], face: 190, anim: 'wave', ex: 'laugh', c: { shirt: 'teal' } }, { id: 'ck', m: 'check', at: [12, 34], y: 8.5, s: 1.6, face: 180, vis: [0.5, 1] }] },
      { vo: 'A hatpin cleared a clogged fuel line, and her garter insulated a wire.', time: 'day', cam: { mode: 'orbit', target: 'mw', r: 7, h: 2.5, a0: -35, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'HATPIN + GARTER', size: 62, bg: '#ffd23f' }], sfx: ['clack@0.3', 'pop@0.7', 'birds'],
        actors: [{ id: 'mw', m: 'motorwagen', at: [0, 20], face: 200 }, { id: 'bz', m: 'lady', at: [2.8, 19], face: 150, anim: 'work', ex: 'determined' }, { id: 'b1', m: 'boy', at: [-2.4, 19.5], face: 190, anim: 'look', ex: 'worried', c: { shirt: 'green' } }, { id: 'b2', m: 'boy', at: [-3.6, 22], face: 180, anim: 'look', ex: 'worried', c: { shirt: 'teal' } }, { id: 'pf', m: 'puff', at: [0, 20], y: 2.2, s: 0.9, c: { a: 'grey' } }] },
      { vo: 'A cobbler nailed leather onto the worn brakes, an early version of brake linings.', time: 'day', cam: { mode: 'static', at: [5, 2, 8], look: [0, 1.4, 22] }, tags: [{ t: [0.1, 0.95], text: 'EARLY BRAKE LINING', size: 52, bg: '#ffb86b' }], sfx: ['clack', 'birds@0.6'],
        actors: [{ id: 'mw', m: 'motorwagen', at: [0, 22], face: 120 }, { id: 'ck', m: 'peasant', at: [3, 21.5], face: 200, anim: 'work', ex: 'smile' }, { id: 'bz', m: 'lady', at: [-3.2, 21], face: 170, anim: 'look', ex: 'smile' }, { id: 'b1', m: 'boy', at: [-5.4, 23], face: 180, anim: 'look', c: { shirt: 'green' } }, { id: 'cr', m: 'crate', at: [5.6, 25], s: 1.2 }, { id: 'bl', m: 'barrel', at: [7, 24], s: 1.1 }] },
      { vo: "She reached her mother's town that evening, proving cars could travel far.", time: 'dusk', cam: { mode: 'dolly', from: [-5, 2, 2], to: [-1, 2.2, 6], look: [0, 1.8, 24] }, tags: [{ t: [0.1, 0.95], text: 'MANNHEIM TO PFORZHEIM', size: 44, bg: '#7cc4ff' }], sfx: ['chime@0.5', 'cheer@0.6', 'birds'],
        actors: [{ id: 'hs', m: 'house', at: [8, 36], face: 0, s: 1.6, o: { style: 'timber' }, c: { a: 'cream' } }, { id: 'mw', m: 'motorwagen', at: [0, 40], to: [0, 20] }, { id: 'bz', m: 'lady', at: [2.4, 40], to: [2.4, 20], anim: 'wave', ex: 'laugh' }, { id: 'b1', m: 'boy', at: [-2.2, 40], to: [-2.2, 20], anim: 'celebrate', ex: 'laugh', c: { shirt: 'green' } }, { id: 'mo', m: 'lady', at: [5, 30], face: 190, anim: 'wave', ex: 'smile', vis: [0.4, 1], c: { dress: 'teal' } }, { id: 'hr', m: 'heart', at: [8, 36], y: 7.4, s: 1.4, vis: [0.5, 1] }] },
    ] });

  // ---- 12. Wright brothers (cat 2) ----
  NEW.push({
    id: 'wrightflight', kind: 'tale', cat: '2', title: 'The First Airplane Flight', set: 'dunes', music: 'wonder',
    caption: 'December 17, 1903: two bicycle makers flew a powered airplane for 12 seconds and started the age of flight. ✈️ (True story, told briefly.)',
    tags: '#truestory #history #aviation #wrightbrothers #didyouknow #shorts',
    footer: 'Based on the Wright brothers\' first flights at Kill Devil Hills near Kitty Hawk, North Carolina, 17 December 1903. Orville flew 120 ft in 12 s; Wilbur\'s fourth flight covered 852 ft in 59 s.',
    beats: [
      { vo: 'In 1903, Orville and Wilbur Wright, two bicycle makers, built a flying machine.', time: 'day', cam: { mode: 'orbit', target: 'fl', r: 14, h: 3.5, a0: -40, a1: 20 }, tags: [{ t: [0.15, 0.95], text: '1903', size: 96 }], sfx: ['clack@0.2', 'wind'],
        actors: [{ id: 'fl', m: 'flyer', at: [0, 22], face: 150 }, { id: 'w1', m: 'worker', at: [-8, 20], face: 160, anim: 'work', ex: 'determined' }, { id: 'w2', m: 'worker', at: [7, 19], face: 200, anim: 'work', ex: 'smile', c: { shirt: 'white' } }, { id: 'cr', m: 'crate', at: [-10, 26], s: 1.2 }] },
      { vo: 'On a cold December 17, they tried it on the dunes of Kitty Hawk.', time: 'dawn', fx: ['dust'], cam: { mode: 'static', at: [14, 2.6, 4], look: [0, 2, 26] }, tags: [{ t: [0.1, 0.95], text: 'KITTY HAWK, NC', size: 60, bg: '#7cc4ff' }], sfx: ['wind', 'birds@0.8'],
        actors: [{ id: 'fl', m: 'flyer', at: [0, 20], face: 0 }, { id: 'w1', m: 'worker', at: [-7, 18], face: 90, anim: 'work', ex: 'determined' }, { id: 'w2', m: 'worker', at: [6.5, 22], face: 270, anim: 'work', ex: 'determined', c: { shirt: 'white' } }] },
      { vo: 'Orville flew first: twelve seconds, one hundred twenty feet, just above the sand.', time: 'dawn', fx: ['dust'], cam: { mode: 'track', target: 'fl', off: [14, 2, -10] }, tags: [{ t: [0.08, 0.5], text: '12 SECONDS', size: 76, bg: '#ffd23f' }, { t: [0.5, 0.95], text: '120 FEET', size: 84, bg: '#ffd23f' }], sfx: ['whoosh@0.2', 'wind', 'cheer@0.8'],
        actors: [{ id: 'fl', m: 'flyer', at: [0, 16], to: [0, 52], y: [0.2, 2.4] }, { id: 'w2', m: 'worker', at: [-4, 16], to: [-3, 34], anim: 'run', ex: 'laugh', c: { shirt: 'white' } }] },
      { vo: "Wilbur's last flight that day stayed up for fifty-nine seconds.", time: 'day', fx: ['dust'], cam: { mode: 'track', target: 'fl', off: [18, 3, -16] }, tags: [{ t: [0.1, 0.95], count: [0, 59], suffix: ' SECONDS', size: 80, bg: '#ffd23f' }], sfx: ['wind', 'cheer@0.85'],
        actors: [{ id: 'fl', m: 'flyer', at: [0, 8], to: [0, 140], y: 2.6 }] },
      { vo: 'That short hop opened the age of flight.', time: 'clear', fx: ['confetti'], cam: { mode: 'crane', from: [-12, 3, 6], to: [-4, 16, 8], look: 'fl' }, tags: [{ t: [0.1, 0.95], text: 'THE AGE OF FLIGHT', size: 60, bg: '#7cf2c0' }], sfx: ['chime@0.4', 'cheer@0.6', 'wind'],
        actors: [{ id: 'fl', m: 'flyer', at: [0, 40], to: [0, 110], y: [4, 14] }, { id: 'b1', m: 'bird', at: [-12, 50], to: [10, 80], y: [8, 12] }, { id: 'b2', m: 'bird', at: [14, 46], to: [-6, 76], y: [6, 10], c: { a: 'blue' } }] },
    ] });

  // ---- 13. Hachiko (cat 15, Pets & Animals) ----
  const AKITA = { a: [222, 170, 100], b: [250, 236, 210] };
  NEW.push({
    id: 'hachiko', kind: 'tale', cat: '15', title: 'Hachiko Waited', set: 'station', music: 'sad',
    caption: 'Hachiko, the Akita who waited at Shibuya Station for more than nine years. 🐕 (True story, told briefly.)',
    tags: '#truestory #history #dog #hachiko #animalstories #shorts',
    footer: 'Based on the documented story of Hachiko (1923-1935) and Professor Hidesaburo Ueno, Tokyo. Dates are from Japanese sources.',
    beats: [
      { vo: 'Every evening in 1924, an Akita named Hachiko met Professor Ueno at Shibuya Station.', time: 'dusk', cam: { mode: 'dolly', from: [-6, 1.6, 4], to: [-2, 1.5, 9], look: [1, 1, 22] }, tags: [{ t: [0.15, 0.95], text: 'SHIBUYA, 1924', size: 64 }], sfx: ['crowd', 'bell@0.5'],
        actors: [{ id: 'tr', m: 'train', at: [10, 31], face: 90 }, { id: 'pr', m: 'gentleman', at: [3, 20], face: 190, anim: 'wave', ex: 'smile', c: { hat: null, coat: 'brown' } }, { id: 'dg', m: 'dog', at: [-4, 19], to: [1.8, 19.6], s: 1.4, c: AKITA }, { id: 'cw', m: 'crowd', at: [-8, 25], o: { n: 4, spread: 6, seed: 2 } }, { id: 'hr', m: 'heart', at: [2.5, 20], y: 3.8, s: 0.8, vis: [0.7, 1] }] },
      { vo: 'In May 1925, the professor died at work and never came home.', time: 'dusk', cam: { mode: 'static', at: [0, 1.8, 3], look: [0, 1.2, 16] }, tags: [{ t: [0.1, 0.95], text: 'MAY 1925', size: 84, bg: '#b9a0ff' }], sfx: ['bell@0.2', 'crowd', 'drip@0.7'],
        actors: [{ id: 'tr', m: 'train', at: [8, 31], face: 90 }, { id: 'dg', m: 'dog', at: [0, 15], face: 180, s: 1.5, c: AKITA }, { id: 'cw', m: 'crowd', at: [-8, 22], to: [8, 22], anim: 'walk', o: { n: 6, spread: 6, seed: 5 } }] },
      { vo: 'Hachiko kept returning nearly every day for over nine years.', time: 'night', fx: ['rain'], cam: { mode: 'orbit', target: 'dg', r: 6, h: 1.8, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], count: [0, 9], suffix: '+ YEARS WAITING', size: 48, bg: '#ffb86b' }], sfx: ['rain', 'bell@0.4', 'wind'],
        actors: [{ id: 'dg', m: 'dog', at: [0, 14], face: 180, s: 1.5, c: AKITA }, { id: 'lp', m: 'lamp', at: [-4, 18] }, { id: 'bn', m: 'bench', at: [5, 16], face: 170 }] },
      { vo: 'Commuters noticed him and brought him food, and his loyalty made him famous.', time: 'day', cam: { mode: 'static', at: [-5, 2, 6], look: [0, 1, 16] }, tags: [{ t: [0.1, 0.95], text: 'A FAMOUS DOG', size: 68, bg: '#ffd23f' }], sfx: ['crowd', 'chime@0.5', 'cheer@0.8'],
        actors: [{ id: 'dg', m: 'dog', at: [0, 15], face: 190, s: 1.5, c: AKITA }, { id: 'gl', m: 'girl', at: [2.4, 14], face: 160, anim: 'crouch', ex: 'smile' }, { id: 'wk', m: 'worker', at: [-2.6, 14.4], face: 200, anim: 'wave', ex: 'smile' }, { id: 'cw', m: 'crowd', at: [-6, 22], anim: 'celebrate', o: { n: 4, spread: 6, seed: 7 } }, { id: 'hr', m: 'heart', at: [0, 15], y: 3.8, s: 1.0, vis: [0.4, 1] }] },
      { vo: 'He died in 1935, and a bronze statue still stands at Shibuya Station.', time: 'clear', cam: { mode: 'orbit', target: 'sm', r: 9, h: 2.4, a0: -35, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'SHIBUYA STATION', size: 58, bg: '#7cc4ff' }], sfx: ['chime@0.4', 'birds', 'crowd'],
        actors: [{ id: 'pd', m: 'pedestal', at: [0, 16], s: 1.2 }, { id: 'sm', m: 'dog', at: [0, 16], y: 1.5, face: 180, s: 1.6, c: { a: [168, 120, 56], b: [196, 146, 74], d: [60, 44, 30], n: [40, 30, 22] } }, { id: 'cw', m: 'crowd', at: [-6, 11], o: { n: 5, spread: 6, seed: 9 } }, { id: 'hr', m: 'heart', at: [0, 16], y: 5.4, s: 1.2 }] },
    ] });

  // ---- 14. Octopus (cat 15) ----
  NEW.push({
    id: 'octopus', kind: 'dyk', cat: '15', title: 'Octopus: Three Hearts', set: 'ocean', music: 'wonder',
    caption: 'Did you know an octopus has three hearts and blue blood? 🐙',
    tags: '#didyouknow #octopus #animalfacts #ocean #science #shorts',
    footer: 'Based on cephalopod biology: two branchial (gill) hearts and one systemic heart; copper-based hemocyanin makes the blood blue; the systemic heart pauses during jet swimming.',
    beats: [
      { vo: 'Did you know an octopus has three hearts, and blue blood?', cam: { mode: 'dolly', from: [-6, 2.4, 4], to: [-2, 2.6, 9], look: 'oc' }, tags: [{ t: [0.15, 0.95], text: '3 HEARTS?!', size: 90, bg: '#ff8a9a' }], sfx: ['hum@0.1', 'drip@0.6', 'magic@0.5'],
        actors: [{ id: 'oc', m: 'octopus', at: [0, 16], face: 180, s: 1.4 }, { id: 'c1', m: 'coral', at: [-6, 18], s: 1.6 }, { id: 'c2', m: 'coral', at: [7, 19], s: 1.4, c: { a: 'orange' } }, { id: 'f1', m: 'fish', at: [-9, 12], to: [9, 10], y: 3 }] },
      { vo: 'Two hearts push blood through the gills to pick up oxygen.', cam: { mode: 'orbit', target: 'oc', r: 8, h: 3, a0: -25, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'TWO GILL HEARTS', size: 60, bg: '#ff8a9a' }], sfx: ['heart', 'hum'],
        actors: [{ id: 'oc', m: 'octopus', at: [0, 16], face: 180, s: 1.4 }, { id: 'h1', m: 'heart', at: [-1.1, 14.8], y: 2.8, s: 0.9 }, { id: 'h2', m: 'heart', at: [1.1, 14.8], y: 2.8, s: 0.9 }, { id: 'c1', m: 'coral', at: [-6, 18], s: 1.6 }] },
      { vo: 'The third heart sends that oxygen-rich blood around the rest of the body.', cam: { mode: 'orbit', target: 'oc', r: 8, h: 3, a0: 25, a1: -25 }, tags: [{ t: [0.1, 0.95], text: 'BODY HEART', size: 66, bg: '#ff6b6b', col: '#ffffff' }], sfx: ['heart', 'magic@0.5'],
        actors: [{ id: 'oc', m: 'octopus', at: [0, 16], face: 180, s: 1.4 }, { id: 'h3', m: 'heart', at: [0, 14.7], y: 2.8, s: 1.2 }, { id: 'p1', m: 'puff', at: [0, 15], to: [-3, 14], y: [2.4, 0.8], s: 0.3, c: { a: [255, 90, 90] }, o: { glow: 1 }, vis: [0.05, 1] }, { id: 'p2', m: 'puff', at: [0, 15], to: [3, 14], y: [2.4, 0.8], s: 0.3, from: 0.2, c: { a: [255, 90, 90] }, o: { glow: 1 }, vis: [0.25, 1] }, { id: 'p3', m: 'puff', at: [0, 15], to: [0, 12.5], y: [2.4, 0.8], s: 0.3, from: 0.4, c: { a: [255, 90, 90] }, o: { glow: 1 }, vis: [0.45, 1] }] },
      { vo: 'Its blood is blue because it carries oxygen with copper, not iron.', cam: { mode: 'static', at: [-4, 3, 6], look: [0, 2.6, 16] }, tags: [{ t: [0.1, 0.95], text: 'BLUE, COPPER BLOOD', size: 54, bg: '#7cc4ff' }], sfx: ['magic@0.3', 'hum'],
        actors: [{ id: 'oc', m: 'octopus', at: [0, 16], face: 180, s: 1.4 }, { id: 'hb', m: 'heart', at: [0, 14.3], y: 3.2, s: 1.8, c: { a: [70, 140, 255] } }, { id: 'sp', m: 'sky_sparkle', at: [0, 15], y: 1.6, s: 1.6, o: { n: 12, col: [140, 200, 255] } }] },
      { vo: 'When it swims, the main heart stops, so octopuses prefer to crawl.', cam: { mode: 'static', at: [0, 3.4, 2], look: [0, 2, 16] }, tags: [{ t: [0.1, 0.95], text: 'SWIM = HEART STOPS', size: 56, bg: '#ffd23f' }], sfx: ['whoosh@0.2', 'hum'],
        actors: [{ id: 'sw', m: 'octopus', at: [-9, 14], to: [9, 13], y: 4, s: 1.2 }, { id: 'xm', m: 'xmark', at: [-9, 12.6], to: [9, 11.6], y: 6.2, s: 0.8 }, { id: 'cr', m: 'octopus', at: [6, 18], to: [-6, 18], y: 0, s: 1.0, c: { a: [200, 120, 220] } }, { id: 'hr', m: 'heart', at: [6, 17], to: [-6, 17], y: 3, s: 0.7 }] },
    ] });

  // ---- 15. Basketball (cat 17, Sports) ----
  NEW.push({
    id: 'naismith', kind: 'tale', cat: '17', title: 'Basketball and Peach Baskets', set: 'gym', music: 'fun',
    caption: 'Basketball started in 1891 with two peach baskets and a soccer ball. 🏀 (True story, told briefly.)',
    tags: '#truestory #history #basketball #sports #didyouknow #shorts',
    footer: 'Based on James Naismith inventing basketball at the YMCA training school in Springfield, Massachusetts, December 1891 (13 rules, 9-on-9, peach baskets about ten feet high).',
    beats: [
      { vo: 'In December 1891, teacher James Naismith needed an indoor game for restless students.', cam: { mode: 'dolly', from: [-8, 3, 0], to: [-3, 3, 10], look: [0, 2.2, 34] }, tags: [{ t: [0.15, 0.95], text: 'DECEMBER 1891', size: 62 }], sfx: ['crowd', 'thud@0.5'],
        actors: [{ id: 'nm', m: 'gentleman', at: [0, 30], face: 190, anim: 'stand', ex: 'worried', c: { hat: null } }, { id: 's1', m: 'man', at: [-8, 24], to: [8, 26], anim: 'run', ex: 'laugh', c: { shirt: 'red' } }, { id: 's2', m: 'boy', at: [6, 20], to: [-6, 22], anim: 'run', ex: 'laugh', c: { shirt: 'blue' } }, { id: 's3', m: 'man', at: [-4, 36], to: [4, 36], anim: 'run', ex: 'smile', c: { shirt: 'green' } }] },
      { vo: 'He nailed two peach baskets to a balcony, ten feet up.', cam: { mode: 'dolly', from: [0, 2.6, 34], to: [0, 3.2, 52], look: [0, 3.4, 72] }, tags: [{ t: [0.1, 0.95], text: '10 FEET HIGH', size: 70, bg: '#ffd23f' }], sfx: ['clack@0.3', 'chime@0.7'],
        actors: [{ id: 'b1', m: 'peachbasket', at: [-10, 71.6], y: 3.0, s: 2.2 }, { id: 'b2', m: 'peachbasket', at: [10, 71.6], y: 3.0, s: 2.2 }, { id: 'cr', m: 'crate', at: [-10, 68], s: 1.2 }, { id: 'nm', m: 'gentleman', at: [-10, 68], y: 1.2, face: 0, anim: 'work', ex: 'determined', c: { hat: null } }] },
      { vo: 'He wrote thirteen rules, and eighteen students played nine against nine.', cam: { mode: 'static', at: [0, 6, 22], look: [0, 1.5, 46] }, tags: [{ t: [0.05, 0.5], count: [0, 13], suffix: ' RULES', size: 76, bg: '#ffd23f' }, { t: [0.5, 0.95], text: '9 VS 9', size: 96, bg: '#7cf2c0' }], sfx: ['clack', 'cheer@0.7'],
        actors: [{ id: 'nm', m: 'gentleman', at: [0, 34], face: 180, anim: 'point', ex: 'smile', o: { hold: 'book' }, c: { hat: null } }, { id: 'ta', m: 'crowd', at: [-7, 46], c: { shirt: 'red' }, o: { n: 9, spread: 12, seed: 3, kinds: ['man', 'boy'] } }, { id: 'tb', m: 'crowd', at: [7, 46], c: { shirt: 'blue' }, o: { n: 9, spread: 12, seed: 4, kinds: ['man', 'boy'] } }, { id: 'bl', m: 'ball', at: [0, 46], y: 0.2, s: 1.6, c: { a: [240, 120, 40] } }] },
      { vo: 'The baskets had closed bottoms, so every ball was fetched by hand.', cam: { mode: 'static', at: [-5, 3.4, 48], look: [0, 3.2, 70] }, tags: [{ t: [0.1, 0.95], text: 'NO HOLE: FETCH BY HAND', size: 44, bg: '#ffb0c0' }], sfx: ['pop@0.5', 'crowd@0.1'],
        actors: [{ id: 'pb', m: 'peachbasket', at: [0, 71.6], y: 3.0, s: 2.6 }, { id: 'bl', m: 'ball', at: [0, 66], to: [0, 71.6], y: [6, 3.4], s: 1.4, c: { a: [240, 120, 40] } }, { id: 'st', m: 'man', at: [3, 64], face: 190, anim: 'point', ex: 'laugh', c: { shirt: 'red' } }, { id: 'sb', m: 'boy', at: [-3, 62], face: 170, anim: 'look', ex: 'smile', c: { shirt: 'blue' } }] },
      { vo: 'Today basketball is played worldwide, and the rim is still ten feet high.', fx: ['confetti'], cam: { mode: 'orbit', target: 'hp', r: 9, h: 3, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'STILL 10 FEET', size: 70, bg: '#7cf2c0' }], sfx: ['cheer', 'chime@0.5'],
        actors: [{ id: 'hp', m: 'hoop', at: [0, 70], face: 180 }, { id: 'bl', m: 'ball', at: [0, 69.1], y: [4.4, 1.0], s: 1.6, c: { a: [240, 120, 40] } }, { id: 'p1', m: 'man', at: [-4, 60], face: 180, anim: 'celebrate', ex: 'laugh', c: { shirt: 'red' } }, { id: 'p2', m: 'boy', at: [4, 60], face: 180, anim: 'celebrate', ex: 'laugh', c: { shirt: 'blue' } }] },
    ] });

  // ---- 16. Kipchoge (cat 17) ----
  NEW.push({
    id: 'kipchoge', kind: 'tale', cat: '17', title: 'The Two-Hour Marathon', set: 'avenue', music: 'hope',
    caption: 'In 2019, Eliud Kipchoge ran a marathon in under two hours. Not an official record, but a historic run. 🏃 (True story, told briefly.)',
    tags: '#truestory #sports #marathon #kipchoge #running #shorts',
    footer: "Based on Eliud Kipchoge's INEOS 1:59 Challenge in Vienna, 12 October 2019 (1:59:40). It used rotating pacemakers, so it was not ratified as an official world record.",
    beats: [
      { vo: 'For years, many believed no human could run a marathon in under two hours.', cam: { mode: 'orbit', target: 'k', r: 7, h: 2, a0: -30, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'UNDER 2 HOURS?', size: 70, bg: '#ff8a9a' }], sfx: ['wind', 'heart@0.5'],
        actors: [{ id: 'k', m: 'runner', at: [0, 16], face: 190, anim: 'stand', ex: 'determined' }, { id: 'xm', m: 'xmark', at: [0, 16], y: 5, s: 1.6 }] },
      { vo: 'On October 12, 2019, Eliud Kipchoge lined up in Vienna to try.', cam: { mode: 'dolly', from: [-6, 2, 4], to: [-2, 2, 9], look: [0, 1.4, 20] }, tags: [{ t: [0.1, 0.95], text: 'VIENNA, OCT 12, 2019', size: 44, bg: '#7cc4ff' }], sfx: ['crowd', 'birds', 'beep@0.8'],
        actors: [{ id: 'k', m: 'runner', at: [0, 18], face: 180, anim: 'stand', ex: 'determined' }, { id: 'p1', m: 'runner', at: [-2.2, 19.6], face: 180, ex: 'smile', c: { shirt: 'orange' } }, { id: 'p2', m: 'runner', at: [2.2, 19.6], face: 180, ex: 'smile', c: { shirt: 'orange' } }, { id: 'p3', m: 'runner', at: [-4.4, 21], face: 180, ex: 'smile', c: { shirt: 'orange' } }, { id: 'p4', m: 'runner', at: [4.4, 21], face: 180, ex: 'smile', c: { shirt: 'orange' } }, { id: 'p5', m: 'runner', at: [0, 21.6], face: 180, ex: 'smile', c: { shirt: 'orange' } }, { id: 'c1', m: 'crowd', at: [-10, 24], anim: 'wave', o: { n: 6, spread: 6, seed: 12 } }, { id: 'c2', m: 'crowd', at: [10, 24], anim: 'wave', o: { n: 6, spread: 6, seed: 13 } }] },
      { vo: 'Pacemakers took turns shielding him from the wind, kilometer after kilometer.', cam: { mode: 'track', target: 'k', off: [6, 2.2, -7] }, tags: [{ t: [0.1, 0.95], text: 'PACERS BLOCK THE WIND', size: 46, bg: '#7cf2c0' }], sfx: ['steps', 'wind', 'crowd@0.5'],
        actors: [{ id: 'k', m: 'runner', at: [-14, 18], to: [14, 18], anim: 'run', loop: 1, ex: 'determined' }, { id: 'p1', m: 'runner', at: [-9.5, 17], to: [18.5, 17], anim: 'run', loop: 1, c: { shirt: 'orange' } }, { id: 'p2', m: 'runner', at: [-9.5, 19], to: [18.5, 19], anim: 'run', loop: 1, c: { shirt: 'orange' } }, { id: 'p3', m: 'runner', at: [-7, 18], to: [21, 18], anim: 'run', loop: 1, c: { shirt: 'orange' } }, { id: 'p4', m: 'runner', at: [-14, 15.6], to: [14, 15.6], anim: 'run', loop: 1, c: { shirt: 'orange' } }, { id: 'p5', m: 'runner', at: [-14, 20.4], to: [14, 20.4], anim: 'run', loop: 1, c: { shirt: 'orange' } }, { id: 'p6', m: 'runner', at: [-17, 18], to: [11, 18], anim: 'run', loop: 1, c: { shirt: 'orange' } }] },
      { vo: 'He crossed the line in one hour, fifty-nine minutes, and forty seconds.', cam: { mode: 'static', at: [0, 2.2, 4], look: [0, 2.4, 24] }, tags: [{ t: [0.1, 0.95], text: '1:59:40', size: 110, bg: '#ffd23f' }], sfx: ['cheer@0.6', 'chime@0.8', 'steps'],
        actors: [{ id: 'fn', m: 'finish', at: [0, 26], face: 180 }, { id: 'k', m: 'runner', at: [0, 44], to: [0, 16], ex: 'laugh', anim: 'run' }, { id: 'p1', m: 'runner', at: [-2, 50], to: [-2, 22], anim: 'run', c: { shirt: 'orange' } }, { id: 'c1', m: 'crowd', at: [-10, 22], anim: 'celebrate', o: { n: 6, spread: 6, seed: 14 } }, { id: 'c2', m: 'crowd', at: [10, 22], anim: 'celebrate', o: { n: 6, spread: 6, seed: 15 } }] },
      { vo: "It isn't an official record, but it showed the limit could be broken.", fx: ['confetti'], cam: { mode: 'orbit', target: 'k', r: 7, h: 2.4, a0: -30, a1: 25 }, tags: [{ t: [0.05, 0.5], text: 'NOT OFFICIAL', size: 76, bg: '#ffb86b' }, { t: [0.5, 0.95], text: 'NO HUMAN IS LIMITED', size: 50, bg: '#7cf2c0' }], sfx: ['cheer', 'chime@0.5'],
        actors: [{ id: 'k', m: 'runner', at: [0, 16], face: 190, anim: 'celebrate', ex: 'laugh' }, { id: 'c1', m: 'crowd', at: [-8, 20], anim: 'celebrate', o: { n: 6, spread: 6, seed: 16 } }, { id: 'c2', m: 'crowd', at: [8, 20], anim: 'celebrate', o: { n: 6, spread: 6, seed: 17 } }, { id: 'hr', m: 'heart', at: [0, 16], y: 5.2, s: 1.4 }] },
    ] });

  // ---- 17. Junko Tabei (cat 22, People) ----
  NEW.push({
    id: 'tabei', kind: 'tale', cat: '22', title: 'First Woman on Everest', set: 'everest', music: 'hope',
    caption: 'Junko Tabei survived an avalanche and became the first woman to reach the top of Mount Everest. 🏔️ (True story, told briefly.)',
    tags: '#truestory #history #everest #junkotabei #inspiring #shorts',
    footer: 'Based on Junko Tabei\'s 1975 expedition: an avalanche hit camp on 4 May, and she reached the summit with Sherpa Ang Tsering on 16 May 1975.',
    beats: [
      { vo: 'In 1975, Junko Tabei led a team of Japanese women to Mount Everest.', time: 'clear', cam: { mode: 'dolly', from: [-6, 1.8, 4], to: [-2, 1.8, 10], look: [0, 3, 26] }, tags: [{ t: [0.15, 0.95], text: 'EVEREST, 1975', size: 64 }], sfx: ['wind', 'chime@0.5'],
        actors: [{ id: 't1', m: 'tent', at: [-12, 30], s: 1.3, c: { a: 'red' } }, { id: 't2', m: 'tent', at: [12, 32], s: 1.3, c: { a: 'orange' } }, { id: 'tb', m: 'hiker', at: [0, 18], face: 190, anim: 'wave', ex: 'smile', c: { shirt: 'red', hair: 'hairBlack' } }, { id: 'h2', m: 'hiker', at: [-3, 20], face: 185, anim: 'stand', ex: 'smile', c: { shirt: 'yellow', pack: 'blue' } }, { id: 'h3', m: 'hiker', at: [3, 20], face: 195, anim: 'wave', ex: 'laugh', c: { shirt: 'green', pack: 'orange' } }, { id: 'h4', m: 'hiker', at: [6, 17], face: 200, anim: 'stand', ex: 'smile', c: { shirt: 'purple' } }] },
      { vo: 'Many told them to stay home and raise children instead, but they kept going.', time: 'clear', cam: { mode: 'static', at: [4, 2, 6], look: [0, 1.6, 20] }, tags: [{ t: [0.1, 0.95], text: 'TOLD: STAY HOME', size: 66, bg: '#ff8a9a' }], sfx: ['crowd@0.1', 'steps@0.4', 'wind'],
        actors: [{ id: 'g1', m: 'gentleman', at: [-7, 16], face: 160, anim: 'point', ex: 'angry' }, { id: 'g2', m: 'gentleman', at: [-4.4, 14], face: 170, anim: 'point', ex: 'angry', c: { coat: 'brown' } }, { id: 'tb', m: 'hiker', at: [0, 16], to: [8, 30], ex: 'determined', c: { shirt: 'red' } }, { id: 'h2', m: 'hiker', at: [2, 17], to: [10, 32], ex: 'determined', c: { shirt: 'yellow', pack: 'blue' } }, { id: 'h3', m: 'hiker', at: [-2, 17], to: [6, 31], ex: 'determined', c: { shirt: 'green', pack: 'orange' } }] },
      { vo: 'On May 4, an avalanche buried her camp, and she lost consciousness.', time: 'storm', cam: { mode: 'static', at: [0, 3, 4], look: [0, 3, 26] }, tags: [{ t: [0.1, 0.95], text: 'MAY 4: AVALANCHE', size: 60, bg: '#ff6b6b', col: '#ffffff' }], sfx: ['rumble@0.1', 'crash@0.4', 'wind'], flashes: [0.4],
        actors: [{ id: 'tn', m: 'tent', at: [0, 26], s: 1.4, c: { a: 'red' } }, { id: 'tb', m: 'hiker', at: [1, 18], face: 180, anim: 'scared', seq: [[0.7, 'sleep']], ex: 'shock', exs: [[0, 'shock'], [0.7, 'sad']], c: { shirt: 'red' } }, { id: 's1', m: 'puff', at: [0, 44], to: [0, 20], y: 2, s: 6, c: { a: 'white' } }, { id: 's2', m: 'puff', at: [-6, 48], to: [-5, 22], y: 2, s: 5, c: { a: 'white' }, from: 0.1 }, { id: 's3', m: 'puff', at: [6, 46], to: [5, 21], y: 2, s: 5, c: { a: 'white' }, from: 0.05 }] },
      { vo: 'Twelve days later, she climbed on with Sherpa Ang Tsering.', time: 'clear', cam: { mode: 'track', target: 'tb', off: [6, 2.4, -9] }, tags: [{ t: [0.1, 0.95], count: [0, 12], suffix: ' DAYS LATER', size: 56, bg: '#ffd23f' }], sfx: ['steps', 'wind'],
        actors: [{ id: 'tb', m: 'hiker', at: [-2, 10], to: [-1, 40], ex: 'determined', c: { shirt: 'red' } }, { id: 'sp', m: 'hiker', at: [1, 8], to: [2, 38], ex: 'determined', c: { shirt: 'blue', skin: 'skin3' } }] },
      { vo: "On May 16, 1975, she became the first woman to stand on Everest's summit.", time: 'clear', fx: ['confetti'], cam: { mode: 'crane', from: [-6, 3, 6], to: [4, 9, 10], look: [0, 10, 24] }, tags: [{ t: [0.05, 0.5], text: 'MAY 16, 1975', size: 70 }, { t: [0.5, 0.95], text: 'FIRST WOMAN ON EVEREST', size: 44, bg: '#7cf2c0' }], sfx: ['wind', 'chime@0.5', 'cheer@0.7'],
        actors: [{ id: 'mt', m: 'mountain', at: [0, 24], o: { r: 22, h: 10 }, c: { a: [200, 214, 236] } }, { id: 'tb', m: 'hiker', at: [-0.9, 24], y: 10, face: 190, anim: 'celebrate', ex: 'laugh', c: { shirt: 'red' } }, { id: 'sp', m: 'hiker', at: [1, 24], y: 10, face: 185, anim: 'wave', ex: 'smile', c: { shirt: 'blue', skin: 'skin3' } }, { id: 'fg', m: 'flag', at: [0, 25.4], y: 10, s: 0.8 }] },
    ] });

  // ---- 18. Emu War (cat 24, Entertainment) ----
  NEW.push({
    id: 'emuwar', kind: 'tale', cat: '24', title: 'The Great Emu War', set: 'outback', music: 'fun',
    caption: 'In 1932, the Australian army went to war with emus. The emus did not lose. 🦤 (True story, told briefly.)',
    tags: '#truestory #history #australia #emuwar #weirdhistory #shorts',
    footer: 'Based on the 1932 Emu War in Western Australia (Campion district). Kill counts reported at the time are disputed; soldiers were withdrawn in December 1932.',
    beats: [
      { vo: 'In 1932, thousands of hungry emus were wrecking wheat farms in Western Australia.', time: 'hazy', fx: ['dust'], cam: { mode: 'dolly', from: [-8, 2.6, 2], to: [-3, 2.4, 8], look: [0, 1.6, 24] }, tags: [{ t: [0.1, 0.95], text: 'WESTERN AUSTRALIA, 1932', size: 40 }], sfx: ['wind', 'birds@0.3'],
        actors: [{ id: 'wh', m: 'wheat', at: [0, 26], s: 1.6, o: { nx: 9, nz: 5 } }, { id: 'e1', m: 'emu', at: [-6, 22], to: [-2, 24], s: 1.2 }, { id: 'e2', m: 'emu', at: [3, 20], to: [1, 24], s: 1.1 }, { id: 'e3', m: 'emu', at: [8, 24], to: [5, 27], s: 1.2 }, { id: 'e4', m: 'emu', at: [-3, 28], to: [0, 29], s: 1.0 }, { id: 'fm', m: 'peasant', at: [9, 16], face: 200, anim: 'look', ex: 'worried' }] },
      { vo: 'Farmers asked for help, so the army sent soldiers with machine guns.', time: 'hazy', cam: { mode: 'static', at: [6, 2.4, 6], look: [-1, 1.6, 22] }, tags: [{ t: [0.1, 0.95], text: 'ARMY TO THE RESCUE?', size: 56, bg: '#7cf2c0' }], sfx: ['steps@0.2', 'clack@0.5'],
        actors: [{ id: 'tk', m: 'truck', at: [-6, 26], face: 120, s: 1.1 }, { id: 'o1', m: 'officer', at: [2, 17], face: 190, anim: 'point', ex: 'determined' }, { id: 's1', m: 'soldier', at: [-1, 19], face: 185, anim: 'stand', ex: 'smile' }, { id: 's2', m: 'soldier', at: [4, 20], face: 200, anim: 'stand', ex: 'determined' }, { id: 'fm', m: 'peasant', at: [8, 18], face: 200, anim: 'wave', ex: 'smile' }] },
      { vo: 'But the emus split into small groups and ran faster than the trucks.', time: 'hazy', fx: ['dust'], cam: { mode: 'static', at: [2, 4, -2], look: [8, 1.5, 24] }, tags: [{ t: [0.1, 0.95], text: 'EMUS: 1  TRUCKS: 0', size: 54, bg: '#ffb86b' }], sfx: ['rumble', 'steps', 'clack@0.5'],
        actors: [{ id: 'tk', m: 'truck', at: [-12, 24], to: [8, 24], s: 1.1 }, { id: 'e1', m: 'emu', at: [-2, 22], to: [26, 21], anim: 'run', s: 1.2 }, { id: 'e2', m: 'emu', at: [0, 26], to: [28, 28], anim: 'run', s: 1.1 }, { id: 'e3', m: 'emu', at: [2, 20], to: [24, 18], anim: 'run', s: 1.2 }, { id: 'e4', m: 'emu', at: [-4, 28], to: [22, 31], anim: 'run', s: 1.0 }] },
      { vo: 'After a month, the army had used nearly ten thousand rounds, with poor results.', time: 'hazy', cam: { mode: 'orbit', target: [0, 1.2, 22], r: 9, h: 3, a0: -20, a1: 25 }, tags: [{ t: [0.1, 0.95], count: [0, 9860], suffix: ' ROUNDS', size: 64, bg: '#ffb86b' }], sfx: ['clack', 'thud@0.6'],
        actors: [{ id: 'tk', m: 'truck', at: [-8, 26], face: 100, s: 1.1 }, { id: 's1', m: 'soldier', at: [-3, 20], face: 180, anim: 'look', ex: 'worried' }, { id: 'o1', m: 'officer', at: [1, 19], face: 190, anim: 'point', ex: 'sad' }, { id: 'e1', m: 'emu', at: [8, 28], face: 200, s: 1.2 }, { id: 'e2', m: 'emu', at: [10, 25], face: 190, s: 1.1 }, { id: 'xm', m: 'xmark', at: [4, 24], y: 5, s: 1.4, vis: [0.5, 1] }] },
      { vo: 'The soldiers were recalled in December, and the emus carried on.', time: 'dusk', cam: { mode: 'dolly', from: [6, 2.4, 6], to: [3, 2, 10], look: [0, 1.6, 24] }, tags: [{ t: [0.1, 0.95], text: 'EMUS: 1  ARMY: 0', size: 62, bg: '#7cf2c0' }], sfx: ['chime@0.5', 'wind'],
        actors: [{ id: 'tk', m: 'truck', at: [-4, 22], to: [-26, 22], s: 1.1 }, { id: 's1', m: 'soldier', at: [-2, 19], to: [-16, 19], ex: 'sad' }, { id: 's2', m: 'soldier', at: [-3.4, 20], to: [-17, 20], ex: 'sad' }, { id: 'wh', m: 'wheat', at: [8, 30], s: 1.5, o: { nx: 7, nz: 4 } }, { id: 'e1', m: 'emu', at: [4, 24], face: 200, s: 1.2 }, { id: 'e2', m: 'emu', at: [8, 26], face: 190, s: 1.1 }, { id: 'e3', m: 'emu', at: [11, 23], face: 210, s: 1.2 }] },
    ] });

  // ---- 19. Rosetta Stone (cat 27, Education) ----
  NEW.push({
    id: 'rosetta', kind: 'dyk', cat: '27', title: 'The Rosetta Stone Code', set: 'desert', music: 'wonder',
    caption: 'A black stone found in 1799 unlocked ancient Egyptian writing. 🏺',
    tags: '#didyouknow #history #egypt #rosettastone #hieroglyphs #shorts',
    footer: 'Based on the Rosetta Stone (found 1799 near Rashid, Egypt; decree of 196 BCE in hieroglyphic, Demotic and Greek) and Champollion\'s decipherment announced in 1822.',
    beats: [
      { vo: 'In 1799, French soldiers in Egypt found a strange black stone.', time: 'hazy', cam: { mode: 'dolly', from: [-7, 2.4, 4], to: [-3, 2.2, 10], look: [0, 1.4, 22] }, tags: [{ t: [0.1, 0.95], text: 'EGYPT, 1799', size: 70 }], sfx: ['wind', 'chime@0.6'],
        actors: [{ id: 'sd1', m: 'soldier', at: [-2.4, 18], face: 170, anim: 'work', ex: 'determined' }, { id: 'sd2', m: 'soldier', at: [2.6, 19], face: 200, anim: 'work', ex: 'determined' }, { id: 'rs', m: 'rosetta', at: [0, 20.5], face: 180, s: 0.5 }, { id: 'sp', m: 'sky_sparkle', at: [0, 20], y: 1.0, s: 0.7, vis: [0.4, 1] }, { id: 'rk', m: 'rock', at: [-6, 22], s: 1.2, c: { a: [214, 170, 110] } }, { id: 'tn', m: 'tent', at: [10, 30], s: 1.2 }] },
      { vo: 'It carried the same message in three scripts: hieroglyphs, Demotic, and Greek.', set: 'museum', time: 'day', cam: { mode: 'orbit', target: 'rs', r: 7, h: 2.4, a0: -25, a1: 25 }, tags: [{ t: [0.05, 0.38], text: 'HIEROGLYPHS', size: 66, bg: '#ffd23f' }, { t: [0.38, 0.68], text: 'DEMOTIC', size: 80, bg: '#ffb86b' }, { t: [0.68, 0.95], text: 'GREEK', size: 90, bg: '#7cc4ff' }], sfx: ['magic@0.2', 'chime@0.5', 'hum'],
        actors: [{ id: 'pd', m: 'pedestal', at: [0, 36], s: 1.3 }, { id: 'rs', m: 'rosetta', at: [0, 36], y: 1.56, face: 180, s: 1.0 }] },
      { vo: 'Scholars could read Greek, so Greek became the key to the others.', set: 'museum', time: 'day', cam: { mode: 'static', at: [4, 3, 26], look: [0, 3, 40] }, tags: [{ t: [0.1, 0.95], text: 'GREEK = THE KEY', size: 60, bg: '#7cc4ff' }], sfx: ['chime@0.5', 'magic@0.3'],
        actors: [{ id: 'pd', m: 'pedestal', at: [0, 38], s: 1.3 }, { id: 'rs', m: 'rosetta', at: [0, 38], y: 1.56, face: 180 }, { id: 'sc1', m: 'scientist', at: [-5, 34], face: 160, anim: 'point', ex: 'smile', o: { hold: 'book' } }, { id: 'sc2', m: 'scientist', at: [5, 34], face: 200, anim: 'look', ex: 'smile' }, { id: 'ck', m: 'check', at: [0, 38], y: 6.4, s: 1.6, vis: [0.5, 1] }] },
      { vo: 'Thomas Young made early progress, but Jean-François Champollion announced the breakthrough in 1822.', set: 'museum', time: 'day', cam: { mode: 'dolly', from: [-5, 3, 22], to: [-1, 3, 28], look: 'ch' }, tags: [{ t: [0.1, 0.95], text: '1822', size: 100, bg: '#ffd23f' }], sfx: ['magic@0.4', 'chime@0.6'],
        actors: [{ id: 'ch', m: 'gentleman', at: [0, 36], face: 190, anim: 'point', ex: 'laugh', c: { hat: null, coat: 'navy' }, o: { hold: 'plans' } }, { id: 'yg', m: 'gentleman', at: [-5, 35], face: 175, anim: 'look', ex: 'smile', c: { hat: null, coat: 'brown' } }, { id: 'sp', m: 'sky_sparkle', at: [0, 36], y: 1, s: 1.6, o: { n: 12 } }] },
      { vo: 'After centuries of silence, ancient Egyptian writing could finally be read again.', set: 'tomb', time: 'tomb', cam: { mode: 'orbit', target: [0, 2, 40], r: 7, h: 2.4, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'THE PAST SPEAKS', size: 70, bg: '#7cf2c0' }], sfx: ['magic@0.2', 'chime@0.6', 'hum'],
        actors: [{ id: 'a1', m: 'archaeologist', at: [-3, 36], face: 160, anim: 'look', ex: 'smile' }, { id: 'a2', m: 'archaeologist', at: [3, 36], face: 200, anim: 'wave', ex: 'laugh', c: { shirt: 'green' } }, { id: 'sp', m: 'sky_sparkle', at: [0, 40], y: 2, s: 3, o: { n: 14 } }, { id: 'ch', m: 'chest', at: [0, 43], s: 1.3, face: 180 }] },
    ] });

  // ---- 20. Voyager Golden Record (cat 28, Science & Tech) ----
  NEW.push({
    id: 'voyager', kind: 'dyk', cat: '28', title: 'A Message Sent to Space', set: 'space', music: 'wonder',
    caption: 'Two spacecraft carry a golden record with greetings from Earth. 🚀',
    tags: '#didyouknow #space #voyager #nasa #science #shorts',
    footer: 'Based on NASA\'s Voyager Golden Records (launched 1977, selected by a committee chaired by Carl Sagan; 55 spoken greetings). Voyager 1 entered interstellar space in August 2012.',
    beats: [
      { vo: 'In 1977, NASA launched two Voyager probes, each carrying a golden record.', cam: { mode: 'static', at: [0, 3, -6], look: [0, 6, 60] }, tags: [{ t: [0.1, 0.95], text: '1977', size: 96 }], sfx: ['rumble@0.1', 'whoosh@0.4', 'chime@0.7'],
        actors: [{ id: 'ea', m: 'planet', at: [-22, 70], y: 8, o: { r: 18 } }, { id: 'v1', m: 'voyager', at: [4, 30], to: [10, 60], y: [3, 10], s: 1.4 }, { id: 'v2', m: 'voyager', at: [-3, 24], to: [2, 52], y: [2, 8], s: 1.4 }] },
      { vo: 'It holds music, nature sounds, and spoken greetings in fifty-five languages.', cam: { mode: 'orbit', target: 'rc', r: 7, h: 1.2, a0: -20, a1: 20 }, tags: [{ t: [0.05, 0.35], text: 'MUSIC', size: 96, bg: '#ffd23f' }, { t: [0.35, 0.65], text: 'SOUNDS OF EARTH', size: 56, bg: '#7cf2c0' }, { t: [0.65, 0.95], text: '55 LANGUAGES', size: 70, bg: '#ff8a9a' }], sfx: ['magic@0.2', 'chime@0.5', 'hum'],
        actors: [{ id: 'rc', m: 'record', at: [0, 20], y: 3, s: 1.3, face: 180 }, { id: 'sp', m: 'sky_sparkle', at: [0, 20], y: 1, s: 2.4, o: { n: 14 } }] },
      { vo: 'A team led by Carl Sagan chose everything on it.', set: 'lab', time: 'day', cam: { mode: 'static', at: [0, 3.5, 22], look: [0, 2.6, 40] }, tags: [{ t: [0.1, 0.95], text: "CARL SAGAN'S TEAM", size: 60, bg: '#b9a0ff' }], sfx: ['chime@0.5', 'clack@0.2'],
        actors: [{ id: 'rc', m: 'record', at: [0, 34], y: 4.1, s: 0.7, face: 180 }, { id: 'sg', m: 'scientist', at: [0, 40], face: 190, anim: 'point', ex: 'smile', o: { hold: 'plans' } }, { id: 'sc2', m: 'scientist', at: [-4.4, 39], face: 170, anim: 'look', ex: 'smile' }, { id: 'sc3', m: 'scientist', at: [4.4, 39], face: 200, anim: 'celebrate', ex: 'laugh' }] },
      { vo: 'In 2012, Voyager 1 became the first human-made object to enter interstellar space.', cam: { mode: 'dolly', from: [-6, 2, 0], to: [-2, 3, 8], look: 'v1' }, tags: [{ t: [0.1, 0.95], text: 'AUGUST 2012', size: 74, bg: '#7cc4ff' }], sfx: ['hum', 'magic@0.5', 'chime@0.8'],
        actors: [{ id: 'v1', m: 'voyager', at: [0, 24], to: [4, 60], y: [4, 6], s: 1.4 }, { id: 'sp', m: 'sky_sparkle', at: [2, 44], y: 5, s: 3, o: { n: 12, col: [160, 200, 255] } }] },
      { vo: 'The record is a message in a bottle, waiting for anyone who finds it.', cam: { mode: 'crane', from: [-4, 2, -2], to: [3, 6, 6], look: 'v1' }, tags: [{ t: [0.1, 0.95], text: 'HELLO, UNIVERSE', size: 66, bg: '#7cf2c0' }], sfx: ['magic@0.2', 'chime@0.5', 'hum'],
        actors: [{ id: 'v1', m: 'voyager', at: [0, 30], to: [3, 46], y: [5, 6], s: 1.4 }, { id: 'ea', m: 'planet', at: [-30, 100], y: 10, o: { r: 10 } }, { id: 'hr', m: 'heart', at: [0, 30], y: 9, s: 1.6 }] },
    ] });

  // ---- 21. Fleming & penicillin (cat 28) ----
  NEW.push({
    id: 'fleming', kind: 'tale', cat: '28', title: 'The Mold That Saved Lives', set: 'lab', music: 'wonder',
    caption: 'A messy lab, a moldy dish, and the discovery of penicillin. 🧪 (True story, told briefly.)',
    tags: '#truestory #science #penicillin #fleming #medicine #shorts',
    footer: 'Based on Alexander Fleming\'s observation at St Mary\'s Hospital, London (September 1928). Howard Florey and Ernst Chain later developed penicillin as a drug; the three shared the 1945 Nobel Prize.',
    beats: [
      { vo: 'In September 1928, Alexander Fleming came back from vacation to a messy lab.', cam: { mode: 'dolly', from: [-5, 3.6, 16], to: [-1, 3.6, 22], look: [0, 2.8, 38] }, tags: [{ t: [0.15, 0.95], text: 'LONDON, 1928', size: 70 }], sfx: ['steps@0.1', 'chime@0.6'],
        actors: [{ id: 'p1', m: 'petri', at: [-4, 34], y: 2.7, s: 1.2 }, { id: 'p2', m: 'petri', at: [-1, 34], y: 2.7, s: 1.2 }, { id: 'p3', m: 'petri', at: [2, 34], y: 2.7, s: 1.2 }, { id: 'p4', m: 'petri', at: [5, 34], y: 2.7, s: 1.2 }, { id: 'fl', m: 'scientist', at: [4, 52], to: [1, 41], ex: 'neutral' }, { id: 'sc', m: 'crate', at: [-6, 44], s: 0.8 }] },
      { vo: 'One dish of bacteria had been contaminated by a blue-green mold.', cam: { mode: 'dolly', from: [0, 4.4, 24], to: [0, 3.6, 29], look: [0, 2.8, 34] }, tags: [{ t: [0.1, 0.95], text: 'MOLD ON THE DISH', size: 58, bg: '#7cf2c0' }], sfx: ['magic@0.3', 'hum'],
        actors: [{ id: 'pt', m: 'petri', at: [0, 34], y: 2.7, s: 4, o: { mold: 1, halo: 0 } }, { id: 'fl', m: 'scientist', at: [0, 42], face: 180, anim: 'look', ex: 'shock' }] },
      { vo: 'Around the mold, the bacteria had died.', cam: { mode: 'static', at: [0, 4.2, 25], look: [0, 3.2, 34] }, tags: [{ t: [0.1, 0.95], text: 'BACTERIA DIED', size: 70, bg: '#ff8a9a' }], sfx: ['pop@0.5', 'drip@0.3'],
        actors: [{ id: 'pt', m: 'petri', at: [0, 34], y: 2.7, s: 4.5, o: { mold: 1, halo: [0.1, 1] } }, { id: 'g1', m: 'germ', at: [3.4, 31.6], y: 3.0, s: [0.7, 0.05] }, { id: 'g2', m: 'germ', at: [-3.4, 32], y: 3.0, s: [0.7, 0.05], from: 0.15 }, { id: 'g3', m: 'germ', at: [2.2, 36], y: 3.0, s: [0.6, 0.05], from: 0.3 }] },
      { vo: 'That mold made penicillin, the first widely used antibiotic.', cam: { mode: 'orbit', target: 'fl', r: 7, h: 2.4, a0: -25, a1: 25 }, tags: [{ t: [0.1, 0.95], text: 'PENICILLIN', size: 84, bg: '#ffd23f' }], sfx: ['chime@0.3', 'magic@0.2'],
        actors: [{ id: 'fl', m: 'scientist', at: [0, 38], face: 190, anim: 'celebrate', ex: 'laugh' }, { id: 'ck', m: 'check', at: [0, 38], y: 5.2, s: 1.6 }, { id: 'sp', m: 'sky_sparkle', at: [0, 34], y: 3, s: 1.5, o: { n: 10 } }] },
      { vo: 'Years later, Florey and Chain turned it into a medicine, and the three shared a Nobel Prize.', fx: ['confetti'], cam: { mode: 'orbit', target: [0, 2, 36], r: 10, h: 3, a0: -30, a1: 30 }, tags: [{ t: [0.05, 0.5], text: 'FLEMING, FLOREY, CHAIN', size: 40, bg: '#7cc4ff' }, { t: [0.5, 0.95], text: 'NOBEL PRIZE, 1945', size: 62, bg: '#ffd23f' }], sfx: ['cheer', 'chime@0.5'],
        actors: [{ id: 'a', m: 'scientist', at: [-4, 38], face: 185, anim: 'celebrate', ex: 'laugh' }, { id: 'b', m: 'scientist', at: [0, 38], face: 190, anim: 'wave', ex: 'smile', c: { hair: 'hairBrown' } }, { id: 'c', m: 'scientist', at: [4, 38], face: 195, anim: 'celebrate', ex: 'laugh', c: { hair: 'hairBlond' } }, { id: 'hr', m: 'heart', at: [0, 38], y: 5.4, s: 1.4 }] },
    ] });

  // ---- 22. Earthquake (cat 26, Howto & Style) ----
  NEW.push({
    id: 'quake', kind: 'survival', cat: '26', title: 'Earthquake: What To Do', set: 'livingroom', music: 'tense',
    caption: 'Feel an earthquake? Drop, Cover, and Hold On. Save this! 🌍',
    tags: '#survival #safety #earthquake #howto #emergency #shorts',
    footer: 'General safety info based on guidance from FEMA/Ready.gov, the CDC and the USGS-backed Great ShakeOut: Drop, Cover, and Hold On; do not run outside; doorways are not safer.',
    beats: [
      { vo: "If the ground starts shaking, don't run outside. Drop to your hands and knees.", cam: { mode: 'static', at: [0, 3.4, 6], look: [0, 2, 26] }, tags: [{ t: [0.1, 0.95], text: 'DROP!', size: 110, bg: '#ff8a9a' }], sfx: ['rumble', 'thud@0.4'],
        actors: [{ id: 'sf', m: 'sofa', at: [-12, 44], face: 180, o: { shake: 1 } }, { id: 'sh', m: 'shelf', at: [14, 52], face: 180, o: { shake: 1 } }, { id: 'mn', m: 'man', at: [0, 22], face: 190, anim: 'stand', seq: [[0.35, 'crouch']], ex: 'shock', exs: [[0, 'shock'], [0.35, 'determined']] }] },
      { vo: 'Cover your head and neck, and crawl under a sturdy table if one is close.', cam: { mode: 'dolly', from: [4, 3, 6], to: [2, 2.8, 10], look: [0, 1.4, 26] }, tags: [{ t: [0.1, 0.95], text: 'COVER HEAD + NECK', size: 56, bg: '#ffd23f' }], sfx: ['rumble', 'clack@0.5'],
        actors: [{ id: 'tb', m: 'table', at: [0, 28], face: 180, s: 1.1, o: { shake: 1 } }, { id: 'wm', m: 'woman', at: [-4, 22], to: [0, 27], anim: 'crouch', ex: 'worried' }, { id: 'k1', m: 'cube', at: [-3, 26], y: [8, 0], s: 1.6, c: { a: 'red' } }, { id: 'k2', m: 'cube', at: [4, 24], y: [9, 0], s: 1.4, c: { a: 'blue' }, from: 0.2 }] },
      { vo: 'Hold on to it until the shaking stops. Doorways are not safer.', cam: { mode: 'orbit', target: 'tb', r: 8, h: 2.6, a0: -30, a1: 20 }, tags: [{ t: [0.05, 0.5], text: 'HOLD ON', size: 100, bg: '#ffd23f' }, { t: [0.5, 0.95], text: 'NOT IN DOORWAYS', size: 56, bg: '#ff6b6b', col: '#ffffff' }], sfx: ['rumble', 'thud@0.6'],
        actors: [{ id: 'tb', m: 'table', at: [0, 28], face: 180, s: 1.1, o: { shake: 1 } }, { id: 'wm', m: 'woman', at: [0, 27.4], face: 180, anim: 'crouch', ex: 'determined' }, { id: 'dr', m: 'doorframe', at: [14, 34], face: 180, s: 1.2 }, { id: 'xm', m: 'xmark', at: [14, 34], y: 6.4, s: 1.5 }] },
      { vo: 'In bed? Stay there and cover your head with a pillow.', cam: { mode: 'dolly', from: [5, 3, 8], to: [2, 3, 14], look: [0, 2, 30] }, tags: [{ t: [0.1, 0.95], text: 'IN BED? STAY THERE', size: 50, bg: '#7cc4ff' }], sfx: ['rumble', 'thud@0.7'],
        actors: [{ id: 'bd', m: 'bed', at: [0, 34], face: 180, s: 1.3, o: { shake: 1 } }, { id: 'bo', m: 'boy', at: [0, 34], y: 1.56, face: 180, anim: 'crouch', ex: 'worried' }, { id: 'pl', m: 'cube', at: [0, 33.4], y: 2.3, s: 3, c: { a: 'cream' } }] },
      { vo: 'Outside, move away from buildings and wires, then drop. Expect aftershocks.', set: 'street', time: 'day', cam: { mode: 'static', at: [-6, 2.6, 4], look: [0, 1.8, 28] }, tags: [{ t: [0.1, 0.95], text: 'AWAY FROM BUILDINGS', size: 50, bg: '#7cf2c0' }], sfx: ['rumble@0.2', 'birds', 'chime@0.8'],
        actors: [{ id: 'hs', m: 'house', at: [14, 34], face: 0, s: 1.4 }, { id: 'ln', m: 'lamp', at: [-12, 30] }, { id: 'wm', m: 'woman', at: [-6, 14], to: [2, 24], until: 0.5, seq: [[0.5, 'crouch']], ex: 'worried' }, { id: 'xm', m: 'xmark', at: [14, 34], y: 9, s: 1.6 }] },
    ] });

  // ---- 23. Lost in the woods (cat 26) ----
  NEW.push({
    id: 'lostwoods', kind: 'survival', cat: '26', title: 'Lost in the Woods', set: 'forest', music: 'tense',
    caption: 'Lost on a hike? Stop, think, stay put, and signal. Save this! 🥾',
    tags: '#survival #safety #hiking #lost #howto #shorts',
    footer: 'General safety info based on common guidance from the National Park Service and search-and-rescue groups: STOP (Stop, Think, Observe, Plan), stay put if unsure, three whistle blasts signal distress.',
    beats: [
      { vo: "Lost on a hike? Don't keep walking. Stop, and stay calm.", cam: { mode: 'dolly', from: [-6, 2.2, 4], to: [-2, 2.2, 9], look: [0, 1.4, 24] }, tags: [{ t: [0.1, 0.95], text: 'STOP', size: 120, bg: '#ff6b6b', col: '#ffffff' }], sfx: ['birds', 'heart@0.5'],
        actors: [{ id: 'hk', m: 'hiker', at: [-6, 18], to: [0, 22], until: 0.6, ex: 'neutral', exs: [[0.6, 'worried']] }] },
      { vo: 'Think, then look around. Can you safely get back to a known trail?', cam: { mode: 'orbit', target: 'hk', r: 7, h: 2.4, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'THINK + LOOK AROUND', size: 50, bg: '#ffd23f' }], sfx: ['birds', 'wind@0.3'],
        actors: [{ id: 'hk', m: 'hiker', at: [0, 20], face: 190, anim: 'look', ex: 'worried' }, { id: 'lg', m: 'log', at: [3, 18], s: 1.3 }] },
      { vo: 'If not, stay put. Searchers look along your planned route.', time: 'dusk', cam: { mode: 'static', at: [4, 2, 8], look: [0, 1.4, 22] }, tags: [{ t: [0.1, 0.95], text: 'STAY PUT', size: 96, bg: '#7cf2c0' }], sfx: ['wind', 'chime@0.7'],
        actors: [{ id: 'hk', m: 'hiker', at: [0, 20], face: 190, anim: 'sit', ex: 'worried' }, { id: 'lg', m: 'log', at: [2, 19.4], s: 1.3 }, { id: 'ck', m: 'check', at: [0, 20], y: 5, s: 1.5, vis: [0.4, 1] }] },
      { vo: 'Blow a whistle three times, pause, and repeat. Three is the distress signal.', time: 'dusk', cam: { mode: 'orbit', target: 'hk', r: 6, h: 2, a0: -25, a1: 25 }, tags: [{ t: [0.1, 0.95], text: '3 WHISTLE BLASTS', size: 70, bg: '#ffb86b' }], sfx: ['beep@0.15', 'beep@0.45', 'beep@0.75', 'birds@0.9'],
        actors: [{ id: 'hk', m: 'hiker', at: [0, 20], face: 190, anim: 'wave', ex: 'determined' }, { id: 'sp', m: 'sky_sparkle', at: [0, 20], y: 1.5, s: 1, o: { n: 8, col: [255, 230, 120] } }] },
      { vo: 'Tell someone your plan before every hike, so they know when to call for help.', set: 'camp', time: 'day', cam: { mode: 'static', at: [3, 2, 8], look: [-1, 1.6, 24] }, tags: [{ t: [0.1, 0.95], text: 'TELL SOMEONE YOUR PLAN', size: 44, bg: '#7cc4ff' }], sfx: ['birds', 'chime@0.5'],
        actors: [{ id: 'hk', m: 'hiker', at: [-2, 20], face: 160, anim: 'point', ex: 'smile', o: { hold: 'plans' } }, { id: 'fr', m: 'woman', at: [2, 20], face: 200, anim: 'look', ex: 'smile' }, { id: 'hr', m: 'heart', at: [0, 20], y: 5, s: 1.2, vis: [0.5, 1] }] },
    ] });

  // ---- 24. The Paper Boat (cat 1, Film & Animation, fiction) ----
  NEW.push({
    id: 'paperboat', kind: 'fiction', cat: '1', title: 'The Paper Boat', set: 'street', music: 'sad',
    caption: 'A small paper boat takes a big journey. 🛶 (This is a made-up story.)',
    tags: '#shortstory #fiction #animatedstory #cozy #shortfilm #shorts',
    footer: 'A fictional story, written for entertainment.',
    beats: [
      { vo: 'On a rainy afternoon, a little boy folded a paper boat.', time: 'storm', fx: ['rain'], cam: { mode: 'dolly', from: [-5, 1.8, 4], to: [-1.5, 1.6, 9], look: 'bo' }, tags: [{ t: [0.1, 0.95], text: 'A RAINY DAY', size: 68 }], sfx: ['rain', 'drip@0.4'],
        actors: [{ id: 'bo', m: 'boy', at: [0, 16], face: 190, anim: 'look', ex: 'smile' }, { id: 'pb', m: 'paperboat', at: [0.2, 15.4], y: 1.0, s: 1.6, face: 180 }, { id: 'lp', m: 'lamp', at: [-6, 20] }] },
      { vo: 'He set it in the gutter, and it sailed away down the street.', time: 'storm', fx: ['rain'], cam: { mode: 'static', at: [4, 2.4, 6], look: [0, 1, 22] }, tags: [{ t: [0.1, 0.95], text: 'ANCHORS AWEIGH!', size: 60, bg: '#7cc4ff' }], sfx: ['rain', 'splash@0.2'],
        actors: [{ id: 'bo', m: 'boy', at: [-1.4, 14], face: 160, anim: 'point', ex: 'laugh' }, { id: 'pb', m: 'paperboat', at: [-0.5, 14], to: [-5, 32], y: 0.15, s: 2 }, { id: 'p1', m: 'puddle', at: [-1, 18], c: { a: [90, 160, 220] }, o: { w: 6, d: 3 } }, { id: 'p2', m: 'puddle', at: [-3, 25], c: { a: [90, 160, 220] }, o: { w: 6, d: 3 } }, { id: 'p3', m: 'puddle', at: [-5, 31], c: { a: [90, 160, 220] }, o: { w: 6, d: 3 } }] },
      { vo: 'The boy chased it past shops, over puddles, and through a crowd.', time: 'storm', fx: ['rain'], cam: { mode: 'track', target: 'bo', off: [5, 2.4, -8] }, tags: [{ t: [0.1, 0.95], text: 'THE CHASE', size: 80, bg: '#ffd23f' }], sfx: ['steps', 'rain', 'crowd@0.5'],
        actors: [{ id: 'bo', m: 'boy', at: [-2, 12], to: [-6, 40], anim: 'run', ex: 'laugh' }, { id: 'pb', m: 'paperboat', at: [-4, 24], to: [-8, 52], y: 0.15, s: 2 }, { id: 'cw', m: 'crowd', at: [3, 30], o: { n: 4, spread: 6, seed: 21 } }] },
      { vo: 'It slipped into the river and drifted on, toward the faraway sea.', set: 'riverside', water: 'blue', time: 'dusk', cam: { mode: 'static', at: [0, 3, 2], look: [0, 0, 34] }, tags: [{ t: [0.1, 0.95], text: 'TO THE SEA', size: 80, bg: '#b9a0ff' }], sfx: ['waves', 'gulls@0.4', 'chime@0.8'],
        actors: [{ id: 'bo', m: 'boy', at: [0, 10], face: 0, anim: 'stand', ex: 'sad' }, { id: 'pb', m: 'paperboat', at: [-1, 22], to: [3, 52], y: -0.35, s: 3.5 }] },
      { vo: 'The boy waved goodbye, smiled, and began folding a second boat.', set: 'riverside', water: 'blue', time: 'dusk', fx: ['rainbow'], cam: { mode: 'orbit', target: 'bo', r: 7, h: 2, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'ANOTHER BOAT', size: 70, bg: '#7cf2c0' }], sfx: ['chime@0.3', 'gulls', 'birds'],
        actors: [{ id: 'bo', m: 'boy', at: [0, 10], face: 190, anim: 'wave', ex: 'smile' }, { id: 'pb', m: 'paperboat', at: [0.3, 9.4], y: 1.0, s: 1.6, face: 180, vis: [0.4, 1] }, { id: 'hr', m: 'heart', at: [0, 10], y: 4.2, s: 1.0, vis: [0.5, 1] }] },
    ] });

  // ---- 25. The Red Balloon of Mia (cat 1, fiction) ----
  NEW.push({
    id: 'balloon', kind: 'fiction', cat: '1', title: 'Mia and the Red Balloon', set: 'plaza', music: 'hope',
    caption: 'A lost balloon finds a new home. 🎈 (This is a made-up story.)',
    tags: '#shortstory #fiction #animatedstory #cozy #balloon #shorts',
    footer: 'A fictional story, written for entertainment.',
    beats: [
      { vo: 'A little girl named Mia held a bright red balloon at the fair.', time: 'day', cam: { mode: 'dolly', from: [-5, 2, 4], to: [-1.5, 2, 9], look: 'g' }, tags: [{ t: [0.1, 0.95], text: 'THE FAIR', size: 80 }], sfx: ['crowd', 'chime@0.5', 'birds'],
        actors: [{ id: 'g', m: 'girl', at: [0, 18], face: 190, anim: 'stand', ex: 'smile' }, { id: 'bl', m: 'balloon', at: [0.5, 18], y: 1.0 }, { id: 'cw', m: 'crowd', at: [-9, 26], o: { n: 5, spread: 8, seed: 31 } }] },
      { vo: 'A gust of wind pulled it from her hand, and it floated away.', time: 'day', cam: { mode: 'static', at: [3, 2.6, 6], look: [0, 6, 22] }, tags: [{ t: [0.1, 0.95], text: 'UP, UP, AWAY!', size: 76, bg: '#ff8a9a' }], sfx: ['wind', 'whoosh@0.3'],
        actors: [{ id: 'g', m: 'girl', at: [0, 18], face: 190, anim: 'scared', ex: 'shock' }, { id: 'bl', m: 'balloon', at: [0.5, 18], to: [8, 34], y: [1, 16] }] },
      { vo: 'Mia ran after it across the meadow, past flowers and over a hill.', set: 'meadow', time: 'day', cam: { mode: 'track', target: 'g', off: [5, 2.4, -8] }, tags: [{ t: [0.1, 0.95], text: 'THE CHASE', size: 80, bg: '#ffd23f' }], sfx: ['steps', 'birds', 'whoosh@0.2'],
        actors: [{ id: 'g', m: 'girl', at: [-4, 12], to: [3, 44], anim: 'run', ex: 'determined' }, { id: 'bl', m: 'balloon', at: [-2, 30], to: [4, 62], y: [9, 10] }] },
      { vo: "It had caught on a tree branch, right beside a tiny bird's nest.", set: 'meadow', time: 'day', cam: { mode: 'dolly', from: [-4, 2.4, 16], to: [-1, 3, 22], look: [3, 4.4, 40] }, tags: [{ t: [0.1, 0.95], text: 'FOUND IT!', size: 84, bg: '#7cf2c0' }], sfx: ['birds', 'chime@0.6'],
        actors: [{ id: 'tr', m: 'tree', at: [3, 40], s: 1.8 }, { id: 'bl', m: 'balloon', at: [3, 36.6], y: 5.8, s: 1.2 }, { id: 'bd', m: 'bird', at: [4.4, 36.4], y: 6.6, s: 1.3, face: 180, o: { perch: 1 } }, { id: 'nt', m: 'cube', at: [4.4, 36.8], y: 6.1, s: 1.4, c: { a: 'brown' } }, { id: 'g', m: 'girl', at: [-2, 26], to: [0, 31], anim: 'run', end: 'point', ex: 'smile' }] },
      { vo: 'Mia smiled, left it there as a gift, and walked home happy.', set: 'meadow', time: 'dusk', fx: ['rainbow'], cam: { mode: 'orbit', target: 'g', r: 8, h: 2.4, a0: -30, a1: 30 }, tags: [{ t: [0.1, 0.95], text: 'A LITTLE GIFT', size: 72, bg: '#b9a0ff' }], sfx: ['chime@0.3', 'birds', 'cheer@0.8'],
        actors: [{ id: 'tr', m: 'tree', at: [3, 40], s: 1.8 }, { id: 'bl', m: 'balloon', at: [3, 36.6], y: 5.8, s: 1.2 }, { id: 'bd', m: 'bird', at: [4.4, 36.4], y: 6.6, s: 1.3, face: 180, o: { perch: 1 } }, { id: 'g', m: 'girl', at: [0, 30], face: 190, anim: 'wave', ex: 'laugh' }, { id: 'hr', m: 'heart', at: [3, 36], y: 10, s: 1.4 }] },
    ] });

  NEW.forEach((s) => STORIES.push(s));
})();
