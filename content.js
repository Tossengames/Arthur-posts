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
  box(0, 0, 0, 0.7, 0.6, 1.0, Yl, base); [-0.25, 0.05, 0.35].forEach((zz) => box(0, 0, zz, 0.73, 0.63, 0.14, Dk, base)); box(0, 0.02, 0.62, 0.54, 0.5, 0.34, Dk, base); box(0, 0, -0.65, 0.14, 0.14, 0.3, Dk, base);
  [-1, 1].forEach((d) => { box(d * 0.2, 0.1, 0.8, 0.14, 0.14, 0.1, [255, 255, 255], base, { emissive: 1 }); const fl = Math.sin(T * (o.wag ? 40 : 30) + d) * 0.5 + 0.6; box(d * 0.5, 0.4, 0, 0.6, 0.05, 0.5, [225, 238, 255], comp(rotZ(d * fl, [d * 0.2, 0.3, 0]), base), { emissive: 1, noedge: 1 }); });
}
function turtle(x, y, z, face, s, T, o) {
  o = o || {}; const G = [98, 150, 88], Sh = [104, 82, 50], Sl = [130, 104, 66], Bl = [220, 206, 160], K = [16, 14, 16], base = comp(sc(s), rotY(face), mv(x, y, z)), ph = o.walk || 0, amp = o.amp == null ? 0.35 : o.amp;
  box(0, 0.65, 0, 1.7, 0.7, 2.1, Sh, base); box(0, 1.1, 0, 1.3, 0.35, 1.6, Sl, base); [[-0.45, 0.5], [0.45, 0.5], [-0.45, -0.5], [0.45, -0.5], [0, 0]].forEach(([px, pz]) => box(px, 1.3, pz, 0.38, 0.08, 0.38, Sh, base)); box(0, 0.3, 0, 1.6, 0.2, 2.0, Bl, base);
  const hx = comp(rotX(o.dip || 0, [0, 0.6, 1.1]), base); box(0, 0.65, 1.5, 0.6, 0.55, 0.7, G, hx); box(0, 0.58, 1.88, 0.4, 0.3, 0.14, G, hx); [-1, 1].forEach((d) => { box(d * 0.25, 0.78, 1.72, 0.1, 0.1, 0.08, K, hx); box(d * 0.25 + 0.01, 0.8, 1.76, 0.03, 0.03, 0.03, [255, 255, 255], hx, { emissive: 1 }); });
  [[-1, 0.75], [1, 0.75], [-1, -0.75], [1, -0.75]].forEach(([dx, dz], k) => { const f = comp(rotX(Math.sin(ph + (k % 2 ? Math.PI : 0)) * amp, [dx * 0.95, 0.5, dz]), base); box(dx * 0.95, 0.25, dz, 0.45, 0.5, 0.5, G, f); }); box(0, 0.4, -1.2, 0.26, 0.2, 0.5, G, base);
}
function chick(x, y, z, face, s, T) { const base = comp(sc(s), rotY(face), mv(x, y, z)), P = [236, 168, 164]; box(0, 0.35, 0, 0.8, 0.6, 0.9, P, base); box(0, 0.8, 0.3, 0.6, 0.5, 0.55, P, base); box(0, 0.72, 0.7, 0.4, 0.2 + 0.1 * Math.abs(Math.sin(T * 5)), 0.3, [250, 210, 90], base); [-1, 1].forEach((d) => { box(d * 0.2, 0.9, 0.58, 0.12, 0.04, 0.05, [40, 24, 30], base); box(d * 0.42, 0.4, -0.05, 0.14, 0.34, 0.5, mixc(P, [120, 90, 90], 0.2), base); }); }
function mouse3d(x, z, s) { box(x, 0.3 * s, z, 0.9 * s, 0.6 * s, 1.2 * s, [170, 160, 150]); box(x, 0.35 * s, z - 0.8 * s, 0.6 * s, 0.5 * s, 0.5 * s, [180, 170, 160]); box(x, 0.28 * s, z - 1.1 * s, 0.14 * s, 0.14 * s, 0.14 * s, [240, 150, 160]); [-1, 1].forEach((d) => box(x + d * 0.35 * s, 0.7 * s, z - 0.7 * s, 0.26 * s, 0.26 * s, 0.1 * s, [240, 170, 180])); box(x, 0.2 * s, z + 1.0 * s, 0.1 * s, 0.1 * s, 0.9 * s, [240, 170, 180]); }

// =====================================================================
//  STORY 11: Owl eyes (did you know)
// =====================================================================
const NIGHT_ENV = { top: [14, 16, 66], bot: [92, 66, 146], fog: [60, 52, 112], sunCol: [170, 190, 255], glow: '170,190,255', sat: 1.25, amb: [0.6, 0.62, 0.86], bright: 1.0, fogNear: 40, fogFar: 200, nosun: 1 };
const S_OWL = {
  id: 'owl', title: 'Owl Eyes',
  caption: "Owls can't move their eyes, so they turn their whole head instead. 🦉",
  tags: '#owl #owls #animalfacts #didyouknow #birds #shorts', footer: 'Based on published research on owl anatomy. The 270 degree turn is an approximate maximum, and owls have 14 neck bones.',
  beats: [
    { d: 4.2, vo: "An owl can't move its eyes. Not even a little.", tags: [{ t: [0, 0.95], text: "EYES DON'T MOVE", y: 330, size: 72, bg: '#ffd23f' }] },
    { d: 5.2, vo: "They're shaped more like tubes than balls, and they're stuck in place.", tags: [{ t: [0.05, 0.95], text: 'TUBE-SHAPED EYES', y: 330, size: 64, bg: '#a8d4ff' }] },
    { d: 4.8, vo: 'So to look sideways, the whole head has to turn.', tags: [{ t: [0.05, 0.95], text: 'THE HEAD TURNS', y: 330, size: 72, bg: '#b9f0d0' }] },
    { d: 6.2, vo: 'It can swing around about 270 degrees. An owl has fourteen neck bones. We only have seven.', tags: [{ t: [0.05, 0.95], text: '270° TURN', y: 330, size: 88, bg: '#ff8a3d' }] },
    { d: 4.4, vo: 'Next time you see one, watch the head, not the eyes.', tags: [{ t: [0.05, 0.95], text: 'WATCH THE HEAD', y: 330, size: 68, bg: '#ffb0c0' }] },
  ],
  build() { darkForest(61, 44); box(-5.2, 5, 8, 1.8, 10, 1.8, [96, 66, 44]); box(-1.5, 3.0, 8, 8, 0.7, 0.9, [110, 76, 50]); box(-5.2, 10.5, 8, 6, 2.6, 5, [24, 96, 78]); box(-6, 12.2, 8.5, 4, 2, 3.5, [30, 110, 88]); },
  env: () => NIGHT_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [lerp(-1, 1, p), 5, -0.5], tg: [0, 5.6, 8] };
    if (i === 1) return { pos: [0, 6.9, 3.4], tg: [0, 6.9, 8] };
    if (i === 2) return { pos: [Math.sin(p * 3) * 2.5, 6.4, 3], tg: [0, 6.5, 8] };
    if (i === 3) return { pos: [1.5, 5.2, -5], tg: [1.5, 5, 8] };
    return { pos: [0, 6.3, 2.5], tg: [0, 6.6, 8] };
  },
  dyn(T, i, p) {
    let look = 0;
    if (i === 1) look = Math.sin(T * 1.1) * 0.12; else if (i === 2) look = Math.sin(p * TAU * 1.5) * 1.25; else if (i === 3) look = 2.35 * ez(wn(p, 0.1, 0.35)) - 4.7 * ez(wn(p, 0.5, 0.75)) + 2.35 * ez(wn(p, 0.85, 1)); else if (i === 4) look = Math.sin(T * 0.9) * 0.2;
    owl(0, 3.35, 8, Math.PI, 1.3, T, { look, blink: slowBlink(T * 0.9) }); fireflies(T, 0, 9, 8);
    if (i === 3 && p > 0.4) { const k = bk(wn(p, 0.4, 0.55)); num3d('14', 0, 10.6, 8, 0.5 * k, [255, 214, 70]); person(5, 0, 6, Math.PI, 1.5, { shirt: [84, 128, 196], pants: [50, 56, 90] }); num3d('7', 5, 5, 6, 0.5 * k, [255, 255, 255]); }
  },
  sfx: [[['crickets', 0, 4.2], ['hoot', 0.5]], [['crickets', 0, 5.2]], [['crickets', 0, 4.8], ['flap', 0.3]], [['hoot', 0.1], ['flap', 0.35], ['flap', 0.6]], [['crickets', 0, 4.4], ['hoot', 0.3]]],
  root: ['D3', 'A3', 'F4'],
};

// =====================================================================
//  STORY 12: Sea otters hold hands (did you know)
// =====================================================================
const S_OTTER = {
  id: 'otter', title: 'Sleepy Otters',
  caption: 'Sea otters hold hands while they sleep. 🦦', tags: '#seaotter #otters #animalfacts #didyouknow #cute #shorts',
  footer: 'Based on observations of sea otters resting in groups, holding paws and wrapping in kelp. Not every group does this.',
  beats: [
    { d: 4.4, vo: 'Sea otters do something really sweet when they sleep.', tags: [{ t: [0, 0.95], text: 'SLEEPY OTTERS', y: 330, size: 78, bg: '#ffc8d8' }] },
    { d: 4.6, vo: 'They float on their backs and hold paws with each other.', tags: [{ t: [0.05, 0.95], text: 'HOLDING PAWS', y: 330, size: 80, bg: '#ffd86b' }] },
    { d: 4.6, vo: "It's so they don't drift apart while they sleep.", tags: [{ t: [0.05, 0.95], text: "DON'T DRIFT APART", y: 330, size: 66, bg: '#a8d4ff' }] },
    { d: 5.4, vo: 'Some even wrap themselves in kelp, like a blanket made of seaweed.', tags: [{ t: [0.05, 0.95], text: 'KELP BLANKET', y: 330, size: 78, bg: '#b9f0d0' }] },
    { d: 4.4, vo: "It's hard to think of a cozier way to nap.", tags: [{ t: [0.05, 0.95], text: 'SO COZY', y: 330, size: 92, bg: '#ffb0c0' }] },
  ],
  build() { cloud(-40, 60, 170, 1.2); cloud(50, 70, 190, 1.4); cone(-70, -1, 150, 40, 14, 7, [110, 150, 140]); cone(80, -1, 160, 36, 12, 7, [120, 160, 140]); },
  env: () => SEA_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [0, 2.8, -0.5], tg: [0, 0.6, 8] };
    if (i === 1) return { pos: [lerp(-1.5, 1.5, p), 1.6, 3.4], tg: [0, 0.6, 8] };
    if (i === 2) return { pos: [0, 5, -4], tg: [0, 0.4, 8] };
    if (i === 3) return { pos: [2, 2.6, 2], tg: [0, 0.7, 8] };
    return { pos: [0, 2.2, 1], tg: [0, 1.0, 8] };
  },
  dyn(T, i, p) {
    seaDyn(T); const s = 1.25, z = 8, bob = (k) => Math.sin(T * 1.3 + k) * 0.05; let gap = 1.15; if (i === 2) gap = 1.15 + 2.4 * ez(wn(p, 0.05, 0.7));
    otter(-gap, 0.12 + bob(0), z, Math.PI, s, T, {}); otter(gap, 0.12 + bob(1), z, Math.PI, s, T, {});
    if (i !== 2) box(0, 1.4 + bob(0), z - 0.75, gap * 2 - 0.5, 0.22, 0.28, [176, 130, 90]);
    if (i === 0) for (let k = 0; k < 3; k++) num3d('Z', -1.4 + k * 0.6, 2.4 + ((T * 0.5 + k * 0.33) % 1) * 1.6, z - 1.4, 0.3, [255, 255, 255]);
    if (i === 3) { [-gap, gap].forEach((xx) => { box(xx, 1.28 + bob(0), z, 1.6, 0.14, 2.4, [56, 132, 66]); box(xx, 1.36 + bob(0), z - 0.6, 1.3, 0.1, 0.5, [88, 170, 80]); box(xx + 0.9, 0.35, z + 1.6, 0.3, 0.12, 1.6, [80, 160, 70]); }); }
    if (i === 4) for (let k = 0; k < 3; k++) heart3d(-0.6 + k * 0.6, 3 + ((T * 0.4 + k * 0.3) % 1) * 1.6, z - 1.2, 0.3);
  },
  sfx: [[['waves', 0, 4.4], ['squeak', 0.4]], [['waves', 0, 4.6]], [['waves', 0, 4.6], ['whimper', 0.5]], [['waves', 0, 5.4], ['squeak', 0.6]], [['waves', 0, 4.4], ['chime', 0.7, 'D5']]],
  root: ['G2', 'D3', 'B3'],
};

// =====================================================================
//  STORY 13: Giraffe neck bones (did you know)
// =====================================================================
const S_GIRAFFE = {
  id: 'giraffe', title: 'Giraffe Neck',
  caption: 'A giraffe has the same number of neck bones as you do. 🦒', tags: '#giraffe #animalfacts #didyouknow #savanna #wildlife #shorts',
  footer: 'Based on mammal anatomy: nearly all mammals, including giraffes and humans, have seven neck vertebrae. Bone sizes are approximate.',
  beats: [
    { d: 4.4, vo: "How many bones do you think are in a giraffe's neck?", tags: [{ t: [0, 0.95], text: 'HOW MANY?', y: 330, size: 92, bg: '#ffd23f' }] },
    { d: 4.0, vo: 'Seven. Same as you.', tags: [{ t: [0.05, 0.95], text: 'SEVEN', y: 330, size: 110, bg: '#7cf2c0' }] },
    { d: 4.8, vo: 'Almost every mammal has seven, even a mouse.', tags: [{ t: [0.05, 0.95], text: 'EVEN A MOUSE', y: 330, size: 76, bg: '#ffb0c0' }] },
    { d: 5.4, vo: "The giraffe's bones are just a lot bigger. Some are about ten inches long.", tags: [{ t: [0.05, 0.95], text: 'MUCH BIGGER BONES', y: 330, size: 60, bg: '#ffb86b' }] },
    { d: 4.4, vo: 'Same number of bones as you. Just bigger.', tags: [{ t: [0.05, 0.95], text: '7 AND 7', y: 330, size: 96, bg: '#c8b8ff' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, () => 0, (x, z) => ((Math.floor(x / 10) + Math.floor(z / 10)) & 1 ? [246, 206, 100] : [236, 190, 86]), 55);
    const r = rng(6); for (let k = 0; k < 40; k++) { const x = -50 + r() * 100, z = -10 + r() * 90; box(x, 0.5, z, 0.5, 1, 0.5, [120, 200, 82]); box(x + 0.4, 0.35, z + 0.2, 0.4, 0.7, 0.4, [150, 214, 90]); }
    [[-18, 24], [22, 28], [-30, 44], [34, 46], [-8, 54], [12, 62]].forEach(([x, z], k) => acacia(x, z, 1 + (k % 3) * 0.2)); baobab(-26, 72, 1.4); baobab(30, 82, 1.1);
    [[-90, 190, 50, 22, [214, 120, 140]], [-20, 210, 60, 28, [190, 110, 180]], [60, 200, 56, 24, [220, 130, 130]]].forEach(([x, z, rr, h, c]) => cone(x, 0, z, rr, h, 7, c)); cloud(-40, 60, 170, 1.2);
  },
  env: () => SAV,
  cam(i, p) {
    if (i === 0) return { pos: [3, 5.5, -6], tg: [0, 6, 14] };
    if (i === 1) return { pos: [-3, 6, -4], tg: [1, 6, 14] };
    if (i === 2) return { pos: [0, 5, -8], tg: [0, 3.5, 14] };
    if (i === 3) return { pos: [lerp(10, -6, p), 6, 2], tg: [0, 7, 14] };
    return { pos: [0, 7, -5], tg: [0, 7, 14] };
  },
  dyn(T, i, p) {
    if (i === 2) {
      const k = (a, b) => bk(wn(p, a, b));
      person(-6.5, 0, 14, Math.PI, 1.5 * Math.max(0.01, k(0, 0.15)), { shirt: [84, 128, 196], pants: [50, 56, 90] }); dog(-2.8, 0, 14, Math.PI, 1.6 * Math.max(0.01, k(0.1, 0.25)), { col: [200, 150, 90], col2: [150, 100, 60] }); mouse3d(1, 14, 1.4 * Math.max(0.01, k(0.2, 0.35))); giraffe(6.2, 0, 14, Math.PI, 0.5 * Math.max(0.01, k(0.3, 0.45)), T, {});
      [[-6.5, 4.4, 0.4], [-2.8, 3.4, 0.55], [1, 2.4, 0.7], [6.2, 8.2, 0.9]].forEach(([x, y, d], q) => { const kk = k(0.4 + q * 0.12, 0.52 + q * 0.12); if (kk > 0.02) num3d('7', x, y, 13, 0.5 * kk, [255, 255, 255]); });
      return;
    }
    let hl = 0; if (i === 1) hl = Math.min(7, Math.floor(wn(p, 0.1, 0.9) * 8)); else if (i === 3) hl = Math.min(7, Math.floor(wn(p, 0.1, 0.8) * 8)); else if (i === 4) hl = Math.floor(T * 2) % 2 ? 7 : 0;
    giraffe(0, 0, 14, i === 1 ? Math.PI / 2 : Math.PI, 1.0, T, { hl, nod: i === 4 ? Math.sin(T * 1.4) * 0.15 : 0 });
    if (i === 1 && hl > 0) num3d(String(hl), -3.2, 4.9 + (hl - 1) * 0.95, 14, 0.8, [255, 214, 70]);
    if (i === 4) num3d('7', 4.5, 8, 14, 0.9 + 0.1 * Math.sin(T * 3), [255, 214, 70]);
  },
  sfx: [[['wind', 0, 4.4]], [['ping', 0.15], ['ping', 0.3], ['ping', 0.45], ['chime', 0.75, 'G5']], [['wind', 0, 4.8], ['squeak', 0.5]], [['wind', 0, 5.4], ['ping', 0.4]], [['wind', 0, 4.4], ['chime', 0.7, 'D5']]],
  root: ['C3', 'G3', 'E4'],
};

// =====================================================================
//  STORY 14: Bee waggle dance (did you know)
// =====================================================================
const X0 = 200;
function dancePos(T, cx, cy, th, L, per) {
  const u = (((T / per) % 1) + 1) % 1, dx = Math.sin(th), dy = Math.cos(th), px = Math.cos(th), py = -Math.sin(th); let x, y, hx, hy, wag = 0;
  if (u < 0.3 || (u >= 0.5 && u < 0.8)) { const k = u < 0.3 ? u / 0.3 : (u - 0.5) / 0.3; x = cx + dx * L * k; y = cy + dy * L * k; hx = dx; hy = dy; wag = 1; }
  else { const sgn = u < 0.5 ? 1 : -1, k = u < 0.5 ? (u - 0.3) / 0.2 : (u - 0.8) / 0.2, a = k * Math.PI, mx = cx + dx * L / 2, my = cy + dy * L / 2; x = mx + dx * (L / 2) * Math.cos(a) + sgn * px * (L / 2) * Math.sin(a); y = my + dy * (L / 2) * Math.cos(a) + sgn * py * (L / 2) * Math.sin(a); hx = -dx * Math.sin(a) + sgn * px * Math.cos(a); hy = -dy * Math.sin(a) + sgn * py * Math.cos(a); }
  if (wag) { const w = Math.sin(T * 38) * 0.22; x += px * w; y += py * w; }
  return { x, y, h: Math.atan2(hx, hy), wag };
}
function dancer(T, cx, cy, th, L, s) { const d = dancePos(T, cx, cy, th, L, 3.2); bee(d.x, d.y, 38.9, 0, s, T, { wallHead: d.h, wag: d.wag }); }
function watchers(T, cx, cy, s) { [[-4, -1], [4.2, 1], [-3, 4.2], [3.6, -3.6]].forEach(([dx, dy], k) => bee(cx + dx, cy + dy + Math.sin(T * 3 + k) * 0.15, 38.9, 0, s, T, { wallHead: Math.atan2(-dx, -dy) + Math.sin(T * 2 + k) * 0.15 })); }
const HIVE_ENV = { top: [70, 40, 10], bot: [170, 110, 30], fog: [120, 80, 24], sunCol: [255, 214, 150], glow: '255,200,120', sat: 1.2, amb: [0.8, 0.74, 0.62], bright: 1.1, fogNear: 60, fogFar: 260, nosun: 1 };
const S_BEEDANCE = {
  id: 'beedance', title: 'Bee Dance',
  caption: 'Honeybees dance to tell each other where the flowers are. 🐝', tags: '#honeybee #bees #animalfacts #didyouknow #nature #shorts',
  footer: "Based on Karl von Frisch's research on the honeybee waggle dance (Nobel Prize, 1973).",
  beats: [
    { d: 4.8, vo: 'When a honeybee finds flowers, she goes home and dances.', tags: [{ t: [0, 0.95], text: 'THE BEE DANCE', y: 330, size: 74, bg: '#ffd23f' }] },
    { d: 5.6, vo: "It's called a waggle dance. She walks in a line and shakes her body as she goes.", tags: [{ t: [0.05, 0.95], text: 'WAGGLE DANCE', y: 330, size: 76, bg: '#ffb86b' }] },
    { d: 5.8, vo: 'The angle of that line tells the other bees which way to fly, using the sun as a guide.', tags: [{ t: [0.05, 0.95], text: 'ANGLE = DIRECTION', y: 330, size: 62, bg: '#a8d4ff' }] },
    { d: 4.8, vo: 'And the longer she waggles, the farther away the flowers are.', tags: [{ t: [0.05, 0.95], text: 'LONGER = FARTHER', y: 330, size: 66, bg: '#b9f0d0' }] },
    { d: 4.2, vo: 'Then they all head out to find them.', tags: [{ t: [0.05, 0.95], text: 'OFF THEY GO', y: 330, size: 78, bg: '#ffb0c0' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, () => 0, (x, z) => ((Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [110, 178, 104] : [96, 166, 94]), 21);
    const r = rng(8), fc = [[240, 110, 150], [250, 214, 70], [170, 120, 230], [250, 250, 250], [250, 150, 70]]; for (let k = 0; k < 70; k++) flower(-16 + r() * 34, -2 + r() * 30, 0.9 + r() * 0.5, fc[k % 5]);
    roundTree(-14, 16, 1.3, [84, 166, 98]); roundTree(15, 20, 1.5, [96, 176, 90]); cloud(-40, 70, 180, 1.2); cloud(50, 76, 200, 1.4);
    box(X0, 12, 40.4, 40, 30, 0.6, [88, 52, 16]); const r2 = rng(3); for (let row = 0; row < 12; row++) for (let c = 0; c < 14; c++) { const v = 0.85 + r2() * 0.3; box(X0 - 14 + c * 2.1 + (row % 2 ? 1.05 : 0), 1 + row * 1.95, 39.8, 1.8, 1.7, 0.5, [230 * v, 150 * v, 28 * v]); }
  },
  env: (i) => (i >= 1 && i <= 3 ? HIVE_ENV : PARK_ENV),
  cam(i, p) {
    if (i === 0) return { pos: [-3, 3, 2], tg: [1.5, 2.5, 9] };
    if (i === 1) return { pos: [X0, 10, 26], tg: [X0, 10, 40] };
    if (i === 2) return { pos: [X0, 11, 26], tg: [X0 - 1, 11, 40] };
    if (i === 3) return { pos: [X0, 11, 18], tg: [X0, 11, 40] };
    return { pos: [0, 3.5, -4], tg: [0, 2.2, 10] };
  },
  dyn(T, i, p) {
    if (i === 0) {
      flower(1.5, 9, 1.6, [240, 110, 150]); const k = ez(wn(p, 0.2, 0.85)), pos = (t) => { const a = t * 1.6, kk = ez(wn((t - T) + p, 0.2, 0.85)); return [1.5 + Math.cos(a) * 3 * (1 - kk), 3.4 - 0.6 * kk + Math.sin(t * 3) * 0.2, 9 + Math.sin(a) * 3 * (1 - kk)]; };
      const a = [1.5 + Math.cos(T * 1.6) * 3 * (1 - k), 3.4 - 0.6 * k + Math.sin(T * 3) * 0.2, 9 + Math.sin(T * 1.6) * 3 * (1 - k)], b = pos(T + 0.05); bee(a[0], a[1], a[2], Math.atan2(b[0] - a[0], b[2] - a[2]), 1.5, T, {});
    }
    if (i === 1) { dancer(T, X0, 9, 0.5, 4, 1.7); watchers(T, X0, 9, 1.5); }
    if (i === 2) {
      const th = ez(p) * 0.75, dx = Math.sin(th), dy = Math.cos(th); dancer(T, X0, 10, th, 4, 1.7); watchers(T, X0, 10, 1.5);
      for (let k = 1; k <= 7; k++) box(X0 + dx * k * 0.95, 10 + dy * k * 0.95, 38.6, 0.28, 0.28, 0.2, [255, 255, 255], null, { emissive: 1, noedge: 1 }); for (let k = 1; k <= 6; k++) box(X0, 10 + k * 0.95, 38.6, 0.2, 0.2, 0.2, [255, 220, 150], null, { emissive: 1, noedge: 1 });
      blossom(X0 + dx * 8.1, 10 + dy * 8.1, 38.6, 0.9, [240, 110, 150]); box(X0 - 9, 19, 38.6, 2.6, 2.6, 0.3, [255, 224, 90], null, { emissive: 1 }); for (let q = 0; q < 8; q++) { const a = (q / 8) * TAU; box(X0 - 9 + Math.cos(a) * 2.5, 19 + Math.sin(a) * 2.5, 38.6, 0.5, 0.5, 0.3, [255, 224, 90], null, { emissive: 1, noedge: 1 }); }
    }
    if (i === 3) {
      dancer(T, X0 - 6.5, 9, 0.5, 2.4, 1.6); dancer(T, X0 + 6.5, 9, 0.5, 6.2, 1.6); const d1 = [Math.sin(0.5), Math.cos(0.5)];
      blossom(X0 - 6.5 + d1[0] * 4.2, 9 + d1[1] * 4.2, 38.6, 0.8, [240, 110, 150]); blossom(X0 + 6.5 + d1[0] * 8.8, 9 + d1[1] * 8.8, 38.6, 0.8, [170, 120, 230]);
      watchers(T, X0 - 6.5, 9, 1.2); watchers(T, X0 + 6.5, 9, 1.2);
    }
    if (i === 4) {
      flower(7, 16, 1.5, [240, 110, 150]); flower(5, 18, 1.3, [250, 214, 70]); flower(9, 18, 1.4, [170, 120, 230]);
      box(-6, 0.9, 6, 2.4, 1.8, 2.4, [236, 226, 196]); box(-6, 2.0, 6, 2.7, 0.4, 2.7, [200, 150, 90]); box(-6, 0.45, 4.78, 1.2, 0.5, 0.1, [50, 30, 20]); [-1, 1].forEach((d) => box(-6 + d * 0.9, 0.2, 6, 0.3, 0.4, 2.0, [150, 100, 60]));
      for (let k = 0; k < 7; k++) { const u = (((T * 0.35 + k * 0.15) % 1) + 1) % 1, x = lerp(-6, 7, u), z = lerp(5, 15.5, u), y = 1.6 + Math.sin(u * Math.PI) * 2.4 + Math.sin(T * 4 + k) * 0.25; bee(x, y, z, Math.atan2(13, 10.5), 1.2, T, {}); }
    }
  },
  sfx: [[['buzz', 0.4, 3.8]], [['buzz', 0, 5.6]], [['buzz', 0, 5.8], ['ping', 0.7]], [['buzz', 0, 4.8], ['ping', 0.5]], [['buzz', 0, 4.2], ['chime', 0.7, 'D5']]],
  root: ['A2', 'E3', 'C4'],
};

// =====================================================================
//  STORY 15: Strange dog charging (survival)
// =====================================================================
const BD = { col: [160, 108, 64], col2: [96, 64, 40] }, PS = { shirt: [84, 128, 196], pants: [50, 56, 90], pack: [240, 150, 60], hair: [70, 48, 36] };
const chaseZ = (p) => lerp(2, -5, ez(wn(p, 0.1, 1)));
const S_STRAYDOG = {
  id: 'straydog', title: 'Strange Dog',
  caption: 'What to do if a strange dog runs at you. Save this for your next walk. 🐕', tags: '#dogs #safety #survival #walking #howto #shorts',
  footer: 'General safety advice. If you are bitten, wash the wound and get medical care. Follow local guidance.',
  beats: [
    { d: 4.6, vo: "A dog you don't know is running right at you. What do you do?", tags: [{ t: [0, 0.95], text: 'STRANGE DOG!', y: 330, size: 84, bg: '#ff8a3d' }] },
    { d: 4.6, vo: "Don't run. Running makes most dogs want to chase.", tags: [{ t: [0.05, 0.95], text: "DON'T RUN", y: 330, size: 92, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 5.0, vo: "Stand still, keep your hands close, and don't stare it in the eyes.", tags: [{ t: [0.05, 0.95], text: 'STAND STILL', y: 330, size: 84, bg: '#7cf2c0' }] },
    { d: 5.4, vo: 'Talk in a calm, low voice. Then back away slowly, sideways if you can.', tags: [{ t: [0.05, 0.95], text: 'BACK AWAY SLOWLY', y: 330, size: 64, bg: '#a8d4ff' }] },
    { d: 5.6, vo: 'If it keeps coming, put something between you and it. A bag, a jacket, anything.', tags: [{ t: [0.05, 0.95], text: 'PUT SOMETHING BETWEEN', y: 330, size: 54, bg: '#ffd23f' }] },
  ],
  build: parkBuild, env: () => PARK_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [-4, 1.8, -3], tg: [1, 1, 10] };
    if (i === 1) { const cz = chaseZ(p); return { pos: [-9, 2.2, cz + 1], tg: [0, 1.2, cz + 1] }; }
    if (i === 2) return { pos: [-6, 1.6, -1], tg: [1, 1.1, 4] };
    if (i === 3) { const cz = lerp(2, -2.5, p) + 2; return { pos: [-7, 1.7, cz], tg: [0, 1.1, cz] }; }
    return { pos: [-6, 1.6, -1], tg: [0, 1.1, 2.5] };
  },
  dyn(T, i, p) {
    const bark = (dx, dz) => { const a = (T * 1.3) % 1; ring3d(dx, 1.8, dz, 0.2 + a * 1.2, 0.1, [255, 255, 255]); };
    if (i === 0) { const dz = lerp(26, 11, eo(p)); person(0, 0, 2, 0, 1.15, Object.assign({ walk: T * 5, amp: 0.5 }, PS)); dog(2.5, 0, dz, Math.PI, 1.6, Object.assign({ walk: T * 14, amp: 0.9, dip: Math.sin(T * 10) * 0.1 }, BD)); shadow(2.5, dz, 0.9, 1.4, 0); if (p > 0.4) bark(2.5, dz - 1.6); }
    if (i === 1) { const pz = chaseZ(p), dz = lerp(11, pz + 3.2, ez(wn(p, 0.1, 1))); person(0, 0, pz, Math.PI, 1.15, Object.assign({ walk: T * 13, amp: 1 }, PS)); dog(lerp(2.5, 0.5, p), 0, dz, Math.PI, 1.6, Object.assign({ walk: T * 16, amp: 1 }, BD)); xmark(0, 3.5, pz, 0.9); }
    if (i === 2) { const dz = lerp(9, 5.4, eo(p)); person(0, 0, 2, 0, 1.15, Object.assign({ armL: 0, armR: 0 }, PS)); dog(1.6, 0, dz, Math.PI, 1.6, Object.assign({ walk: p < 0.7 ? T * 5 : 0, amp: 0.4, dip: 0.15 * wn(p, 0.5, 1) }, BD)); }
    if (i === 3) { const pz = lerp(2, -2.5, p), dz = p < 0.6 ? pz + lerp(5.5, 7, p) : pz + 7; person(0, 0, pz, Math.PI / 2, 1.15, Object.assign({ walk: T * 3, amp: 0.25 }, PS)); dog(1.6, 0, dz, Math.PI, 1.6, Object.assign({ pose: p > 0.65 ? 'sit' : 'stand', walk: T * 5, amp: p > 0.65 ? 0 : 0.4, wag: T * 3 }, BD)); }
    if (i === 4) { const g = person(0, 0, 0, 0, 1.15, Object.assign({ armR: -1.3, armL: -1.3 }, PS)); box(g.hR[0] - 0.2, 1.4, g.hR[2] + 0.3, 1.0, 0.8, 0.4, [220, 120, 50]); const dz = lerp(6, 3.8, eo(wn(p, 0, 0.5))); dog(1.2, 0, dz, Math.PI, 1.6, Object.assign({ pose: p > 0.7 ? 'sit' : 'stand', walk: p < 0.5 ? T * 6 : 0, amp: 0.4, dip: 0.1 }, BD)); }
  },
  sfx: [[['bark', 0.45], ['steps', 0.2]], [['bark', 0.2], ['steps', 0.1]], [['whimper', 0.5]], [['steps', 0.1], ['whimper', 0.6]], [['bark', 0.15], ['ping', 0.7]]],
  root: ['E2', 'B2', 'D3'],
};

// =====================================================================
//  STORY 16: Bees chasing you (survival)
// =====================================================================
const S_BEESWARM = {
  id: 'beeswarm', title: 'Bees Chasing You',
  caption: 'What to do if bees start chasing you. 🐝', tags: '#bees #safety #survival #outdoors #howto #shorts',
  footer: 'General safety advice. If you are stung and feel dizzy, short of breath or swollen, call emergency services. Allergies make this much more serious.',
  beats: [
    { d: 4.4, vo: "Bees are chasing you, and you don't know where to go.", tags: [{ t: [0, 0.95], text: 'BEES!', y: 330, size: 110, bg: '#ffd23f' }] },
    { d: 4.4, vo: "Don't swat at them. Swatting just makes them angrier.", tags: [{ t: [0.05, 0.95], text: "DON'T SWAT", y: 330, size: 92, bg: '#ff4d4d', col: '#ffffff' }] },
    { d: 5.0, vo: 'Cover your face and head, and run in a straight line.', tags: [{ t: [0.05, 0.95], text: 'COVER YOUR FACE', y: 330, size: 70, bg: '#7cf2c0' }] },
    { d: 6.0, vo: "Head for a car or a building. Water won't help, they'll wait for you to come up.", tags: [{ t: [0.05, 0.95], text: 'GET INSIDE', y: 330, size: 86, bg: '#a8d4ff' }] },
    { d: 6.0, vo: 'Scrape stingers out with a card. If you feel dizzy or your face swells, call for help.', tags: [{ t: [0.05, 0.95], text: 'SCRAPE, DON\'T SQUEEZE', y: 330, size: 58, bg: '#ffb86b' }] },
  ],
  build() { parkBuild(); roundTree(8, 10, 1.6, [84, 166, 98]); box(6.3, 3.3, 10, 1.3, 1.7, 1.3, [222, 196, 120]); box(6.3, 3.0, 9.3, 0.5, 0.4, 0.1, [60, 40, 20]); box(-5, 0.06, 30, 7, 0.2, 6, [70, 150, 210], null, { bias: -1 }); house(8, 38, true); },
  env: () => PARK_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [-2, 2.6, -2], tg: [5, 3, 8] };
    if (i === 1) return { pos: [-4, 1.8, 2], tg: [3, 1.4, 10] };
    if (i === 2) { const z = lerp(6, 26, ez(p)); return { pos: [-4, 2.2, z - 6], tg: [4, 1.3, z + 3] }; }
    if (i === 3) return { pos: [-3, 2.6, 22], tg: [4, 1.5, 31] };
    return { pos: [-1, 1.9, 5], tg: [3, 1.3, 10] };
  },
  dyn(T, i, p) {
    const SH = { shirt: [214, 98, 86], pants: [56, 78, 140], hair: [70, 48, 36] };
    if (i === 0) { person(3, 0, 3, 0, 1.1, Object.assign({ armL: -0.6 }, SH)); swarm(T, 6.3, 3.6, 9.5, 24, 2.4, 2); }
    if (i === 1) { person(4, 0, 6.5, Math.PI, 1.1, Object.assign({ armL: -2.4 + Math.sin(T * 14) * 0.8, armR: -2.4 + Math.cos(T * 14) * 0.8 }, SH)); swarm(T, 4, 2, 6.5, 24, 1.8, 3); xmark(4, 4.4, 6.5, 0.9); }
    if (i === 2) { const z = lerp(6, 26, ez(p)); person(4, 0, z, 0, 1.1, Object.assign({ walk: T * 13, amp: 1, armL: -2.0, armR: -2.0 }, SH)); swarm(T, 4, 2, z - 1.4, 24, 1.8, 3); }
    if (i === 3) { const k = eo(p), x = lerp(4, 8, k), z = lerp(26, 33, k); if (p < 0.85) person(x, 0, z, Math.atan2(8 - x, 34 - z), 1.1, Object.assign({ walk: T * 13, amp: 1, armL: -2.0, armR: -2.0 }, SH)); swarm(T, lerp(4, 8, wn(p, 0.5, 1)), 2.4, lerp(24, 31, wn(p, 0.5, 1)), 24, 2, 2.5); xmark(-5, 3, 30, 1.1); }
    if (i === 4) { person(3, 0, 10, Math.PI, 1.1, Object.assign({ bend: 0.15, armL: -1.2, armR: -1.4 + Math.sin(T * 5) * 0.25, item: [240, 240, 250] }, SH)); }
  },
  sfx: [[['buzz', 0, 4.4], ['heart', 0.5]], [['buzz', 0, 4.4]], [['buzz', 0, 5], ['steps', 0.1]], [['buzz', 0, 4.5], ['door', 0.8]], [['ping', 0.6], ['whoosh', 0.2]]],
  root: ['F3', 'C4', 'A4'],
};

// =====================================================================
//  STORY 17: Baby bird on the ground (help)
// =====================================================================
const FLO = { back: [150, 134, 114], breast: [196, 176, 146], head: [160, 142, 120], wing: [112, 98, 82], beak: [240, 200, 80], big: 3 };
const KID = { shirt: [236, 120, 150], pants: [60, 70, 150], hair: [60, 36, 28] };
const S_FLEDGE = {
  id: 'fledgling', title: 'Baby Bird on the Ground',
  caption: "Found a baby bird on the ground? Most of the time it doesn't need rescuing. 🐦", tags: '#birds #wildlife #howto #animalrescue #nature #shorts',
  footer: 'General advice. If the bird is clearly hurt, bleeding, or a tiny chick with no feathers, call a local wildlife rehabilitator. Rules differ by region.',
  beats: [
    { d: 4.6, vo: 'You found a baby bird on the ground. Before you pick it up, wait.', tags: [{ t: [0, 0.95], text: 'WAIT FIRST', y: 330, size: 92, bg: '#ffd23f' }] },
    { d: 5.4, vo: "If it has feathers and hops around, it's probably a fledgling. That's normal.", tags: [{ t: [0.05, 0.95], text: 'FEATHERS? LEAVE IT', y: 330, size: 66, bg: '#7cf2c0' }] },
    { d: 5.4, vo: 'Its parents are almost always close by. They keep feeding it on the ground.', tags: [{ t: [0.05, 0.95], text: 'PARENTS ARE NEAR', y: 330, size: 68, bg: '#ffb0c0' }] },
    { d: 4.8, vo: "If it's in danger, moving it to a bush close by is fine.", tags: [{ t: [0.05, 0.95], text: 'MOVE IT TO A BUSH', y: 330, size: 66, bg: '#b9f0d0' }] },
    { d: 5.0, vo: 'No feathers at all, or clearly hurt? Then call a wildlife rescue.', tags: [{ t: [0.05, 0.95], text: 'NO FEATHERS = CALL', y: 330, size: 66, bg: '#ff8a3d' }] },
  ],
  build: parkBuild, env: () => PARK_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [-4.5, 1.8, -1.5], tg: [-0.2, 1, 6] };
    if (i === 1) return { pos: [lerp(-1, 1.6, p), 1.2, 3.8], tg: [1.2, 0.8, 7] };
    if (i === 2) return { pos: [0.5, 1.6, 3.6], tg: [3, 1, 7.3] };
    if (i === 3) return { pos: [-5, 2, 2.5], tg: [-1, 1.1, 7.5] };
    return { pos: [-0.5, 1.8, 2.6], tg: [0.8, 0.9, 6.5] };
  },
  dyn(T, i, p) {
    const hop = Math.abs(Math.sin(T * 2.4)) * 0.25 * (Math.sin(T * 0.8) > 0 ? 1 : 0);
    if (i === 0) { const kx = lerp(-4, -1.4, ez(p)); person(kx, 0, 4, Math.atan2(1.2 - kx, 3), 0.85, Object.assign({ walk: T * 5, amp: p < 0.9 ? 0.5 : 0 }, KID)); bird(1.2, hop, 7, Math.PI + 0.3, 1.7, T, FLO); num3d('?', kx, 3.2, 4, 0.35, [255, 230, 90]); shadow(1.2, 7, 0.6, 0.5, 0); }
    if (i === 1) { bird(1.2, hop, 7, Math.PI + 0.3, 1.9, T, FLO); warn3d(1.2, 2.7, 6.5, 0.5); person(-1.6, 0, 5, 0.7, 0.85, Object.assign({ bend: 0.15 }, KID)); }
    if (i === 2) {
      const x = lerp(5, 2.6, ez(wn(p, 0, 0.4))), pk = Math.abs(Math.sin(T * 5)) * 0.2 * (p < 0.4 ? 1 : 0);
      bird(1.2, 0, 7, Math.PI + 0.3, 1.8, T, Object.assign({ beakOpen: p > 0.5 ? 1 : 0 }, FLO)); bird(x, pk, 7.3, -Math.PI / 2, 2.4, T, {});
      const wk = ez(wn(p, 0.5, 0.75)); box(lerp(x - 0.9, 1.7, wk), lerp(1.0, 0.8, wk), lerp(7.3, 7, wk), 0.5, 0.12, 0.12, [236, 150, 160]); if (p > 0.7) heart3d(1.2, 2.8, 7, 0.4 * bk(wn(p, 0.7, 0.85)));
    }
    if (i === 3) {
      const k = ez(wn(p, 0.2, 0.85)); person(-0.4, 0, 6, 0.9, 0.85, Object.assign({ bend: 0.45 }, KID)); bird(lerp(1.2, -2.6, k), Math.sin(Math.PI * k) * 1.3, lerp(7, 8.6, k), Math.PI / 2 + 0.4, 1.7, T, FLO);
      box(-3.3, 0.8, 9, 2.6, 1.6, 1.8, [60, 150, 80]); box(-3, 1.9, 8.9, 1.8, 0.8, 1.4, [80, 170, 90]);
    }
    if (i === 4) {
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([a, b]) => box(1.5 + a * 0.9, 0.2, 7 + b * 0.9, a ? 0.4 : 1.8, 0.4, b ? 0.4 : 1.8, [150, 110, 70])); box(1.5, 0.12, 7, 1.6, 0.2, 1.6, [190, 160, 110]);
      chick(1.5, 0.2, 7, Math.PI, 1.5, T); person(-1.2, 0, 5.2, 0.8, 0.85, Object.assign({ phone: 1, armR: -1.2 }, KID)); const a = (T * 0.8) % 1; ring3d(-0.9, 1.4, 5.1, 0.2 + a * 0.8, 0.07, [230, 245, 255]);
    }
  },
  sfx: [[['tweet', 0.3]], [['tweet', 0.2], ['tweet', 0.6]], [['tweet', 0.1], ['flap', 0.25]], [['steps', 0.2], ['tweet', 0.6]], [['tweet', 0.2], ['ping', 0.6]]],
  root: ['G2', 'D3', 'B3'],
};

// =====================================================================
//  STORY 18: Turtle on the road (help)
// =====================================================================
const HV = { shirt: [200, 255, 70], pants: [50, 56, 90], hair: [70, 48, 36] };
const S_TURTLE = {
  id: 'turtle', title: 'Turtle on the Road',
  caption: 'Turtle crossing the road? Here is how to help it. 🐢', tags: '#turtle #wildlife #howto #roadsafety #animalrescue #shorts',
  footer: 'General advice. Your safety comes first. Never pick up a snapping turtle by its tail. Rules and who to call differ by region.',
  beats: [
    { d: 4.6, vo: "There's a turtle in the middle of the road. Should you help?", tags: [{ t: [0, 0.95], text: 'TURTLE ON THE ROAD', y: 330, size: 60, bg: '#7cf2c0' }] },
    { d: 4.8, vo: "Only if it's safe for you. Pull over and put your hazard lights on.", tags: [{ t: [0.05, 0.95], text: 'SAFETY FIRST', y: 330, size: 80, bg: '#ffd23f' }] },
    { d: 5.4, vo: 'Carry it the way it was already going, even if that seems like the wrong way.', tags: [{ t: [0.05, 0.95], text: 'SAME DIRECTION', y: 330, size: 72, bg: '#a8d4ff' }] },
    { d: 6.2, vo: 'Hold it by the sides of the shell, low to the ground. A big snapping turtle? Slide a car mat under it instead.', tags: [{ t: [0.05, 0.95], text: 'HOLD THE SHELL SIDES', y: 330, size: 58, bg: '#ffb86b' }] },
    { d: 5.0, vo: "Set it down well off the road, and let it go. Don't take it home.", tags: [{ t: [0.05, 0.95], text: "DON'T TAKE IT HOME", y: 330, size: 66, bg: '#b9f0d0' }] },
  ],
  build() { ROAD.build(); },
  env: () => ROAD.env(0),
  cam(i, p) {
    if (i === 0) return { pos: [-9, 1.6, 6], tg: [0, 0.6, 12] };
    if (i === 1) return { pos: [-6, 1.8, 0], tg: [2, 1.2, 8] };
    if (i === 2) return { pos: [-4, 2, 5], tg: [1, 1, 12] };
    if (i === 3) return { pos: [-5, 2.2, 7], tg: [0, 0.8, 12] };
    return { pos: [3, 2, 4], tg: [8, 0.8, 12] };
  },
  dyn(T, i, p) {
    if (i === 0) { turtle(lerp(-3, -1, p), 0, 12, Math.PI / 2, 1.3, T, { walk: T * 3 }); car(-2.2, 0, lerp(-30, 2, eo(p * 0.9)), 0, 1, { col: [70, 150, 255] }); }
    if (i === 1) { const k = ez(wn(p, 0.2, 0.8)); turtle(-1, 0, 12, Math.PI / 2, 1.3, T, { amp: 0, dip: -0.1 }); car(lerp(-1.8, 6.2, k), 0, lerp(-14, 6, eo(p)), lerp(0, 0.12, k), 1, { haz: 1, T }); }
    if (i === 2) {
      const k = ez(wn(p, 0.4, 0.95)), x = lerp(-1, 3, k); car(6.2, 0, 4, 0.12, 1, { haz: 1, T }); const g = person(x - 0.6, 0, 11, Math.PI / 2, 1.1, Object.assign({ bend: 0.5 * (1 - k * 0.5), armL: -1.3, armR: -1.3 }, HV)); turtle(x + 0.2, 0.75 + 0.2 * (1 - k), 11.8, Math.PI / 2, 0.5, T, { amp: 0.4, walk: T * 6 });
      box(2.4, 0.06, 12.4, 4, 0.1, 0.5, [255, 230, 60], null, { emissive: 1, noedge: 1 }); box(5.1, 0.06, 12.4, 0.5, 0.1, 1.6, [255, 230, 60], null, { emissive: 1, noedge: 1 });
    }
    if (i === 3) { const x = lerp(-3, 3, ez(p)); box(x, 0.06, 12, 3.2, 0.1, 2.6, [40, 44, 60]); turtle(x, 0.12, 12, Math.PI / 2, 1.2, T, { amp: 0 }); person(x + 3.4, 0, 12, -Math.PI / 2, 1.1, Object.assign({ bend: 0.3, armL: -0.9, armR: -0.9, walk: T * 4, amp: 0.3 }, HV)); car(6.2, 0, 4, 0.12, 1, { haz: 1, T }); }
    if (i === 4) { const x = lerp(6, 10, ez(p)); turtle(x, 0, 12, Math.PI / 2, 1.2, T, { walk: T * 3 }); person(8, 0, 9, Math.PI, 1.1, Object.assign({ armR: -0.4 }, HV)); car(6.2, 0, 2, 0.12, 1, { haz: 1, T }); if (p > 0.6) heart3d(x, 2.5, 12, 0.35 * bk(wn(p, 0.6, 0.8))); }
  },
  sfx: [[['car', 0.2], ['beep', 0.5]], [['car', 0.1], ['beep', 0.4]], [['steps', 0.3]], [['steps', 0.2], ['beep', 0.5]], [['steps', 0.3], ['chime', 0.8, 'D5']]],
  root: ['E2', 'B2', 'D3'],
};

// =====================================================================
//  STORY 19: Smoky the war dog (true story)
// =====================================================================
const SMK = { col: [150, 128, 104], col2: [214, 170, 100] }, SOL = { shirt: [96, 112, 70], pants: [84, 96, 64], hat: [78, 94, 60], hair: [70, 48, 36] };
const TROP_ENV = { top: [40, 150, 235], bot: [255, 236, 196], fog: [230, 232, 214], sunCol: [255, 240, 205], glow: '255,238,190', sat: 1.25, amb: [0.7, 0.7, 0.76], bright: 1.05, fogNear: 50, fogFar: 230 };
const sandbags = (x, z, n) => { for (let k = 0; k < n; k++) for (let r = 0; r < 2; r++) box(x + k * 1.2 + (r % 2) * 0.6, 0.3 + r * 0.55, z, 1.1, 0.5, 0.7, [196, 176, 130]); };
const S_SMOKY = {
  id: 'smoky', title: 'Smoky the War Dog',
  caption: 'The true story of Smoky, a tiny dog who helped soldiers in World War Two. 🐕 (Based on a documented true story, told briefly.)', tags: '#smoky #truestory #dogs #history #animalstories #shorts',
  footer: 'Based on the documented story of Smoky, a Yorkshire terrier who served in the Pacific in 1944 and 1945. Told briefly, and some figures are approximate.',
  beats: [
    { d: 4.4, vo: "She weighed about four pounds, and she's a war hero.", tags: [{ t: [0, 0.95], text: 'FOUR POUNDS', y: 330, size: 84, bg: '#ffd23f' }] },
    { d: 6.4, vo: 'In 1944, a soldier found her in a foxhole in New Guinea. She ended up with a corporal named Bill Wynne, who called her Smoky.', tags: [{ t: [0.05, 0.95], text: '1944', y: 330, size: 100, bg: '#b9c4ff' }] },
    { d: 6.0, vo: 'Soldiers needed to run a telegraph wire under an airfield, through a pipe about seventy feet long.', tags: [{ t: [0.05, 0.95], text: 'A 70 FOOT PIPE', y: 330, size: 70, bg: '#ffb86b' }] },
    { d: 6.2, vo: 'Smoky crawled through with a string tied on, and the soldiers pulled the wire after her. It saved them days of work.', tags: [{ t: [0.05, 0.95], text: 'SHE DID IT', y: 330, size: 84, bg: '#7cf2c0' }] },
    { d: 5.6, vo: 'She also cheered up wounded soldiers, and some people call her the first therapy dog.', tags: [{ t: [0.05, 0.95], text: 'FIRST THERAPY DOG?', y: 330, size: 62, bg: '#ffb0c0' }] },
  ],
  build() {
    groundG(XS_A, ZS_A, () => 0, (x, z) => ((Math.floor(x / 8) + Math.floor(z / 8)) & 1 ? [236, 214, 160] : [226, 202, 148]), 31);
    [[-16, 22], [18, 26], [-24, 40], [26, 44], [-8, 52]].forEach(([x, z], k) => palm(x, z, 1.2, 0, k)); cloud(-40, 66, 170, 1.2); cloud(55, 74, 190, 1.4);
    [[-90, 190, 50, 22, [110, 150, 120]], [20, 210, 60, 26, [120, 160, 130]], [90, 195, 44, 20, [100, 140, 120]]].forEach(([x, z, r, h, c]) => cone(x, 0, z, r, h, 7, c));
    box(-12, 1.6, 20, 7, 3.2, 5, [98, 112, 74]); box(-12, 3.4, 20, 7.6, 0.5, 5.6, [86, 100, 64]); box(14, 1.6, 22, 6, 3.2, 5, [98, 112, 74]); box(14, 3.4, 22, 6.6, 0.5, 5.6, [86, 100, 64]);
  },
  env: () => TROP_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [lerp(-2, 2, p), 1.6, 3], tg: [0, 0.9, 8] };
    if (i === 1) return { pos: [-3, 3, 1], tg: [1, 0.8, 8] };
    if (i === 2) return { pos: [0, 5, 0], tg: [0, 0.4, 14] };
    if (i === 3) return { pos: [0, 9, 8], tg: [0, 0, 14] };
    return { pos: [-2, 1.8, 2], tg: [1, 1, 8] };
  },
  dyn(T, i, p) {
    const pipe = () => { box(0, 0.15, 14, 24, 0.3, 2.4, [110, 112, 122]); box(0, 1.0, 12.9, 24, 1.4, 0.35, [128, 130, 142]); box(0, 1.0, 15.1, 24, 1.4, 0.35, [128, 130, 142]); };
    if (i === 0) { dog(0, 0.55, 8, Math.PI, 0.55, T, Object.assign({}, SMK)); }
    if (i === 0) { sandbags(-4, 9, 5); }
    if (i === 1) { box(1, -0.5, 8, 4, 1, 3.6, [120, 96, 66]); sandbags(-2, 10.4, 5); dog(1, 0.15, 8, Math.PI, 0.6, { pose: 'sit', ...SMK, wag: T * 8 }); person(-1.6, 0, 7, 1.2, 1.05, Object.assign({ bend: 0.35, armR: -0.8 }, SOL)); }
    if (i === 2) { pipe(); person(-11, 0, 14, Math.PI / 2, 1.05, SOL); person(11, 0, 14, -Math.PI / 2, 1.05, SOL); num3d('70', 0, 5, 14, 0.7, [255, 214, 70]); for (let k = 0; k <= 12; k++) box(-12 + k * 2, 2.1, 12.7, 0.12, 0.5, 0.1, [255, 255, 255], null, { emissive: 1, noedge: 1 }); }
    if (i === 3) { pipe(); const x = lerp(-11, 11, ez(wn(p, 0.05, 0.85))); dog(x, 0.3, 14, Math.PI / 2, 0.42, { walk: T * 12, amp: 0.4, ...SMK }); box((x - 12) / 2 - 0.5, 0.45, 14, x + 12 - 0.5 > 0 ? Math.max(0.2, x + 11.5) : 0.2, 0.08, 0.08, [240, 240, 255]); person(-12.6, 0, 14, Math.PI / 2, 1.05, SOL); person(12.4, 0, 14, -Math.PI / 2, 1.05, Object.assign({ armL: -2.4, armR: -2.4 }, SOL)); }
    if (i === 4) { box(0, 0.4, 8, 4, 0.8, 2, [120, 96, 66]); box(0, 0.85, 8, 3.8, 0.3, 1.8, [236, 236, 230]); dog(0.4, 0.95, 8, Math.PI, 0.6, { pose: 'sit', ...SMK, wag: T * 8 }); person(-2.4, 0, 8, Math.PI / 2, 1.1, Object.assign({ armR: -0.7, bend: 0.2, hat: [250, 250, 250] }, SOL)); if (p > 0.3) heart3d(0.4, 3.0 + Math.sin(T * 2) * 0.1, 8, 0.4 * bk(wn(p, 0.3, 0.5))); }
  },
  sfx: [[['wind', 0, 4.4]], [['steps', 0.4], ['bark', 0.7]], [['wind', 0, 6], ['knock', 0.6]], [['steps', 0.1], ['squeak', 0.6]], [['whimper', 0.3], ['chime', 0.8, 'D5']]],
  root: ['A2', 'E3', 'C4'],
};

// =====================================================================
//  STORY 20: The owl and the lost rabbit (fiction)
// =====================================================================
const S_OWLRABBIT = {
  id: 'owlrabbit', title: 'The Owl and the Lost Rabbit',
  caption: 'A short story about a night in the woods. 🦉 (This is a made-up story.)', tags: '#shortstory #fiction #owl #rabbit #animalstories #shorts',
  footer: 'A fictional story, written for entertainment.',
  beats: [
    { d: 5.0, vo: "It got dark fast, and the little rabbit couldn't find his burrow.", tags: [{ t: [0, 0.95], text: 'A SHORT STORY', y: 330, size: 74, bg: '#ffc8d8' }] },
    { d: 4.8, vo: 'Every tree looked the same. He sat down and stopped hopping.', tags: [{ t: [0.05, 0.95], text: 'LOST', y: 330, size: 110, bg: '#c8d0e8' }] },
    { d: 4.6, vo: 'Up on a branch, an old owl heard him sniffling.', tags: [{ t: [0.05, 0.95], text: 'A VISITOR', y: 330, size: 80, bg: '#ffd86b' }] },
    { d: 5.4, vo: "She didn't say much. She just flew low, one tree at a time, and he followed.", tags: [{ t: [0.05, 0.95], text: 'FOLLOW ME', y: 330, size: 82, bg: '#b9f0d0' }] },
    { d: 5.6, vo: 'At his burrow he turned to say thanks, but she was already gone.', tags: [{ t: [0.05, 0.95], text: 'HOME', y: 330, size: 110, bg: '#ffb0c0' }] },
  ],
  build() { darkForest(88, 50); box(-6, 5, 10, 2, 10, 2, [80, 58, 40]); box(-3.4, 6.6, 10, 6, 0.7, 0.9, [96, 70, 48]); box(-6, 11, 10, 6, 2.4, 5, [24, 96, 78]); box(9, 0.8, 14, 5, 1.6, 4, [70, 52, 38]); box(9, 0.6, 11.95, 1.5, 1.2, 0.3, [10, 8, 10]); box(9, 1.5, 11.9, 2, 0.3, 0.3, [96, 70, 48]); },
  env: () => NIGHT_ENV,
  cam(i, p) {
    if (i === 0) return { pos: [0, 1.8, -2], tg: [0, 1, 9] };
    if (i === 1) { const a = lerp(0, 2.2, p); return { pos: [Math.sin(a) * 8, 2.2, 8 - Math.cos(a) * 8], tg: [0, 1.2, 8] }; }
    if (i === 2) return { pos: [-1, 3.2, 2], tg: [-3.5, 5.5, 10] };
    if (i === 3) return { pos: [lerp(-4, 4, p), 2.5, 2], tg: [lerp(0, 8, p), 2, 12] };
    return { pos: [6, 2.2, 5], tg: [10, 4, 14] };
  },
  dyn(T, i, p) {
    fireflies(T, 4, 10, 12);
    if (i === 0) rabbit(0, 0, 8, Math.PI, 1.3, T, { dip: 0.15 + Math.sin(T * 2) * 0.05, look: Math.sin(T * 0.8) * 0.5 });
    if (i === 1) rabbit(0, 0, 8, Math.PI, 1.3, T, { droop: 0.8, dip: 0.2, look: Math.sin(T * 1.5) * 0.8 });
    if (i === 2) { rabbit(0.5, 0, 7, Math.PI + 0.3, 1.3, T, { droop: 0.8, dip: 0.25 }); owl(-3.8, 6.95, 10, Math.PI + 0.35, 1.0, T, { look: -0.3 + Math.sin(T * 0.7) * 0.15, blink: slowBlink(T) }); }
    if (i === 3) {
      const k = ez(wn(p, 0.05, 0.95)), ox = lerp(-3.8, 8, k), oy = lerp(6.2, 1.8, eo(wn(p, 0, 0.5))) + Math.sin(T * 3) * 0.2, rx = lerp(0, 7.4, ez(wn(p, 0.18, 1)));
      owl(ox, oy, lerp(10, 13, k), Math.PI / 2, 1.0, T, { fly: 1 }); rabbit(rx, Math.abs(Math.sin(T * 6)) * 0.6, lerp(8, 12, k), Math.PI / 2, 1.2, T, { hop: 0 });
    }
    if (i === 4) { rabbit(8.4, 0, 11.4, -Math.PI / 2 - 0.5, 1.2, T, { look: -0.5 + Math.sin(T * 0.8) * 0.15 }); const ox = lerp(24, 54, p); owl(ox, 54, 160, Math.PI / 2, 3, T, { fly: 1 }); heart3d(8.4, 3.6 + Math.sin(T * 2) * 0.1, 11.4, 0.3 * bk(wn(p, 0.5, 0.7))); }
  },
  sfx: [[['crickets', 0, 5], ['wind', 0, 5]], [['crickets', 0, 4.8], ['whimper', 0.4]], [['crickets', 0, 4.6], ['hoot', 0.3]], [['flap', 0.1], ['flap', 0.4], ['steps', 0.5]], [['crickets', 0, 5.6], ['chime', 0.75, 'D5']]],
  root: ['F3', 'C4', 'A4'],
};

// ---------- add the new stories to the list ----------
STORIES.push(S_OWL, S_OTTER, S_GIRAFFE, S_BEEDANCE, S_STRAYDOG, S_BEESWARM, S_FLEDGE, S_TURTLE, S_SMOKY, S_OWLRABBIT);
[[S_OWL, 'dyk'], [S_OTTER, 'dyk'], [S_GIRAFFE, 'dyk'], [S_BEEDANCE, 'dyk'], [S_STRAYDOG, 'survival'], [S_BEESWARM, 'survival'], [S_FLEDGE, 'help'], [S_TURTLE, 'help'], [S_SMOKY, 'tale'], [S_OWLRABBIT, 'fiction']].forEach(([s, k]) => { s.kind = k; });
