'use strict';
// =====================================================================
//  content.js: ALL the stories (script lines, on-screen tags, caption, hashtags, sound cues and the 3D scene code).
//  Loaded by animals.html. To add a story: copy an existing one, give it a new id, add it to STORIES and to the kinds list at the bottom.
//  Kinds: survival ("what to do if..."), help (found/hurt animals, pet first aid), tale (true stories), dyk (did you know), fiction (made-up stories).
// =====================================================================
// =====================================================================
//  STORY 1: Brown bear encounter (forest trail)
// =====================================================================
const BZ0 = (p) => lerp(-8, 52, p);
const B1S = (bt) => { const run = Math.max(0, bt - 0.5), zh = -5.2 * run, zb = Math.max(zh + 2.7, 9 - (bt < 0.25 ? 0 : 9.2 * (bt - 0.25))); return { zh, zb }; };
const hikerO = (o) => Object.assign({ shirt: [255, 96, 56], pants: [36, 66, 170], pack: [255, 200, 36], hat: [255, 255, 255] }, o);
const BEAR = {
  id: 'bear', title: 'Bear Encounter',
  caption: 'What to do if you meet a brown bear. Save this for your next hike! (Black bear? The advice differs: fight back instead of playing dead.)',
  tags: '#bear #survival #hiking #wildlife #safety #shorts', footer: 'General safety info. Advice differs by species and region, so follow your local park or wildlife authority.',
  beats: [
    { d: 5.4, vo: "A bear runs 35 miles per hour. Here's what to do if you meet one.", tags: [{ t: [0, 0.95], text: '35 MPH', y: 330, size: 96, bg: '#ffd23f' }] },
    { d: 5.4, vo: "First, never run. You can't outrun a bear, and running can trigger a chase.", tags: [{ t: [0.1, 0.95], text: "DON'T RUN", y: 330, size: 88, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 4.6, vo: 'Stay calm, talk in a low voice, and back away slowly.', tags: [{ t: [0.1, 0.95], text: 'BACK AWAY SLOWLY', y: 330, size: 64, bg: '#7cf2c0' }] },
    { d: 5.6, vo: 'If it charges, use bear spray. Many charges are bluffs, so hold your ground.', tags: [{ t: [0.1, 0.95], text: 'BEAR SPRAY', y: 330, size: 88, bg: '#ff8a3d' }] },
    { d: 7.2, vo: "If a brown bear makes contact, play dead, stomach down, neck covered. That's how you beat a bear that outruns you.", tags: [{ t: [0.1, 0.95], text: 'PLAY DEAD', y: 330, size: 88, bg: '#b58cff' }] },
  ],
  build() {
    const xs = [-70, -56, -44, -34, -26, -19, -13, -8, -3, 3, 8, 13, 19, 26, 34, 44, 56, 70], zs = []; for (let z = -40; z <= 60; z += 6) zs.push(z); for (let z = 72; z <= 160; z += 16) zs.push(z);
    groundG(xs, zs, (x, z) => (Math.abs(x) > 16 ? Math.sin(x * 0.13) * Math.cos(z * 0.09) * 1.2 + (Math.abs(x) - 16) * 0.07 : 0), (x, z) => (Math.abs(x) < 3.5 ? [226, 164, 92] : (Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [74, 210, 94] : [56, 190, 86]), 11);
    const r = rng(5), greens = [[30, 160, 90], [22, 178, 116], [66, 186, 74], [18, 142, 104], [255, 176, 40]];
    for (let k = 0; k < 70; k++) { const side = r() < 0.5 ? -1 : 1, x = side * (6 + r() * 42), z = -30 + r() * 150; pine(x, z, 0.9 + r() * 0.7, greens[k % 6 === 5 ? 4 : Math.floor(r() * 4)]); }
    const fc = [[255, 80, 130], [255, 224, 60], [176, 96, 255], [255, 255, 255]]; for (let k = 0; k < 90; k++) { const side = r() < 0.5 ? -1 : 1; ico(side * (3.8 + r() * 12), 0.16, -30 + r() * 80, 0.18, fc[k % 4], null, 0.8); }
    [[-8, 12, 0.9], [9, 30, 1.1], [-12, 40, 1.3], [7, -10, 0.8], [14, 6, 1]].forEach(([x, z, s], k) => rock(x, z, s, [150, 150, 190], k + 3));
    prism(0, 0, 0, 0.38, 5, 7, [140, 84, 46], comp(rotZ(Math.PI / 2), mv(-4, 0.4, 26)));
    [[-90, 200, 60, 40, [112, 114, 236]], [-30, 225, 52, 36, [150, 108, 230]], [48, 215, 72, 46, [100, 130, 240]], [112, 195, 50, 32, [160, 120, 236]]].forEach(([x, z, r2, h, c]) => mountain(x, z, r2, h, c));
    cloud(-50, 70, 180, 1.3); cloud(40, 82, 200, 1.5); cloud(115, 62, 175, 1.1);
  },
  env(i) {
    const base = { top: [34, 132, 255], bot: [255, 238, 196], fog: [196, 232, 240], sunCol: [255, 240, 205], glow: '255,238,190', sat: 1.3, amb: [0.68, 0.68, 0.76], bright: 1.06, fogNear: 50, fogFar: 230 };
    if (i === 3) return Object.assign({}, base, { top: [120, 92, 240], bot: [255, 178, 120], fog: [255, 206, 170], sunCol: [255, 196, 140], glow: '255,190,120' });
    if (i === 4) return Object.assign({}, base, { top: [150, 80, 220], bot: [255, 150, 120], fog: [255, 190, 170], sunCol: [255, 176, 128], glow: '255,160,110' });
    return base;
  },
  cam(i, p, T, TL) {
    const bt = T - TL.E[i];
    if (i === 0) { const z = BZ0(p); return { pos: [9.5, 2.3, z - 2], tg: [0, 1.1, z + 1.6] }; }
    if (i === 1) { const s = B1S(bt); return { pos: [lerp(1.6, -1.6, p), 1.5, s.zh - 8.2], tg: [0, 1.3, s.zh + 3.5] }; }
    if (i === 2) { const zh = -0.85 * bt; return { pos: [1.7, 1.8, zh - 3.4], tg: [0, 1.6, 8.2] }; }
    if (i === 3) return { pos: [lerp(-3, -2, p), 1.8, -3.3], tg: [0.4, 1.3, 7.5] };
    return { pos: [lerp(4.2, 3.2, p), lerp(0.8, 1.3, p), 6.5], tg: [0, 0.8, 1.8] };
  },
  dyn(T, i, p, TL) {
    const bt = T - TL.E[i], H = (x, y, z, f, o) => person(x, y, z, f, 1, hikerO(o));
    if (i === 0) { const z = BZ0(p); bear(0.2, 0, z, 0, 0.78, { gallop: 1, walk: T * 12 }); shadow(0.2, z, 1, 1.6, 0); for (let k = 0; k < 7; k++) ico(0.2 + (k % 2 ? 0.5 : -0.5) * (0.3 + k * 0.07), 0.3 + k * 0.1, z - 1.7 - k * 0.85, 0.25 + k * 0.08, [238, 212, 170], null, 0.8); }
    if (i === 1) { const s = B1S(bt), run = bt > 0.5, g = s.zb > s.zh + 3.2; H(0.5, 0, s.zh, lerp(0, Math.PI, ez(wn(bt, 0.12, 0.5))), { walk: T * 11, amp: run ? 1 : 0 }); shadow(0.5, s.zh, 0.5, 0.5, 0); bear(-0.3, 0, s.zb, Math.PI, 0.78, { gallop: g ? 1 : 0, walk: g ? T * 12 : T * 6, mouth: g ? 0.5 : 0.2 }); shadow(-0.3, s.zb, 1, 1.6, Math.PI); }
    if (i === 2) {
      const zh = -0.85 * bt; H(0.2, 0, zh, 0, { walk: T * 2.6, amp: 0.3, armL: -0.55, armR: -0.55 }); shadow(0.2, zh, 0.5, 0.5, 0);
      const st = ez(wn(p, 0.1, 0.4)) * (1 - ez(wn(p, 0.6, 0.8))), mvz = ez(wn(p, 0.8, 1)), zb = 8 + 8 * mvz, fc = lerp(Math.PI, 0.5, ez(wn(p, 0.7, 0.9)));
      bear(0.3, 0, zb, fc, 0.78, { stand: st, walk: mvz > 0 ? T * 4 : 0, look: Math.sin(T * 1.3) * 0.25 }); shadow(0.3, zb, 1, 1.5, fc);
    }
    if (i === 3) {
      H(0, 0, 0, 0, { armR: lerp(0, -1.55, ez(wn(p, 0.12, 0.28))), can: 1 }); shadow(0, 0, 0.5, 0.5, 0);
      const ch = ez(wn(p, 0, 0.5)), fl = wn(p, 0.64, 1), zb = lerp(15, 6.2, ch) + 30 * fl * fl, fc = lerp(Math.PI, 0, ez(wn(p, 0.55, 0.74)));
      bear(0, 0, zb, fc, 0.78, { gallop: p < 0.5 || p > 0.7 ? 1 : 0, walk: T * 12, mouth: p < 0.5 ? 0.55 + 0.45 * Math.sin(T * 14) : 0 }); shadow(0, zb, 1, 1.6, fc);
      const gr = ez(wn(p, 0.4, 0.8)), fade = 1 - wn(p, 0.86, 1); if (p > 0.4 && fade > 0) for (let k = 0; k < 14; k++) { const u = k / 14; ico(Math.sin(k * 2.1 + T * 5) * 0.25 * u + 0.31, 1.4 + Math.cos(k * 1.7 + T * 4) * 0.2 * u, 0.9 + u * 5.2 * gr, (0.25 + u * 0.9 * gr) * fade, mixc([255, 160, 50], [255, 90, 40], u), null, 0.9, { emissive: 1 }); }
    }
    if (i === 4) {
      H(0, -0.75, 0, Math.PI, { prone: 1, armL: -2.5, armR: -2.5 }); shadow(0, 0, 0.6, 1.1, 0);
      const zb = p < 0.5 ? lerp(12, 2.4, ez(wn(p, 0, 0.45))) : 2.4 + 12 * ez(wn(p, 0.72, 1)), fc = lerp(Math.PI, 0.4, ez(wn(p, 0.62, 0.8))), mvg = p < 0.45 || p > 0.7;
      bear(0, 0, zb, fc, 0.78, { walk: mvg ? T * 4 : 0, dip: 0.55 * wn(p, 0.42, 0.55) * (1 - wn(p, 0.62, 0.72)) }); shadow(0, zb, 1, 1.5, fc);
    }
  },
  post(ctx, T, i) { if (i !== 0) return; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (let k = 0; k < 10; k++) { const y = 420 + k * 70 + (k % 3) * 18, x = (((T * 1500 + k * 173) % 1200) - 240); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 240, y); ctx.stroke(); } ctx.restore(); },
  sfx: [[['forest', 0, 6], ['growl', 0.45], ['steps', 0.2]], [['twig', 0.25], ['growl', 0.1], ['heart', 0.2]], [['heart', 0.05], ['forest', 0, 4.6]], [['growl', 0.05], ['spray', 0.45], ['heart', 0.1]], [['thud', 0.1], ['forest', 0, 5.8], ['chime', 0.8, 'D5']]],
  root: ['C3', 'G3', 'E4'],
};

// =====================================================================
//  STORY 2: Shark (underwater, then the beach)
// =====================================================================
const FL = (x, z) => (z < 0 ? 1.2 - 0.04 * z + Math.sin(x * 0.2) * 0.1 : Math.max(-13, 1.2 - 0.3 * z) + (z > 6 ? Math.sin(x * 0.15 + z * 0.1) * 0.25 : 0));
const KELPS = (() => { const r = rng(21), a = []; for (let k = 0; k < 22; k++) a.push([-50 + r() * 100, 12 + r() * 70, 3 + r() * 3]); return a; })();
const SHARK = {
  id: 'shark', title: 'Shark Encounter',
  caption: 'What to do if a shark finds you in the water. Save this before your next beach trip! 🦈',
  tags: '#shark #survival #ocean #beach #safety #shorts', footer: 'General safety info. Always follow lifeguard and local authority guidance.',
  beats: [
    { d: 6.4, vo: "Unprovoked shark bites are rare, fewer than 100 a year. Here's what to do if one finds you.", tags: [{ t: [0, 0.95], text: 'UNDER 100 BITES / YEAR', y: 330, size: 60, bg: '#ffd23f' }] },
    { d: 4.8, vo: 'Stay calm and stop splashing. Splashing looks like a struggling fish.', tags: [{ t: [0.1, 0.95], text: 'STOP SPLASHING', y: 330, size: 80, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 5.2, vo: 'Keep your eyes on it, and swim back to shore slowly and smoothly.', tags: [{ t: [0.1, 0.95], text: 'SWIM SMOOTHLY', y: 330, size: 80, bg: '#7cf2c0' }] },
    { d: 5.6, vo: 'If it attacks, hit its sensitive spots: the eyes, the nose, and the gills.', tags: [{ t: [0.1, 0.95], text: 'EYES · NOSE · GILLS', y: 330, size: 64, bg: '#ff8a3d' }] },
    { d: 6.4, vo: "Then get out of the water fast and get medical help. Shark bites are rare, but now you're ready.", tags: [{ t: [0.05, 0.5], text: 'GET OUT OF THE WATER', y: 330, size: 56, bg: '#ff4d4d', col: '#ffffff' }, { t: [0.55, 1], text: 'GET MEDICAL HELP', y: 330, size: 64, bg: '#7cf2c0' }] },
  ],
  build() {
    const xs = []; for (let x = -84; x <= 84; x += 12) xs.push(x); const zs = []; for (let z = -36; z <= 60; z += 6) zs.push(z); for (let z = 72; z <= 120; z += 12) zs.push(z);
    groundG(xs, zs, FL, (x, z) => (z < 4 ? [255, 228, 150] : z < 12 ? mixc([240, 214, 150], [255, 226, 140], wn(z, 4, 12)) : mixc([255, 214, 120], [60, 190, 200], cl((z - 12) / 70))), 17);
    const r = rng(77), cols = [[255, 90, 140], [255, 170, 40], [170, 90, 255], [60, 230, 190]];
    for (let k = 0; k < 46; k++) { const x = -60 + r() * 120, z = 8 + r() * 90, y = FL(x, z), t = k % 4, c = cols[Math.floor(r() * 4)]; if (t === 0) { for (let q = 0; q < 5; q++) prism(x + (q - 2) * 0.35, y, z + ((q * 3) % 2) * 0.3, 0.12, 1.2 + r() * 1.4, 5, c, null, 0.06); } else if (t === 1) ico(x, y + 0.5, z, 0.9 + r() * 0.6, c, null, 0.6); else if (t === 2) { cone(x, y, z, 0.9, 1.8 + r(), 6, c); cone(x + 0.8, y, z + 0.3, 0.6, 1.2, 6, mixc(c, [255, 255, 255], 0.2)); } else { ico(x, y + 0.3, z, 0.7, c, null, 0.5); ico(x + 0.7, y + 0.2, z + 0.2, 0.5, mixc(c, [255, 255, 200], 0.3), null, 0.5); } }
    for (let k = 0; k < 18; k++) rock(-70 + r() * 140, 10 + r() * 90, 0.8 + r() * 1.6, [120, 140, 190], k + 9);
    box(-14, 2.4, -4, 2.6, 0.2, 2.6, [255, 255, 255]); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => prism(-14 + a * 1.1, 1.3, -4 + b * 1.1, 0.1, 2.2, 5, [250, 250, 250])); box(-14, 3.8, -4, 2.8, 1.8, 2.8, [255, 250, 245]); box(-14, 4.9, -4, 3.4, 0.4, 3.4, [255, 70, 80]); box(-14, 4.1, -5.45, 1.6, 0.8, 0.1, [130, 220, 255], null, { emissive: 1 });
    [[-22, -8, 1], [20, -9, 1.15], [34, -6, 1]].forEach(([x, z, s]) => { cone(x, FL(x, z) + 3.2 * s, z, 2.2 * s, 1.3 * s, 8, [255, 70, 90]); prism(x, FL(x, z), z, 0.06, 3.3 * s, 4, [250, 250, 250]); });
  },
  env(i) { if (i === 4) return { top: [34, 140, 255], bot: [206, 244, 255], fog: [204, 238, 252], sunCol: [255, 246, 220], glow: '255,246,210', sat: 1.3, amb: [0.7, 0.7, 0.78], bright: 1.06, fogNear: 60, fogFar: 300 }; return { top: [4, 104, 214], bot: [50, 220, 232], fog: [30, 168, 208], sunCol: [255, 255, 235], glow: '210,255,255', sat: 1.3, amb: [0.7, 0.8, 0.86], bright: 1.08, fogNear: 14, fogFar: 100 }; },
  cam(i, p, T, TL) {
    if (i === 0) { const q = ez(p * 0.94); return { pos: [lerp(1, -0.5, p), -5.9, lerp(9.5, 10.5, p)], tg: [lerp(26, -4, q), -4.7, lerp(44, 17, q)] }; }
    if (i === 1) return { pos: [-6.5, -2.6, 6.5], tg: [1, -1.9, 14] };
    if (i === 2) return { pos: [-9, -2.8, lerp(5, 3, p)], tg: [2, -2.3, 13] };
    if (i === 3) return { pos: [lerp(-3, -4, p), -1.9, 22], tg: [1.6, -2, 13.4] };
    return { pos: [lerp(2, 0, p), 1.9, -5.5], tg: [0, 1.3, 5] };
  },
  dyn(T, i, p, TL) {
    const bt = T - TL.E[i], under = i < 4;
    for (let z = 2; z < 120; z += 7) for (let x = -84; x < 84; x += 7) {
      const zc = z + 3.5, fy = FL(x + 3.5, zc); if (fy > -0.05) continue;
      const w = (xx, zz) => Math.sin(xx * 0.3 + zz * 0.22 + T * 1.5) * 0.18, a = [x, w(x, z), z], b = [x + 7, w(x + 7, z), z], c = [x, w(x, z + 7), z + 7], d = [x + 7, w(x + 7, z + 7), z + 7];
      if (under) { const s = 0.5 + 0.5 * Math.sin(x * 0.5 + zc * 0.4 + T * 2), col = mixc([110, 226, 246], [236, 255, 255], s); tri(a, c, b, col, { twoSided: 1, emissive: 1, bias: 30 }); tri(b, c, d, mixc(col, [255, 255, 255], 0.2), { twoSided: 1, emissive: 1, bias: 30 }); }
      else { const col = mixc([86, 236, 220], [18, 132, 206], cl(-fy / 6)); tri(a, c, b, col, { water: 1, bias: -0.4 }); tri(b, c, d, mixc(col, [255, 255, 255], 0.14), { water: 1, bias: -0.4 }); }
    }
    if (under) {
      KELPS.forEach(([x, z, h], k) => kelp(x, FL(x, z), z, h, T, k % 2 ? [40, 220, 110] : [90, 230, 70]));
      const fc = [[255, 206, 40], [255, 100, 160], [80, 255, 200]];
      for (let s = 0; s < 3; s++) for (let f = 0; f < 8; f++) { const ang = T * 0.4 * (s % 2 ? 1 : -1) + s * 2.1, cx = -22 + s * 22, cz = 46 + s * 6, ox = (f % 4) * 1.1, oy = (f >> 2) * 0.9, x = cx + Math.cos(ang) * 14 + ox, z = cz + Math.sin(ang) * 9, vx = -Math.sin(ang) * (s % 2 ? 1 : -1), vz = Math.cos(ang) * (s % 2 ? 1 : -1); fish(x, -5 + s * 1.2 + oy + Math.sin(T * 2 + f) * 0.15, z, Math.atan2(vx, vz), 0.55, fc[s], T, f); }
      for (let k = 0; k < 12; k++) ico(-6 + ((k * 7) % 13), -6 + ((T * 0.9 + k * 0.37) % 1) * 7, 10 + ((k * 5) % 17), 0.1, [255, 255, 255], null, 1, { emissive: 1 });
    }
    const sw = { x: 0, y: -1.15, z: 13 };
    if (i === 0) { const q = ez(p), pos = [lerp(30, -6, q), -4.7 + Math.sin(T) * 0.15, lerp(48, 15.5, q)]; shark(pos[0], pos[1], pos[2], Math.atan2(-36, -32.5), 1.25, T, { mouth: 0 }); for (let k = 1; k < 6; k++) ico(pos[0] + 2.2 * k, pos[1] + 0.2, pos[2] + 2 * k, 0.12, [255, 255, 255], null, 1, { emissive: 1 }); }
    if (i === 1) {
      const q = ez(p), sp = [lerp(17, 9, q), lerp(-4.8, -3.6, q), lerp(30, 22.5, q)];
      person(sw.x, sw.y, sw.z, Math.PI, 1, { prone: 1, walk: T * 14, amp: 1.2, armL: Math.sin(T * 14) * 2, armR: Math.cos(T * 14) * 2, shirt: [255, 96, 56], pants: [36, 66, 170] });
      for (let k = 0; k < 14; k++) ico(sw.x + Math.sin(k * 2.3 + T * 6) * 1.1, sw.y + 0.6 + (((T * 1.6 + k * 0.29) % 1) * 1.1), sw.z + Math.cos(k * 1.7 + T * 5) * 1.1, 0.12 + (k % 3) * 0.04, [255, 255, 255], null, 1, { emissive: 1 });
      shark(sp[0], sp[1], sp[2], Math.atan2(sw.x - sp[0], sw.z - sp[2]), 1.25, T, {});
    }
    if (i === 2) {
      const q = ez(p), z = lerp(13, 6.5, q), a = T * 0.6, sp = [8 + Math.cos(a) * 5, -4.2, 22 + Math.sin(a) * 4];
      person(0, sw.y, z, Math.PI, 1, { prone: 1, walk: T * 3, amp: 0.3, armL: Math.sin(T * 2) * 0.9, armR: -Math.sin(T * 2) * 0.9, shirt: [255, 96, 56], pants: [36, 66, 170] });
      shark(sp[0], sp[1], sp[2], Math.atan2(-Math.sin(a) * 5 * 0.6, Math.cos(a) * 4 * 0.6), 1.25, T, {});
    }
    if (i === 3) {
      const fl = wn(p, 0.58, 1), f0 = Math.atan2(-3.5, -2.5), sp = [3.5 + 10 * fl * fl, -2.2, 14.5 + 8 * fl * fl], fc = lerp(f0, Math.atan2(1, 0.7), ez(wn(p, 0.5, 0.7)));
      person(0, -1.7, 12, Math.atan2(3.5, 2.5), 1, { walk: T * 5, amp: 0.4, armR: -1.5 + Math.sin(T * 13) * 0.6, armL: -0.6, shirt: [255, 96, 56], pants: [36, 66, 170] });
      const sb = shark(sp[0], sp[1], sp[2], fc, 1.25, T, { mouth: 0.5 * (1 - wn(p, 0.4, 0.6)) });
      if (p < 0.62) [[0, -0.1, 2.5], [0.37, 0.2, 1.75], [0.575, 0.12, 1.05]].forEach((lp, k) => { const w = sb(lp), pop = bk(wn(p, 0.12 + k * 0.12, 0.22 + k * 0.12)); ico(w[0], w[1], w[2], (0.2 + 0.06 * Math.sin(T * 10 + k)) * pop, [255, 240, 60], null, 1, { emissive: 1, bias: -4 }); });
    }
    if (i === 4) {
      const z = lerp(8, -2, ez(p)), y = Math.max(FL(0, z), -1);
      person(0, y, z, Math.PI, 1, { walk: T * 12, amp: 1, armL: -0.9, armR: 0.9, shirt: [255, 96, 56], pants: [36, 66, 170] });
      const fx = -6 + Math.sin(T * 0.8) * 3; tri([fx, 1.0, 30], [fx, -0.2, 31.3], [fx, -0.2, 29.6], [30, 88, 184], { twoSided: 1 }); for (let k = 0; k < 4; k++) ico(fx, 0.05, 28.6 - k * 0.9, 0.3 + k * 0.1, [255, 255, 255], null, 0.3);
      [-22, -10, 14, 22].forEach((x, k) => palm(x, -10 + (k % 2) * 3, 1.1, T, k, 1.5));
      [[-4, -1.5, [70, 200, 120]], [5, -2.5, [255, 200, 40]], [3, 0.5, [255, 90, 150]]].forEach(([x, z, c], k) => person(x, FL(x, z), z, Math.PI * 0.1, 1, { shirt: c, pants: [250, 250, 250], armR: k === 0 ? -2.6 + Math.sin(T * 8) * 0.4 : null }));
      cloud(-40, 52, 150, 1.2); cloud(50, 60, 170, 1.4);
    }
  },
  post(ctx, T, i) { if (i >= 4) return; ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let k = 0; k < 6; k++) { const x0 = -100 + k * 170 + Math.sin(T * 0.5 + k) * 40, w = 36 + (k % 3) * 18, a = 0.1 + 0.05 * Math.sin(T * 0.8 + k * 2), g = ctx.createLinearGradient(0, 0, 0, HH * 0.8); g.addColorStop(0, `rgba(210,255,255,${a * 2})`); g.addColorStop(1, 'rgba(210,255,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + w, 0); ctx.lineTo(x0 + w + 260, HH * 0.8); ctx.lineTo(x0 + 260 - w * 0.4, HH * 0.8); ctx.closePath(); ctx.fill(); } ctx.restore(); },
  sfx: [[['uw', 0, 6.4], ['jaws', 0.2]], [['uw', 0, 4.8], ['bubbles', 0.1], ['jaws', 0.5]], [['uw', 0, 5.2], ['ping', 0.2]], [['jaws', 0.05], ['thud', 0.5], ['bubbles', 0.6]], [['waves', 0, 4.6], ['gulls', 0.2], ['chime', 0.75, 'D5']]],
  root: ['E2', 'B2', 'G3'],
};

// =====================================================================
//  STORY 3: Snake (desert trail)
// =====================================================================
const SN = [0.6, 0, 9], NS = 44;
const SNAKE = {
  id: 'snake', title: 'Snake Encounter',
  caption: 'What to do if you meet a snake, and what to do if you get bitten. Save this! 🐍',
  tags: '#snake #survival #hiking #wildlife #firstaid #shorts', footer: 'General safety info. Snake species and treatment differ by region, so follow local emergency guidance.',
  beats: [
    { d: 5.4, vo: 'Snakebites kill around 100,000 people a year. Here is how to stay safe.', tags: [{ t: [0, 0.95], text: '~100,000 / YEAR', y: 330, size: 70, bg: '#ffd23f' }] },
    { d: 5, vo: 'If you see a snake, freeze. They strike when they feel cornered.', tags: [{ t: [0.1, 0.95], text: 'FREEZE', y: 330, size: 96, bg: '#ff8a3d' }] },
    { d: 5.2, vo: 'Step back slowly and give it space. Never try to catch or kill it.', tags: [{ t: [0.1, 0.95], text: 'GIVE IT SPACE', y: 330, size: 78, bg: '#7cf2c0' }] },
    { d: 5.4, vo: 'If you are bitten, stay calm, keep the limb still, and call emergency services.', tags: [{ t: [0.05, 0.5], text: 'STAY CALM & STILL', y: 330, size: 66, bg: '#7cf2c0' }, { t: [0.55, 1], text: 'CALL EMERGENCY', y: 330, size: 70, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 7.2, vo: "Don't cut the wound, suck out venom, or use ice. Get to a hospital fast. That's how you survive a snakebite.", tags: [{ t: [0.05, 0.55], text: 'NO CUTTING · SUCKING · ICE', y: 330, size: 52, bg: '#ff4d4d', col: '#ffffff' }, { t: [0.6, 1], text: 'GET TO A HOSPITAL', y: 330, size: 64, bg: '#7cf2c0' }] },
  ],
  build() {
    const xs = [-70, -56, -44, -34, -26, -19, -13, -8, -3, 3, 8, 13, 19, 26, 34, 44, 56, 70], zs = []; for (let z = -40; z <= 60; z += 6) zs.push(z); for (let z = 72; z <= 160; z += 16) zs.push(z);
    groundG(xs, zs, () => 0, (x, z) => (Math.abs(x) < 3.5 ? [255, 218, 150] : (Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [255, 190, 84] : [246, 166, 70]), 13);
    const r = rng(8); for (let k = 0; k < 24; k++) { const side = r() < 0.5 ? -1 : 1; cactus(side * (7 + r() * 36), -25 + r() * 110, 0.8 + r() * 0.6); }
    for (let k = 0; k < 40; k++) { const side = r() < 0.5 ? -1 : 1; ico(side * (5 + r() * 40), 0.4, -30 + r() * 110, 0.5 + r() * 0.4, [120, 190, 66], null, 0.7); }
    for (let k = 0; k < 18; k++) rock((r() < 0.5 ? -1 : 1) * (5 + r() * 30), -20 + r() * 90, 0.8 + r() * 1.5, [222, 112, 84], k + 2);
    rock(2.6, 8.4, 0.9, [210, 104, 80], 41); rock(-2.2, 10.5, 0.7, [226, 120, 90], 42);
    mesa(-60, 140, 40, 26, 22, [236, 96, 64]); mesa(10, 170, 60, 30, 30, [226, 86, 60]); mesa(80, 150, 36, 24, 18, [240, 110, 70]); mesa(-110, 120, 30, 20, 16, [230, 100, 76]);
    cloud(-40, 70, 190, 1.1); cloud(60, 78, 200, 1.3);
  },
  env(i) {
    const base = { top: [18, 112, 255], bot: [255, 220, 150], fog: [255, 216, 172], sunCol: [255, 218, 160], glow: '255,206,120', sat: 1.3, amb: [0.7, 0.68, 0.74], bright: 1.08, fogNear: 50, fogFar: 240 };
    if (i === 3) return Object.assign({}, base, { top: [96, 90, 232], bot: [255, 170, 120], fog: [255, 196, 160], glow: '255,180,110' });
    if (i === 4) return Object.assign({}, base, { top: [150, 80, 220], bot: [255, 150, 110], fog: [255, 184, 160], sunCol: [255, 176, 120], glow: '255,150,100' });
    return base;
  },
  cam(i, p, T, TL) {
    if (i === 0) return { pos: [lerp(2.4, 1.5, ez(p)), lerp(0.5, 0.8, p), lerp(5.6, 6.6, ez(p))], tg: [SN[0], 0.75, SN[2] - 0.1] };
    if (i === 1) return { pos: [11, 1.3, 6], tg: [0, 0.9, 6] };
    if (i === 2) return { pos: [10, 1.5, 5.4], tg: [0, 0.9, 5.4] };
    if (i === 3) return { pos: [lerp(3.2, 2.4, p), 1.5, 6.4], tg: [0, 1.3, 3] };
    return { pos: [-6, 2.2, 0], tg: [1.5, 1.3, 9] };
  },
  dyn(T, i, p, TL) {
    const bt = T - TL.E[i], H = (x, y, z, f, o) => person(x, y, z, f, 1, hikerO(o));
    if (i === 0) { snakeDraw(coilPose(SN[0], SN[2], NS, T, 1), NS, T, { tongue: 1, rattle: 1 }); shadow(SN[0], SN[2], 1.1, 1.1, 0); }
    if (i === 1) {
      const zh = lerp(0, 3.0, eo(wn(p, 0, 0.4))), mvg = 1 - ez(wn(p, 0.3, 0.42)), up = ez(wn(p, 0.4, 0.55));
      H(-0.3, 0, zh, 0, { walk: T * 6, amp: 0.7 * mvg, armL: -0.9 * up, armR: -0.9 * up }); shadow(-0.3, zh, 0.5, 0.5, 0);
      snakeDraw(coilPose(SN[0], SN[2], NS, T, 1), NS, T, { tongue: 1, rattle: 1 }); shadow(SN[0], SN[2], 1.1, 1.1, 0);
    }
    if (i === 2) {
      const zh = 3.0 - 0.7 * bt, b = ez(wn(p, 0.15, 0.55)), co = coilPose(SN[0], SN[2], NS, T, 1 - b * 0.7), sl = slitherPose(NS, SN[0], SN[2], 0.2 + bt * 0.9), P = co.map((q, k) => lerp3(q, sl[k], b));
      H(-0.3, 0, zh, 0, { walk: T * 2.5, amp: 0.3, armL: -0.4, armR: -0.4 }); shadow(-0.3, zh, 0.5, 0.5, 0);
      snakeDraw(P, NS, T, { tongue: 1, rattle: 1 - b });
      for (let k = 0; k < 16; k++) { const a = (k / 16) * TAU; box(0, 0, 0, 0.5, 0.04, 0.14, [255, 255, 255], comp(rotY(-a - Math.PI / 2), mv(SN[0] + Math.cos(a) * 2.6, 0.05, SN[2] + Math.sin(a) * 2.6)), { emissive: 1 }); }
    }
    if (i === 3) {
      H(-0.2, 0, 3, 0, { phone: 1, armR: -1.2, armL: 0, wrap: 1 }); shadow(-0.2, 3, 0.5, 0.5, 0);
      snakeDraw(slitherPose(NS, -4 - bt * 0.5, 11, 1.2 + bt * 0.9), NS, T, { tongue: 1 });
    }
    if (i === 4) {
      const q = eo(wn(p, 0, 0.7)), az = lerp(42, 7, q), fc = Math.PI;
      H(0, 0, 3, 0, { wrap: 1, armL: 0.0 }); shadow(0, 3, 0.5, 0.5, 0);
      const x = 4.5, W2 = [255, 255, 255], RED = [255, 60, 70], xf = comp(rotY(fc), mv(x, 0, az));
      box(0, 1.7, -0.4, 2.6, 2.2, 3.8, W2, xf); box(0, 1.3, 2.0, 2.5, 1.6, 1.4, W2, xf); box(0, 1.05, 3.0, 2.4, 0.9, 1.0, W2, xf); box(0, 1.8, 2.72, 2.0, 0.7, 0.06, [130, 224, 255], xf, { emissive: 1 }); box(0, 1.3, -0.4, 2.64, 0.35, 3.84, RED, xf);
      [-1, 1].forEach((d) => { box(d * 1.31, 1.9, -0.5, 0.05, 0.9, 0.26, RED, xf, { emissive: 1 }); box(d * 1.31, 1.9, -0.5, 0.05, 0.26, 0.9, RED, xf, { emissive: 1 }); [-1.4, 1.9].forEach((wz) => prism(0, -0.15, 0, 0.5, 0.3, 10, [30, 30, 38], comp(rotZ(Math.PI / 2), mv(d * 1.3, 0.5, wz), xf))); });
      const fl = Math.floor(T * 4) % 2; box(-0.5, 2.9, 1.6, 0.5, 0.2, 0.3, fl ? [255, 40, 50] : [90, 20, 30], xf, { emissive: 1 }); box(0.5, 2.9, 1.6, 0.5, 0.2, 0.3, fl ? [30, 40, 90] : [70, 130, 255], xf, { emissive: 1 });
      if (p > 0.7) { const k = ez(wn(p, 0.7, 1)); person(lerp(3.4, 1.2, k), 0, lerp(7.5, 5, k), Math.PI, 1, { shirt: [255, 255, 255], pants: [20, 170, 120], walk: T * 6, amp: 0.7 }); person(lerp(3.8, 1.8, k), 0, lerp(8.2, 6, k), Math.PI, 1, { shirt: [255, 255, 255], pants: [20, 170, 120], walk: T * 6 + 2, amp: 0.7 }); }
    }
  },
  sfx: [[['wind', 0, 5.4], ['rattle', 0.35], ['hiss', 0.6]], [['rattle', 0.3], ['steps', 0.05]], [['hiss', 0.1], ['wind', 0, 5.2]], [['heart', 0.1], ['ping', 0.5]], [['siren', 0.05], ['chime', 0.8, 'D5']]],
  root: ['D3', 'A3', 'F4'],
};
// =====================================================================
//  STORY 4: Found a hurt bird (park). Told with simple props, not step-by-step animation.
// =====================================================================
const BP = [0.4, 0, 6.0], FC = Math.PI / 2;
const glove = (x, z, a) => { const xf = comp(rotY(a), mv(x, 0, z)), G = [232, 196, 64]; ell(0, 0.1, 0, 0.16, 0.07, 0.22, G, xf); [-0.09, -0.03, 0.03, 0.09].forEach((q) => ell(q, 0.1, 0.26, 0.035, 0.05, 0.12, G, xf)); ell(-0.17, 0.1, 0.08, 0.05, 0.05, 0.12, G, xf); };
const crate = (bx, bz, holes) => { const CB = [214, 164, 100]; box(bx, 0.04, bz, 0.95, 0.08, 0.95, CB); box(bx, 0.32, bz - 0.45, 0.95, 0.6, 0.06, CB); box(bx, 0.32, bz + 0.45, 0.95, 0.6, 0.06, CB); box(bx - 0.45, 0.32, bz, 0.06, 0.6, 0.95, CB); box(bx + 0.45, 0.32, bz, 0.06, 0.6, 0.95, CB); if (holes) [-1, 0, 1].forEach((q) => box(bx + q * 0.22, 0.35, bz - 0.49, 0.08, 0.08, 0.03, [70, 46, 30])); };
const BIRD = {
  id: 'bird', title: 'Found a Hurt Bird',
  caption: 'Found an injured bird? Here is what wildlife rescuers recommend. Save this! 🐦',
  tags: '#wildlife #birds #animalrescue #howto #petcare #shorts', footer: 'General advice. When in doubt, contact a local wildlife rehabilitator or vet. Rules differ by region.',
  beats: [
    { d: 4.4, vo: 'Found a hurt bird? Do not give it water.', tags: [{ t: [0, 0.95], text: 'NO FOOD OR WATER', y: 330, size: 72, bg: '#ff6b6b', col: '#ffffff' }] },
    { d: 4.6, vo: 'Put on gloves, and gently cover it with a towel.', tags: [{ t: [0.05, 0.95], text: 'GLOVES + TOWEL', y: 330, size: 70, bg: '#ffd86b' }] },
    { d: 6, vo: 'Place it in a box with air holes and a lid, somewhere warm, dark and quiet.', tags: [{ t: [0.05, 0.95], text: 'WARM · DARK · QUIET', y: 330, size: 66, bg: '#8de8c4' }] },
    { d: 5, vo: 'Keep pets and kids away, and handle it as little as possible.', tags: [{ t: [0.05, 0.95], text: 'HANDS OFF', y: 330, size: 88, bg: '#ffa06b' }] },
    { d: 5.4, vo: 'Then call a wildlife rescue. A hurt bird needs experts, not food or water.', tags: [{ t: [0.05, 0.95], text: 'CALL WILDLIFE RESCUE', y: 330, size: 60, bg: '#8de8c4' }] },
  ],
  build: parkBuild, env: () => PARK_ENV,
  cam(i, p) {
    if (i <= 2) { const a = lerp(-0.3, 0.3, p); return { pos: [BP[0] + Math.sin(a) * 3.0, 1.0, BP[2] - Math.cos(a) * 3.0], tg: [BP[0], 0.6, BP[2]] }; }
    return { pos: [lerp(3.6, 3.0, p), 1.4, lerp(2.4, 3.4, p)], tg: [3.2, 1.1, 7.6] };
  },
  dyn(T, i, p) {
    if (i === 0) { bird(BP[0], 0, BP[2], Math.PI + 0.4, 1.8, T, { hurt: 1, dip: 0.35 }); prism(-0.35, 0, 6.5, 0.28, 0.12, 8, [90, 150, 220], null, 0.34); ell(-0.35, 0.12, 6.5, 0.28, 0.03, 0.28, [150, 205, 240], null); [0, 1, 2, 3].forEach((k) => ico(-0.65 + k * 0.08, 0.05, 7.0 - (k % 2) * 0.1, 0.04, [230, 196, 90], null, 1)); xmark(-0.35, 1.3, 6.5, 0.8); shadow(BP[0], BP[2], 0.45, 0.35, 0); }
    if (i === 1) { bird(BP[0], 0.3, BP[2] + 0.1, Math.PI, 1.3, T, { dip: 0.2 }); ell(BP[0], 0.2, BP[2] - 0.05, 0.75, 0.42, 0.62, [96, 150, 206], null, null, 1); ell(BP[0] + 0.3, 0.5, BP[2] - 0.2, 0.34, 0.12, 0.34, [128, 178, 226], null); glove(BP[0] + 1.3, BP[2] - 0.2, 0.4); glove(BP[0] + 1.7, BP[2] + 0.3, -0.5); heart3d(BP[0], 2.0 + Math.sin(T * 2) * 0.08, BP[2], 0.28); }
    if (i === 2) { crate(BP[0], BP[2], true); bird(BP[0], 0.2, BP[2] + 0.05, Math.PI, 1.1, T, { dip: 0.15 }); ell(BP[0], 0.2, BP[2] - 0.05, 0.4, 0.22, 0.32, [96, 150, 206], null, null, 1); box(BP[0] + 1.5, 0.52, BP[2], 1.0, 0.06, 1.0, [226, 176, 110], comp(rotZ(0.9, [BP[0] + 1.5, 0.5, BP[2]]))); ico(BP[0] - 1.6, 2.3, BP[2] + 1, 0.35, [250, 226, 140], null, 1, { emissive: 1 }); }
    if (i === 3 || i === 4) {
      crate(3.2, 7.5, true); box(3.2, 0.64, 7.5, 1.0, 0.06, 1.0, [226, 176, 110]); const sh = (v) => v;
      if (i === 3) { const k = (T * 1.6) % 14; person(-1 - k * 0.6, 0, 11, -FC, 0.65, { walk: T * 8, shirt: [214, 178, 84], pants: [160, 70, 100] }); dog(-2.6 - k * 0.6, 0, 11, -FC, 0.8, { walk: T * 9, wag: T * 6, tongue: 1, col: [226, 190, 120], col2: [200, 140, 80] }); xmark(-2.2 - k * 0.6, 2.4, 11, 0.5); }
      else { box(1.6, 1.8, 6.4, 0.5, 0.9, 0.06, [40, 42, 54]); box(1.6, 1.8, 6.37, 0.42, 0.78, 0.02, [150, 235, 200], null, { emissive: 1 }); const age = (T * 0.8) % 1; ring3d(1.6, 1.8, 6.3, 0.3 + age * 1.1, 0.07, [230, 245, 255]); ring3d(1.6, 1.8, 6.3, 0.3 + ((age + 0.5) % 1) * 1.1, 0.07, [230, 245, 255]); heart3d(3.2, 2.3 + Math.sin(T * 2) * 0.1, 7.5, 0.3); }
    }
  },
  sfx: [[['tweet', 0.2], ['wind', 0, 4.4]], [['steps', 0.4]], [['knock', 0.7]], [['tweet', 0.5], ['bark', 0.2]], [['ping', 0.4], ['chime', 0.8, 'D5']]],
  root: ['G2', 'D3', 'B3'],
};

// =====================================================================
//  STORY 5: Dog ate chocolate (living room)
// =====================================================================
const CD = [0.6, 0, 5.4], GD = { col: [246, 206, 120], col2: [226, 150, 72], collar: [255, 70, 110] };
const wrapper = (x, z) => { box(x, 0.03, z, 0.55, 0.03, 0.38, [255, 70, 90]); box(x + 0.1, 0.05, z, 0.2, 0.02, 0.3, [255, 214, 90]); [0, 1, 2].forEach((k) => box(x - 0.25 + k * 0.22, 0.04, z + 0.35, 0.18, 0.05, 0.14, [100, 56, 34])); };
const CHOC = {
  id: 'choc', title: 'Dog Ate Chocolate',
  caption: 'Dog ate chocolate? Here is what to do right away. Save this, it could help your pet! 🐶',
  tags: '#dogs #petcare #pethealth #chocolate #firstaid #shorts', footer: 'General advice, not a diagnosis. Always call your vet or a pet poison hotline, as risk depends on the dog and the amount.',
  beats: [
    { d: 4.4, vo: 'Dog ate chocolate? Every minute counts.', tags: [{ t: [0, 0.95], text: 'CHOCOLATE IS TOXIC', y: 330, size: 60, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 5, vo: 'Take away what is left, and note how much your dog ate.', tags: [{ t: [0.05, 0.95], text: 'NOTE WHAT & HOW MUCH', y: 330, size: 56, bg: '#ffd23f' }] },
    { d: 4.4, vo: 'Call your vet or a pet poison hotline right away.', tags: [{ t: [0.05, 0.95], text: 'CALL YOUR VET', y: 330, size: 80, bg: '#7cc4ff' }] },
    { d: 4.8, vo: 'Do not try to make your dog vomit unless a vet tells you to.', tags: [{ t: [0.05, 0.95], text: 'NO HOME REMEDIES', y: 330, size: 66, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 6, vo: 'Dark chocolate is the most dangerous. Dog ate chocolate? Call the vet right away.', tags: [{ t: [0.05, 0.5], text: 'DARK = MOST DANGEROUS', y: 330, size: 54, bg: '#ff8a3d' }, { t: [0.55, 1], text: 'CALL THE VET NOW', y: 330, size: 64, bg: '#7cf2c0' }] },
  ],
  build: roomBuild, env: () => ROOM_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [3.4, 1.4, lerp(1.6, 2.2, p)], tg: [0.2, 0.7, 5] };
    if (i === 1) return { pos: [-1.6, 1.5, 2.4], tg: [1, 1.1, 4.6] };
    if (i === 2) return { pos: [lerp(-1.2, -0.4, p), 1.5, 2.6], tg: [1, 1.2, 4.6] };
    if (i === 3) return { pos: [0, 1.6, 2], tg: [2.2, 1.4, 5.6] };
    return { pos: [1, 1.6, 1.4], tg: lerp3([3.5, 0.9, 5.5], [3, 1.2, 4.2], ez(p)) };
  },
  dyn(T, i, p) {
    const OW = (x, z, f, o) => person(x, 0, z, f, 1, Object.assign({ shirt: [70, 190, 170], pants: [60, 70, 150], hair: [50, 30, 24] }, o));
    if (i === 0) { const ox = lerp(-4, -2.2, ez(p)), oz = lerp(0.4, 2.6, ez(p)); dog(CD[0], 0, CD[2], 2.5, 1.1, Object.assign({ pose: 'lie', sad: 1, dip: 0.25, look: -0.3, wag: 0 }, GD)); wrapper(1.5, 5.1); warn3d(1.5, 1.9 + Math.sin(T * 3) * 0.08, 5.1, 0.45); OW(ox, oz, Math.atan2(CD[0] - ox, CD[2] - oz), { walk: T * 6, amp: 0.6 }); }
    if (i === 1) { dog(0.2, 0, 5, Math.PI, 1.1, Object.assign({ pose: 'lie', sad: 1, wag: 0 }, GD)); OW(1.3, 4.2, Math.PI, { armR: -1.2, armL: -0.3, item: [255, 70, 90], bend: 0.2 }); }
    if (i === 2) { dog(0.2, 0, 5, Math.PI, 1.1, Object.assign({ pose: 'lie', look: 0.2, wag: T * 2 }, GD)); OW(1.3, 4.2, Math.PI, { phone: 1, armR: -1.2 }); }
    if (i === 3) { dog(0.2, 0, 5, Math.PI, 1.1, Object.assign({ pose: 'lie', dip: -0.2, wag: 0 }, GD)); OW(1.3, 4.2, Math.PI, { armR: -1.5 + Math.sin(T * 8) * 0.15, armL: -1.5 - Math.sin(T * 8) * 0.15 }); prism(3.2, 0.89, 6.2, 0.14, 0.5, 8, [80, 170, 255], null, 0.1); prism(3.2, 1.39, 6.2, 0.07, 0.1, 6, [250, 250, 250]); xmark(3.2, 2.2, 6.2, 0.8); }
    if (i === 4) {
      const k = ez(wn(p, 0.35, 1)), mvg = k > 0 && k < 1 ? 1 : 0;
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) box(3.0 + a * 0.28, 0.93, 5.9 + b * 0.22, 0.24, 0.06, 0.18, [74, 40, 28]); if (p < 0.5) warn3d(3.4, 1.9, 6.0, 0.4);
      OW(lerp(1.2, 5, k), 4.2, FC, { walk: T * 7, amp: 0.7 * mvg }); dog(lerp(2.4, 5.8, k), 0, 4.9, FC, 1.1, Object.assign({ pose: 'stand', walk: T * 10, wag: T * 8, amp: 0.6 * mvg }, GD));
    }
  },
  sfx: [[['whimper', 0.4], ['steps', 0.2]], [['whimper', 0.5]], [['ping', 0.3]], [['heart', 0.1]], [['door', 0.75], ['chime', 0.8, 'D5']]],
  root: ['A2', 'E3', 'C4'],
};

// =====================================================================
//  STORY 6: Hit an animal on the road
// =====================================================================
const DOGP = [4.6, 0, 15];
const ROAD = {
  id: 'road', title: 'Hit an Animal',
  caption: 'You hit an animal with your car: what to do, step by step. Save this, it could help an animal. 🚗',
  tags: '#roadsafety #animalrescue #wildlife #pets #howto #shorts', footer: 'General advice. Your safety comes first. Rules and who to call differ by region.',
  beats: [
    { d: 4.8, vo: 'You hit an animal with your car. What now?', tags: [{ t: [0, 0.95], text: 'STAY SAFE FIRST', y: 330, size: 72, bg: '#ff8a3d' }] },
    { d: 4.6, vo: 'Pull over safely, and switch on your hazard lights.', tags: [{ t: [0.05, 0.95], text: 'HAZARD LIGHTS ON', y: 330, size: 62, bg: '#ffd23f' }] },
    { d: 5, vo: 'Check for traffic before you step out. Your safety comes first.', tags: [{ t: [0.05, 0.95], text: 'CHECK TRAFFIC FIRST', y: 330, size: 60, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 6.6, vo: 'A scared animal may bite, so do not touch it bare-handed. Call animal control or the police.', tags: [{ t: [0.05, 0.5], text: "DON'T TOUCH IT", y: 330, size: 74, bg: '#ff4d4d', col: '#ffffff' }, { t: [0.55, 1], text: 'CALL ANIMAL CONTROL', y: 330, size: 58, bg: '#7cc4ff' }] },
    { d: 5.2, vo: 'Hit an animal? Stay safe first, then call for help.', tags: [{ t: [0.05, 0.95], text: 'CALL FOR HELP', y: 330, size: 76, bg: '#7cf2c0' }] },
  ],
  build() {
    const xs = [-70, -50, -36, -24, -14, -8, -5, 5, 8, 14, 24, 36, 50, 70], zs = []; for (let z = -50; z <= 70; z += 8) zs.push(z); for (let z = 86; z <= 170; z += 16) zs.push(z);
    groundG(xs, zs, () => 0, (x, z) => (Math.abs(x) < 5 ? [84, 90, 126] : Math.abs(x) < 8 ? [226, 200, 160] : (Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [96, 206, 104] : [78, 190, 92]), 23);
    for (let z = -48; z < 70; z += 6) strip(-0.12, 0.12, z, z + 3, [255, 236, 120], 0.03, -5); for (let z = -50; z < 70; z += 8) { strip(-4.9, -4.75, z, z + 8, [255, 255, 255], 0.03, -5); strip(4.75, 4.9, z, z + 8, [255, 255, 255], 0.03, -5); }
    const r = rng(31), leaf = [[60, 190, 96], [96, 208, 70], [255, 170, 60], [44, 172, 124]]; for (let k = 0; k < 22; k++) { const side = r() < 0.5 ? -1 : 1; roundTree(side * (11 + r() * 30), -30 + r() * 90, 0.9 + r() * 0.7, leaf[k % 4]); }
    [-20, 0, 20, 40].forEach((z) => { prism(-9, 0, z, 0.12, 7, 5, [90, 70, 60]); box(-9, 6.8, z, 2.4, 0.15, 0.15, [90, 70, 60]); });
    [[-80, 160, 56, 30, [150, 110, 200]], [10, 175, 70, 36, [130, 120, 220]], [90, 160, 50, 26, [170, 110, 190]]].forEach(([x, z, rr, h, c]) => mountain(x, z, rr, h, c)); cloud(-40, 66, 170, 1.2); cloud(60, 74, 190, 1.4);
  },
  env: () => ({ top: [70, 70, 210], bot: [255, 170, 110], fog: [255, 190, 160], sunCol: [255, 180, 120], glow: '255,160,100', sat: 1.3, amb: [0.66, 0.64, 0.76], bright: 1.04, fogNear: 50, fogFar: 230 }),
  cam(i, p) {
    if (i === 0) return { pos: [3.4, 0.9, 18.5], tg: [5.2, 0.9, 6] };
    if (i === 1) return { pos: [-6, 1.8, 0], tg: [2, 1.2, 8] };
    if (i === 2) return { pos: [4.8, 1.5, 0.2], tg: [6.8, 1.3, 7] };
    if (i === 3) return { pos: [1.8, 1.5, 9.8], tg: [5.2, 0.8, 14] };
    return { pos: [0.5, 2.0, 1.2], tg: [5.4, 1.2, 11] };
  },
  dyn(T, i, p) {
    const hurtDog = () => dog(DOGP[0], 0, DOGP[2], 1.2, 0.95, { pose: 'lie', sad: 1, col: [150, 98, 60], col2: [220, 170, 110], wag: 0 });
    if (i === 0) { car(6.2, 0, 6, 0.12, 1, { haz: 1, T }); hurtDog(); person(8.2, 0, 6.6, Math.PI, 1, { armL: -2.6, armR: -2.6, shirt: [70, 140, 255], pants: [50, 50, 80] }); }
    if (i === 1) { const k = ez(wn(p, 0.2, 0.8)); car(lerp(-1.8, 6.2, k), 0, lerp(-14, 6, eo(p)), lerp(0, 0.12, k), 1, { haz: 1, T }); hurtDog(); }
    if (i === 2) { car(6.2, 0, 3.4, 0.12, 1, { haz: 1, T }); car(-2, 0, lerp(-26, 42, wn(p, 0.1, 0.55)), 0, 1, { col: [70, 150, 255] }); const g = ez(wn(p, 0.55, 0.7)); person(8.2, 0, lerp(6.2, 7.6, wn(p, 0.7, 1)), lerp(Math.PI, 0, g), 1, { shirt: [70, 140, 255], pants: [50, 50, 80], walk: T * 4, amp: g > 0 ? 0.4 : 0 }); hurtDog(); }
    if (i === 3) { car(6.2, 0, 6, 0.12, 1, { haz: 1, T }); hurtDog(); person(6.8, 0, 11.6, Math.atan2(-2.2, 3.4), 1, { bend: 0.3, phone: p > 0.45 ? 1 : 0, armR: p > 0.45 ? -1.2 : null, shirt: [70, 140, 255], pants: [50, 50, 80] }); }
    if (i === 4) { const z = lerp(-10, 10.5, eo(wn(p, 0, 0.8))); van(6.2, 0, z, 0, 1, { T }); hurtDog(); const k = ez(wn(p, 0.65, 1)); if (p > 0.6) person(lerp(7.8, 5.6, k), 0, lerp(9.4, 13.4, k), lerp(0.4, 0.1, k), 1, { shirt: [40, 110, 235], pants: [30, 50, 100], hat: [255, 255, 255], walk: T * 6, amp: k < 1 ? 0.6 : 0 }); }
  },
  sfx: [[['beep', 0], ['wind', 0, 4.8]], [['car', 0.1], ['beep', 0.4]], [['car', 0.45], ['heart', 0.1]], [['whimper', 0.2], ['beep', 0]], [['car', 0.1], ['chime', 0.8, 'D5']]],
  root: ['E2', 'B2', 'D3'],
};

// =====================================================================
//  STORY 7: Hachiko (true story)
// =====================================================================
const DS = [2.2, 0, 20.5], SEASON = (u) => (u < 0.5 ? mixc([96, 200, 84], [255, 176, 40], u * 2) : mixc([255, 176, 40], [200, 100, 52], (u - 0.5) * 2)), HK = { col: [250, 238, 214], col2: [226, 176, 110], ears: 'up' };
const HE = { dusk: { top: [60, 50, 160], bot: [255, 150, 120], fog: [250, 170, 150], sunCol: [255, 190, 150], glow: '255,170,130' }, morn: { top: [70, 160, 255], bot: [255, 232, 190], fog: [250, 230, 210], sunCol: [255, 238, 205], glow: '255,238,200' }, gold: { top: [100, 110, 230], bot: [255, 200, 140], fog: [255, 205, 160], sunCol: [255, 214, 160], glow: '255,210,150' } };
const HACHI = {
  id: 'hachi', title: 'Hachiko',
  caption: 'The true story of Hachiko, the dog who waited almost ten years for his owner. 🐕 (Based on a documented true story, told briefly.)',
  tags: '#hachiko #truestory #dogs #loyalty #animalstories #shorts', footer: 'Based on the documented true story of Hachiko (Tokyo, 1923-1935), told briefly.',
  beats: [
    { d: 5, vo: 'He waited almost ten years for someone who never returned.', tags: [{ t: [0, 0.95], text: '9 YEARS · 9 MONTHS', y: 330, size: 62, bg: '#ffd23f' }] },
    { d: 4.6, vo: 'In Tokyo, Hachiko met his owner at the station every evening.', tags: [{ t: [0.05, 0.9], text: 'TOKYO', y: 330, size: 92, bg: '#ff8a9a' }] },
    { d: 4.4, vo: 'Then in 1925, his owner died at work and never came back.', tags: [{ t: [0.1, 0.9], text: '1925', y: 330, size: 100, bg: '#b9c4ff' }] },
    { d: 5, vo: 'But Hachiko kept returning to the same spot, day after day.', tags: [{ t: [0.1, 1], text: (p) => 'DAY ' + (1 + Math.floor(3499 * eo(wn(p, 0.12, 0.92)))).toLocaleString('en-US'), y: 330, size: 84, bg: '#ffd23f' }] },
    { d: 7, vo: 'Today a statue of Hachiko stands at that station. He waited almost ten years, and Tokyo never forgot him.', tags: [{ t: [0.05, 0.95], text: 'HIS STATUE STANDS TODAY', y: 330, size: 54, bg: '#7cf2c0' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, () => 0, (x, z) => (Math.abs(x) > 30 || z > 52 ? [110, 200, 120] : z > 31 ? [160, 156, 184] : (Math.floor(x / 5) + Math.floor(z / 5)) & 1 ? [190, 184, 208] : [204, 198, 220]), 11);
    box(0, 3.5, 36, 22, 7, 8, [224, 104, 78]); box(0, 7.4, 36, 24, 0.8, 10, [74, 58, 82]); box(0, 10.4, 36, 5, 6, 5, [224, 104, 78]); box(0, 13.6, 36, 6.4, 0.8, 6.4, [74, 58, 82]); box(0, 10.6, 33.4, 3.6, 3.6, 0.2, [250, 246, 235]); box(0, 10.9, 33.28, 0.18, 1.2, 0.1, [40, 30, 40]); box(0.45, 10.6, 33.28, 0.9, 0.18, 0.1, [40, 30, 40]);
    box(0, 1.6, 31.9, 4, 3.2, 0.3, [58, 36, 40]); [-7, -3.6, 3.6, 7].forEach((x) => box(x, 3.6, 31.9, 2, 2.2, 0.2, [255, 218, 140], null, { emissive: 1 })); box(0, 0.5, 47, 70, 1, 3, [110, 110, 140]);
    [-14, 14, -26, 26].forEach((x) => { prism(x, 0, 8, 0.15, 5, 6, [60, 60, 80]); ico(x, 5.3, 8, 0.45, [255, 226, 160], null, 1, { emissive: 1 }); });
    building(-34, 70, 18, 14, 40, [150, 130, 230]); building(-8, 76, 16, 14, 54, [110, 170, 240]); building(22, 72, 18, 14, 44, [230, 120, 170]); building(48, 78, 16, 14, 34, [120, 210, 190]);
  },
  env(i, T, p) { const e = [HE.dusk, HE.gold, HE.dusk, HE.morn, HE.gold][i], o = Object.assign({ sat: 1.3, amb: [0.66, 0.64, 0.74], bright: 1.04, fogNear: 40, fogFar: 200 }, e); if (i === 2) o.bright = lerp(1, 0.62, p); if (i === 3) o.bright = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(p * TAU * 7)); return o; },
  cam(i, p) {
    if (i === 0) return { pos: [lerp(2, 5, ez(p)), lerp(0.5, 2.4, ez(p)), lerp(17.2, 10.5, ez(p))], tg: [2.2, 0.65, 20.5] };
    if (i === 1) return { pos: [lerp(-4, -2, p), 1.4, 14], tg: [4, 1, 24] };
    if (i === 2) return { pos: [lerp(-1.5, 0.8, p), 1.1, lerp(16, 18.4, p)], tg: lerp3([2.2, 0.8, 20.5], [1, 1.6, 32], ez(p)) };
    if (i === 3) return { pos: [lerp(-3, 3, p), 1.6, 13.5], tg: [2.2, 1.0, 20.5] };
    const a = lerp(-0.7, 0.9, ez(p)); return { pos: [DS[0] + Math.sin(a) * 7, lerp(1.6, 3.2, p), DS[2] - Math.cos(a) * 7], tg: [DS[0], 1.5, DS[2]] };
  },
  dyn(T, i, p, TL) {
    const bt = T - TL.E[i], fol = i === 3 ? SEASON(p) : [255, 176, 40];
    [[-22, 10], [-14, 14], [16, 14], [26, 10], [-30, 24], [32, 22]].forEach(([x, z], k) => roundTree(x, z, 1 + (k % 3) * 0.12, fol));
    const tx = i === 1 ? lerp(-100, 6, eo(p)) : 6; [0, 1, 2].forEach((k) => { box(tx - k * 15, 1.9, 44, 14, 3.2, 3, k % 2 ? [236, 230, 214] : [220, 70, 60]); box(tx - k * 15, 2.4, 42.45, 12, 1, 0.1, [150, 200, 240], null, { emissive: 1 }); });
    const walkers = (n, spd) => { for (let k = 0; k < n; k++) { const dn = k % 2 ? 1 : -1, z0 = 5 + (k % 4) * 2.4, x = ((((T * spd * dn + k * 11.7) % 60) + 60) % 60) - 30; if (Math.abs(x - DS[0]) < 1.8 && Math.abs(z0 - DS[2]) < 2.5) continue; person(x, 0, z0, dn > 0 ? Math.PI / 2 : -Math.PI / 2, 1, { walk: T * 6 + k, shirt: PAL[k % 5], pants: [50, 50, 70] }); } };
    const crowd = (sp) => { for (let k = 0; k < 8; k++) { const z = 31.2 - (((bt * sp + k * 3.3) % 26)), x = [-12, -9, -7, 7, 10, -10, 9, 6.5][k] + (k % 3 ? 0 : 1.2); if (z < 20 || Math.abs(x) < 4.5) continue; person(x, 0, z, Math.PI, 1, { walk: T * 6 + k, shirt: PAL[k % 5], pants: [50, 50, 70], dress: k % 4 === 3 ? [220, 100, 150] : null }); } };
    if (i === 0) { dog(DS[0], 0, DS[2], Math.PI, 1.15, Object.assign({ pose: 'lie', wag: T * 1.5 }, HK)); walkers(2, 1.2); shadow(DS[0], DS[2], 0.8, 1, 0); }
    if (i === 1) {
      const k = ez(wn(p, 0.05, 0.6)), mx = lerp(8, 3.6, k), mz = lerp(31.5, 22.4, k), at = wn(p, 0.6, 0.78), dk = ez(wn(p, 0.3, 0.65)), dp = lerp3(DS, [2.9, 0, 22.2], dk);
      person(mx, 0, mz, Math.atan2(DS[0] - mx, DS[2] - mz), 1, { walk: T * 6, amp: k < 1 ? 0.7 : 0, shirt: [70, 90, 170], pants: [50, 50, 70], hair: [210, 210, 215], hat: [90, 90, 120], bend: lerp(0, 0.9, at), armR: at > 0 ? -1 : null });
      dog(dp[0], 0, dp[2], Math.atan2(mx - dp[0], mz - dp[2]), 1.15, Object.assign({ walk: T * 10 * (1 - dk), amp: 0.6, wag: T * 9, tongue: 1 }, HK)); walkers(3, 1);
    }
    if (i === 2) { dog(DS[0], 0, DS[2], 0, 1.15, Object.assign({ pose: 'lie', sad: 1, wag: 0 }, HK)); crowd(3.2); ico(4, 5.3, 18, 0.5, [255, 226, 160], null, 1, { emissive: 1 }); }
    if (i === 3) { dog(DS[0], 0, DS[2], 0, 1.15, Object.assign({ pose: 'lie', wag: T * 1.5 }, HK)); crowd(7); }
    if (i === 4) {
      const k = ez(wn(p, 0.05, 0.6)), h = 1.2 * k; prism(DS[0], 0, DS[2], 1.2, h, 6, [160, 156, 170], null, 1.0);
      dog(DS[0], h, DS[2], 0, 1.15, { pose: 'stand', ears: 'up', col: mixc(HK.col, [214, 170, 66], k), col2: mixc(HK.col2, [176, 130, 40], k) });
      [[-3.6, 2.6, 0.6], [3.4, 2.4, -0.7], [-2.6, -3.2, 2.2], [3.8, -2.8, 3.4]].forEach(([dx, dz, f], q) => person(DS[0] + dx, 0, DS[2] + dz, Math.atan2(-dx, -dz) + f * 0.1, 1, { shirt: PAL[q], pants: [50, 50, 70], armR: q === 0 ? -1.2 : null, dress: q === 2 ? [220, 100, 150] : null }));
      [[-1.6, 1.8], [1.4, 1.9]].forEach(([dx, dz], q) => ico(DS[0] + dx, 0.3, DS[2] - dz, 0.28, [[255, 90, 100], [255, 220, 80]][q], null, 0.8)); if (p > 0.6) heart3d(DS[0], 3.4 + Math.sin(T * 2) * 0.1, DS[2], 0.35);
    }
  },
  sfx: [[['chime', 0.1, 'A4'], ['wind', 0, 5]], [['train', 0.1], ['steps', 0.3]], [['chime', 0.1, 'A3'], ['steps', 0.3]], [['steps', 0.05], ['chime', 0.7, 'D5']], [['chime', 0.2, 'A4'], ['chime', 0.35, 'E5'], ['chime', 0.5, 'A5']]],
  root: ['A2', 'E3', 'C4'],
};

// =====================================================================
//  STORY 8: Bobbie the Wonder Dog (true story)
// =====================================================================
const BOB = { col: [214, 134, 60], col2: [255, 255, 255], ears: 'up' }, SNOW_E = { top: [110, 160, 235], bot: [236, 244, 255], fog: [222, 234, 252], sunCol: [235, 240, 255], glow: '235,244,255' };
const BOBBIE = {
  id: 'bobbie', title: 'Bobbie Comes Home',
  caption: 'The true story of Bobbie the Wonder Dog, who walked about 2,500 miles to get home. 🐕 (Based on a documented true story, told briefly.)',
  tags: '#bobbie #truestory #dogs #loyalty #animalstories #shorts', footer: 'Based on the documented 1923-24 story of Bobbie the Wonder Dog (Indiana to Oregon), told briefly. Distance is approximate.',
  beats: [
    { d: 4.4, vo: 'This dog walked 2,500 miles to get home.', tags: [{ t: [0, 0.95], text: '2,500 MILES', y: 330, size: 96, bg: '#ffd23f' }] },
    { d: 5, vo: 'In 1923, Bobbie got lost on a family road trip in Indiana.', tags: [{ t: [0.05, 0.95], text: '1923', y: 330, size: 100, bg: '#ffb86b' }] },
    { d: 5.2, vo: 'His family searched, then gave up and drove home to Oregon.', tags: [{ t: [0.05, 0.95], text: 'THEY SEARCHED', y: 330, size: 78, bg: '#b9c4ff' }] },
    { d: 5.2, vo: 'Six months later, a thin, tired dog showed up at their door.', tags: [{ t: [0, 0.95], text: '6 MONTHS LATER', y: 330, size: 70, bg: '#7cc4ff' }] },
    { d: 5.6, vo: 'It was Bobbie. He had walked about 2,500 miles to get home.', tags: [{ t: [0.1, 0.95], text: 'HOME', y: 330, size: 110, bg: '#ff8aa8' }] },
  ],
  build() {
    [[-90, 200, 60, 40, [150, 170, 240]], [-30, 225, 52, 36, [160, 150, 240]], [48, 215, 72, 46, [140, 170, 245]], [112, 195, 50, 32, [170, 160, 240]]].forEach(([x, z, r2, h, c]) => mountain(x, z, r2, h, c));
    const r = rng(14); for (let k = 0; k < 44; k++) { const side = r() < 0.5 ? -1 : 1; pineSnow(side * (7 + r() * 40), -25 + r() * 120, 0.9 + r() * 0.7); }
    cloud(-50, 70, 180, 1.2); cloud(60, 80, 200, 1.4);
  },
  env(i) { if (i === 0) return Object.assign({ sat: 1.25, amb: [0.72, 0.76, 0.86], bright: 1.06, fogNear: 40, fogFar: 200 }, SNOW_E); if (i === 1 || i === 2) return { top: [60, 150, 255], bot: [255, 226, 170], fog: [255, 224, 180], sunCol: [255, 220, 170], glow: '255,220,160', sat: 1.3, amb: [0.68, 0.68, 0.76], bright: 1.05, fogNear: 50, fogFar: 220 }; if (i === 3) return { top: [24, 28, 110], bot: [96, 80, 170], fog: [90, 80, 150], sunCol: [150, 170, 255], glow: '120,130,255', sat: 1.3, amb: [0.55, 0.58, 0.8], bright: 0.95, fogNear: 30, fogFar: 160 }; return { top: [96, 70, 190], bot: [255, 170, 120], fog: [255, 190, 160], sunCol: [255, 190, 140], glow: '255,180,120', sat: 1.3, amb: [0.7, 0.66, 0.76], bright: 1.04, fogNear: 40, fogFar: 180 }; },
  cam(i, p, T, TL) {
    if (i === 0) { const z = lerp(-4, 22, p); return { pos: [7.5, 1.5, z], tg: [0, 1, z + 1.5] }; }
    if (i === 1) return { pos: [0, 1.2, 0], tg: [0, 1, 18] };
    if (i === 2) return { pos: [-4.5, 1.7, 4], tg: [2, 1.2, 12] };
    if (i === 3) return { pos: [1.8, 1.2, lerp(4, 12, ez(p))], tg: [0, 1.2, 24] };
    return { pos: [3, 1.5, 17.8], tg: [0, 1, 24.5] };
  },
  dyn(T, i, p, TL) {
    const gc = (x, z) => (i === 1 || i === 2 ? ((Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [244, 196, 96] : [232, 180, 80]) : Math.abs(x) < 3.5 ? [214, 226, 248] : (Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [240, 247, 255] : [226, 238, 255]);
    groundG(XS_A, ZS_A, () => 0, gc, 33);
    const cz = i === 0 ? lerp(-4, 22, p) : i === 3 ? lerp(4, 12, ez(p)) : 12;
    if (i === 0 || i === 3 || i === 4) for (let k = 0; k < 34; k++) ico(((k * 37) % 19) - 9.5, 8 - ((T * 2.2 + k * 0.173) % 1) * 8, cz + ((k * 53) % 23) - 6, 0.06, [255, 255, 255], null, 1, { emissive: 1 });
    const FAM = { dad: { shirt: [60, 140, 230], pants: [50, 50, 80] }, kid: { shirt: [255, 200, 50], pants: [200, 60, 100] } };
    if (i === 0) { const z = lerp(-4, 22, p); dog(0.2, 0, z, 0, 1.15, Object.assign({ walk: T * 9, amp: 0.5, wag: 0, dip: 0.15 }, BOB)); shadow(0.2, z, 0.6, 1, 0); }
    if (i === 1) {
      const z = lerp(22, 8, ez(p)); car(3.5, 0, 30, 0.1, 1, { col: [60, 140, 255] }); person(1.6, 0, 29, 1.2, 0.8, Object.assign({ armR: -2.6 + Math.sin(T * 6) * 0.3 }, FAM.dad)); person(0.2, 0, 31, 0.4, 0.7, Object.assign({ armR: -2.6 + Math.sin(T * 6 + 1) * 0.3, dress: [230, 90, 150] }, {}));
      dog(0.4, 0, z, Math.PI, 1.15, Object.assign({ walk: T * 9, amp: 0.5, wag: 0, sad: 1, look: Math.sin(T * 1.5) * 0.4 }, BOB)); shadow(0.4, z, 0.6, 1, 0);
    }
    if (i === 2) {
      const g = ez(wn(p, 0.65, 0.85)), cz2 = lerp(12, 12 + 40 * Math.pow(wn(p, 0.8, 1), 2), 1); car(4, 0, cz2, 0, 1, { col: [60, 140, 255] });
      if (p < 0.85) { [[1.6, 10], [2.8, 13], [-0.2, 12]].forEach(([x, z], k) => person(lerp(x, 4, g), 0, lerp(z, 12, g), Math.sin(T * 1.2 + k) * 1.2 + (k === 2 ? 0 : 1), k === 2 ? 0.7 : 1, Object.assign({ armL: -2.6, armR: -2.6, walk: T * 5, amp: g > 0 && g < 1 ? 0.5 : 0 }, k === 2 ? FAM.kid : FAM.dad))); }
      dog(-14, 0, 34, 0.6, 1.15, Object.assign({ walk: T * 7, amp: 0.4 }, BOB));
    }
    if (i >= 3) cabin(0, 30);
    const door = (a) => box(0.7, 1.2, 0, 1.4, 2.4, 0.12, [130, 76, 44], comp(rotY(-a), mv(-0.7, 0, 26.5)));
    if (i === 3) { const z = lerp(8, 23.5, ez(p)); dog(0, 0, z, 0, 1.15, Object.assign({ walk: T * 5, amp: 0.4, dip: 0.3, sad: 1 }, BOB)); const op = ez(wn(p, 0.7, 0.9)); door(op * 1.4); if (p > 0.8) person(0, 0, 25.8, Math.PI, 1, { dress: [230, 90, 150], armR: -2.5, armL: -2.5 }); }
    if (i === 4) {
      door(1.4); dog(0, Math.abs(Math.sin(T * 5)) * 0.3, 23.4, 0, 1.15, Object.assign({ wag: T * 14, tongue: 1, pose: 'stand' }, BOB)); person(-1.5, 0, 25.4, Math.PI, 1, Object.assign({ armL: -1.2, armR: -1.2, bend: 0.6 }, FAM.dad)); person(1.5, 0, 25.6, Math.PI, 1, { dress: [230, 90, 150], armL: -1.2, armR: -1.2, bend: 0.6 }); person(0, 0, 26.0, Math.PI, 0.65, Object.assign({ armL: -1.2, armR: -1.2 }, FAM.kid));
      for (let k = 0; k < 7; k++) heart3d(Math.sin(k * 2.3) * 1.4, 2.2 + ((T * 0.6 + k * 0.31) % 1) * 2.5, 24.6 + Math.cos(k * 1.7) * 0.8, 0.3);
    }
  },
  sfx: [[['wind', 0, 4.4]], [['car', 0.4], ['whimper', 0.1]], [['steps', 0.2], ['car', 0.8]], [['wind', 0, 5.2], ['knock', 0.75]], [['bark', 0.1], ['chime', 0.5, 'D5'], ['chime', 0.65, 'F#5']]],
  root: ['D3', 'A3', 'F4'],
};

// =====================================================================
//  STORY 9: Do elephants grieve? (savanna)
// =====================================================================
const SK = [0, 0, 8], SAV = { top: [90, 60, 210], bot: [255, 170, 90], fog: [255, 190, 120], sunCol: [255, 192, 112], glow: '255,170,90', sat: 1.3, amb: [0.68, 0.64, 0.78], bright: 1.04, fogNear: 50, fogFar: 230 };
const ELEPH = {
  id: 'elephant', title: 'Do Elephants Grieve',
  caption: 'Do elephants grieve? Here is what scientists have observed. 🐘',
  tags: '#elephants #animalbehavior #wildlife #animalfacts #nature #shorts', footer: 'Based on published observations of elephant behavior. Scientists cannot read animals\' minds, so conclusions about feelings are interpretations.',
  beats: [
    { d: 4.4, vo: 'Elephants visit the bones of their dead.', tags: [{ t: [0, 0.95], text: 'DO ELEPHANTS GRIEVE?', y: 330, size: 58, bg: '#ffd23f' }] },
    { d: 5, vo: 'Studies show they pay special attention to the skulls of their own kind.', tags: [{ t: [0.05, 0.95], text: 'THEY TOUCH THE BONES', y: 330, size: 60, bg: '#ffb86b' }] },
    { d: 5, vo: 'They also comfort upset friends, touching them gently with their trunks.', tags: [{ t: [0.05, 0.95], text: 'THEY COMFORT FRIENDS', y: 330, size: 60, bg: '#ff8aa8' }] },
    { d: 5.2, vo: 'Their families are tight, led by a matriarch, and bonds can last for decades.', tags: [{ t: [0.05, 0.95], text: 'DEEP BONDS', y: 330, size: 88, bg: '#7cf2c0' }] },
    { d: 6, vo: "We can't read their minds, but elephants do return to the bones of their dead.", tags: [{ t: [0.05, 0.95], text: 'REAL FEELINGS?', y: 330, size: 76, bg: '#b9a0ff' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, (x, z) => Math.sin(x * 0.07) * Math.cos(z * 0.06) * 0.5, (x, z) => ((Math.floor(x / 10) + Math.floor(z / 10)) & 1 ? [246, 206, 100] : [236, 190, 86]), 55);
    const r = rng(6); for (let k = 0; k < 40; k++) { const x = -50 + r() * 100, z = -10 + r() * 90; cone(x, 0, z, 0.4, 1.2, 5, [120, 200, 82]); cone(x + 0.3, 0, z + 0.2, 0.3, 0.9, 5, [150, 214, 90]); }
    [[-18, 20], [22, 26], [-30, 40], [34, 44], [-8, 52], [12, 60], [-40, 16], [40, 12]].forEach(([x, z], k) => acacia(x, z, 1 + (k % 3) * 0.2)); baobab(-24, 70, 1.4); baobab(30, 80, 1.1);
    [[-90, 190, 50, 22, [214, 120, 140]], [-20, 210, 60, 28, [190, 110, 180]], [60, 200, 56, 24, [220, 130, 130]]].forEach(([x, z, rr, h, c]) => cone(x, 0, z, rr, h, 7, c)); ell(48, 14, 200, 12, 12, 2, [255, 214, 140], null, { emissive: 1 }); cloud(-40, 60, 170, 1.2);
    skull(SK[0], 0, SK[2], 0.9, 0.3); rock(-4, 6, 0.7, [190, 140, 120], 3); rock(5, 9, 0.9, [200, 150, 120], 4);
  },
  env: () => SAV,
  cam(i, p, T, TL) {
    if (i === 0) return { pos: [4, 1.2, 3], tg: [0, 1.2, 9] };
    if (i === 1) return { pos: [3.2, 0.8, 6.8], tg: [0, 0.7, 8.6] };
    if (i === 2) return { pos: [-0.4, 1.6, -1.6], tg: [0, 1.8, 9] };
    if (i === 3) { const xm = lerp(-10, 12, p); return { pos: [xm - 1, 1.5, 3.5], tg: [xm + 1.5, 1.7, 12] }; }
    return { pos: [lerp(3, 13, p), lerp(1.4, 5, p), lerp(5, -3, p)], tg: [0, 1.6, 10] };
  },
  dyn(T, i, p, TL) {
    if (i === 0) { const z = lerp(30, 11.5, ez(p)), tt = lerp3([0, 0.3, 3.0], [0, 0.8, 3.4], ez(wn(p, 0.7, 1))); elephant(0, 0, z, Math.PI, 1, T, { walk: T * 2.2, amp: p < 0.9 ? 0.35 : 0.05, tt }); elephant(-6, 0, 26, Math.PI * 0.9, 0.9, T, { walk: T * 2, amp: 0.3 }); elephant(6, 0, 30, Math.PI * 1.1, 0.5, T, { walk: T * 3, amp: 0.3 }); shadow(0, z, 2, 3, Math.PI); }
    if (i === 1) { elephant(0, 0, 11.5, Math.PI, 1, T, { dip: 0.12, tt: [Math.sin(T * 0.9) * 0.5, 0.7 + Math.sin(T * 1.8) * 0.08, 3.4], amp: 0 }); shadow(0, 11.5, 2, 3, Math.PI); }
    if (i === 2) { elephant(-1.5, 0, 10, Math.PI, 1, T, { tt: [-2.0, 2.0 + Math.sin(T * 1.2) * 0.08, 2.6], amp: 0 }); elephant(1.2, 0, 10, Math.PI, 1, T, { dip: 0.15, amp: 0 }); elephant(-0.2, 0, 6.2, Math.PI, 0.45, T, { amp: 0 }); heart3d(0, 5.2, 8.5, 0.4 + 0.05 * Math.sin(T * 3)); shadow(-1.5, 10, 2, 3, Math.PI); shadow(1.2, 10, 2, 3, Math.PI); }
    if (i === 3) { const xm = lerp(-10, 12, p), w = T * 2.2; elephant(xm, 0, 12, FC, 1.05, T, { walk: w, amp: 0.35 }); elephant(xm - 4.8, 0, 12.8, FC, 0.95, T, { walk: w + 1, amp: 0.35 }); elephant(xm - 8.2, 0, 11.2, FC, 0.9, T, { walk: w + 2, amp: 0.35 }); elephant(xm - 6.4, 0, 10.2, FC, 0.45, T, { walk: w * 1.6, amp: 0.4 }); }
    if (i === 4) { elephant(0, 0, 11.5, Math.PI, 1, T, { dip: 0.1, tt: [0, 0.8, 3.4], amp: 0 }); shadow(0, 11.5, 2, 3, Math.PI); for (let k = 0; k < 20; k++) ico(-10 + ((k * 7) % 21), 1 + ((T * 0.3 + k * 0.17) % 1) * 4, 4 + ((k * 5) % 14), 0.05, [255, 226, 150], null, 1, { emissive: 1 }); if (p > 0.4) heart3d(0, 3.9 + Math.sin(T * 2) * 0.1, 8.6, 0.45); }
  },
  sfx: [[['wind', 0, 4.4], ['trumpet', 0.4]], [['rumble', 0.2]], [['rumble', 0.1], ['heart', 0.5]], [['steps', 0.05], ['rumble', 0.3]], [['wind', 0, 6], ['chime', 0.7, 'D5']]],
  root: ['C3', 'G3', 'E4'],
};

// =====================================================================
//  STORY 10: The cat slow blink (living room)
// =====================================================================
const CATP = { col: [255, 150, 44] };
const CATS = {
  id: 'cat', title: 'The Cat Slow Blink',
  caption: 'Cats have a secret way to say I love you: the slow blink. Try it today! 🐱',
  tags: '#cats #catbehavior #petcare #catlove #animalfacts #shorts', footer: 'Based on research on cat-human communication. Every cat is different, so go slowly and let your cat choose.',
  beats: [
    { d: 4.4, vo: 'Cats have a secret way to say I love you.', tags: [{ t: [0, 0.95], text: 'THE SLOW BLINK', y: 330, size: 80, bg: '#ffd23f' }] },
    { d: 5, vo: "It's called the slow blink. Cats do it when they feel safe and relaxed.", tags: [{ t: [0.05, 0.95], text: 'SLOW BLINK = TRUST', y: 330, size: 62, bg: '#ff8aa8' }] },
    { d: 4.4, vo: 'Look at your cat, then slowly close your eyes.', tags: [{ t: [0.05, 0.95], text: 'CLOSE YOUR EYES SLOWLY', y: 330, size: 52, bg: '#7cf2c0' }] },
    { d: 4.8, vo: 'Then look away. Staring can feel like a threat to a cat.', tags: [{ t: [0.05, 0.95], text: "DON'T STARE", y: 330, size: 88, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 5.6, vo: "Cats often blink back, and come closer. It's how cats say I love you.", tags: [{ t: [0.05, 0.95], text: 'TRY IT TODAY', y: 330, size: 80, bg: '#7cf2c0' }] },
  ],
  build: roomBuild, env: () => ROOM_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [lerp(-2.4, -2.8, p), 1.9, lerp(5.6, 6.4, p)], tg: [-2.8, 1.75, 8.4] };
    if (i === 1) return { pos: [lerp(-2, 1.5, p), 1.0, 2.6], tg: [0.5, 0.8, 5.2] };
    if (i === 2) return { pos: [0, 1.2, lerp(1.2, 1.9, p)], tg: [0, 1.65, 4.2] };
    if (i === 3) return { pos: [3.8, 1.2, 3.6], tg: [0, 0.9, 3.6] };
    return { pos: [lerp(-2.5, 2.5, p), 1.4, 1.6], tg: [0, 0.9, 4.2] };
  },
  dyn(T, i, p, TL) {
    const bt = T - TL.E[i], PR = { shirt: [255, 120, 150], pants: [60, 70, 150], hair: [60, 36, 28] };
    if (i === 0) { const b = slowBlink(T); cat(-2.8, 1.0, 8.4, Math.PI, 1.1, Object.assign({ blink: b, tail: T * 1.5 }, CATP)); if (b > 0.9) heart3d(-2.8, 2.9, 8.2, 0.25); }
    if (i === 1) { const b = slowBlink(T); cat(0.5, 0, 5.2, Math.PI, 1.1, Object.assign({ blink: b, tail: T * 1.5 }, CATP)); if (b > 0.8) { heart3d(0.5, 1.9 + (b - 0.8), 5.1, 0.22); heart3d(0.9, 2.2, 5.1, 0.15); } }
    if (i === 2) { const u = wn(p, 0.15, 0.4), d = wn(p, 0.5, 0.75); person(0, 0, 4.2, Math.PI, 1, Object.assign({ bend: 0.25, blink: u < 1 ? ez(u) : 1 - ez(d) }, PR)); cat(0, 0, 2.6, 0, 1.1, Object.assign({ blink: wn(p, 0.7, 0.85) * (1 - wn(p, 0.9, 1)), tail: T }, CATP)); }
    if (i === 3) { person(0, 0, 4.2, lerp(Math.PI, Math.PI + 1.3, ez(wn(p, 0.1, 0.4))), 1, PR); const k = ez(wn(p, 0.45, 1)); cat(0, 0, lerp(3.0, 3.8, k), 0, 1.1, Object.assign({ pose: k > 0 && k < 1 ? 'stand' : 'sit', walk: T * 7, blink: slowBlink(T), tail: T * 2 }, CATP)); }
    if (i === 4) { const a = T * 1.4; person(0, 0, 4.2, Math.PI, 1, Object.assign({ blink: slowBlink(T * 0.8) }, PR)); cat(0.6 * Math.cos(a), 0, 4.2 + 0.6 * Math.sin(a), Math.atan2(-Math.sin(a), Math.cos(a)), 1.1, Object.assign({ pose: 'stand', walk: T * 6, tail: T * 2 }, CATP)); for (let k = 0; k < 4; k++) heart3d(Math.sin(k * 2.4) * 0.9, 2.2 + ((T * 0.5 + k * 0.27) % 1) * 1.6, 4.4 + Math.cos(k * 1.9) * 0.6, 0.22); }
  },
  sfx: [[['purr', 0.2]], [['purr', 0], ['meow', 0.6]], [['heart', 0.2]], [['meow', 0.5]], [['purr', 0], ['chime', 0.7, 'D5']]],
  root: ['F3', 'C4', 'A4'],
};


// =====================================================================
//  V3 STORIES: "Did you know" facts and short fictional stories
// =====================================================================
const CROW_O = { back: [44, 44, 56], breast: [64, 64, 78], head: [50, 50, 62], wing: [34, 34, 46], beak: [44, 44, 52], big: 1 };
const crow = (x, y, z, f, s, T, o) => bird(x, y, z, f, s, T, Object.assign({}, CROW_O, o));
const SEA_ENV = { top: [96, 154, 220], bot: [240, 236, 218], fog: [214, 228, 232], sunCol: [255, 244, 220], glow: '255,240,210', sat: 1.1, amb: [0.7, 0.72, 0.8], bright: 1.05, fogNear: 60, fogFar: 260 };
function seaDyn(T) { for (let z = -6; z < 100; z += 6) for (let x = -60; x < 60; x += 6) { const w = (xx, zz) => Math.sin(xx * 0.3 + zz * 0.22 + T * 1.5) * 0.15, a = [x, w(x, z), z], b = [x + 6, w(x + 6, z), z], c = [x, w(x, z + 6), z + 6], d = [x + 6, w(x + 6, z + 6), z + 6], col = mixc([88, 176, 196], [44, 122, 170], cl((z - 6) / 80)); tri(a, c, b, col, { water: 1 }); tri(b, c, d, mixc(col, [255, 255, 255], 0.12), { water: 1 }); } }
const jumpD = (T, ph, x0, dx, z, spd) => { const per = 2.6, fr = 0.8, u = (((T / per + ph) % 1) + 1) % 1; if (u > fr) return null; const q = u / fr, x = x0 + dx * (q - 0.5) * spd, y = 3.2 * Math.sin(Math.PI * q), vy = (3.2 * Math.PI * Math.cos(Math.PI * q)) / fr / per, vx = spd / fr / per; return { x, y, z, ang: Math.atan2(vy, vx), q, dx }; };
const drawJump = (T, j, s) => { if (!j) return; dolphin(j.x, j.y, j.z, j.dx > 0 ? Math.PI / 2 : -Math.PI / 2, s || 1.6, T, { pitch: -j.ang }); if (j.q < 0.1 || j.q > 0.9) ico(j.x, 0.1, j.z, 0.9, [240, 248, 255], null, 0.25); };

// ---------- Did you know: octopus ----------
const OCTO = {
  id: 'octopus', title: 'Octopus Hearts',
  caption: 'Did you know an octopus has three hearts? 🐙',
  tags: '#didyouknow #octopus #oceanlife #animalfacts #sea #shorts', footer: 'Based on marine biology facts about octopus anatomy and blood.',
  beats: [
    { d: 4.4, vo: 'Did you know octopuses have three hearts?', tags: [{ t: [0, 0.95], text: '3 HEARTS', y: 330, size: 100, bg: '#ffd86b' }] },
    { d: 5.4, vo: 'Two pump blood to the gills, and one pumps it to the rest of the body.', tags: [{ t: [0.05, 0.95], text: '2 + 1', y: 330, size: 100, bg: '#ffb0c0' }] },
    { d: 4.6, vo: 'Their blood is blue, because it uses copper to carry oxygen.', tags: [{ t: [0.05, 0.95], text: 'BLUE BLOOD', y: 330, size: 82, bg: '#a8d4ff' }] },
    { d: 5, vo: 'And when an octopus swims, its main heart actually stops beating.', tags: [{ t: [0.05, 0.95], text: 'THE MAIN HEART PAUSES', y: 330, size: 50, bg: '#ffd86b' }] },
    { d: 4.8, vo: 'So yes, an octopus really has three hearts, and blue blood too.', tags: [{ t: [0.05, 0.95], text: '3 HEARTS · BLUE BLOOD', y: 330, size: 54, bg: '#b9f0d0' }] },
  ],
  build() { uwBuild(5); }, env: () => UW_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [lerp(0, 0.8, p), 2.4, lerp(1.2, 3.2, p)], tg: [0, 2.4, 8] };
    if (i === 1) return { pos: [lerp(-1.5, 1.5, p), 2.4, 2.6], tg: [0, 2.2, 8] };
    if (i === 2) return { pos: [lerp(2.5, -2.5, p), 2.2, 3.4], tg: [0, 2.2, 8] };
    if (i === 3) { const x = lerp(-6, 6, p); return { pos: [x * 0.4, 2.8, 2.4], tg: [x, 2.8, 8] }; }
    return { pos: [lerp(-2, 2, p), 2.6, 3], tg: [0, 2.4, 8] };
  },
  dyn(T, i, p) {
    uwDyn(T); const bl = [90, 150, 230];
    if (i !== 3) octopus(0, 0, 8, Math.PI, 1.2, T, {});
    if (i === 0) [[-1.5, 4.0], [0, 4.7], [1.5, 4.0]].forEach(([x, y], k) => { const pop = bk(wn(p, 0.2 + k * 0.18, 0.34 + k * 0.18)); if (pop > 0) heart3d(x, y + Math.sin(T * 3 + k) * 0.08, 8, 0.5 * pop); });
    if (i === 1) { const pl = 1 + 0.12 * Math.sin(T * 6); heart3d(-1.5, 2.4, 7.4, 0.36 * pl, [240, 150, 176]); heart3d(1.5, 2.4, 7.4, 0.36 * pl, [240, 150, 176]); heart3d(0, 1.9, 7.4, 0.6 * pl); }
    if (i === 2) for (let k = 0; k < 12; k++) { const a = T * 2 + k * 0.52; ico(Math.cos(a) * 1.5, 2.2 + Math.sin(T * 1.5 + k) * 0.5, 8 + Math.sin(a) * 1.2, 0.11, bl, null, 1, { emissive: 1 }); }
    if (i === 3) { const x = lerp(-6, 6, p); octopus(x, 2.8 + Math.sin(T * 3) * 0.2, 8, Math.PI / 2, 1.1, T, { swim: 1 }); heart3d(x, 5.4, 8, 0.4, [160, 160, 172]); box(x - 0.9, 5.4, 7.9, 0.12, 0.45, 0.05, [240, 240, 244], null, { emissive: 1 }); box(x - 1.15, 5.4, 7.9, 0.12, 0.45, 0.05, [240, 240, 244], null, { emissive: 1 }); }
    if (i === 4) { const pl = 1 + 0.1 * Math.sin(T * 5); [[-1.4, 4.0], [0, 4.7], [1.4, 4.0]].forEach(([x, y]) => heart3d(x, y, 8, 0.5 * pl)); for (let k = 0; k < 8; k++) { const a = T * 1.6 + k * 0.79; ico(Math.cos(a) * 1.8, 2.4 + Math.sin(T + k) * 0.5, 8 + Math.sin(a) * 1.3, 0.1, bl, null, 1, { emissive: 1 }); } }
  },
  post: SHARK.post,
  sfx: [[['uw', 0, 4.4], ['heart', 0.3]], [['uw', 0, 5.4], ['heart', 0.1]], [['uw', 0, 4.6], ['bubbles', 0.2]], [['uw', 0, 5], ['whoosh', 0.1]], [['uw', 0, 4.8], ['chime', 0.7, 'D5']]],
  root: ['E2', 'B2', 'G3'],
};

// ---------- Did you know: crows remember faces ----------
const CROWP = [[3.2, 0.8, 7.6, Math.PI], [1.6, 0, 9.2, Math.PI], [-1.8, 0, 10, Math.PI], [4.6, 4.4, 3, Math.PI]];
const CROWS = {
  id: 'crow', title: 'Crows Remember Faces',
  caption: 'Did you know crows can remember human faces? 🐦‍⬛',
  tags: '#didyouknow #crows #animalfacts #birds #smartanimals #shorts', footer: 'Based on published field research on American crows and human faces (University of Washington).',
  beats: [
    { d: 4.4, vo: 'Did you know crows can remember human faces?', tags: [{ t: [0, 0.95], text: 'CROWS REMEMBER FACES', y: 330, size: 56, bg: '#ffd86b' }] },
    { d: 4.6, vo: 'Researchers wore a mask when they briefly caught crows.', tags: [{ t: [0.05, 0.95], text: 'THE MASK TEST', y: 330, size: 80, bg: '#c8b8ff' }] },
    { d: 4.8, vo: 'Soon even crows that were never caught scolded that mask.', tags: [{ t: [0.05, 0.95], text: 'THEY SCOLD THE MASK', y: 330, size: 62, bg: '#ff8f8f', col: '#ffffff' }] },
    { d: 4.6, vo: 'And years later, they still did.', tags: [{ t: [0.05, 0.95], text: 'YEARS LATER', y: 330, size: 84, bg: '#a8d4ff' }] },
    { d: 5, vo: 'So be kind to crows. Crows remember faces.', tags: [{ t: [0.05, 0.95], text: 'BE KIND TO CROWS', y: 330, size: 66, bg: '#b9f0d0' }] },
  ],
  build: parkBuild, env: () => PARK_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [lerp(3.6, 3.2, p), 1.5, 4.4], tg: [3.2, 1.4, 7.6] };
    if (i === 1) return { pos: [-2.5, 1.5, 2], tg: [1.5, 1.1, 8] };
    if (i === 2) return { pos: [-2.5, 1.6, 2.5], tg: [1.2, 1.2, 8.5] };
    if (i === 3) return { pos: [-2.5, 1.6, 2.5], tg: [1.2, 1.2, 8.5] };
    return { pos: [lerp(2.6, 3.4, p), 1.5, 4.6], tg: [3.2, 1.4, 7.6] };
  },
  dyn(T, i, p) {
    const MS = { shirt: [206, 96, 86], pants: [50, 56, 90], mask: [232, 232, 236], shape: 1 }, NO = { shirt: [84, 128, 196], pants: [50, 56, 90], shape: 0 }, caw = (T * 3) % 1 < 0.5;
    const flock = (n, angry) => CROWP.slice(0, n).forEach(([x, y, z, f], k) => crow(x, y, z, f, 2.0, T, { beakOpen: angry && caw ? 1 : 0, dip: angry ? 0.2 + Math.sin(T * 12 + k) * 0.1 : 0 }));
    if (i === 0) crow(3.2, 0.8, 7.6, Math.PI, 1.7, T, { dip: Math.sin(T * 1.5) * 0.08 });
    if (i === 1) { crow(3.2, 0.8, 7.6, Math.PI, 2.0, T, {}); crow(1.6, 0, 9.2, Math.PI, 2.0, T, {}); person(0.4, 0, lerp(0, 10, p), 0, 1, Object.assign({ walk: T * 6 }, MS)); }
    if (i === 2) { flock(Math.min(4, 1 + Math.floor(p * 5)), 1); person(0.4, 0, lerp(0, 10, p), 0, 1, Object.assign({ walk: T * 6 }, MS)); }
    if (i === 3) { const w = p < 0.5; flock(3, !w); person(0.4, 0, lerp(0, 10, w ? wn(p, 0, 0.5) : wn(p, 0.5, 1)), 0, 1, Object.assign({ walk: T * 6 }, w ? NO : MS)); }
    if (i === 4) crow(3.2, 0.8, 7.6, Math.PI, 1.7, T, { dip: 0.15 + Math.sin(T * 2) * 0.06 });
  },
  sfx: [[['wind', 0, 4.4], ['caw', 0.5]], [['steps', 0.3]], [['caw', 0.2], ['caw', 0.45], ['caw', 0.7]], [['steps', 0.1], ['caw', 0.7]], [['caw', 0.3], ['chime', 0.7, 'D5']]],
  root: ['D3', 'A3', 'F4'],
};

// ---------- Did you know: dolphins have names ----------
const DOLPH = {
  id: 'dolphin', title: 'Dolphin Names',
  caption: 'Did you know dolphins have names for each other? 🐬',
  tags: '#didyouknow #dolphins #animalfacts #oceanlife #smartanimals #shorts', footer: 'Based on research on bottlenose dolphin signature whistles (e.g. University of St Andrews).',
  beats: [
    { d: 4.4, vo: 'Did you know dolphins have names for each other?', tags: [{ t: [0, 0.95], text: 'DOLPHINS HAVE NAMES', y: 330, size: 58, bg: '#ffd86b' }] },
    { d: 4.6, vo: 'Each dolphin invents its own signature whistle.', tags: [{ t: [0.05, 0.95], text: 'SIGNATURE WHISTLE', y: 330, size: 64, bg: '#a8d4ff' }] },
    { d: 5, vo: 'Other dolphins copy that whistle when they call to it.', tags: [{ t: [0.05, 0.95], text: 'THEY CALL BY NAME', y: 330, size: 68, bg: '#ffb0c0' }] },
    { d: 5.6, vo: "They can even recognize an old friend's whistle after decades apart.", tags: [{ t: [0.05, 0.95], text: 'AFTER 20+ YEARS', y: 330, size: 72, bg: '#c8b8ff' }] },
    { d: 4.8, vo: 'So yes, dolphins really do have names for each other.', tags: [{ t: [0.05, 0.95], text: 'REAL NAMES', y: 330, size: 84, bg: '#b9f0d0' }] },
  ],
  build() { cloud(-40, 60, 170, 1.2); cloud(50, 70, 190, 1.4); cone(-70, -1, 150, 40, 14, 7, [110, 150, 140]); cone(80, -1, 160, 36, 12, 7, [120, 160, 140]); }, env: () => SEA_ENV,
  cam: () => ({ pos: [0, 1.4, 0], tg: [0, 2.4, 12] }),
  dyn(T, i, p) {
    seaDyn(T);
    const rings = (j, col, off) => { if (j) for (let k = 0; k < 3; k++) { const a = (((T * 0.9 + k / 3 + (off || 0)) % 1) + 1) % 1; ring3d(j.x, j.y + 0.6, j.z, 0.3 + a * 2.6, 0.1, col); } };
    if (i === 0) { drawJump(T, jumpD(T, 0, 0, 1, 10, 14)); drawJump(T, jumpD(T, 0.5, 0, -1, 15, 14)); }
    if (i === 1) { const j = jumpD(T, 0, 0, 1, 11, 12); drawJump(T, j, 1.2); rings(j, [255, 244, 190]); }
    if (i === 2) { const a = jumpD(T, 0, -3, 1, 10, 10), b = jumpD(T, 0.06, 3, -1, 14, 10); drawJump(T, a); drawJump(T, b); rings(a, [255, 244, 190]); rings(b, [190, 226, 255], 0.5); }
    if (i === 3) { const a = jumpD(T, 0, lerp(-12, -2.5, p), 1, 12, 8), b = jumpD(T, 0.03, lerp(12, 2.5, p), -1, 12, 8); drawJump(T, a); drawJump(T, b); if (p > 0.75) heart3d(0, 5.2 + Math.sin(T * 3) * 0.1, 12, 0.5); }
    if (i === 4) { const a = jumpD(T, 0, -2.2, 1, 11, 6), b = jumpD(T, 0.02, 2.2, -1, 11, 6); drawJump(T, a); drawJump(T, b); heart3d(0, 5.4 + Math.sin(T * 3) * 0.1, 11, 0.5); }
  },
  sfx: [[['waves', 0, 4.4], ['whistle', 0.4]], [['waves', 0, 4.6], ['whistle', 0.2]], [['waves', 0, 5], ['whistle', 0.2], ['whistle', 0.5]], [['waves', 0, 5.6], ['whistle', 0.5]], [['waves', 0, 4.8], ['chime', 0.7, 'D5']]],
  root: ['G2', 'D3', 'B3'],
};

// ---------- Did you know: penguin pebble proposal ----------
const PENG = {
  id: 'penguin', title: 'Penguin Pebble',
  caption: 'Did you know some penguins propose with a pebble? 🐧',
  tags: '#didyouknow #penguins #animalfacts #animalslove #nature #shorts', footer: 'Based on observations of Adélie and gentoo penguins, which use pebbles in courtship and nests.',
  beats: [
    { d: 4.8, vo: 'Did you know some penguins propose with a pebble?', tags: [{ t: [0, 0.95], text: 'A PEBBLE PROPOSAL', y: 330, size: 62, bg: '#ffd86b' }] },
    { d: 4.4, vo: 'A male searches for the smoothest pebble he can find.', tags: [{ t: [0.05, 0.95], text: 'THE PERFECT PEBBLE', y: 330, size: 60, bg: '#a8d4ff' }] },
    { d: 4.2, vo: 'Then he places it at his partner\'s feet.', tags: [{ t: [0.05, 0.95], text: 'A GIFT OF LOVE', y: 330, size: 70, bg: '#ffb0c0' }] },
    { d: 5, vo: 'If she accepts, the pair uses pebbles to build their nest.', tags: [{ t: [0.05, 0.95], text: 'BUILDING A NEST', y: 330, size: 70, bg: '#c8b8ff' }] },
    { d: 4.6, vo: 'So yes, some penguins really do propose with a pebble.', tags: [{ t: [0.05, 0.95], text: 'PEBBLE = I LOVE YOU', y: 330, size: 58, bg: '#b9f0d0' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, () => 0, (x, z) => ((Math.floor(x / 10) + Math.floor(z / 10)) & 1 ? [236, 242, 250] : [222, 232, 246]), 41);
    const r = rng(41); for (let k = 0; k < 12; k++) { const w = 2 + r() * 3, h = 1 + r() * 2.5; box(-30 + r() * 60, h / 2, 22 + r() * 40, w, h, w * 0.8, [198, 224, 244]); }
    for (let k = 0; k < 70; k++) ico(-9 + r() * 18, 0.07, 4 + r() * 10, 0.08 + r() * 0.08, mixc([130, 128, 134], [176, 168, 160], r()), null, 0.6);
    [[-90, 200, 60, 30, [196, 214, 240]], [20, 220, 70, 36, [206, 220, 244]], [100, 200, 50, 26, [190, 210, 238]]].forEach(([x, z, rr, h, c]) => mountain(x, z, rr, h, c)); cloud(-40, 66, 180, 1.2); cloud(60, 74, 200, 1.3);
    [[-14, 22], [-9, 26], [10, 24], [15, 20], [6, 30], [-4, 32]].forEach(([x, z], k) => penguin(x, 0, z, Math.PI + (k - 3) * 0.2, 0.9, 0, {}));
  },
  env: () => ({ top: [128, 168, 222], bot: [240, 244, 252], fog: [226, 236, 248], sunCol: [245, 247, 255], glow: '245,248,255', sat: 1.05, amb: [0.72, 0.76, 0.86], bright: 1.06, fogNear: 50, fogFar: 220 }),
  cam(i, p) { if (i === 3) return { pos: [lerp(-2, 2, p), 1.8, 0.8], tg: [0, 1, 8] }; if (i === 1) return { pos: [lerp(-4, -1, p), 1.4, 1.2], tg: [lerp(-3, 0, p), 1.1, 8] }; return { pos: [0, 1.6, 0.6], tg: [0, 1.5, 8] }; },
  dyn(T, i, p) {
    const S = 1.1, F = (x) => penguin(x, 0, 8, -Math.PI / 2, S, T, { dip: 0 });
    if (i === 0) { penguin(-0.9, 0, 8, Math.PI / 2, S, T, {}); F(0.9); ico(-0.1, 1.95, 8, 0.1, [150, 146, 150], null, 0.7); heart3d(0, 3.4 + Math.sin(T * 3) * 0.08, 8, 0.4); }
    if (i === 1) { const x = lerp(-4.5, -1.2, ez(p)), dip = 0.5 * wn(p, 0.4, 0.55) * (1 - wn(p, 0.6, 0.75)); penguin(x, 0, 8, Math.PI / 2, S, T, { walk: T * 7, dip }); if (p > 0.6) ico(x + 0.55, 1.95, 8, 0.1, [150, 146, 150], null, 0.7); F(3); }
    if (i === 2) { const x = lerp(-3, -0.3, ez(wn(p, 0, 0.7))); penguin(x, 0, 8, Math.PI / 2, S, T, { walk: p < 0.7 ? T * 7 : 0, dip: 0.4 * wn(p, 0.7, 0.85) }); if (p < 0.72) ico(x + 0.55, 1.95, 8, 0.1, [150, 146, 150], null, 0.7); else { ico(0.5, 0.1, 8, 0.12, [150, 146, 150], null, 0.7); heart3d(0.2, 3.3, 8, 0.4 * bk(wn(p, 0.75, 0.9))); } F(0.9); }
    if (i === 3) { const n = Math.floor(26 * wn(p, 0.1, 0.85)); for (let k = 0; k < n; k++) { const a = (k / 26) * TAU; ico(Math.cos(a) * 1.1, 0.1, 8.4 + Math.sin(a) * 0.9, 0.13, mixc([140, 136, 142], [180, 170, 160], (k % 3) / 3), null, 0.7); } penguin(-1.9, 0, 8, Math.PI / 2, S, T, { dip: 0.3 * Math.abs(Math.sin(T * 3)) }); F(1.9); }
    if (i === 4) { penguin(-0.7, 0, 8, Math.PI / 2, S, T, { flap: Math.sin(T * 3) * 0.1 }); F(0.7); for (let k = 0; k < 16; k++) { const a = (k / 16) * TAU; ico(Math.cos(a) * 1.5, 0.1, 8.3 + Math.sin(a) * 1.0, 0.13, [150, 146, 150], null, 0.7); } [[-0.6, 3.4], [0.6, 3.4], [0, 4.0]].forEach(([x, y], k) => heart3d(x, y + Math.sin(T * 3 + k) * 0.1, 8, 0.32)); }
  },
  sfx: [[['wind', 0, 4.8], ['chime', 0.4, 'E5']], [['steps', 0.2]], [['steps', 0.1], ['chime', 0.75, 'G5']], [['steps', 0.2], ['knock', 0.5]], [['wind', 0, 4.6], ['chime', 0.7, 'D5']]],
  root: ['C3', 'G3', 'E4'],
};

// ---------- Short fictional story: the kitten and the rain ----------
function house(x, z, open) { box(x, 2, z, 7, 4, 7, [222, 192, 150]); box(x, 4.2, z, 8, 0.4, 8, [170, 70, 60]); cone(x, 4.4, z, 5.4, 2.6, 4, [184, 84, 70], comp(mv(-x, 0, -z), rotY(Math.PI / 4), mv(x, 0, z))); [-2, 2].forEach((d) => box(x + d, 2.2, z - 3.52, 1.3, 1.3, 0.1, [255, 222, 140], null, { emissive: 1 })); box(x, 1.2, z - 3.45, 1.4, 2.4, 0.05, [255, 222, 140], null, { emissive: 1 }); if (!open) box(x, 1.2, z - 3.52, 1.4, 2.4, 0.1, [130, 80, 50]); }
const RAIN_ENV = { top: [88, 100, 134], bot: [170, 180, 198], fog: [146, 156, 178], sunCol: [196, 206, 232], glow: '190,200,230', sat: 1.0, amb: [0.68, 0.7, 0.8], bright: 0.95, fogNear: 25, fogFar: 150 };
const KIT = { col: [214, 150, 90] }, RAINCOAT = { shirt: [226, 190, 70], pants: [60, 70, 110], shape: 0 };
const FICT1 = {
  id: 'kitten', title: 'The Kitten and the Rain',
  caption: 'A short fictional story about kindness. 🐱 (This is a made-up story.)',
  tags: '#shortstory #fiction #kitten #kindness #animalstories #shorts', footer: 'A fictional story, written for entertainment. If you find a real stray, see our "Found an animal" videos.',
  beats: [
    { d: 5, vo: 'A tiny kitten waited in the rain for someone kind.', tags: [{ t: [0, 0.95], text: 'A SHORT STORY', y: 330, size: 74, bg: '#ffc8d8' }] },
    { d: 4.4, vo: 'People hurried past, too busy to notice her.', tags: [{ t: [0.05, 0.95], text: 'NO ONE STOPPED', y: 330, size: 72, bg: '#c8d0e8' }] },
    { d: 4.6, vo: 'Then a little girl stopped, and shared her umbrella.', tags: [{ t: [0.05, 0.95], text: 'THEN, KINDNESS', y: 330, size: 74, bg: '#ffd86b' }] },
    { d: 4.8, vo: 'She carried the kitten home, tucked inside her coat.', tags: [{ t: [0.05, 0.95], text: 'GOING HOME', y: 330, size: 80, bg: '#b9f0d0' }] },
    { d: 5.6, vo: 'The kitten had waited for someone kind, and now she had a home.', tags: [{ t: [0.05, 0.95], text: 'A HOME', y: 330, size: 100, bg: '#ffb0c0' }] },
  ],
  build() {
    groundG([-70, -40, -20, -10, -6, 6, 10, 20, 40, 70], ZS_A, () => 0, (x, z) => (Math.abs(x) < 6 ? [74, 80, 100] : Math.abs(x) < 10 ? [150, 150, 168] : [116, 126, 120]), 61);
    const r = rng(61), pal = [[170, 150, 150], [150, 160, 176], [180, 160, 130], [140, 150, 170]]; for (let z = -10; z < 80; z += 16) [-1, 1].forEach((d) => building(d * (22 + r() * 4), z, 16 + r() * 6, 14, 14 + r() * 22, pal[Math.floor(r() * 4)]));
    [-1, 1].forEach((d) => [0, 14, 28, 42].forEach((z) => { prism(d * 8.5, 0, z, 0.1, 5, 5, [70, 70, 86]); ico(d * 8.5, 5.3, z, 0.45, [255, 232, 170], null, 1, { emissive: 1 }); }));
    for (let k = 0; k < 6; k++) { const x = -4 + (k % 3) * 3.5, z = 6 + k * 4; ell(x, 0.03, z, 1.4, 0.02, 0.9, [120, 140, 176], null); }
  },
  env: () => RAIN_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [lerp(4.8, 5.4, p), 1.0, 5.8], tg: [7, 0.6, 10] };
    if (i === 1) return { pos: [4.4, 1.2, 4.8], tg: [8, 0.9, 10] };
    if (i === 2) return { pos: [lerp(4.6, 5.2, p), 1.3, 5.6], tg: [7.2, 0.9, 9.6] };
    if (i === 3) { const z = lerp(10, 22, p); return { pos: [4.6, 1.4, z - 4.5], tg: [7.4, 1.0, z] }; }
    return { pos: [lerp(3.4, 4.4, p), 1.5, 17.6], tg: [6.5, 1.2, 22.6] };
  },
  dyn(T, i, p) {
    rainDyn(T, 6, i === 3 ? lerp(10, 22, p) : i === 4 ? 22 : 9, 70);
    if (i <= 2) { crate(7, 10, false); cat(7, 0.3, 10, Math.PI, 0.7, Object.assign({ pose: 'sit', look: i === 1 ? Math.sin(T * 1.2) * 0.5 : 0, tail: T }, KIT)); }
    if (i === 1) for (let k = 0; k < 4; k++) { const x = ((((T * 2.4 + k * 4.1) % 18) + 18) % 18) - 4; person(x, 0, 7.4 + (k % 2) * 0.8, FC, 1, { walk: T * 7 + k, umbrella: PAL[k % 5], shirt: PAL[(k + 2) % 5], pants: [60, 66, 96] }); }
    if (i === 2) { person(7.2, 0, 8.3, 0, 0.7, Object.assign({ bend: 0.45, umbrella: [210, 90, 90], armR: -1.0 }, RAINCOAT)); }
    if (i === 3) { const z = lerp(10, 22, p), g = person(7.2, 0, z, 0, 0.7, Object.assign({ walk: T * 7, amp: 0.5, armR: -1.1, armL: -1.1, umbrella: [210, 90, 90] }, RAINCOAT)); cat(g.hR[0] - 0.1, g.hR[1] - 0.25, g.hR[2] + 0.05, 0, 0.32, Object.assign({ pose: 'sit' }, KIT)); house(6, 26, false); }
    if (i === 4) { house(6, 26, true); person(6.2, 0, 22.4, Math.PI, 0.7, Object.assign({ armR: -1.1, armL: -1.1 }, RAINCOAT)); cat(6.2, 0.9, 22.0, Math.PI, 0.32, Object.assign({ pose: 'sit', blink: slowBlink(T) }, KIT)); [0, 1, 2].forEach((k) => heart3d(5.6 + k * 0.6, 3 + ((T * 0.5 + k * 0.3) % 1) * 1.6, 22, 0.25)); }
  },
  sfx: [[['rain', 0, 5], ['meow', 0.5]], [['rain', 0, 4.4], ['steps', 0.2]], [['rain', 0, 4.6], ['chime', 0.6, 'A4']], [['rain', 0, 4.8], ['steps', 0.1]], [['rain', 0, 5.6], ['door', 0.1], ['purr', 0.3], ['chime', 0.7, 'D5']]],
  root: ['A2', 'E3', 'C4'],
};

// ---------- Short fictional story: the old dog and the puppy ----------
const GARDEN_ENV = { top: [96, 156, 226], bot: [246, 238, 214], fog: [220, 230, 226], sunCol: [255, 244, 220], glow: '255,244,210', sat: 1.1, amb: [0.7, 0.7, 0.78], bright: 1.05, fogNear: 50, fogFar: 230 };
const OLD = { col: [176, 150, 126], col2: [210, 188, 158], muzzle: [226, 220, 212] }, PUP = { col: [236, 200, 130], col2: [214, 150, 84], collar: [200, 90, 100] };
const FICT2 = {
  id: 'olddog', title: 'The Old Dog and the Puppy',
  caption: 'A short fictional story about love and loyalty. 🐕 (This is a made-up story.)',
  tags: '#shortstory #fiction #dogs #puppy #animalstories #shorts', footer: 'A fictional story, written for entertainment.',
  beats: [
    { d: 4.6, vo: 'An old dog had one last lesson to teach.', tags: [{ t: [0, 0.95], text: 'A SHORT STORY', y: 330, size: 74, bg: '#ffc8d8' }] },
    { d: 5, vo: 'A new puppy bounced around him all day, full of energy.', tags: [{ t: [0.05, 0.95], text: 'ENERGY!', y: 330, size: 90, bg: '#ffd86b' }] },
    { d: 5, vo: 'The old dog was slow, but he showed the puppy every favorite spot.', tags: [{ t: [0.05, 0.95], text: 'SLOW AND STEADY', y: 330, size: 64, bg: '#b9f0d0' }] },
    { d: 5, vo: 'When a storm came, the puppy trembled, and the old dog stayed close.', tags: [{ t: [0.05, 0.95], text: 'STAYING CLOSE', y: 330, size: 70, bg: '#a8d4ff' }] },
    { d: 5.2, vo: 'That was the lesson: love is simply staying close.', tags: [{ t: [0.05, 0.95], text: 'THE LESSON', y: 330, size: 84, bg: '#ffb0c0' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, () => 0, (x, z) => ((Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [116, 180, 104] : [102, 168, 94]), 71);
    house(0, 50, true); for (let x = -22; x <= 22; x += 2) { box(x, 0.6, 38, 0.2, 1.2, 0.2, [196, 160, 120]); } box(0, 0.9, 38, 46, 0.12, 0.1, [196, 160, 120]); box(0, 0.4, 38, 46, 0.12, 0.1, [196, 160, 120]);
    const r = rng(71), leaf = [[84, 166, 98], [112, 176, 84], [66, 148, 118]]; for (let k = 0; k < 10; k++) roundTree((r() < 0.5 ? -1 : 1) * (10 + r() * 24), 6 + r() * 30, 0.9 + r() * 0.5, leaf[k % 3]); roundTree(9, 12, 1.4, [96, 170, 90]);
    const fc = [[226, 110, 140], [236, 210, 90], [170, 120, 210], [245, 245, 245]]; for (let k = 0; k < 40; k++) ico(-14 + r() * 28, 0.16, 4 + r() * 26, 0.17, fc[k % 4], null, 0.8);
    [[-80, 160, 50, 24, [110, 170, 140]], [30, 180, 60, 28, [120, 170, 160]]].forEach(([x, z, rr, h, c]) => cone(x, 0, z, rr, h, 7, c)); cloud(-40, 70, 180, 1.2);
  },
  env(i, T, p) { if (i === 3) { const fl = Math.sin(T * 7) > 0.92 ? 1.5 : 0; return { top: [60, 64, 96], bot: [130, 136, 156], fog: [110, 116, 140], sunCol: [190, 200, 230], glow: '190,200,230', sat: 1.0, amb: [0.6, 0.62, 0.74], bright: 0.82 + fl * 0.3, fogNear: 25, fogFar: 150 }; } if (i === 4) return { top: [150, 130, 200], bot: [255, 200, 150], fog: [255, 214, 180], sunCol: [255, 210, 160], glow: '255,200,140', sat: 1.1, amb: [0.7, 0.68, 0.78], bright: 1.05, fogNear: 50, fogFar: 230 }; return GARDEN_ENV; },
  cam(i, p) {
    if (i === 0) return { pos: [lerp(-2.5, -1.5, p), 1.0, 5], tg: [0, 0.6, 9] };
    if (i === 1) return { pos: [-3, 1.3, 4.6], tg: [0, 0.8, 9] };
    if (i === 2) { const x = lerp(-3, 5, ez(p)); return { pos: [x - 1, 1.4, 5.2], tg: [x + 1.5, 0.8, 11] }; }
    if (i === 3) return { pos: [lerp(-2, -1, p), 1.0, 5.4], tg: [0, 0.6, 9] };
    return { pos: [lerp(-2.4, -1.6, p), 1.0, 5.4], tg: [0, 0.6, 9] };
  },
  dyn(T, i, p) {
    if (i === 3) rainDyn(T, 0, 9, 80);
    if (i === 0) dog(0, 0, 9, Math.PI * 0.85, 1.1, Object.assign({ pose: 'lie', wag: T * 1.2 }, OLD));
    if (i === 1) { dog(0, 0, 9, Math.PI * 0.9, 1.1, Object.assign({ pose: 'lie', wag: T * 2 }, OLD)); const a = T * 3.2; dog(Math.cos(a) * 2.6, Math.abs(Math.sin(T * 7)) * 0.35, 9 + Math.sin(a) * 2.0, Math.atan2(-Math.sin(a), Math.cos(a)) + Math.PI / 2 * 0 + 0, 0.55, Object.assign({ walk: T * 14, wag: T * 14, tongue: 1, amp: 0.8 }, PUP)); }
    if (i === 2) { const x = lerp(-3, 5, ez(p)); dog(x + 1.5, 0, 9, FC, 1.1, Object.assign({ walk: T * 4, wag: T * 2, amp: 0.35 }, OLD)); dog(x - 0.2, Math.abs(Math.sin(T * 7)) * 0.1, 9.2, FC, 0.55, Object.assign({ walk: T * 8, wag: T * 12, tongue: 1, amp: 0.6 }, PUP)); }
    if (i === 3) { dog(0, 0, 9, Math.PI * 0.9, 1.1, Object.assign({ pose: 'lie', dip: 0.1 }, OLD)); dog(-0.9 + Math.sin(T * 30) * 0.015, 0, 8.4, Math.PI * 0.9, 0.55, Object.assign({ pose: 'lie', sad: 1 }, PUP)); }
    if (i === 4) { dog(0, 0, 9, Math.PI * 0.9, 1.1, Object.assign({ pose: 'lie', wag: T * 1.5 }, OLD)); dog(-0.9, 0, 8.4, Math.PI * 0.9, 0.55, Object.assign({ pose: 'lie', wag: T * 3 }, PUP)); [0, 1, 2].forEach((k) => heart3d(-0.4 + k * 0.4, 2 + ((T * 0.5 + k * 0.3) % 1) * 1.5, 8.8, 0.25)); }
  },
  sfx: [[['wind', 0, 4.6], ['chime', 0.2, 'A4']], [['bark', 0.3], ['steps', 0.1]], [['steps', 0.1], ['wind', 0, 5]], [['rain', 0, 5], ['thunder', 0.2], ['whimper', 0.6]], [['wind', 0, 5.2], ['chime', 0.5, 'D5'], ['chime', 0.65, 'F#5']]],
  root: ['F3', 'C4', 'A4'],
};
const STORIES = [BEAR, SHARK, SNAKE, BIRD, CHOC, ROAD, HACHI, BOBBIE, ELEPH, CATS, OCTO, CROWS, DOLPH, PENG, FICT1, FICT2];
Object.entries({ survival: [BEAR, SHARK, SNAKE], help: [BIRD, CHOC, ROAD], tale: [HACHI, BOBBIE], dyk: [ELEPH, CATS, OCTO, CROWS, DOLPH, PENG], fiction: [FICT1, FICT2] }).forEach(([k, a]) => a.forEach((s) => { s.kind = k; }));

// =====================================================================
//  ===== NEW IN THIS VERSION: everything below was added after the first 16 stories =====
// =====================================================================
'use strict';
// =====================================================================
//  content2.js: 10 more stories + the new blocky models they use.
//  Loads after content.js (see animals.html). Everything is built from boxes.
//  It also swaps the water in the shark story and the dolphin sea for blocky versions.
// =====================================================================

// ---------- blocky sea (replaces the smooth one from content.js) ----------
function seaDyn(T) {
  for (let z = -6; z < 100; z += 6) for (let x = -60; x < 60; x += 6) {
    const wv = Math.round((Math.sin(x * 0.3 + z * 0.22 + T * 1.5) * 0.15) / 0.1) * 0.1, col = mixc([88, 176, 196], [44, 122, 170], cl((z - 6) / 80));
    box(x + 3, wv - 0.1, z + 3, 6, 0.5, 6, ((x / 6 + z / 6) & 1) ? col : mixc(col, [255, 255, 255], 0.1), null, { bias: 2 });
  }
}

// ---------- shark story: water and the fin on the beach rebuilt from boxes ----------
SHARK.dyn = function (T, i, p, TL) {
  const bt = T - TL.E[i], under = i < 4;
  for (let z = 2; z < 120; z += 7) for (let x = -84; x < 84; x += 7) {
    const zc = z + 3.5, fy = FL(x + 3.5, zc); if (fy > -0.05) continue;
    const wv = Math.round((Math.sin((x + 3.5) * 0.3 + zc * 0.22 + T * 1.5) * 0.18) / 0.12) * 0.12;
    if (under) { const s = 0.5 + 0.5 * Math.sin(x * 0.5 + zc * 0.4 + T * 2); box(x + 3.5, wv, zc, 7, 0.25, 7, mixc([110, 226, 246], [236, 255, 255], s), null, { emissive: 1, bias: 30, noedge: 1 }); }
    else box(x + 3.5, wv - 0.1, zc, 7, 0.5, 7, mixc([86, 236, 220], [18, 132, 206], cl(-fy / 6)), null, { bias: 2 });
  }
  if (under) {
    KELPS.forEach(([x, z, h], k) => kelp(x, FL(x, z), z, h, T, k % 2 ? [40, 220, 110] : [90, 230, 70]));
    const fc = [[255, 206, 40], [255, 100, 160], [80, 255, 200]];
    for (let s = 0; s < 3; s++) for (let f = 0; f < 8; f++) { const ang = T * 0.4 * (s % 2 ? 1 : -1) + s * 2.1, cx = -22 + s * 22, cz = 46 + s * 6, ox = (f % 4) * 1.1, oy = (f >> 2) * 0.9, x = cx + Math.cos(ang) * 14 + ox, z = cz + Math.sin(ang) * 9, vx = -Math.sin(ang) * (s % 2 ? 1 : -1), vz = Math.cos(ang) * (s % 2 ? 1 : -1); fish(x, -5 + s * 1.2 + oy + Math.sin(T * 2 + f) * 0.15, z, Math.atan2(vx, vz), 0.55, fc[s], T, f); }
    for (let k = 0; k < 12; k++) ico(-6 + ((k * 7) % 13), -6 + ((T * 0.9 + k * 0.37) % 1) * 7, 10 + ((k * 5) % 17), 0.1, [255, 255, 255], null, 1, { emissive: 1 });
  }
  const sw = { x: 0, y: -1.15, z: 13 };
  if (i === 0) { const q = ez(p), pos = [lerp(30, -6, q), -4.7 + Math.sin(T) * 0.15, lerp(48, 15.5, q)]; shark(pos[0], pos[1], pos[2], Math.atan2(-36, -32.5), 1.25, T, { mouth: 0 }); for (let k = 1; k < 6; k++) ico(pos[0] + 2.2 * k, pos[1] + 0.2, pos[2] + 2 * k, 0.12, [255, 255, 255], null, 1, { emissive: 1 }); }
  if (i === 1) {
    const q = ez(p), sp = [lerp(17, 9, q), lerp(-4.8, -3.6, q), lerp(30, 22.5, q)];
    person(sw.x, sw.y, sw.z, Math.PI, 1, { prone: 1, walk: T * 14, amp: 1.2, armL: Math.sin(T * 14) * 2, armR: Math.cos(T * 14) * 2, shirt: [255, 96, 56], pants: [36, 66, 170] });
    for (let k = 0; k < 14; k++) ico(sw.x + Math.sin(k * 2.3 + T * 6) * 1.1, sw.y + 0.6 + (((T * 1.6 + k * 0.29) % 1) * 1.1), sw.z + Math.cos(k * 1.7 + T * 5) * 1.1, 0.12 + (k % 3) * 0.04, [255, 255, 255], null, 1, { emissive: 1 });
    shark(sp[0], sp[1], sp[2], Math.atan2(sw.x - sp[0], sw.z - sp[2]), 1.25, T, {});
  }
  if (i === 2) {
    const q = ez(p), z = lerp(13, 6.5, q), a = T * 0.6, sp = [8 + Math.cos(a) * 5, -4.2, 22 + Math.sin(a) * 4];
    person(0, sw.y, z, Math.PI, 1, { prone: 1, walk: T * 3, amp: 0.3, armL: Math.sin(T * 2) * 0.9, armR: -Math.sin(T * 2) * 0.9, shirt: [255, 96, 56], pants: [36, 66, 170] });
    shark(sp[0], sp[1], sp[2], Math.atan2(-Math.sin(a) * 5 * 0.6, Math.cos(a) * 4 * 0.6), 1.25, T, {});
  }
  if (i === 3) {
    const fl = wn(p, 0.58, 1), f0 = Math.atan2(-3.5, -2.5), sp = [3.5 + 10 * fl * fl, -2.2, 14.5 + 8 * fl * fl], fc = lerp(f0, Math.atan2(1, 0.7), ez(wn(p, 0.5, 0.7)));
    person(0, -1.7, 12, Math.atan2(3.5, 2.5), 1, { walk: T * 5, amp: 0.4, armR: -1.5 + Math.sin(T * 13) * 0.6, armL: -0.6, shirt: [255, 96, 56], pants: [36, 66, 170] });
    const sb = shark(sp[0], sp[1], sp[2], fc, 1.25, T, { mouth: 0.5 * (1 - wn(p, 0.4, 0.6)) });
    if (p < 0.62) [[0, -0.1, 2.5], [0.37, 0.2, 1.75], [0.575, 0.12, 1.05]].forEach((lp, k) => { const w = sb(lp), pop = bk(wn(p, 0.12 + k * 0.12, 0.22 + k * 0.12)); ico(w[0], w[1], w[2], (0.2 + 0.06 * Math.sin(T * 10 + k)) * pop, [255, 240, 60], null, 1, { emissive: 1, bias: -4 }); });
  }
  if (i === 4) {
    const z = lerp(8, -2, ez(p)), y = Math.max(FL(0, z), -1);
    person(0, y, z, Math.PI, 1, { walk: T * 12, amp: 1, armL: -0.9, armR: 0.9, shirt: [255, 96, 56], pants: [36, 66, 170] });
    const fx = -6 + Math.sin(T * 0.8) * 3; box(fx, 0.45, 30, 0.14, 0.9, 1.2, [30, 88, 184]); box(fx, 1.05, 29.7, 0.14, 0.5, 0.6, [30, 88, 184]); for (let k = 0; k < 4; k++) ico(fx, 0.05, 28.6 - k * 0.9, 0.3 + k * 0.1, [255, 255, 255], null, 0.3);
    [-22, -10, 14, 22].forEach((x, k) => palm(x, -10 + (k % 2) * 3, 1.1, T, k, 1.5));
    [[-4, -1.5, [70, 200, 120]], [5, -2.5, [255, 200, 40]], [3, 0.5, [255, 90, 150]]].forEach(([x, z, c], k) => person(x, FL(x, z), z, Math.PI * 0.1, 1, { shirt: c, pants: [250, 250, 250], armR: k === 0 ? -2.6 + Math.sin(T * 8) * 0.4 : null }));
    cloud(-40, 52, 150, 1.2); cloud(50, 60, 170, 1.4);
  }
};

// ---------- little helpers ----------
const DIG = { '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'], '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'], '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'], '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'], Z: ['111', '001', '010', '100', '111'], '?': ['111', '001', '011', '000', '010'], '!': ['010', '010', '010', '000', '010'] };
function num3d(str, x, y, z, s, col) {
  const yaw = Math.atan2(CAMP[0] - x, CAMP[2] - z), xf = comp(rotY(yaw), mv(x, y, z)), wTot = str.length * 4 * s - s;
  [[1.4, [30, 14, 50], -0.12 * s, -1.5], [1, col || [255, 255, 255], 0, -2]].forEach(([k, c, zo, b]) => str.split('').forEach((ch, q) => { const g = DIG[ch]; if (!g) return; g.forEach((row, r) => { for (let c2 = 0; c2 < 3; c2++) if (row[c2] === '1') box(-wTot / 2 + q * 4 * s + c2 * s + s / 2, (2 - r) * s, zo, s * k, s * k, s * 0.7, c, xf, { emissive: 1, noedge: 1, bias: b }); }); }));
}
function nightSky() { const r = rng(77); for (let k = 0; k < 70; k++) box(-140 + r() * 280, 22 + r() * 70, 190, 1.3, 1.3, 0.5, [255, 250, 220], null, { emissive: 1, noedge: 1 }); box(36, 62, 180, 16, 16, 3, [250, 244, 206], null, { emissive: 1 }); box(31, 66, 178, 3.5, 3.5, 0.6, [226, 218, 176], null, { emissive: 1, noedge: 1 }); box(40, 58, 178, 2.6, 2.6, 0.6, [226, 218, 176], null, { emissive: 1, noedge: 1 }); }
function darkForest(seed, n) { groundG(XS_A, ZS_A, () => 0, (x, z) => ((Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [36, 86, 78] : [30, 76, 70]), seed); nightSky(); const r = rng(seed + 4); for (let k = 0; k < n; k++) { const side = r() < 0.5 ? -1 : 1; pine(side * (10 + r() * 40), -10 + r() * 120, 0.9 + r() * 0.9, [22, 104, 84]); } }
function fireflies(T, cx, cz, n) { for (let k = 0; k < n; k++) { const a = T * 0.5 + k * 2.4, fl = 0.5 + 0.5 * Math.sin(T * 4 + k * 3); if (fl < 0.25) continue; box(cx + Math.cos(a) * (3 + (k % 5) * 1.6), 1 + ((k * 7) % 9) * 0.45 + Math.sin(T + k) * 0.3, cz + Math.sin(a * 0.8) * (2 + (k % 4) * 1.5), 0.24 * fl + 0.1, 0.24 * fl + 0.1, 0.24 * fl + 0.1, [230, 255, 120], null, { emissive: 1, noedge: 1 }); } }
function flower(x, z, s, col) { box(x, 0.7 * s, z, 0.14 * s, 1.4 * s, 0.14 * s, [60, 150, 70]); box(x, 1.5 * s, z, 0.5 * s, 0.5 * s, 0.16 * s, [250, 214, 60]); [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([a, b]) => box(x + a * 0.4 * s, 1.5 * s + b * 0.4 * s, z, 0.38 * s, 0.38 * s, 0.14 * s, col)); }
function blossom(x, y, z, s, col) { box(x, y, z, 0.5 * s, 0.5 * s, 0.2 * s, [250, 214, 60], null, { emissive: 1 }); [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([a, b]) => box(x + a * 0.4 * s, y + b * 0.4 * s, z, 0.38 * s, 0.38 * s, 0.18 * s, col, null, { emissive: 1 })); }
function swarm(T, cx, cy, cz, n, rad, spd) { for (let k = 0; k < n; k++) { const a = T * (spd || 2) * (1 + (k % 5) * 0.12) + k * 2.1, rr = rad * (0.35 + ((k * 37) % 10) / 16), x = cx + Math.cos(a) * rr, y = cy + Math.sin(T * 3 + k) * 0.5 + ((k * 13) % 7) * 0.18, z = cz + Math.sin(a * 1.3 + k) * rr; box(x, y, z, 0.3, 0.26, 0.4, [250, 200, 40]); box(x, y, z - 0.1, 0.32, 0.28, 0.09, [30, 24, 20]); } }

// ---------- new models ----------
function owl(x, y, z, face, s, T, o) {
  o = o || {}; const B = [142, 102, 66], Dk = mixc(B, [40, 26, 16], 0.5), Bl = [234, 208, 166], Y = [255, 206, 60], K = [16, 14, 20], OR = [232, 150, 40], base = comp(sc(s), rotY(face), mv(x, y, z)), fly = o.fly || 0, bl = o.blink || 0;
  box(0, 1.3, 0, 1.5, 2.0, 1.2, B, base); box(0, 1.2, 0.52, 1.0, 1.5, 0.2, Bl, base); [[-0.25, 1.7], [0.25, 1.7], [0, 1.3], [-0.25, 0.9], [0.25, 0.9]].forEach(([px, py]) => box(px, py, 0.66, 0.2, 0.15, 0.06, Dk, base)); box(0, 0.5, -0.65, 0.9, 0.35, 0.6, Dk, base);
  const hd = comp(rotY(o.look || 0), mv(0, 2.75, 0), base); box(0, 0, 0, 1.7, 1.25, 1.3, B, hd);
  [-1, 1].forEach((d) => { box(d * 0.62, 0.78, -0.1, 0.32, 0.5, 0.3, Dk, hd); box(d * 0.42, 0.08, 0.62, 0.66, 0.66, 0.12, Bl, hd); box(d * 0.42, 0.08, 0.7, 0.48, 0.48, 0.1, Y, hd); box(d * 0.42, 0.08, 0.78, 0.22, Math.max(0.03, 0.3 * (1 - bl)), 0.08, K, hd); });
  box(0, -0.12, 0.75, 0.22, 0.3, 0.2, OR, hd);
  [-1, 1].forEach((d) => { const ang = fly ? 1.25 + Math.sin(T * 10) * 0.45 : 0.1, xw = comp(rotZ(d * ang, [d * 0.8, 2.2, 0]), base); box(d * 0.95, 1.25, -0.05, 0.36, 2.0, 1.0, Dk, xw); box(d * 0.95, 0.45, -0.1, 0.32, 0.6, 0.9, B, xw); box(d * 0.35, 0.12, 0.2, 0.4, 0.24, 0.6, OR, base); });
}
function rabbit(x, y, z, face, s, T, o) {
  o = o || {}; const C = o.col || [188, 168, 148], Wh = [250, 246, 240], Pk = [240, 160, 170], K = [18, 14, 18], base = comp(sc(s), rotY(face), mv(x, y + (o.hop || 0), z)), droop = o.droop || 0;
  box(0, 0.75, 0, 0.95, 0.95, 1.4, C, base); box(0, 0.62, -0.5, 1.05, 0.9, 0.8, C, base); box(0, 0.4, 0.1, 0.7, 0.3, 1.0, Wh, base); box(0, 0.85, -1.0, 0.34, 0.34, 0.34, Wh, base);
  [-1, 1].forEach((d) => { box(d * 0.4, 0.12, -0.7, 0.4, 0.24, 0.9, C, base); box(d * 0.3, 0.3, 0.7, 0.26, 0.6, 0.26, C, base); box(d * 0.3, 0.1, 0.8, 0.3, 0.2, 0.4, Wh, base); });
  const hd = comp(rotX(o.dip || 0), rotY(o.look || 0), mv(0, 1.25, 0.8), base); box(0, 0, 0, 0.78, 0.68, 0.76, C, hd); box(0, -0.12, 0.42, 0.36, 0.28, 0.26, Wh, hd); box(0, -0.02, 0.58, 0.12, 0.1, 0.08, Pk, hd);
  [-1, 1].forEach((d) => { box(d * 0.28, 0.1, 0.34, 0.1, 0.12, 0.08, K, hd); box(d * 0.28 + 0.01, 0.13, 0.38, 0.03, 0.03, 0.03, [255, 255, 255], hd, { emissive: 1 }); const ef = comp(rotZ(d * (0.12 + droop * 0.9), [d * 0.2, 0.3, 0]), rotX(-droop * 0.5, [0, 0.3, 0]), hd); box(d * 0.2, 0.95, -0.05, 0.2, 0.9, 0.14, C, ef); box(d * 0.2, 0.95, 0.0, 0.1, 0.7, 0.05, Pk, ef); });
}
function otter(x, y, z, face, s, T, o) {
  o = o || {}; const C = [120, 84, 56], L = [208, 178, 138], Dk = [70, 48, 34], K = [16, 12, 14], base = comp(sc(s), rotY(face), mv(x, y, z));
  box(0, 0.4, 0, 1.1, 0.8, 2.4, C, base); box(0, 0.82, 0, 0.9, 0.1, 2.0, L, base);
  const hd = comp(rotX(o.tilt || 0, [0, 0.4, 1.1]), mv(0, 0.65, 1.5), base); box(0, 0, 0, 0.9, 0.7, 0.85, C, hd); box(0, 0.3, 0.12, 0.74, 0.1, 0.6, L, hd); box(0, 0.38, 0.45, 0.22, 0.14, 0.14, K, hd);
  [-1, 1].forEach((d) => { box(d * 0.22, 0.38, 0.1, 0.1, 0.06, 0.1, K, hd); box(d * 0.4, 0.3, -0.25, 0.2, 0.2, 0.14, Dk, hd); box(d * 0.45, 0.95, 0.55, 0.22, 0.6, 0.22, C, base); box(d * 0.45, 1.3, 0.55, 0.26, 0.16, 0.26, L, base); box(d * 0.4, 0.25, -1.3, 0.3, 0.12, 0.5, Dk, base); });
  box(0, 0.25, -1.75, 0.4, 0.15, 1.0, C, base);
}
function giraffe(x, y, z, face, s, T, o) {
  o = o || {}; const Yl = [244, 200, 80], Y2 = [232, 176, 60], Sp = [160, 92, 40], Dk = [60, 40, 30], K = [16, 12, 14], base = comp(sc(s), rotY(face), mv(x, y, z)), hl = o.hl || 0;
  [[-0.6, 1.0], [0.6, 1.0], [-0.6, -1.0], [0.6, -1.0]].forEach(([lx, lz], k) => { const f = comp(rotX(Math.sin((o.walk || 0) + (lx * lz > 0 ? 0 : Math.PI)) * (o.amp || 0), [lx, 3.2, lz]), base); box(lx, 1.6, lz, 0.5, 3.2, 0.5, Yl, f); box(lx, 0.15, lz, 0.55, 0.3, 0.6, Dk, f); });
  box(0, 3.7, 0, 1.7, 1.5, 3.1, Yl, base); [[-0.86, 3.9, 0.6], [-0.86, 3.4, -0.7], [0.86, 4.0, -0.5], [0.86, 3.3, 0.8]].forEach(([sx, sy, sz]) => box(sx, sy, sz, 0.08, 0.55, 0.6, Sp, base)); [[0, 4.46, 0.2], [0, 4.45, -0.9]].forEach(([sx, sy, sz]) => box(sx, sy, sz, 0.7, 0.1, 0.6, Sp, base)); box(0, 3.4, -1.7, 0.14, 0.14, 0.7, Dk, base);
  let hx = 0, hy = 4.4, hz = 1.1;
  for (let k = 0; k < 7; k++) { const sw = Math.sin(T * 0.7 + k * 0.5) * 0.05 * k, cy = 4.9 + k * 0.95, cz = 1.25 + k * 0.16, w = 0.85 - 0.04 * k; box(sw, cy, cz, w, 1.0, w, k < hl ? [255, 236, 130] : k % 2 ? Yl : Y2, base); box(sw, cy, cz - 0.5, 0.18, 1.0, 0.2, [150, 86, 34], base); hx = sw; hy = cy; hz = cz; }
  const hd = comp(rotX(o.nod || 0, [0, -0.3, -0.4]), mv(hx, hy + 0.9, hz + 0.35), base); box(0, 0, 0, 0.75, 0.65, 1.1, Yl, hd); box(0, -0.1, 0.62, 0.55, 0.42, 0.5, [250, 222, 170], hd); box(0, 0.0, 0.9, 0.4, 0.12, 0.08, K, hd);
  [-1, 1].forEach((d) => { box(d * 0.4, 0.14, 0.25, 0.1, 0.12, 0.1, K, hd); box(d * 0.18, 0.55, -0.1, 0.12, 0.4, 0.12, Dk, hd); box(d * 0.18, 0.78, -0.1, 0.2, 0.14, 0.2, Dk, hd); box(d * 0.5, 0.25, -0.3, 0.4, 0.14, 0.2, Yl, hd); });
}
function bee(x, y, z, face, s, T, o) {
  o = o || {}; const Yl = [250, 200, 40], Dk = [34, 26, 22], base = o.wallHead != null ? comp(sc(s), rotX(-Math.PI / 2), rotZ(-o.wallHead), mv(x, y, z)) : comp(sc(s), rotY(face), mv(x, y, z));
  box(0, 0, 0, 0.7, 0.6, 1.0, Yl, base); [-0.25, 0.05, 0.35].forEach((zz) => box(0, 0, zz, 0.73, 0.63, 0.14, D