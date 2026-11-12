'use strict';
// =====================================================================
//  engine_plus.js  -- loaded by story.html AFTER the engine and the content files.
//  It upgrades the engine by replacing functions: humans with joints, more animations,
//  more characters/animals/robots, textures, VFX, camera moves, transitions, looks (themes).
//  Settings you may want to change are in the CONFIG block right below.
// =====================================================================
(() => {
  // ---------------------------------------------------------------- CONFIG
  window.BAN_SFX = ['chime', 'bell', 'magic', 'beep', 'pop', 'hum', 'alarm', 'drip'];   // sounds that are never played (pings / tones)
  const THEME_LIST = ['classic', 'pastel', 'vintage', 'neon', 'sunset', 'cool'];       // looks picked at random per story
  const TRANSITIONS = ['flash', 'whip', 'zoom', 'wipe', 'dip', 'slide', 'cut'];
  const CAM_MODS = ['none', 'pushin', 'pullout', 'arcL', 'arcR', 'rise', 'sink', 'handheld', 'dutch', 'pan'];

  // ---------------------------------------------------------------- extend lists the validator uses
  ['kneel', 'jump', 'kick', 'clap', 'bow', 'salute', 'think', 'read', 'phone', 'dig', 'climb', 'fall', 'shiver', 'march', 'cheer', 'sit2', 'idle2'].forEach((a) => { if (ALLANIM.indexOf(a) < 0) ALLANIM.push(a); });
  ['snow', 'leaves', 'petals', 'fireflies', 'bubbles', 'embers', 'steam', 'rays', 'speed', 'stars', 'sparkle'].forEach((f) => { if (FXS.indexOf(f) < 0) FXS.push(f); });
  ['push', 'pull', 'arc', 'whip', 'pan', 'topdown', 'low', 'auto'].forEach((m) => { if (CAMS.indexOf(m) < 0) CAMS.push(m); });
  if (KINDS.indexOf('fiction') >= 0) KINDS.splice(KINDS.indexOf('fiction'), 1);
  ['tale', 'dyk', 'survival', 'history', 'science'].forEach((k) => { if (KINDS.indexOf(k) < 0) KINDS.push(k); });
  BADGE.history = ['HISTORY', '#ff7060', '#fff']; BADGE.science = ['SCIENCE', '#7cc4ff', '#12304a'];

  // ---------------------------------------------------------------- THEMES (looks)
  const THEMES = {
    classic: { filter: 'saturate(1.1) contrast(1.04)', sat: 1.14, smooth: 0, outline: [12, 6, 40], ow: 1, bloom: 0.1, vig: 0.3, grain: 0.08, hi: ['#ffd23f', '#3ff2b4', '#ff8a3d'], env: (e) => e },
    pastel: { filter: 'saturate(0.88) brightness(1.08) contrast(0.94)', sat: 1.0, smooth: 1, outline: [96, 70, 120], ow: 0.7, bloom: 0.22, vig: 0.18, grain: 0.05, hi: ['#ff8fb8', '#7cc4ff', '#ffb86b'], env: (e) => Object.assign({}, e, { top: mixc(e.top, [255, 220, 240], 0.28), bot: mixc(e.bot, [255, 240, 230], 0.28), fog: mixc(e.fog, [255, 236, 240], 0.3), bright: (e.bright || 1) * 1.04 }) },
    vintage: { filter: 'sepia(0.5) contrast(1.12) saturate(0.88)', sat: 0.9, smooth: 0, outline: [40, 24, 16], ow: 1.1, bloom: 0.12, vig: 0.5, grain: 0.2, hi: ['#ffe6a8', '#ffd23f', '#ffffff'], env: (e) => e },
    neon: { filter: 'saturate(1.45) contrast(1.16) hue-rotate(6deg)', sat: 1.3, smooth: 0, outline: [4, 0, 30], ow: 1.15, bloom: 0.34, vig: 0.4, grain: 0.06, hi: ['#3ff2ff', '#ff4fd8', '#b6ff3f'], env: (e) => Object.assign({}, e, { bright: (e.bright || 1) * 0.92, top: mixc(e.top, [40, 10, 90], 0.3), fog: mixc(e.fog, [50, 20, 100], 0.25) }) },
    sunset: { filter: 'sepia(0.22) saturate(1.3) hue-rotate(-8deg) brightness(1.03)', sat: 1.2, smooth: 1, outline: [60, 20, 40], ow: 0.9, bloom: 0.26, vig: 0.34, grain: 0.08, hi: ['#ffd23f', '#ff9a3f', '#ffffff'], env: (e) => Object.assign({}, e, { sunCol: mixc(e.sunCol, [255, 170, 110], 0.4), fog: mixc(e.fog, [255, 190, 150], 0.2) }) },
    cool: { filter: 'saturate(1.05) hue-rotate(-14deg) contrast(1.08)', sat: 1.08, smooth: 1, outline: [14, 20, 60], ow: 1, bloom: 0.16, vig: 0.32, grain: 0.07, hi: ['#7cf2ff', '#ffffff', '#ffd23f'], env: (e) => Object.assign({}, e, { sunCol: mixc(e.sunCol, [190, 220, 255], 0.3) }) },
  };
  let CUR_THEME = THEMES.classic, CUR_YAW = 0;
  const themeFor = (S) => { if (S.look && THEMES[S.look]) return THEMES[S.look]; const r = rng(hashS(S.id + new Date().toISOString().slice(0, 7))); return THEMES[THEME_LIST[Math.floor(r() * THEME_LIST.length)]]; };

  // ---------------------------------------------------------------- TEXTURES
  window.texCol = function (c, tex, i, j, k, salt) {
    const r = hf(i, j, k, salt), r2 = hf(i * 7 + 3, j * 5 + 1, k, salt + 5);
    switch (tex) {
      case 'brick': { if (j % 3 === 2) return sh(c, 0.62); const off = (j / 3 | 0) & 1; if ((i + off * 2) % 4 === 3) return sh(c, 0.66); return sh(mixc(c, [255, 214, 190], 0.08 * r2), 0.88 + 0.26 * r); }
      case 'plank': { if (i % 3 === 2) return sh(c, 0.7); return sh(c, (0.93 + 0.08 * Math.sin(j * 1.9 + salt + (i % 3) * 2)) * (0.95 + 0.1 * r)); }
      case 'wood': return sh(c, 0.9 + 0.12 * Math.sin(j * 2.1 + i * 0.4 + salt) + 0.06 * r);
      case 'check': return sh(c, (i + j) & 1 ? 1.12 : 0.86);
      case 'stripe': return sh(c, j & 1 ? 1.14 : 0.88);
      case 'tile': return sh(c, ((i + (j & 1)) % 2) ? 0.86 : 1.08);
      case 'grass': return sh(mixc(c, [190, 255, 120], r2 > 0.85 ? 0.2 : 0), 0.82 + 0.32 * r);
      case 'leaf': return sh(mixc(c, [255, 230, 90], r2 > 0.9 ? 0.25 : 0), 0.8 + 0.36 * r);
      case 'stone': return sh(c, r > 0.82 ? 0.7 : (r2 > 0.9 ? 1.08 : 0.9 + 0.18 * r));
      case 'rock': return sh(mixc(c, [96, 110, 80], r2 > 0.93 ? 0.35 : 0), 0.78 + 0.34 * r);
      case 'sand': return sh(c, 0.92 + 0.14 * r + (r2 > 0.95 ? 0.08 : 0));
      case 'cobble': return sh(c, 0.74 + 0.4 * r);
      case 'mud': return sh(c, 0.84 + 0.2 * r + (r > 0.9 ? 0.2 : 0));
      case 'metal': return sh(c, (j & 1 ? 1.08 : 0.94) * (r > 0.96 ? 1.25 : 1));
      case 'marble': return sh(c, 0.94 + 0.12 * Math.sin((i + j) * 0.9 + r * 4));
      case 'carpet': return sh(c, ((i + j) & 1 ? 0.95 : 1.05) * (0.97 + 0.06 * r));
      case 'fabric': return sh(c, (i & 1 ? 0.96 : 1.04) * (j & 1 ? 0.97 : 1.03));
      case 'snow': return sh(c, r > 0.93 ? 1.14 : 0.97 + 0.05 * r);
      case 'ice': return sh(mixc(c, [220, 245, 255], 0.2), 0.94 + 0.1 * r);
      case 'roof': { const off = j & 1; return sh(c, ((i + off) % 2) ? 0.82 : 1.02); }
      case 'lava': return sh(c, 0.9 + 0.3 * r);
      default: return sh(c, 0.965 + 0.07 * r);
    }
  };

  // ---------------------------------------------------------------- SHADOWS (soft)
  window.shadow = function (x, y, z, r) {
    [[1, 0.1], [0.78, 0.11], [0.55, 0.13]].forEach(([k, a]) => {
      const v = []; for (let i = 0; i < 12; i++) { const t = (i / 12) * TAU; v.push([x + Math.cos(t) * r * k, y + 0.04, z + Math.sin(t) * r * k * 0.8]); }
      FACES.push({ v, n: [0, 1, 0], c: [12, 10, 36], e: null, em: 1, sn: null, L: 1, a, b: 0, ts: 0 });
    });
  };

  // ---------------------------------------------------------------- RENDERER (cel / smooth light, AO, theme outline)
  window.renderScene = function (ctx, cam, env, view) {
    const TH = CUR_THEME, SUN = norm(env.sun || [0.5, 0.78, -0.5]), AMB = env.amb == null ? 0.6 : env.amb, SK = env.sk == null ? 0.52 : env.sk, TN = env.sunCol.map((v) => 0.55 + v / 570), BR = env.bright || 1, cp = cam.pos, out = [], FN = env.fogNear || 40, FF = env.fogFar || 260;
    for (let i = 0; i < FACES.length; i++) {
      const f = FACES[i], v0 = f.v[0]; let n = f.n;
      if (n[0] * (cp[0] - v0[0]) + n[1] * (cp[1] - v0[1]) + n[2] * (cp[2] - v0[2]) <= 0) { if (!f.ts) continue; n = [-n[0], -n[1], -n[2]]; }
      let vp = f.v.map((p) => cam.view(p)), clipped = false, ok = false;
      for (let k = 0; k < vp.length; k++) if (vp[k][2] >= 0.5) { ok = true; break; }
      if (!ok) continue; for (let k = 0; k < vp.length; k++) if (vp[k][2] < 0.5) { clipped = true; break; }
      if (clipped) { vp = clipNear(vp, 0.5); if (vp.length < 3) continue; }
      let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9, dsum = 0; const pts = new Array(vp.length);
      for (let k = 0; k < vp.length; k++) { const v = vp[k], x = W / 2 + (F * v[0]) / v[2], y = HH / 2 - (F * v[1]) / v[2]; pts[k] = [x, y]; if (x < mnx) mnx = x; if (x > mxx) mxx = x; if (y < mny) mny = y; if (y > mxy) mxy = y; dsum += v[2]; }
      if (mxx < -40 || mnx > W + 40 || mxy < -40 || mny > HH + 40) continue;
      if (mxx - mnx < 0.35 && mxy - mny < 0.35) continue;
      const depth = dsum / vp.length + (f.b || 0); let col;
      if (f.em) col = f.c;
      else {
        const lam = n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]; let q;
        if (TH.smooth) { const t = cl((lam + 0.2) / 0.95); q = t * t * (3 - 2 * t); } else q = lam > 0.62 ? 1 : lam > 0.18 ? 0.58 : 0;
        let my = 1e9; for (let k = 0; k < f.v.length; k++) if (f.v[k][1] < my) my = f.v[k][1];
        const ao = f.L === 2 ? 0.84 + 0.16 * cl(my / 1.4) : 1, k = (AMB + SK * q) * BR * ao;
        col = [f.c[0] * k * TN[0], f.c[1] * k * TN[1], f.c[2] * k * TN[2]];
      }
      col = satc(col, f.em ? 1 : TH.sat);
      const fk = cl(Math.pow(wn(depth, FN, FF), 1.1) * 0.92) * (f.em ? 0.4 : 1); col = mixc(col, env.fog, fk);
      let edges = null;
      if (f.e && !clipped && f.L === 2) for (let e = 0; e < f.e.length; e++) { let on = f.e[e]; if (on === 2) { const nn = f.sn && f.sn[e]; on = nn ? (nn[0] * (cp[0] - v0[0]) + nn[1] * (cp[1] - v0[1]) + nn[2] * (cp[2] - v0[2]) <= 0) : true; } if (on) (edges || (edges = [])).push(e); }
      out.push({ pts, d: depth, L: f.L, col, a: f.a, edges, fk, lw: cl(150 / Math.max(depth, 1), 1.1, 4.6) * TH.ow });
    }
    out.sort((p, q) => p.L - q.L || q.d - p.d); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const X = (q) => (view ? view.ox + (q[0] - W / 2) * view.k : q[0]), Y = (q) => (view ? view.oy + (q[1] - HH / 2) * view.k : q[1]);
    for (const o of out) {
      const c = o.col, fs = `rgb(${cl(c[0], 0, 255) | 0},${cl(c[1], 0, 255) | 0},${cl(c[2], 0, 255) | 0})`; ctx.globalAlpha = o.a; ctx.fillStyle = fs; ctx.strokeStyle = fs; ctx.lineWidth = 0.9;
      ctx.beginPath(); for (let k = 0; k < o.pts.length; k++) { const q = o.pts[k]; k ? ctx.lineTo(X(q), Y(q)) : ctx.moveTo(X(q), Y(q)); } ctx.closePath(); ctx.fill(); if (o.a === 1) ctx.stroke();
      if (o.edges) { const oc = mixc(mixc(c, TH.outline, 0.78), env.fog, o.fk * 0.8); ctx.strokeStyle = `rgb(${oc[0] | 0},${oc[1] | 0},${oc[2] | 0})`; ctx.lineWidth = o.lw * (view ? view.k : 1); ctx.beginPath(); for (const e of o.edges) { const A = o.pts[e], B = o.pts[(e + 1) % o.pts.length]; ctx.moveTo(X(A), Y(A)); ctx.lineTo(X(B), Y(B)); } ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- SKY
  window.skyDraw = function (ctx, env, T) {
    const TH = CUR_THEME, br = env.bright || 1, hz = HH * 0.5, H2 = hz + 150, rgb = (c) => `rgb(${cl(c[0] * br, 0, 255) | 0},${cl(c[1] * br, 0, 255) | 0},${cl(c[2] * br, 0, 255) | 0})`;
    const par = -CUR_YAW * 260;
    if (TH.smooth) { const g = ctx.createLinearGradient(0, 0, 0, H2); g.addColorStop(0, rgb(env.top)); g.addColorStop(1, rgb(env.bot)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H2); }
    else { const nb = 12; for (let i = 0; i < nb; i++) { ctx.fillStyle = rgb(mixc(env.top, env.bot, i / (nb - 1))); ctx.fillRect(0, (i * H2) / nb, W, H2 / nb + 1); } }
    ctx.fillStyle = rgb(env.bot); ctx.fillRect(0, H2, W, HH - H2);
    const q = rng(77);
    if (env.stars) for (let i = 0; i < 130; i++) { const tw = 0.5 + 0.5 * Math.sin(T * (1 + q() * 2) + i); ctx.fillStyle = `rgba(255,246,226,${0.3 + 0.6 * tw * q()})`; const s = q() < 0.12 ? 5 : 3; ctx.fillRect(((q() * (W + 400) + par * 0.4) % (W + 400) + W + 400) % (W + 400) - 200, (q() * hz * 0.95) | 0, s, s); }
    if (env.orb) {
      const ox = W * (env.orbx == null ? 0.7 : env.orbx) + par * 0.6, oy = hz - (env.orby == null ? 215 : env.orby), s = env.orbs || 110, oc = env.orbc || [255, 236, 150];
      const gl = ctx.createRadialGradient(ox, oy, s * 0.2, ox, oy, s * 2.6); gl.addColorStop(0, `rgba(${oc},0.55)`); gl.addColorStop(1, `rgba(${oc},0)`); ctx.fillStyle = gl; ctx.fillRect(ox - s * 3, oy - s * 3, s * 6, s * 6);
      ctx.fillStyle = `rgb(${oc})`; if (TH.smooth) { ctx.beginPath(); ctx.arc(ox, oy, s / 2, 0, TAU); ctx.fill(); } else ctx.fillRect(ox - s / 2, oy - s / 2, s, s);
    }
    const nc = env.clouds == null ? 4 : env.clouds, cc2 = env.cloudc || [255, 255, 255];
    for (let i = 0; i < nc; i++) {
      const w = 170 + q() * 120, h = 38 + q() * 22, y = 120 + q() * 280, x = (((q() * (W + 500) + T * (5 + q() * 9) + par) % (W + 500)) + (W + 500)) % (W + 500) - 250;
      if (TH.smooth) { ctx.fillStyle = rgb(cc2); [[0, 0, 0.5], [0.3, -0.25, 0.4], [0.62, -0.1, 0.38], [0.85, 0.05, 0.3]].forEach(([a, b2, r2]) => { ctx.beginPath(); ctx.ellipse(x + w * a, y + h * b2, w * r2, h * 0.75, 0, 0, TAU); ctx.fill(); }); ctx.fillStyle = rgb(mixc(cc2, env.bot, 0.3)); ctx.beginPath(); ctx.ellipse(x + w * 0.4, y + h * 0.45, w * 0.55, h * 0.3, 0, 0, TAU); ctx.fill(); }
      else { ctx.fillStyle = rgb(cc2); ctx.fillRect(x, y, w, h); ctx.fillRect(x + w * 0.18, y - h * 0.55, w * 0.42, h * 0.6); ctx.fillRect(x + w * 0.5, y - h * 0.3, w * 0.3, h * 0.4); ctx.fillStyle = rgb(mixc(cc2, env.bot, 0.35)); ctx.fillRect(x, y + h * 0.72, w, h * 0.28); }
    }
    const hg = ctx.createLinearGradient(0, hz - 60, 0, hz + 90); hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(1, `rgba(${env.fog[0] | 0},${env.fog[1] | 0},${env.fog[2] | 0},0.45)`); ctx.fillStyle = hg; ctx.fillRect(0, hz - 60, W, 150);
  };

  // ---------------------------------------------------------------- PARTICLES / VFX
  window.drawFx = function (c, names, T) {
    names.forEach((n) => {
      const q = rng(hashS(n));
      if (n === 'rain') { c.strokeStyle = 'rgba(210,225,245,.65)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 130; i++) { const x = q() * (W + 200) - 100, y = (q() * HH + T * 1600 * (0.8 + q() * 0.5)) % HH; c.moveTo(x, y); c.lineTo(x - 14, y + 50); } c.stroke(); }
      if (n === 'dust') { for (let i = 0; i < 55; i++) { c.fillStyle = `rgba(240,225,190,${0.18 + q() * 0.25})`; const s = 4 + q() * 8; c.fillRect((q() * W + T * (12 + q() * 30)) % W, (q() * HH + Math.sin(T + i) * 18 + HH) % HH, s, s); } }
      if (n === 'sparks') { for (let i = 0; i < 40; i++) { const t = (T * (0.6 + q() * 0.8) + q() * 3) % 1; c.fillStyle = `rgba(255,${150 + (q() * 90) | 0},60,${1 - t})`; c.fillRect(W * (0.2 + q() * 0.6) + Math.sin(i + T * 3) * 20, HH * 0.8 - t * 700 * (0.5 + q()), 6, 6); } }
      if (n === 'confetti') { for (let i = 0; i < 70; i++) { const t = (T * (0.3 + q() * 0.4) + q()) % 1; c.save(); c.translate(q() * W + Math.sin(T * 3 + i) * 30, -30 + t * (HH + 60)); c.rotate(T * 4 + i); c.fillStyle = ['#ff7060', '#ffd23f', '#7cf2c0', '#7aa8ff', '#ff9bd0'][i % 5]; c.fillRect(-8, -4, 16, 8); c.restore(); } }
      if (n === 'rainbow') { const cs = ['#ff4040', '#ff9a30', '#ffe040', '#50d060', '#40a0ff', '#8060ff']; cs.forEach((col, i) => { c.strokeStyle = col; c.globalAlpha = 0.7; c.lineWidth = 22; c.beginPath(); c.arc(W * 0.35, HH * 0.62, 470 - i * 22, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); }); c.globalAlpha = 1; }
      if (n === 'fog') { for (let i = 0; i < 9; i++) { const g = c.createLinearGradient(0, 0, 320, 0); g.addColorStop(0, 'rgba(200,215,150,0)'); g.addColorStop(0.5, 'rgba(200,215,150,.2)'); g.addColorStop(1, 'rgba(200,215,150,0)'); c.save(); c.translate(((i * 190 + T * 20) % (W + 300)) - 150, 300 + i * 90); c.fillStyle = g; c.fillRect(0, 0, 320, 110); c.restore(); } }
      if (n === 'snow') { for (let i = 0; i < 110; i++) { const s = 3 + q() * 5, t = (T * (60 + q() * 90) + q() * HH) % (HH + 20); c.fillStyle = `rgba(255,255,255,${0.5 + q() * 0.45})`; c.fillRect((q() * W + Math.sin(T * 1.5 + i) * 24 + W) % W, t - 10, s, s); } }
      if (n === 'leaves') { for (let i = 0; i < 36; i++) { const t = (T * (0.25 + q() * 0.3) + q()) % 1; c.save(); c.translate((q() * W * 1.3 - 100 + t * 160) % W, -30 + t * (HH + 60)); c.rotate(T * 2 + i); c.fillStyle = ['#e8742a', '#d9a21b', '#9a4a1e', '#c4402a'][i % 4]; c.beginPath(); c.ellipse(0, 0, 11, 5, 0, 0, TAU); c.fill(); c.restore(); } }
      if (n === 'petals') { for (let i = 0; i < 40; i++) { const t = (T * (0.2 + q() * 0.3) + q()) % 1; c.save(); c.translate((q() * W + Math.sin(T + i) * 40 + W) % W, -30 + t * (HH + 60)); c.rotate(T * 3 + i); c.fillStyle = ['#ffb0c8', '#ffd0e0', '#fff0f4'][i % 3]; c.beginPath(); c.ellipse(0, 0, 8, 4, 0, 0, TAU); c.fill(); c.restore(); } }
      if (n === 'fireflies') { for (let i = 0; i < 40; i++) { const x = (q() * W + Math.sin(T * 0.6 + i * 2) * 50 + W) % W, y = HH * (0.3 + q() * 0.5) + Math.cos(T * 0.8 + i) * 30, a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(T * 2 + i * 3)); const g = c.createRadialGradient(x, y, 0, x, y, 16); g.addColorStop(0, `rgba(255,248,150,${a})`); g.addColorStop(1, 'rgba(255,248,150,0)'); c.fillStyle = g; c.fillRect(x - 16, y - 16, 32, 32); } }
      if (n === 'bubbles') { for (let i = 0; i < 40; i++) { const t = (T * (0.18 + q() * 0.25) + q()) % 1, x = q() * W + Math.sin(T * 2 + i) * 14, y = HH - t * (HH + 40), r = 5 + q() * 12; c.strokeStyle = 'rgba(220,245,255,.7)'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.25, 0, TAU); c.fill(); } }
      if (n === 'embers') { for (let i = 0; i < 50; i++) { const t = (T * (0.2 + q() * 0.3) + q()) % 1; c.fillStyle = `rgba(255,${120 + (q() * 100) | 0},40,${1 - t})`; c.fillRect(q() * W + Math.sin(T * 2 + i) * 20, HH - t * HH * 0.9, 5, 5); } }
      if (n === 'steam') { for (let i = 0; i < 10; i++) { const t = (T * 0.3 + i * 0.1) % 1, x = W * (0.2 + q() * 0.6); const g = c.createRadialGradient(x, HH * 0.8 - t * 500, 0, x, HH * 0.8 - t * 500, 60 + t * 80); g.addColorStop(0, `rgba(255,255,255,${0.28 * (1 - t)})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x - 160, HH * 0.8 - t * 500 - 160, 320, 320); } }
      if (n === 'rays') { c.save(); c.globalCompositeOperation = 'screen'; for (let i = 0; i < 6; i++) { const a0 = 0.15 + i * 0.1 + Math.sin(T * 0.4 + i) * 0.02, g = c.createLinearGradient(W * 0.7, 0, W * 0.7 - 300 * (i - 2), HH * 0.8); g.addColorStop(0, 'rgba(255,240,180,.28)'); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(W * 0.7 + i * 14, 0); c.lineTo(W * 0.7 + i * 14 + 60, 0); c.lineTo(W * (a0 - 0.1) - 80, HH * 0.8); c.lineTo(W * (a0 - 0.1) - 200, HH * 0.8); c.closePath(); c.fill(); } c.restore(); }
      if (n === 'speed') { c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < 28; i++) { const x = q() * W, len = 120 + q() * 220, y = (q() * HH + T * 3000 * (0.6 + q())) % (HH + len) - len; c.moveTo(x, y); c.lineTo(x, y + len); } c.stroke(); }
      if (n === 'stars') { for (let i = 0; i < 70; i++) { const a = 0.4 + 0.6 * Math.abs(Math.sin(T * 2 + i)); c.fillStyle = `rgba(255,250,210,${a})`; const s = q() < 0.2 ? 6 : 3; c.fillRect(q() * W, q() * HH * 0.7, s, s); } }
      if (n === 'sparkle') { for (let i = 0; i < 30; i++) { const a = Math.max(0, Math.sin(T * 3 + i * 2)); const x = q() * W, y = q() * HH * 0.8, r = 4 + 10 * a; c.fillStyle = `rgba(255,255,255,${a * 0.9})`; c.fillRect(x - r, y - 1.5, r * 2, 3); c.fillRect(x - 1.5, y - r, 3, r * 2); } }
    });
  };

  // ---------------------------------------------------------------- HUMANS: skeleton constants
  const J = { HIPY: 0.89, KNEEY: 0.484, ANKY: 0.078, LX: 0.1, SHY: 1.44, SX: 0.255, ELY: 1.14, NECKY: 1.47 };
  const HC2 = {};

  // more people
  const NEWHP = {
    teen: { shirt: 'purple', pants: 'navy', hair: 'hairBrown', k: 0.9, pack: 'teal' }, student: { shirt: 'blue', pants: 'dark', pack: 'green', hair: 'hairBlack', k: 0.9 }, baby: { dress: 'pink', hair: 'hairBlond', hs: 'bald', k: 0.42, hk: 1.7, blush: 1, skin: 'skin1' },
    grandma: { dress: 'purple', hair: 'white', hs: 'bun', glasses: 1, skin: 'skin1', blush: 1 }, chef: { coat: 'white', shirt: 'white', pants: 'dark', hat: 'chef', hatc: 'white', must: 'hairBrown' }, doctor: { coat: 'white', shirt: 'teal', pants: 'blue', glasses: 1, skin: 'skin2' },
    nurse: { shirt: 'teal', pants: 'teal', hat: 'cap', hatc: 'white', hs: 'bob', skin: 'skin1', hair: 'hairBrown' }, firefighter: { coat: 'yellow', shirt: 'orange', pants: 'dark', hat: 'helmet', hatc: 'red', shoes: 'black', gloves: 'dark' }, police: { shirt: 'navy', pants: 'navy', hat: 'cap', hatc: 'navy', shoes: 'black' },
    knight: { coat: 'silver', shirt: 'grey', pants: 'grey', hat: 'knight', hatc: 'silver', shoes: 'dark', gloves: 'grey' }, king: { coat: 'crimson', shirt: 'gold', pants: 'dark', hat: 'crown', hatc: 'gold', beard: 'hairBrown', cape: 'crimson' }, queen: { dress: 'violet', hs: 'long', hat: 'crown', hatc: 'gold', skin: 'skin1', blush: 1, sleeves: 1 },
    pirate: { coat: 'brown', shirt: 'red', pants: 'dark', hat: 'pirate', hatc: 'black', beard: 'hairBlack', shoes: 'black' }, astronaut: { coat: 'white', shirt: 'white', pants: 'white', hat: 'astro', hatc: 'white', gloves: 'grey', shoes: 'grey' }, farmer: { shirt: 'red', pants: 'blue', hat: 'straw', hatc: 'tan', shoes: 'brown' },
    explorer: { shirt: 'olive', pants: 'khaki', hat: 'straw', hatc: 'khaki', pack: 'brown', shoes: 'brown' }, cowboy: { shirt: 'red', pants: 'blue', hat: 'cowboy', hatc: 'brown', shoes: 'brown' }, viking: { coat: 'brown', shirt: 'grey', pants: 'brown', hat: 'viking', hatc: 'silver', beard: 'hairRed', hair: 'hairRed' },
    wizard: { coat: 'violet', shirt: 'violet', pants: 'violet', hat: 'wizard', hatc: 'violet', beard: 'white', hair: 'white', skin: 'skin1' }, pilot: { coat: 'brown', shirt: 'white', pants: 'khaki', hat: 'cap', hatc: 'brown', shoes: 'brown' }, sailor: { shirt: 'white', pants: 'navy', hat: 'cap', hatc: 'white', stripe: 1 },
    monk: { coat: 'brown', shirt: 'brown', pants: 'brown', hs: 'bald', skin: 'skin2' }, roman: { coat: 'cream', shirt: 'cream', pants: 'tan', hat: 'roman', hatc: 'crimson', shoes: 'brown' }, pharaoh: { shirt: 'gold', pants: 'white', hat: 'pharaoh', hatc: 'gold', skin: 'skin3', shoes: 'gold' },
    maid: { dress: 'dark', apron: 'white', hs: 'bun', skin: 'skin1', blush: 1 }, tourist: { shirt: 'yellow', pants: 'khaki', hat: 'cap', hatc: 'teal', pack: 'blue' }, referee: { shirt: 'black', pants: 'black', stripe: 1, shoes: 'black' }, athlete: { shirt: 'red', pants: 'white', short: 1, shorts: 1, skin: 'skin3', hair: 'hairBlack', shoes: 'white' },
    businessman: { coat: 'grey', shirt: 'white', pants: 'grey', hair: 'hairBlack', shoes: 'black' }, robot2: { robot: 1, skin: 'orange', shirt: 'orange', pants: 'dark', shoes: 'black', hs: 'bald' }, robot3: { robot: 1, skin: 'green', shirt: 'green', pants: 'dark', shoes: 'black', hs: 'bald', k: 1.1 },
  };
  HP.boy.hk = 1.3; HP.girl.hk = 1.3;
  Object.keys(NEWHP).forEach((n) => { HP[n] = NEWHP[n]; MINFO[n] = { h: 1.8 * (NEWHP[n].k || 1), cat: 'people' }; MODELS[n] = (x, y, z, f, s, o, T, st) => drawHuman(n, x, y, z, f, s == null ? 1 : s, o || {}, T || 0, st || { anim: 'stand' }); });
  Object.keys(HP).forEach((n) => { if (MINFO[n]) MINFO[n].h = 1.8 * (HP[n].k || 1); });

  // ---------------------------------------------------------------- HUMANS: building the voxel body parts
  function mkHuman2(cf, ex, bl) {
    const skin = colr(cf.skin), hair = colr(cf.hair), shirt = colr(cf.shirt), pants = colr(cf.pants), shoe = colr(cf.shoes), K = [26, 20, 34], WH = [252, 252, 255], MO = [196, 56, 70];
    const coat = cf.coat ? colr(cf.coat) : null, dress = cf.dress ? colr(cf.dress) : null, body = coat || dress || shirt, rb = !!cf.robot, P = {};
    const sleeve = rb ? [176, 184, 204] : coat || (dress ? (cf.sleeves ? dress : skin) : shirt), legc = rb ? [96, 104, 126] : dress ? (cf.boots ? shoe : skin) : pants, handc = cf.gloves ? colr(cf.gloves) : rb ? [70, 76, 96] : skin;
    const uL = 0.058, uA = 0.06, uT = 0.065, LX = J.LX;
    // legs
    const mkLeg = (sg, sl) => {
      const th = new Grid(3, 7, 3), shn = new Grid(3, 7, 3), ft = new Grid(3, 2, 5), ox = sg * LX - 1.5 * uL;
      th.fill(0, 0, 0, 2, 6, 2, cf.shorts ? pants : legc); shn.fill(0, 0, 0, 2, 6, 2, cf.shorts ? skin : legc); if (rb) { th.fill(0, 6, 0, 2, 6, 2, [60, 64, 80]); shn.fill(0, 6, 0, 2, 6, 2, [60, 64, 80]); }
      if (cf.boots || cf.knee) shn.fill(0, 0, 0, 2, 3, 2, shoe);
      ft.fill(0, 0, 0, 2, 1, 4, shoe); ft.fill(0, 0, 4, 2, 0, 4, sh(shoe, 1.15));
      return { th: buildPart(th, uL, [ox, J.KNEEY, -1.5 * uL], sl, 0.04), sn: buildPart(shn, uL, [ox, J.ANKY, -1.5 * uL], sl + 2, 0.04), ft: buildPart(ft, uL, [ox, 0, -2 * uL], sl + 4, 0.04) };
    };
    const lL = mkLeg(-1, 1), lR = mkLeg(1, 2); P.thighL = lL.th; P.shinL = lL.sn; P.footL = lL.ft; P.thighR = lR.th; P.shinR = lR.sn; P.footR = lR.ft;
    // torso (pelvis + chest)
    const tg = new Grid(6, 9, 4); tg.fill(0, 0, 0, 5, 8, 3, body);
    if (rb) { tg.fill(0, 0, 0, 5, 8, 3, [176, 184, 204]); tg.fill(0, 0, 0, 5, 1, 3, [70, 76, 96]); tg.fill(2, 4, 3, 3, 6, 3, [90, 255, 190, 1]); tg.fill(1, 7, 3, 1, 7, 3, [255, 190, 60, 1]); tg.fill(4, 7, 3, 4, 7, 3, [255, 80, 80, 1]); tg.fill(2, 8, 1, 3, 8, 2, [90, 98, 120]); }
    else {
      if (!dress && !coat) { tg.fill(0, 0, 0, 5, 1, 3, pants); tg.fill(0, 2, 0, 5, 2, 3, [64, 44, 34]); }
      if (cf.stripe) for (let y = 3; y < 9; y += 2) tg.fill(0, y, 0, 5, y, 3, mixc(shirt, [255, 255, 255], 0.8));
      if (cf.vest) { tg.fill(0, 3, 0, 5, 8, 3, [255, 150, 30]); tg.fill(0, 5, 0, 5, 5, 3, [255, 248, 120]); }
      if (coat) { tg.fill(2, 3, 3, 3, 8, 3, shirt); tg.fill(2, 3, 3, 2, 8, 3, sh(coat, 0.8)); }
      if (cf.apron) tg.fill(1, 0, 3, 4, 6, 3, colr(cf.apron));
      if (cf.pack) { tg.fill(1, 2, 0, 1, 7, 0, sh(colr(cf.pack), 0.8)); tg.fill(4, 2, 0, 4, 7, 0, sh(colr(cf.pack), 0.8)); }
      if (cf.scarf) { tg.fill(0, 8, 0, 5, 8, 3, colr(cf.scarf)); tg.fill(2, 5, 3, 3, 7, 3, colr(cf.scarf)); }
      if (cf.gloves && cf.hat === 'knight') tg.fill(0, 5, 3, 5, 5, 3, sh(colr(cf.coat || 'silver'), 0.8));
      tg.fill(2, 8, 1, 3, 8, 2, skin);
    }
    P.torso = buildPart(tg, uT, [-3 * uT, J.HIPY, -2 * uT], 3, 0.04);
    if (dress) { const g = new Grid(8, 5, 6); g.fill(0, 0, 0, 7, 4, 5, dress); g.fill(0, 0, 0, 7, 0, 5, mixc(dress, WH, 0.3)); if (cf.apron) g.fill(2, 0, 5, 5, 4, 5, colr(cf.apron)); P.skirt = buildPart(g, uL, [-4 * uL, J.HIPY - 5 * uL + 0.05, -3 * uL], 4, 0.04); }
    if (coat && !rb && !cf.hat !== 'knight') { const g = new Grid(8, 7, 5); g.fill(0, 0, 0, 7, 6, 4, coat); g.fill(3, 0, 4, 4, 6, 4, shirt); P.skirt = buildPart(g, uL, [-4 * uL, J.HIPY - 7 * uL + 0.06, -2.5 * uL], 4, 0.04); }
    if (cf.pack) { const g = new Grid(4, 6, 2); g.fill(0, 0, 0, 3, 5, 1, colr(cf.pack)); g.fill(0, 3, 0, 3, 3, 1, sh(colr(cf.pack), 0.75)); P.pack = buildPart(g, 0.062, [-0.124, 1.08, -0.26], 5, 0.05); }
    if (cf.cape) { const g = new Grid(7, 14, 1); g.fill(0, 0, 0, 6, 13, 0, colr(cf.cape)); g.fill(0, 0, 0, 6, 0, 0, mixc(colr(cf.cape), WH, 0.4)); P.cape = buildPart(g, 0.06, [-0.21, 0.66, -0.2], 6, 0.04); }
    // arms
    const mkArm = (sg, sl) => {
      const ua = new Grid(2, 5, 2), fa = new Grid(2, 5, 2), ox = sg * J.SX - uA, short = cf.short || (dress && !cf.sleeves && !coat);
      ua.fill(0, 0, 0, 1, 4, 1, short && !dress ? sleeve : sleeve); fa.fill(0, 0, 0, 1, 4, 1, short ? skin : sleeve); fa.fill(0, 0, 0, 1, 0, 1, handc);
      if (rb) { ua.fill(0, 0, 0, 1, 4, 1, [176, 184, 204]); fa.fill(0, 0, 0, 1, 4, 1, [176, 184, 204]); fa.fill(0, 0, 0, 1, 0, 1, [70, 76, 96]); fa.fill(0, 2, 0, 1, 2, 1, [96, 104, 126]); }
      return { ua: buildPart(ua, uA, [ox, J.ELY, -uA], sl, 0.04), fa: buildPart(fa, uA, [ox, J.ELY - 5 * uA, -uA], sl + 1, 0.04) };
    };
    const aL = mkArm(-1, 6), aR = mkArm(1, 7); P.uaL = aL.ua; P.faL = aL.fa; P.uaR = aR.ua; P.faR = aR.fa;
    // head (same face logic as before, finer voxels)
    const hg = new Grid(10, 11, 11), hs = (x, y, z, c) => hg.set(x + 1, y, z + 1, c); hg.fill(1, 0, 1, 8, 7, 8, rb ? [190, 198, 216] : skin);
    if (!rb) { [3, 4].forEach((z) => { hs(-1, 3, z, skin); hs(8, 3, z, skin); }); if (cf.blush) { hs(0, 2, 7, mixc(skin, [255, 90, 120], 0.55)); hs(7, 2, 7, mixc(skin, [255, 90, 120], 0.55)); } }
    else { hs(-1, 3, 3, [90, 98, 120]); hs(-1, 3, 4, [90, 98, 120]); hs(8, 3, 3, [90, 98, 120]); hs(8, 3, 4, [90, 98, 120]); hg.fill(2, 2, 8, 7, 6, 8, [24, 28, 46]); hs(3, 8, 3, [120, 128, 150]); hs(3, 9, 3, [120, 128, 150]); hs(3, 10, 3, [255, 70, 70, 1]); }
    if (cf.beard) { const bc = colr(cf.beard); hg.fill(2, 0, 8, 7, 1, 8, bc); hs(0, 0, 3, bc); hs(0, 1, 3, bc); hs(7, 0, 3, bc); hs(7, 1, 3, bc); hs(0, 0, 4, bc); hs(7, 0, 4, bc); }
    if (cf.must) { const mc = colr(cf.must); hg.fill(3, 2, 9, 6, 2, 9, mc); hs(1, 1, 7, mc); hs(6, 1, 7, mc); }
    if (rb) { const eh = ex === 'sad' ? 1 : ex === 'shock' ? 3 : 2, ey = 3, col = [90, 255, 235, 1]; [1, 5].forEach((dx) => { for (let yy = 0; yy < eh; yy++) for (let xx = 0; xx < 2; xx++) hs(dx + xx, ey + (bl > 0.5 ? 0 : yy), 7, col); }); if (ex === 'smile' || ex === 'laugh') hg.fill(3, 1, 8, 6, 1, 8, [90, 255, 235, 1]); }
    else {
      [1, 5].forEach((dx) => { if (bl > 0.5) { hs(dx, 3, 7, K); hs(dx + 1, 3, 7, K); } else { for (let yy = 3; yy <= 4; yy++) for (let xx = dx; xx <= dx + 1; xx++) hs(xx, yy, 7, K); hs(dx, 4, 7, WH); } });
      const brow = hair; if (ex === 'determined' || ex === 'angry') { hs(1, 6, 7, brow); hs(2, 5, 7, brow); hs(5, 5, 7, brow); hs(6, 6, 7, brow); } else if (ex === 'worried' || ex === 'sad') { hs(1, 5, 7, brow); hs(2, 6, 7, brow); hs(5, 6, 7, brow); hs(6, 5, 7, brow); } else if (ex === 'shock') { [1, 2, 5, 6].forEach((x) => hs(x, 6, 7, brow)); } else { [1, 2, 5, 6].forEach((x) => hs(x, 5, 7, brow)); }
      if (ex === 'smile') { hs(2, 2, 7, MO); hs(5, 2, 7, MO); hs(3, 1, 7, MO); hs(4, 1, 7, MO); } else if (ex === 'laugh') { [2, 3, 4, 5].forEach((x) => hs(x, 2, 7, WH)); hs(3, 1, 7, MO); hs(4, 1, 7, MO); } else if (ex === 'sad' || ex === 'worried') { hs(3, 2, 7, MO); hs(4, 2, 7, MO); hs(2, 1, 7, MO); hs(5, 1, 7, MO); } else if (ex === 'shock') { hs(3, 1, 7, MO); hs(4, 1, 7, MO); hs(3, 2, 7, MO); hs(4, 2, 7, MO); } else if (ex === 'determined' || ex === 'angry') { [2, 3, 4, 5].forEach((x) => hs(x, 1, 7, MO)); } else { hs(3, 1, 7, MO); hs(4, 1, 7, MO); }
    }
    const H = rb ? 'bald' : cf.hs, hr = (x, y, z) => hs(x, y, z, hair);
    if (H && H !== 'bald') {
      for (let x = 0; x < 8; x++) for (let z = 0; z < 8; z++) hr(x, 7, z);
      for (let y = 5; y <= 6; y++) for (let x = 0; x < 8; x++) for (let z = 0; z < 7; z++) if (z <= 2 || x === 0 || x === 7) hr(x, y, z);
      for (let x = 0; x < 8; x++) if (hf(x, 1, 2, 5) > 0.45) hr(x, 6, 7);
      if (H === 'long' || H === 'bob') { const lo = H === 'long' ? 0 : 2; for (let y = lo; y <= 5; y++) { for (let x = 0; x < 8; x++) for (let z = 0; z <= 1; z++) hr(x, y, z); for (let z = 0; z <= 4; z++) { hr(0, y, z); hr(7, y, z); } } }
      if (H === 'bun') { for (let x = 3; x <= 4; x++) for (let z = 3; z <= 4; z++) for (let y = 8; y <= 9; y++) hr(x, y, z); }
      if (H === 'spiky') { [[1, 2], [3, 4], [5, 2], [6, 5], [2, 5], [4, 1]].forEach(([x, z]) => hr(x, 8, z)); hr(3, 9, 4); hr(5, 9, 2); }
      if (H === 'afro') { for (let x = -1; x <= 8; x++) for (let z = -1; z <= 8; z++) for (let y = 6; y <= 9; y++) if (!(z > 5 && y < 8)) hr(x, y, z); }
    }
    const hc = colr(cf.hatc || 'red'), hd = (x, y, z, c) => hs(x, y, z, c || hc), rect = (y, x0, x1, z0, z1, c) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) hd(x, y, z, c); };
    switch (cf.hat) {
      case 'hard': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); rect(9, 1, 6, 1, 6); rect(7, 1, 6, 9, 9); break;
      case 'cap': rect(7, 0, 7, 0, 7); rect(8, 0, 7, 0, 6); rect(9, 1, 6, 1, 5); rect(7, 1, 6, 8, 9, sh(hc, 0.8)); break;
      case 'flat': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); rect(7, 1, 6, 9, 9, sh(hc, 0.8)); break;
      case 'top': rect(7, -1, 8, -1, 8); rect(8, 1, 6, 1, 6, sh(hc, 0.55)); rect(9, 1, 6, 1, 6); rect(10, 1, 6, 1, 6); break;
      case 'helmet': rect(6, -1, 8, -1, 8); rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); rect(9, 2, 5, 2, 5); break;
      case 'beanie': rect(7, 0, 7, 0, 7); rect(8, 0, 7, 0, 7); rect(9, 1, 6, 1, 6); rect(10, 3, 4, 3, 4, mixc(hc, WH, 0.6)); break;
      case 'straw': rect(7, -1, 8, -1, 9); rect(8, 1, 6, 1, 6); rect(9, 1, 6, 1, 6); rect(8, 1, 6, 1, 6, sh(hc, 0.85)); break;
      case 'bonnet': rect(7, -1, 8, -1, 8); rect(8, 1, 6, 1, 6); rect(8, 3, 4, 7, 7, [255, 120, 160]); break;
      case 'chef': rect(7, 0, 7, 0, 7); rect(8, 0, 7, 0, 7); rect(9, 0, 7, 0, 7); rect(10, 1, 6, 1, 6); rect(11, 1, 6, 1, 6); break;
      case 'crown': rect(7, 0, 7, 0, 7); [0, 2, 4, 6].forEach((x) => { hd(x, 8, 0); hd(x, 8, 7); hd(x, 9, 0); }); hd(3, 8, 3, [255, 70, 90]); break;
      case 'pirate': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); rect(9, 1, 6, 1, 6); rect(8, 3, 4, 7, 7, WH); break;
      case 'cowboy': rect(7, -2, 9, -2, 9); rect(8, 0, 7, 0, 7); rect(9, 1, 6, 1, 6); rect(10, 1, 6, 1, 6); break;
      case 'wizard': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); rect(9, 1, 6, 1, 6); rect(10, 2, 5, 2, 5); rect(11, 3, 4, 3, 4); hd(3, 12, 3); hd(4, 12, 3); break;
      case 'knight': rect(6, -1, 8, -1, 8); rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); rect(9, 2, 5, 2, 5); for (let y = 3; y <= 5; y++) { hd(1, y, 8, sh(hc, 0.9)); hd(6, y, 8, sh(hc, 0.9)); } hd(3, 6, 8, sh(hc, 0.9)); hd(4, 6, 8, sh(hc, 0.9)); break;
      case 'astro': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); for (let y = 0; y <= 6; y++) { hd(-1, y, 3); hd(-1, y, 4); hd(8, y, 3); hd(8, y, 4); hd(-1, y, 0); hd(8, y, 0); hd(-1, y, 7); hd(8, y, 7); } rect(9, 1, 6, 1, 6); break;
      case 'viking': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); hd(-2, 8, 3, [240, 232, 210]); hd(-2, 9, 3, [240, 232, 210]); hd(9, 8, 3, [240, 232, 210]); hd(9, 9, 3, [240, 232, 210]); break;
      case 'pharaoh': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); for (let y = 0; y <= 6; y += 2) { hd(-1, y, 3); hd(8, y, 3); hd(-1, y + 1, 3, [60, 90, 200]); hd(8, y + 1, 3, [60, 90, 200]); } break;
      case 'roman': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); for (let z = 0; z <= 7; z++) { hd(3, 9, z, [200, 40, 50]); hd(4, 9, z, [200, 40, 50]); } break;
      case 'hood': rect(7, -1, 8, -1, 8); rect(8, 0, 7, 0, 7); for (let y = 0; y <= 6; y++) { hd(-1, y, 2); hd(8, y, 2); hd(-1, y, 1); hd(8, y, 1); } break;
    }
    if (cf.glasses && !rb) { for (let y = 2; y <= 5; y++) [0, 3, 4, 7].forEach((x) => { if (y >= 3 && y <= 4) hs(x, y, 8, K); }); [1, 2, 5, 6].forEach((x) => { hs(x, 5, 8, K); hs(x, 2, 8, K); }); }
    P.head = buildPart(hg, 0.034, [-0.17, J.NECKY, -0.17], 8, 0.035);
    return P;
  }

  // ---------------------------------------------------------------- HUMANS: poses (joint angles, radians)
  // hip/knee/ank (L,R): leg joints; sh/el/ab (L,R): shoulder swing forward/up, elbow bend, arm out sideways
  // bend/twist/lean: spine; look/nod/tilt: head; dy/hop: body height; yaw: body turn; prone: lying
  const sn = Math.sin, cs = Math.cos, mx = Math.max, ab = Math.abs;
  function poseOf2(an2, T, sd) {
    const P = { shL: 0.07, shR: 0.07, elL: 0.12, elR: 0.12, abL: 0.06, abR: 0.06 };
    const A = (o) => Object.assign(P, o);
    switch (an2) {
      case 'walk': { const f = T * 6.2 + sd, s2 = sn(f), c2 = cs(f); return A({ hipL: 0.5 * s2, hipR: -0.5 * s2, kneeL: 0.12 + 0.75 * mx(0, c2), kneeR: 0.12 + 0.75 * mx(0, -c2), ankL: -0.3 * mx(0, c2), ankR: -0.3 * mx(0, -c2), shL: -0.42 * s2, shR: 0.42 * s2, elL: 0.3 + 0.2 * mx(0, -s2), elR: 0.3 + 0.2 * mx(0, s2), twist: 0.12 * s2, bend: 0.05, hop: 0.02 * ab(c2) }); }
      case 'march': { const f = T * 6 + sd, s2 = sn(f); return A({ hipL: 0.55 * s2, hipR: -0.55 * s2, kneeL: 0.1 + 0.35 * mx(0, cs(f)), kneeR: 0.1 + 0.35 * mx(0, -cs(f)), shL: -0.85 * s2, shR: 0.85 * s2, elL: 0.12, elR: 0.12, hop: 0.03 * ab(cs(f)) }); }
      case 'run': case 'run2': { const f = T * 10 + sd, s2 = sn(f), c2 = cs(f); return A({ hipL: 0.95 * s2, hipR: -0.95 * s2, kneeL: 0.5 + 1.4 * mx(0, c2), kneeR: 0.5 + 1.4 * mx(0, -c2), ankL: -0.3 * mx(0, c2), ankR: -0.3 * mx(0, -c2), shL: -0.95 * s2, shR: 0.95 * s2, elL: 1.5, elR: 1.5, abL: 0.12, abR: 0.12, bend: 0.22, twist: 0.2 * s2, hop: 0.05 + 0.07 * ab(s2) }); }
      case 'sit': case 'sit2': return A({ hipL: 1.5, hipR: 1.5, kneeL: 1.5, kneeR: 1.5, dy: -0.39, bend: 0.06, shL: 0.55, shR: 0.55, elL: 0.8, elR: 0.8, look: sn(T * 0.7 + sd) * 0.2 });
      case 'wave': return A({ shR: 2.75 + sn(T * 3 + sd) * 0.1, elR: 0.5 + 0.7 * sn(T * 9 + sd), abR: 0.35, look: 0.15, tilt: 0.06 });
      case 'wave2': return A({ shR: 2.8, shL: 2.8, elR: 0.5 + 0.7 * sn(T * 9 + sd), elL: 0.5 - 0.7 * sn(T * 9 + sd), abR: 0.5, abL: 0.5 });
      case 'cheer': { const j = ab(sn(T * 6 + sd)); return A({ shL: 2.8 + sn(T * 9 + sd) * 0.3, shR: 2.8 - sn(T * 9 + sd) * 0.3, abL: 0.4, abR: 0.4, elL: 0.2, elR: 0.2, hop: j * 0.2, kneeL: 0.35 * (1 - j), kneeR: 0.35 * (1 - j) }); }
      case 'point': return A({ shR: 1.5, elR: 0.1, look: -0.1, bend: 0.03 });
      case 'celebrate': { const j = ab(sn(T * 6 + sd)); return A({ shL: 2.7 + sn(T * 9 + sd) * 0.3, shR: 2.7 - sn(T * 9 + sd) * 0.3, abL: 0.4, abR: 0.4, elL: 0.25, elR: 0.25, hop: j * 0.26, kneeL: 0.5 * (1 - j), kneeR: 0.5 * (1 - j), hipL: 0.1 * (1 - j), hipR: 0.1 * (1 - j), ankL: -0.3 * j, ankR: -0.3 * j }); }
      case 'carry': return A({ shL: 1.15, shR: 1.15, elL: 1.25, elR: 1.25, abL: -0.12, abR: -0.12, carry: 1 });
      case 'carrywalk': { const f = T * 6.2 + sd, s2 = sn(f), c2 = cs(f); return A({ hipL: 0.45 * s2, hipR: -0.45 * s2, kneeL: 0.12 + 0.65 * mx(0, c2), kneeR: 0.12 + 0.65 * mx(0, -c2), shL: 1.15, shR: 1.15, elL: 1.25, elR: 1.25, abL: -0.12, abR: -0.12, carry: 1, hop: 0.02 * ab(c2) }); }
      case 'work': { const f = T * 9 + sd; return A({ shR: 1.1 + 0.8 * sn(f), elR: 0.9 - 0.5 * sn(f), shL: 0.9 + 0.4 * sn(f + 1), elL: 1.0, bend: 0.2, hipL: 0.1, hipR: -0.1, kneeL: 0.15, kneeR: 0.15 }); }
      case 'plant': return A({ hipL: 1.2, hipR: 1.2, kneeL: 1.9, kneeR: 1.9, dy: -0.36, bend: 0.5, shR: 1.3 + 0.3 * sn(T * 5 + sd), shL: 1.0, elR: 0.4, elL: 0.4, nod: 0.3 });
      case 'type': return A({ hipL: 1.5, hipR: 1.5, kneeL: 1.5, kneeR: 1.5, dy: -0.39, bend: 0.1, shL: 0.95, shR: 0.95, elL: 1.5 + 0.1 * sn(T * 14 + sd), elR: 1.5 + 0.1 * sn(T * 14 + sd + 2), nod: 0.2 });
      case 'push': { const f = T * 4 + sd; return A({ bend: 0.32, shL: 1.45, shR: 1.45, elL: 0.12, elR: 0.12, hipL: 0.3 * sn(f), hipR: -0.3 * sn(f), kneeL: 0.3 + 0.3 * mx(0, cs(f)), kneeR: 0.3 + 0.3 * mx(0, -cs(f)) }); }
      case 'look': return A({ look: sn(T * 1.4 + sd) * 0.7, nod: 0.05, lean: sn(T * 0.7 + sd) * 0.02 });
      case 'pinch': return A({ shR: 2.2, elR: 2.3, abR: -0.2, nod: 0.15, tilt: 0.1 });
      case 'dance': { const d = sn(T * 8 + sd); return A({ hipL: d * 0.5, hipR: -d * 0.5, kneeL: 0.3 + 0.3 * ab(d), kneeR: 0.3 + 0.3 * ab(d), shL: 2.5 * (d > 0 ? 1 : 0.3), shR: 2.5 * (d > 0 ? 0.3 : 1), abL: 0.5, abR: 0.5, elL: 0.4, elR: 0.4, twist: d * 0.3, hop: ab(d) * 0.14, look: d * 0.25, yaw: sn(T * 4 + sd) * 25 }); }
      case 'crouch': return A({ hipL: 1.55, hipR: 1.55, kneeL: 2.3, kneeR: 2.3, dy: -0.4, bend: 0.55, shL: 0.9, shR: 0.9, elL: 0.9, elR: 0.9, nod: 0.4 });
      case 'kneel': return A({ hipL: 1.4, kneeL: 1.5, hipR: 0.15, kneeR: 2.3, dy: -0.36, bend: 0.15, shL: 0.6, shR: 0.7, elL: 0.9, elR: 0.9, nod: 0.15 });
      case 'scared': return A({ shL: 1.7, shR: 1.7, elL: 2.0, elR: 2.0, abL: 0.25, abR: 0.25, bend: -0.12, kneeL: 0.3, kneeR: 0.3, look: sn(T * 25 + sd) * 0.12, hop: ab(sn(T * 20)) * 0.02 });
      case 'shiver': return A({ shL: 1.1, shR: 1.1, elL: 2.5, elR: 2.5, abL: -0.3, abR: -0.3, kneeL: 0.25, kneeR: 0.25, bend: 0.1, hop: ab(sn(T * 24 + sd)) * 0.015, look: sn(T * 22) * 0.05 });
      case 'swim': return A({ prone: 1, hipL: sn(T * 9 + sd) * 0.5, hipR: -sn(T * 9 + sd) * 0.5, shL: 2.6 + sn(T * 5 + sd) * 1.2, shR: 2.6 - sn(T * 5 + sd) * 1.2, elL: 0.3, elR: 0.3, nod: -0.5 });
      case 'panic': return A({ shL: 2.8 + 0.5 * sn(T * 12 + sd), shR: 2.8 - 0.5 * sn(T * 12 + sd), abL: 0.5, abR: 0.5, kneeL: 0.25, kneeR: 0.25, hop: ab(sn(T * 6)) * 0.1, look: sn(T * 5) * 0.35, bend: -0.1 });
      case 'float': return A({ prone: -1, yaw: 180, shL: 0, shR: 0, abL: 1.0, abR: 1.0, hipL: 0.1, hipR: 0.1 });
      case 'throw': { const ph = wn(sn(T * 3 + sd) * 0.5 + 0.5, 0.2, 0.8); return A({ shR: 2.4 - 1.9 * ph, elR: 1.6 - 1.2 * ph, shL: 0.5, bend: 0.2 * ph, hipL: -0.3 * ph, hipR: 0.3 * ph, twist: 0.4 * ph }); }
      case 'sleep': return A({ prone: -1, dy: -0.74, shL: 0.35, shR: 0.35, elL: 1.2, elR: 1.2, hipL: 0.1, hipR: 0.1, kneeL: 0.15, kneeR: 0.15 });
      case 'jump': { const j = ab(sn(T * 4 + sd)); return A({ hop: j * 0.4, kneeL: 0.9 * (1 - j), kneeR: 0.9 * (1 - j), hipL: 0.4 * (1 - j), hipR: 0.4 * (1 - j), shL: 2.0 * j, shR: 2.0 * j, abL: 0.4, abR: 0.4 }); }
      case 'kick': { const ph = mx(0, sn(T * 5 + sd)); return A({ hipR: 1.25 * ph - 0.1, kneeR: 0.2 + 0.9 * (1 - ph), hipL: -0.1, kneeL: 0.1, shL: 0.6, shR: -0.5, abL: 0.4, abR: 0.2, lean: -0.05 * ph, bend: -0.08 * ph }); }
      case 'clap': return A({ shL: 1.3, shR: 1.3, elL: 1.5, elR: 1.5, abL: -0.2 + 0.25 * sn(T * 14 + sd), abR: -0.2 + 0.25 * sn(T * 14 + sd), hop: 0.01 * ab(sn(T * 14)) });
      case 'bow': return A({ bend: 0.9, shL: 0.1, shR: 0.1, nod: 0.2 });
      case 'salute': return A({ shR: 1.45, elR: 2.45, abR: 0.1, shL: 0.05, look: 0.0 });
      case 'think': return A({ shR: 1.25, elR: 2.4, shL: 1.0, elL: 1.4, nod: 0.15, tilt: 0.1, look: sn(T * 0.8 + sd) * 0.2 });
      case 'read': return A({ shL: 1.1, shR: 1.1, elL: 1.5, elR: 1.5, nod: 0.35, look: sn(T * 0.6 + sd) * 0.1 });
      case 'phone': return A({ shR: 1.6, elR: 2.4, tilt: 0.12, look: 0.2 });
      case 'dig': { const ph = sn(T * 4 + sd); return A({ bend: 0.55 + 0.2 * ph, shL: 1.0 + 0.4 * ph, shR: 1.0 + 0.4 * ph, elL: 0.5, elR: 0.5, hipL: 0.3, hipR: -0.2, kneeL: 0.5, kneeR: 0.3 }); }
      case 'climb': { const s2 = sn(T * 5 + sd); return A({ hipL: 0.9 * mx(0, s2), hipR: 0.9 * mx(0, -s2), kneeL: 1.2 * mx(0, s2), kneeR: 1.2 * mx(0, -s2), shL: 2.5 + 0.5 * s2, shR: 2.5 - 0.5 * s2, elL: 0.8, elR: 0.8, hop: 0.03 * ab(s2) }); }
      case 'fall': return A({ bend: -0.5, lean: 0.4, shL: 2.6, shR: 2.4, abL: 0.8, abR: 0.8, kneeL: 0.6, kneeR: 0.9, dy: -0.15, hipL: 0.4 });
      case 'eat': case 'up': case 'stand': case 'idle2': default: { const b = sn(T * 2 + sd); return A({ shL: 0.07 + b * 0.03, shR: 0.07 - b * 0.03, lean: sn(T * 0.8 + sd) * 0.015, look: sn(T * 0.7 + sd) * 0.12, nod: b * 0.015 }); }
    }
  }
  const POSEK = ['hipL', 'hipR', 'kneeL', 'kneeR', 'ankL', 'ankR', 'shL', 'shR', 'elL', 'elR', 'abL', 'abR', 'bend', 'twist', 'lean', 'look', 'nod', 'tilt', 'dy', 'hop', 'yaw', 'prone'];
  function blendPose(a, b, t) { const r = Object.assign({}, b); POSEK.forEach((k) => { r[k] = lerp(a[k] || 0, b[k] || 0, t); }); r.carry = t > 0.5 ? b.carry : a.carry; return r; }

  window.poseOf = (an2, T, sd) => poseOf2(an2, T, sd);   // old name kept for anything else that calls it

  // ---------------------------------------------------------------- HUMANS: drawing with the jointed skeleton
  window.drawHuman = function (name, x, y, z, face, s, o, T, st) {
    const cf = Object.assign({}, HBASE, HP[name] || {}, o.c || {}), ex = o.ex || st.ex || 'neutral', bl = blinkAt(T, st.seed), key = JSON.stringify(cf) + '|' + ex + '|' + bl, sd = st.seed || 0;
    const P = HC2[key] || (HC2[key] = mkHuman2(cf, ex, bl));
    let po = poseOf2(st.anim || 'stand', T, sd); if (st.anim0 && st.bl != null && st.bl < 1) po = blendPose(poseOf2(st.anim0, T, sd), po, ez(st.bl));
    const k = (cf.k || 1) * s, pr = po.prone || 0;
    const M0 = mm(mT(x, y + ((po.hop || 0) + (po.dy || 0)) * k, z), mm(mRy((face + (po.yaw || 0)) * D2R), mS(k)));
    const Mb = pr ? mm(M0, piv(mRx(pr * Math.PI / 2), [0, J.HIPY, 0])) : M0;
    const Mu = mm(Mb, piv(mm(mRy(po.twist || 0), mm(mRz(po.lean || 0), mRx(po.bend || 0))), [0, J.HIPY, 0]));
    if (!o.noshadow && !pr) shadow(x, y, z, 0.42 * k);
    [[-1, 'L'], [1, 'R']].forEach(([sg, L]) => {
      const hx = sg * J.LX, Mth = mm(Mb, piv(mRx(-(po['hip' + L] || 0)), [hx, J.HIPY, 0])); drawPart(P['thigh' + L], Mth);
      const Msh = mm(Mth, piv(mRx(po['knee' + L] || 0), [hx, J.KNEEY, 0])); drawPart(P['shin' + L], Msh);
      drawPart(P['foot' + L], mm(Msh, piv(mRx(-(po['ank' + L] || 0)), [hx, J.ANKY, 0])));
    });
    if (P.skirt) drawPart(P.skirt, mm(Mb, piv(mRx(-((po.hipL || 0) + (po.hipR || 0)) * 0.22), [0, J.HIPY, 0])));
    drawPart(P.torso, Mu); if (P.pack) drawPart(P.pack, Mu);
    if (P.cape) drawPart(P.cape, mm(Mu, piv(mRx(0.08 + ab(po.hipL || 0) * 0.2 + sn(T * 3 + sd) * 0.03), [0, J.SHY, -0.13])));
    let Mh = mm(Mu, piv(mm(mRy(po.look || 0), mm(mRz(po.tilt || 0), mRx(po.nod || 0))), [0, J.NECKY, 0])); if (cf.hk && cf.hk !== 1) Mh = mm(Mh, piv(mS(cf.hk), [0, J.NECKY, 0])); drawPart(P.head, Mh);
    let handW = null;
    [[-1, 'L'], [1, 'R']].forEach(([sg, L]) => {
      const sx = sg * J.SX, Mua = mm(Mu, piv(mm(mRz(sg * (po['ab' + L] || 0)), mRx(-(po['sh' + L] || 0))), [sx, J.SHY, 0])); drawPart(P['ua' + L], Mua);
      const Mfa = mm(Mua, piv(mRx(-(po['el' + L] || 0)), [sx, J.ELY, 0])); drawPart(P['fa' + L], Mfa); if (L === 'R') handW = ap(Mfa, [sx, 0.9, 0.05]);
    });
    if (o.hold) { if (po.carry) holdItem(o.hold, mm(Mu, mm(mT(0, 1.12, 0.36), mS(1))), T); else holdItem(o.hold, mm(mT(handW[0], handW[1], handW[2]), mm(mRy(face * D2R), mS(k))), T); }
  };

  // ---------------------------------------------------------------- ANIMALS: more species + extra animations
  const ANX = {
    cat: { u: 0.08, b: [3, 3, 6], lh: 3, lw: 1, h: [4, 4, 3], sn: [2, 2, 1], ear: 'point', tl: [1, 8, 1], cols: { a: [226, 150, 70], b: [255, 236, 210], d: [60, 40, 30], n: [255, 150, 170] } },
    rabbit: { u: 0.08, b: [4, 4, 6], lh: 3, lw: 1, h: [4, 4, 3], sn: [2, 2, 1], ear: 'long', tl: [2, 2, 1], cols: { a: [226, 222, 216], b: [255, 255, 255], d: [60, 40, 50], n: [255, 150, 170] } },
    fox: { u: 0.09, b: [4, 4, 8], lh: 4, lw: 1, h: [4, 4, 4], sn: [2, 2, 3], ear: 'point', tl: [2, 2, 6], tdown: 0, cols: { a: [226, 110, 40], b: [255, 245, 230], d: [40, 30, 28], n: [30, 24, 28], t: [236, 130, 50] } },
    wolf: { u: 0.1, b: [5, 5, 9], lh: 5, lw: 2, h: [5, 5, 4], sn: [3, 3, 4], ear: 'point', tl: [2, 2, 5], tdown: 1, cols: { a: [128, 132, 146], b: [214, 216, 226], d: [40, 40, 50], n: [24, 24, 30] } },
    pig: { u: 0.12, b: [6, 5, 8], lh: 2, lw: 2, h: [5, 5, 4], sn: [3, 2, 2], ear: 'floppy', tl: [1, 1, 1], cols: { a: [255, 168, 186], b: [255, 196, 206], d: [120, 60, 70], n: [200, 90, 110] } },
    lion: { u: 0.13, b: [6, 6, 11], lh: 5, lw: 3, h: [6, 6, 5], sn: [3, 2, 2], ear: 'round', mane: [214, 140, 44], tl: [1, 6, 1], tdown: 1, cols: { a: [226, 176, 90], b: [244, 214, 160], d: [60, 40, 30], n: [40, 30, 30] } },
    elephant: { u: 0.18, b: [8, 8, 12], lh: 5, lw: 3, h: [7, 7, 5], sn: [2, 6, 2], trunk: 1, ear: 'big', tl: [1, 4, 1], tdown: 1, cols: { a: [150, 156, 170], b: [186, 190, 204], d: [60, 62, 72], n: [120, 124, 136] } },
    giraffe: { u: 0.14, b: [5, 6, 10], lh: 12, lw: 2, h: [4, 4, 5], sn: [3, 3, 3], neck: 12, ear: 'point', horns: 1, tl: [1, 5, 1], tdown: 1, cols: { a: [240, 190, 70], b: [250, 226, 150], d: [120, 70, 30], n: [60, 40, 30] } },
  };
  Object.keys(ANX).forEach((n) => { AN[n] = ANX[n]; MINFO[n] = { h: (ANX[n].lh + ANX[n].b[1] + (ANX[n].neck || 0) + 3) * ANX[n].u, cat: 'animals' }; MODELS[n] = (x, y, z, f, s, o, T, st) => drawAnimal(n, x, y, z, f, s == null ? 1 : s, o || {}, T || 0, st || { anim: 'stand' }); });
  const mkAnimalOrig = window.mkAnimal;
  window.mkAnimal = function (name, cols) {
    const P = mkAnimalOrig(name, cols), sp = AN[name], u = sp.u;
    if (sp.mane || sp.trunk || sp.ear === 'long' || sp.ear === 'big' || sp.horns) {
      const C = Object.assign({}, sp.cols, cols || {}), a = colr(C.a), d = colr(C.d), [hw, hh, hl] = sp.h, [sw, sht, sl] = sp.sn, hg = new Grid(hw + 4, hh + 8, hl + sl + 3);
      hg.fill(2, 0, 1, hw + 1, hh - 1, hl, a); const sx0 = 2 + ((hw - sw) >> 1), b = colr(C.b), n = colr(C.n);
      if (sp.trunk) { hg.fill(sx0, -0, hl + 1, sx0 + sw - 1, 0, hl + sl, a); for (let y = 0; y < sht; y++) hg.set(sx0, 0, 0, a); hg.fill(sx0, 0, hl + 1, sx0 + sw - 1, sht - 1, hl + 1, a); hg.fill(sx0, 0, hl + 1, sx0 + sw - 1, sht - 1, hl + 1, a); }
      else hg.fill(sx0, 0, hl + 1, sx0 + sw - 1, sht - 1, hl + sl, b);
      if (sp.trunk) { const tg = new Grid(2, 8, 2); tg.fill(0, 0, 0, 1, 7, 1, a); P.trunk = buildPart(tg, u * 0.8, [-u * 0.8, P.hy - 8 * u * 0.8 + hh * u * 0.6, P.hz + (hl + 1) * u], 15, 0.05); }
      else hg.set(sx0 + (sw >> 1), sht - 1, hl + sl, n);
      [3, hw].forEach((ex) => hg.set(ex, hh - 2, hl, d));
      if (sp.ear === 'long') { hg.fill(2, hh, 1, 2, hh + 4, 2, a); hg.fill(hw + 1, hh, 1, hw + 1, hh + 4, 2, a); } else if (sp.ear === 'big') { hg.fill(0, 1, 2, 1, hh - 1, 4, sh(a, 0.92)); hg.fill(hw + 2, 1, 2, hw + 3, hh - 1, 4, sh(a, 0.92)); } else if (sp.ear === 'round') { hg.fill(2, hh, 1, 2, hh, 2, a); hg.fill(hw + 1, hh, 1, hw + 1, hh, 2, a); } else if (sp.ear === 'point') { hg.fill(2, hh, 1, 2, hh + 1, 1, a); hg.fill(hw + 1, hh, 1, hw + 1, hh + 1, 1, a); } else if (sp.ear === 'floppy') { hg.fill(1, hh - 3, 1, 1, hh - 1, 2, d); hg.fill(hw + 2, hh - 3, 1, hw + 2, hh - 1, 2, d); }
      if (sp.mane) { const mc = colr(sp.mane); for (let x = 0; x < hw + 4; x++) for (let y = -1; y < hh + 2; y++) for (let z = 0; z < 3; z++) if (!(y < 0 && (x < 2 || x > hw + 1))) hg.set(x, y + 1, z, mc); }
      if (sp.horns) { [3, hw].forEach((hx) => { hg.fill(hx, hh, 1, hx, hh + 2, 1, d); hg.set(hx, hh + 3, 1, [240, 226, 190]); }); }
      P.head = buildPart(hg, u, [-(hw + 4) * u / 2, P.hy, P.hz], 9, 0.06);
    }
    return P;
  };
  const drawAnimalOrig = window.drawAnimal;
  window.drawAnimal = function (name, x, y, z, face, s, o, T, st) {
    const an2 = st.anim || 'stand', sd = st.seed || 0;
    if (an2 === 'sit' || an2 === 'sleep' || an2 === 'jump' || an2 === 'bow') {
      const o2 = Object.assign({}, o), st2 = Object.assign({}, st);
      if (an2 === 'sit') { st2.anim = 'stand'; o2.up = 0.7; }
      else if (an2 === 'bow') { st2.anim = 'stand'; o2.dip = 0.8; o2.up = -0.5; }
      else if (an2 === 'jump') { st2.anim = 'run'; return drawAnimalOrig(name, x, y + ab(sn(T * 6 + sd)) * 0.7 * s, z, face, s, o2, T, st2); }
      else { st2.anim = 'eat'; o2.dip = 0.3; return drawAnimalOrig(name, x, y, z, face + 0, s * 0.96, o2, T, st2); }
      return drawAnimalOrig(name, x, y, z, face, s, o2, T, st2);
    }
    const o3 = o, hold = o.look != null ? o.look : sn(T * 0.9 + sd) * 0.2; if (an2 === 'stand' || an2 === 'look') o3.look = hold;
    drawAnimalOrig(name, x, y, z, face, s, o3, T, st);
    const P = AC[name + JSON.stringify((o.c) || {})]; if (P && P.trunk) { const Mb = mm(mT(x, y, z), mm(mRy(face * D2R), mS(s))); drawPart(P.trunk, mm(Mb, piv(mRx(sn(T * 1.6 + sd) * 0.25), [0, P.hy + 0.5, P.hz]))); }
  };

  // ---------------------------------------------------------------- MORE CREATURES / ROBOTS (simple voxel models)
  const gait = (T, st, a2) => (st && st.moving ? sn(T * 8 + ((st && st.seed) || 0)) * (a2 || 0.5) : 0);
  defP('penguin', { h: 1.2, r: 0.5, cat: 'animals' }, (M, o, T, st) => { const g = gait(T, st, 0.4), M2 = mm(M, mRz(g * 0.2)); bb(M2, 0, 0.6, 0, 0.6, 0.9, 0.5, [30, 34, 48], { cell: 0.3 }); bb(M2, 0, 0.55, 0.2, 0.44, 0.7, 0.14, [250, 250, 255], { ne: 1 }); bb(M2, 0, 1.2, 0.05, 0.42, 0.34, 0.42, [30, 34, 48], { cell: 0.2 }); bb(M2, 0, 1.15, 0.32, 0.18, 0.1, 0.18, 'orange', { ne: 1 }); [-0.13, 0.13].forEach((x) => bb(M2, x, 1.26, 0.25, 0.06, 0.06, 0.04, 'white', { ne: 1 })); [-0.35, 0.35].forEach((x) => bb(M2, x, 0.62, 0, 0.1, 0.6, 0.3, [24, 28, 40], { ne: 1 })); [-0.14, 0.14].forEach((x, i) => bb(M, x, 0.06, 0.12 + (i ? g : -g) * 0.2, 0.2, 0.1, 0.34, 'orange', { ne: 1 })); });
  defP('chicken', { h: 1, r: 0.4, cat: 'animals' }, (M, o, T, st) => { const c = cc(o, 'a', 'white'), g = gait(T, st, 0.4); bb(M, 0, 0.55, 0, 0.5, 0.5, 0.7, c, { cell: 0.25 }); bb(M, 0, 0.9, 0.36, 0.3, 0.34, 0.3, c, { cell: 0.15 }); bb(M, 0, 1.12, 0.36, 0.1, 0.12, 0.2, 'red', { ne: 1 }); bb(M, 0, 0.88, 0.58, 0.12, 0.08, 0.14, 'orange', { ne: 1 }); bb(M, 0, 0.62, -0.42, 0.3, 0.4, 0.2, sh(c, 0.9), { ne: 1 }); [-0.1, 0.1].forEach((x, i) => bb(M, x, 0.15 + (i ? g : -g) * 0.05, 0, 0.07, 0.3, 0.07, 'orange', { ne: 1 })); });
  defP('duck', { h: 0.9, r: 0.4, cat: 'animals' }, (M, o, T, st) => { const g = gait(T, st, 0.3); bb(M, 0, 0.4, 0, 0.5, 0.4, 0.8, [250, 230, 90], { cell: 0.25 }); bb(M, 0, 0.8, 0.3, 0.3, 0.3, 0.3, [30, 130, 80], { cell: 0.15 }); bb(M, 0, 0.76, 0.52, 0.2, 0.08, 0.18, 'orange', { ne: 1 }); [-0.1, 0.1].forEach((x, i) => bb(M, x, 0.08, 0.05 + (i ? g : -g) * 0.1, 0.12, 0.06, 0.2, 'orange', { ne: 1 })); });
  defP('monkey', { h: 1.6, r: 0.6, cat: 'animals' }, (M, o, T, st) => { const g = gait(T, st, 0.5), c = cc(o, 'a', [130, 84, 50]); bb(M, 0, 0.8, 0, 0.5, 0.7, 0.4, c, { cell: 0.25 }); bb(M, 0, 1.3, 0.05, 0.42, 0.4, 0.4, c, { cell: 0.2 }); bb(M, 0, 1.25, 0.28, 0.28, 0.22, 0.1, [236, 200, 160], { ne: 1 }); [-0.3, 0.3].forEach((x, i) => { bb(mm(M, piv(mRx(i ? g : -g), [x, 1.1, 0])), x, 0.8, 0, 0.14, 0.6, 0.14, c, { ne: 1 }); bb(mm(M, piv(mRx(i ? -g : g), [x * 0.4, 0.5, 0])), x * 0.4, 0.25, 0, 0.16, 0.5, 0.16, c, { ne: 1 }); bb(M, x * 1.5, 1.35, 0, 0.14, 0.2, 0.06, c, { ne: 1 }); }); bb(M, 0, 0.55, -0.4, 0.1, 0.1, 0.7, c, { ne: 1 }); });
  defP('owl', { h: 1.2, r: 0.4, cat: 'animals' }, (M, o, T) => { const c = cc(o, 'a', [150, 110, 76]); bb(M, 0, 0.55, 0, 0.6, 0.8, 0.5, c, { cell: 0.25 }); bb(M, 0, 0.5, 0.2, 0.4, 0.5, 0.1, [236, 220, 190], { ne: 1 }); bb(M, 0, 1.1, 0.05, 0.54, 0.42, 0.46, c, { cell: 0.2 }); [-0.12, 0.12].forEach((x) => { bb(M, x, 1.14, 0.28, 0.16, 0.16, 0.05, 'white', { ne: 1 }); bb(M, x, 1.14, 0.31, 0.07, 0.07, 0.03, 'black', { ne: 1 }); bb(M, x * 1.8, 1.4, 0, 0.1, 0.14, 0.1, c, { ne: 1 }); }); bb(M, 0, 1.04, 0.3, 0.08, 0.1, 0.1, 'orange', { ne: 1 }); });
  defP('frog', { h: 0.6, r: 0.4, cat: 'animals' }, (M, o, T) => { const c = cc(o, 'a', [90, 190, 70]), j = ab(sn(T * 3)) * 0.1; bb(M, 0, 0.25 + j, 0, 0.6, 0.4, 0.7, c, { cell: 0.3 }); [-0.18, 0.18].forEach((x) => { bb(M, x, 0.52 + j, 0.28, 0.16, 0.16, 0.16, 'white', { ne: 1 }); bb(M, x, 0.52 + j, 0.34, 0.07, 0.07, 0.05, 'black', { ne: 1 }); }); [-0.32, 0.32].forEach((x) => bb(M, x, 0.08, -0.25, 0.2, 0.12, 0.4, sh(c, 0.85), { ne: 1 })); });
  defP('turtle', { h: 0.9, r: 0.8, cat: 'animals' }, (M, o, T, st) => { const g = gait(T, st, 0.4); bb(M, 0, 0.35, 0, 1.2, 0.4, 1.5, [70, 150, 90], { tex: 'stone', cell: 0.4 }); bb(M, 0, 0.62, 0, 0.8, 0.25, 1.1, [90, 176, 110], { tex: 'stone', cell: 0.3 }); bb(M, 0, 0.35, 0.95, 0.3, 0.26, 0.4, [150, 200, 110], { ne: 1 }); [[-0.55, 0.5], [0.55, 0.5], [-0.55, -0.5], [0.55, -0.5]].forEach(([x, z], i) => bb(M, x, 0.15, z + (i % 2 ? g : -g) * 0.1, 0.4, 0.12, 0.3, [150, 200, 110], { ne: 1 })); });
  defP('shark', { h: 2, r: 0, cat: 'animals', sh: 0 }, (M, o, T, st) => { const w = sn(T * 4 + ((st && st.seed) || 0)) * 0.2, c = cc(o, 'a', [110, 128, 150]); bb(M, 0, 0, 0, 1.2, 1.1, 3.6, c, { cell: 0.9 }); bb(M, 0, -0.2, 0.2, 1.0, 0.6, 3.0, [236, 240, 246], { ne: 1 }); bb(M, 0, 0, 2.0, 0.8, 0.7, 0.8, sh(c, 1.1), { ne: 1 }); bb(M, 0, 0.9, 0.2, 0.12, 0.8, 0.9, sh(c, 0.85), { ne: 1 }); bb(mm(M, mT(w, 0, 0)), 0, 0.1, -2.1, 0.3, 0.9, 0.8, sh(c, 0.85), { ne: 1 }); [-1, 1].forEach((d) => { bb(M, d * 0.8, -0.3, 0.6, 0.9, 0.1, 0.6, sh(c, 0.9), { ne: 1 }); bb(M, d * 0.3, 0.1, 2.0, 0.08, 0.1, 0.08, 'black', { ne: 1 }); }); });
  defP('whale', { h: 3, r: 0, cat: 'animals', sh: 0 }, (M, o, T) => { const w = sn(T * 1.5) * 0.15, c = cc(o, 'a', [60, 100, 160]); bb(M, 0, 0, 0, 3.2, 2.8, 8, c, { cell: 1.5 }); bb(M, 0, -0.6, 0.6, 2.8, 1.4, 6, [220, 232, 245], { ne: 1 }); bb(M, 0, 0, 4.3, 2.4, 2.2, 1.4, sh(c, 1.1), { ne: 1 }); bb(mm(M, mT(0, w, 0)), 0, 0.3, -4.6, 1.4, 0.8, 2, sh(c, 0.9), { ne: 1 }); bb(mm(M, mT(0, w * 1.5, 0)), 0, 0.5, -5.8, 4.4, 0.3, 1.2, sh(c, 0.85), { ne: 1 }); [-1, 1].forEach((d) => bb(M, d * 1.8, -0.8, 1.5, 1.6, 0.2, 1.0, sh(c, 0.9), { ne: 1 })); [-1.3, 1.3].forEach((x) => bb(M, x, 0.4, 4.0, 0.2, 0.2, 0.06, 'white', { ne: 1 })); });
  defP('crab', { h: 0.8, r: 0.6, cat: 'animals' }, (M, o, T, st) => { const g = gait(T, st, 0.3), c = cc(o, 'a', [230, 80, 60]); bb(M, 0, 0.3, 0, 0.9, 0.35, 0.6, c, { cell: 0.4 }); [-0.3, 0.3].forEach((x) => { bb(M, x, 0.58, 0.2, 0.08, 0.2, 0.08, 'black', { ne: 1 }); bb(M, x * 2, 0.4, 0.5, 0.35, 0.25, 0.35, sh(c, 1.1), { ne: 1 }); }); [-1, 1].forEach((d) => [0, 1, 2].forEach((i) => bb(M, d * 0.6, 0.1, -0.2 + i * 0.2 + (i % 2 ? g : -g) * 0.05, 0.4, 0.08, 0.08, sh(c, 0.85), { ne: 1 }))); });
  defP('jellyfish', { h: 2, r: 0, cat: 'animals', sh: 0 }, (M, o, T) => { const c = cc(o, 'a', [255, 150, 220]), p = 1 + sn(T * 3) * 0.08; bb(M, 0, 0.8, 0, 1.2 * p, 0.7 / p, 1.2 * p, c, { em: 1, cell: 0.4, ne: 1 }); bb(M, 0, 1.15, 0, 0.8, 0.3, 0.8, sh(c, 1.1), { em: 1, ne: 1 }); for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; for (let j = 0; j < 4; j++) bb(M, cs(a) * 0.4 + sn(T * 2 + i + j) * 0.08, 0.3 - j * 0.3, sn(a) * 0.4, 0.08, 0.3, 0.08, sh(c, 0.9), { em: 1, ne: 1 }); } });
  defP('rover', { h: 1.6, r: 1.4, cat: 'robots' }, (M, o, T, st) => { const c = cc(o, 'a', [236, 240, 250]); bb(M, 0, 0.8, 0, 1.6, 0.6, 2.2, c, { tex: 'metal', cell: 0.5 }); bb(M, 0, 1.3, 0.5, 0.8, 0.5, 0.8, sh(c, 0.95), { cell: 0.4 }); bb(M, 0, 1.3, 0.92, 0.5, 0.3, 0.06, [90, 230, 255], { em: 1, ne: 1 }); bb(M, 0, 1.7, 0.2, 0.08, 0.6, 0.08, 'dark', { ne: 1 }); [[-0.95, 0.8], [0.95, 0.8], [-0.95, 0], [0.95, 0], [-0.95, -0.8], [0.95, -0.8]].forEach(([x, z]) => cy(mm(M, mm(mT(x, 0.35, z), mRz(Math.PI / 2))), 0, -0.12, 0, 0.35, 0.24, 8, 'dark', { capc: 'grey' })); bb(M, -0.6, 1.2, -0.7, 1.0, 0.04, 0.8, [40, 80, 170], { ne: 1 }); });
  defP('drone', { h: 1.4, r: 0, cat: 'robots', sh: 0 }, (M, o, T) => { const c = cc(o, 'a', [60, 66, 84]), bob = sn(T * 3) * 0.05, M2 = mm(M, mT(0, bob, 0)); bb(M2, 0, 0.5, 0, 0.8, 0.3, 0.8, c, { cell: 0.4 }); bb(M2, 0, 0.45, 0.4, 0.3, 0.2, 0.08, [255, 70, 70], { em: 1, ne: 1 }); [[-0.7, 0.7], [0.7, 0.7], [-0.7, -0.7], [0.7, -0.7]].forEach(([x, z]) => { bb(M2, x * 0.5, 0.5, z * 0.5, 0.7, 0.08, 0.08, c, { ne: 1 }); bb(mm(M2, mm(mT(x, 0.7, z), mRy(T * 30))), 0, 0, 0, 0.7, 0.03, 0.12, 'silver', { ne: 1 }); }); });
  defP('cutebot', { h: 1.4, r: 0.8, cat: 'robots' }, (M, o, T, st) => { const c = cc(o, 'a', [250, 200, 60]), g = gait(T, st, 0.3); bb(M, 0, 0.55, 0, 0.8, 0.8, 0.7, c, { tex: 'metal', cell: 0.4 }); bb(M, 0, 1.15, 0, 0.7, 0.55, 0.6, sh(c, 1.05), { cell: 0.3 }); bb(M, 0, 1.15, 0.31, 0.5, 0.3, 0.04, [20, 24, 40], { ne: 1 }); [-0.14, 0.14].forEach((x) => bb(M, x, 1.18, 0.34, 0.1, 0.12, 0.03, [90, 255, 235], { em: 1, ne: 1 })); bb(M, 0, 1.6, 0, 0.06, 0.3, 0.06, 'dark', { ne: 1 }); bb(M, 0, 1.78, 0, 0.14, 0.14, 0.14, [255, 80, 80], { em: 1, ne: 1 }); [-0.55, 0.55].forEach((x, i) => bb(mm(M, piv(mRx(i ? g : -g), [x, 0.8, 0])), x, 0.5, 0, 0.14, 0.6, 0.14, sh(c, 0.85), { ne: 1 })); [-0.2, 0.2].forEach((x, i) => bb(M, x, 0.12, (i ? g : -g) * 0.1, 0.24, 0.24, 0.3, 'dark', { ne: 1 })); });
  defP('mech', { h: 5, r: 2, cat: 'robots' }, (M, o, T, st) => { const c = cc(o, 'a', [90, 110, 150]), g = gait(T, st, 0.5); bb(M, 0, 2.6, 0, 2.2, 2.0, 1.6, c, { tex: 'metal', cell: 0.8 }); bb(M, 0, 4.0, 0.1, 1.2, 0.9, 1.0, sh(c, 1.1), { cell: 0.5 }); bb(M, 0, 4.0, 0.62, 0.9, 0.3, 0.05, [255, 120, 60], { em: 1, ne: 1 }); [-1.6, 1.6].forEach((x, i) => { bb(mm(M, piv(mRx(i ? g : -g), [x, 3.4, 0])), x, 2.4, 0, 0.7, 2.2, 0.7, sh(c, 0.9), { cell: 0.7 }); bb(mm(M, piv(mRx(i ? -g : g), [x * 0.35, 1.6, 0])), x * 0.35, 0.8, 0, 0.8, 1.7, 0.9, sh(c, 0.85), { cell: 0.7 }); bb(M, x * 0.35, 0.12, 0.3, 1.0, 0.24, 1.4, 'dark', { ne: 1 }); }); });
  const NEWCAT = ['penguin', 'chicken', 'duck', 'monkey', 'owl', 'frog', 'turtle', 'shark', 'whale', 'crab', 'jellyfish', 'rover', 'drone', 'cutebot', 'mech'];

  // ---------------------------------------------------------------- ACTOR STATE (adds animation blending)
  window.actorState = function (a, p, T, idx) {
    const f = a.from == null ? 0 : a.from, u = a.until == null ? 1 : a.until, at = a.at || [0, 0], to = a.to || at, raw = wn(p, f, u), k = a.loop ? (raw * a.loop) % 1 : ez(raw);
    const x = lerp(at[0], to[0], k), z = lerp(at[1], to[1], k), travels = to[0] !== at[0] || to[1] !== at[1], moving = travels && raw > 0.001 && raw < 0.999;
    const yy = Array.isArray(a.y) ? lerp(a.y[0], a.y[1], k) : a.y || 0, s = Array.isArray(a.s) ? lerp(a.s[0], a.s[1], ez(raw)) : a.s == null ? 1 : a.s, vis = a.vis || [0, 1];
    let face = Array.isArray(a.face) ? lerp(a.face[0], a.face[1], ez(raw)) : typeof a.face === 'number' ? a.face : travels ? (Math.atan2(to[0] - at[0], to[1] - at[1]) * 180) / Math.PI : 180;
    let anim = a.anim || (moving ? 'walk' : 'stand'), anim0 = null, bl = 1;
    if (!a.anim && travels && !a.loop) { if (raw < 0.05) { anim = 'walk'; anim0 = 'stand'; bl = raw / 0.05; } else if (raw >= 0.95 && raw < 0.999) { anim = 'walk'; } else if (raw >= 0.999) { anim = a.end || 'stand'; } }
    else if (raw >= 0.999 && a.end) anim = a.end;
    if (a.seq) { let prev = anim; for (const [pp, nm] of a.seq) if (p >= pp) { if (anim !== nm) { anim0 = prev; bl = cl((p - pp) / 0.06); } prev = nm; anim = nm; } }
    let ex = a.ex || 'neutral'; if (a.exs) for (const [pp, nm] of a.exs) if (p >= pp) ex = nm;
    const info = MINFO[a.m] || {}; return { x, y: yy, z, s, face, moving, anim, anim0, bl, ex, seed: idx * 1.7, show: p >= vis[0] && p <= vis[1], h: (info.h || 2) * s };
  };

  // ---------------------------------------------------------------- CAMERA (new moves + automatic variation)
  const rot2 = (px, pz, cx, cz, a) => { const dx = px - cx, dz = pz - cz, c = cs(a), s2 = sn(a); return [cx + dx * c - dz * s2, cz + dx * s2 + dz * c]; };
  window.camFor = function (b, p, A, bi) {
    const c = b.cam || { mode: 'orbit', target: b.actors && b.actors[0] ? b.actors[0].id : [0, 1, 10], r: 8, h: 2.5 }, e = ez(p);
    let res;
    if (c.mode === 'static') res = { pos: c.at.slice(), tg: aim(c.look, A) };
    else if (c.mode === 'dolly' || c.mode === 'crane') res = { pos: lerp3(c.from, c.to, e), tg: c.look2 ? lerp3(aim(c.look, A), aim(c.look2, A), e) : aim(c.look, A) };
    else if (c.mode === 'track') { const t = aim(c.target, A); res = { pos: [t[0] + c.off[0], t[1] + c.off[1], t[2] + c.off[2]], tg: c.look ? aim(c.look, A) : t }; }
    else if (c.mode === 'pan' || c.mode === 'whip') { const q = c.mode === 'whip' ? eo(p * 1.6) : e; res = { pos: c.at.slice(), tg: lerp3(aim(c.look, A), aim(c.look2 || c.look, A), q) }; }
    else if (c.mode === 'push' || c.mode === 'pull') { const t = aim(c.target, A), a0 = (c.a == null ? 0 : c.a) * D2R, r0 = c.mode === 'push' ? (c.r0 || 11) : (c.r0 || 5), r1 = c.mode === 'push' ? (c.r1 || 5) : (c.r1 || 11), r = lerp(r0, r1, e); res = { pos: [t[0] + sn(a0) * r, t[1] + (c.h == null ? 1.6 : c.h), t[2] - cs(a0) * r], tg: t }; }
    else if (c.mode === 'topdown') { const t = aim(c.target, A), r = c.r || 3; res = { pos: [t[0], t[1] + (c.h || 16), t[2] - r], tg: t }; }
    else if (c.mode === 'low') { const t = aim(c.target, A), a0 = lerp(c.a0 == null ? -20 : c.a0, c.a1 == null ? 20 : c.a1, e) * D2R, r = c.r || 6; res = { pos: [t[0] + sn(a0) * r, Math.max(0.35, t[1] - (c.h == null ? 1.0 : c.h)), t[2] - cs(a0) * r], tg: [t[0], t[1] + 0.4, t[2]] }; }
    else if (c.mode === 'arc') { const t = aim(c.target, A), a = lerp(c.a0 == null ? -40 : c.a0, c.a1 == null ? 40 : c.a1, e) * D2R, r = c.r || 8, h = lerp(c.h0 == null ? 1.5 : c.h0, c.h1 == null ? 3.5 : c.h1, e); res = { pos: [t[0] + sn(a) * r, t[1] + h, t[2] - cs(a) * r], tg: t }; }
    else { const t = aim(c.target, A), a = lerp(c.a0 == null ? -30 : c.a0, c.a1 == null ? 30 : c.a1, p) * D2R, r = c.r || 8; res = { pos: [t[0] + sn(a) * r, t[1] + (c.h == null ? 1.5 : c.h), t[2] - cs(a) * r], tg: t }; }
    // variation layer: seeded modifier on top of the written camera (never the same twice in a row)
    res.roll = 0; res.shake = 0;
    if (STORY && !b.nocamvar && bi != null) {
      const rr = rng(hashS(STORY.id + '|' + bi)), prev = bi > 0 ? CAMVAR_CACHE[bi - 1] : 'none'; let m = rr() < 0.62 ? CAM_MODS[1 + Math.floor(rr() * (CAM_MODS.length - 1))] : 'none'; if (m === prev && m !== 'none') m = 'none'; CAMVAR_CACHE[bi] = m;
      const pos = res.pos, tg = res.tg, dx = pos[0] - tg[0], dy = pos[1] - tg[1], dz = pos[2] - tg[2], dist = Math.hypot(dx, dy, dz) || 8, sg = rr() < 0.5 ? -1 : 1;
      if (m === 'pushin') { const k2 = 0.2 * e; res.pos = [pos[0] - dx * k2, pos[1] - dy * k2, pos[2] - dz * k2]; }
      else if (m === 'pullout') { const k2 = 0.22 * e; res.pos = [pos[0] + dx * k2, pos[1] + dy * k2 * 0.5 + 0.2 * e, pos[2] + dz * k2]; }
      else if (m === 'arcL' || m === 'arcR') { const a = (m === 'arcL' ? -1 : 1) * 0.28 * (e - 0.5); const q2 = rot2(pos[0], pos[2], tg[0], tg[2], a); res.pos = [q2[0], pos[1], q2[1]]; }
      else if (m === 'rise') { res.pos = [pos[0], pos[1] + 1.6 * e, pos[2]]; }
      else if (m === 'sink') { res.pos = [pos[0], Math.max(0.9, pos[1] - 0.9 * e), pos[2]]; }
      else if (m === 'handheld') { const k2 = Math.min(0.09, dist * 0.007); res.pos = [pos[0] + sn(CURT * 1.3) * k2 + sn(CURT * 2.9) * k2 * 0.4, pos[1] + sn(CURT * 1.7 + 1) * k2 * 0.6, pos[2] + sn(CURT * 1.1 + 2) * k2]; res.tg = [tg[0] + sn(CURT * 1.9) * k2 * 0.6, tg[1] + sn(CURT * 2.3) * k2 * 0.4, tg[2]]; }
      else if (m === 'dutch') { res.roll = sg * (3 + 2 * rr()) * D2R * Math.min(1, e * 3 + 0.3); }
      else if (m === 'pan') { const lat = [cs(Math.atan2(dx, dz)), 0, -sn(Math.atan2(dx, dz))]; const k2 = (e - 0.5) * dist * 0.18 * sg; res.tg = [tg[0] + lat[0] * k2, tg[1], tg[2] + lat[2] * k2]; }
    }
    if (res.pos[1] < 0.5) res.pos[1] = 0.5;
    return res;
  };
  const CAMVAR_CACHE = []; let CURT = 0;

  // ---------------------------------------------------------------- EXPLAINER (render beat -> buffers -> transitions -> grade / bloom / overlays)
  let BUF = [null, null];
  const getBuf = (i) => { if (!BUF[i]) { BUF[i] = document.createElement('canvas'); BUF[i].width = W; BUF[i].height = HH; BUF[i].ctx = BUF[i].getContext('2d'); } return BUF[i]; };
  const trFor = (S, i) => { if (i <= 0) return 'cut'; const b = S.beats[i]; if (b.tr && (TRANSITIONS.indexOf(b.tr) >= 0)) return b.tr; const r = rng(hashS(S.id + '#tr' + i)); let t = TRANSITIONS[Math.floor(r() * TRANSITIONS.length)]; if (i > 1 && t === trFor.last) t = TRANSITIONS[(TRANSITIONS.indexOf(t) + 1) % TRANSITIONS.length]; trFor.last = t; return t; };
  const TRD = { cut: 0.001, flash: 0.14, whip: 0.24, zoom: 0.22, wipe: 0.3, dip: 0.32, slide: 0.28 };

  function renderBeat(c, i, bt, T) {
    const S = STORY, b = S.beats[i], p = cl(bt / TL.R[i]), setName = b.set || S.set, SET = SETS[setName]; CURT = T;
    if (!SETC[setName]) { FACES = []; STATIC = true; SET.build(); STATIC = false; SETC[setName] = FACES; }
    const A = {}; (b.actors || []).forEach((a, k) => { A[a.id] = actorState(a, p, T, k); });
    const cv = camFor(b, p, A, i), sh0 = bt < 0.25 && i > 0 ? sn(bt * 90) * (1 - bt / 0.25) * 0.12 : 0, cpos = [cv.pos[0] + sh0, cv.pos[1] + sh0 * 0.6, cv.pos[2]], cam = lookCam(cpos, cv.tg);
    CUR_YAW = Math.atan2(cv.tg[0] - cv.pos[0], cv.tg[2] - cv.pos[2]);
    CAMP = cpos; FACES = SETC[setName].slice(); STATIC = false;
    (b.actors || []).forEach((a, k) => { const st = A[a.id]; if (!st.show) return; const oo = {}, rw = wn(p, a.from == null ? 0 : a.from, a.until == null ? 1 : a.until); for (const kk in (a.o || {})) { const v = a.o[kk]; oo[kk] = Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' ? lerp(v[0], v[1], ez(rw)) : v; } oo.c = a.c; oo.ex = st.ex; MODELS[a.m](st.x, st.y, st.z, st.face, st.s, oo, T, st); });
    if (SET.dyn) SET.dyn(b, T, p);
    (b.bolts || []).forEach((bo) => { if (Math.abs(p - bo.p) < 0.045) MODELS.bolt(bo.x, 0, bo.z, 0, 1, { seed: Math.round(bo.p * 100), h: bo.h || 34 }, T, {}); });
    let env = Object.assign({ amb: 0.6, sk: 0.52, bright: 1, fogNear: 40, fogFar: 260 }, TIMES[b.time || SET.time]); env = CUR_THEME.env(env);
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, HH);
    c.save(); if (cv.roll) { const sc = 1 + Math.abs(cv.roll) * 1.5; c.translate(W / 2, HH / 2); c.rotate(cv.roll); c.scale(sc, sc); c.translate(-W / 2, -HH / 2); }
    skyDraw(c, env, T); renderScene(c, cam, env); drawFx(c, b.fx || [], T);
    c.restore();
    if (b.flash === 'red') { c.fillStyle = `rgba(255,40,30,${0.2 * (0.5 + 0.5 * sn(T * 10))})`; c.fillRect(0, 0, W, HH); }
    (b.flashes || []).forEach((fp) => { const d = p - fp; if (d >= 0 && d < 0.07) { c.fillStyle = `rgba(255,255,255,${0.75 * (1 - d / 0.07)})`; c.fillRect(0, 0, W, HH); } });
  }

  let GR2 = null;
  window.explainer = function (ctx, T) {
    const S = STORY; CUR_THEME = themeFor(S); if (S._look !== CUR_THEME) { S._look = CUR_THEME; VAR.hi = CUR_THEME.hi[Math.floor(rng(hashS(S.id + 'h'))() * 3)]; }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.filter = 'none'; ctx.clearRect(0, 0, W, HH);
    let i = S.beats.length - 1; for (let k = 0; k < S.beats.length; k++) if (T < TL.E[k] + TL.R[k]) { i = k; break; }
    const bt = T - TL.E[i], b = S.beats[i], A0 = getBuf(0), tr = trFor(S, i), trd = TRD[tr];
    renderBeat(A0.ctx, i, bt, T);
    const lp = i > 0 && bt < trd ? bt / trd : 1;
    ctx.filter = CUR_THEME.filter;
    if (lp >= 1 || tr === 'cut') ctx.drawImage(A0, 0, 0);
    else {
      const B0 = getBuf(1); renderBeat(B0.ctx, i - 1, TL.R[i - 1], TL.E[i - 1] + TL.R[i - 1]); const q = ez(lp);
      if (tr === 'flash') { ctx.drawImage(A0, 0, 0); ctx.filter = 'none'; ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - lp)})`; ctx.fillRect(0, 0, W, HH); }
      else if (tr === 'whip') { ctx.globalAlpha = 1; ctx.drawImage(lp < 0.5 ? B0 : A0, (lp < 0.5 ? -1 : 1) * (1 - Math.abs(lp - 0.5) * 2) * 0, 0); for (let k = 0; k < 7; k++) { ctx.globalAlpha = 0.16; const off = (lp < 0.5 ? -1 : 1) * (1 - Math.abs(lp * 2 - 1)) * 160 * (k - 3) / 3; ctx.drawImage(lp < 0.5 ? B0 : A0, off, 0); } ctx.globalAlpha = 1; }
      else if (tr === 'zoom') { const sc = lerp(1.35, 1, q); ctx.drawImage(B0, 0, 0); ctx.globalAlpha = q; ctx.save(); ctx.translate(W / 2, HH / 2); ctx.scale(sc, sc); ctx.translate(-W / 2, -HH / 2); ctx.drawImage(A0, 0, 0); ctx.restore(); ctx.globalAlpha = 1; }
      else if (tr === 'wipe') { ctx.drawImage(B0, 0, 0); ctx.save(); ctx.beginPath(); const xx = lerp(-200, W + 200, q); ctx.moveTo(0, 0); ctx.lineTo(xx + 160, 0); ctx.lineTo(xx - 160, HH); ctx.lineTo(0, HH); ctx.closePath(); ctx.clip(); ctx.drawImage(A0, 0, 0); ctx.restore(); }
      else if (tr === 'dip') { ctx.drawImage(lp < 0.5 ? B0 : A0, 0, 0); ctx.filter = 'none'; const a2 = lp < 0.5 ? lp * 2 : (1 - lp) * 2; ctx.fillStyle = `rgba(14,8,36,${a2})`; ctx.fillRect(0, 0, W, HH); }
      else if (tr === 'slide') { ctx.drawImage(B0, -W * q, 0); ctx.drawImage(A0, W * (1 - q), 0); }
    }
    ctx.filter = 'none'; ctx.globalAlpha = 1;
    if (CUR_THEME.bloom > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.filter = 'blur(10px) brightness(1.15)'; ctx.globalAlpha = CUR_THEME.bloom; ctx.drawImage(A0, 0, 0); ctx.restore(); ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    const bg = BADGE[S.kind] || BADGE.tale; tag(ctx, 175, 74, bg[0], { size: 30, bg: bg[1], col: bg[2] });
    if (i === 0) tag(ctx, W / 2, 200, S.title.toUpperCase(), { size: 58, k: bk(wn(bt, 0.1, 0.45)) * (1 - wn(bt, 2.4, 2.9)) });
    (b.tags || []).forEach((tg) => { const a = tg.t[0], e = tg.t[1], p = cl(bt / TL.R[i]), k = bk(wn(p, a, a + 0.1)) * (1 - wn(p, e - 0.08, e)); const txt = tg.count ? Math.round(lerp(tg.count[0], tg.count[1], eo(wn(p, a + 0.02, e - 0.1)))).toLocaleString('en-US') + (tg.suffix || '') : tg.text; tag(ctx, W / 2, tg.y || 330, txt, { size: tg.size || 70, k, bg: tg.bg, col: tg.col }); });
    drawSubtitle(ctx, T, VAR.hi);
    const vg = CUR_THEME.vig, g = ctx.createRadialGradient(W / 2, HH / 2, 420, W / 2, HH / 2, 900); g.addColorStop(0, 'rgba(10,5,30,0)'); g.addColorStop(1, `rgba(10,5,30,${vg})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, HH);
    if (!GR2) { GR2 = document.createElement('canvas'); GR2.width = GR2.height = 128; const x = GR2.getContext('2d'), im = x.createImageData(128, 128), d = im.data, q = rng(9); for (let k = 0; k < d.length; k += 4) { const v = (q() * 255) | 0; d[k] = d[k + 1] = d[k + 2] = v; d[k + 3] = 255; } x.putImageData(im, 0, 0); GR2.pat = ctx.createPattern(GR2, 'repeat'); }
    const f = Math.floor(T * 12); ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = CUR_THEME.grain; ctx.translate((f * 37) % 128, (f * 91) % 128); ctx.fillStyle = GR2.pat; ctx.fillRect(-128, -128, W + 256, HH + 256); ctx.restore();
  };

  // ---------------------------------------------------------------- VALIDATOR (allows the new things; removes the fiction rule)
  window.validateStory = function (s) {
    const E = [], wordsOf = (t) => t.split(/\s+/).filter(Boolean).length; if (!s || typeof s !== 'object') return ['story is not an object'];
    const CATS = ['2', '15', '17', '22', '24', '26', '27', '28', '1'];
    if (!/^[a-z0-9_]+$/.test(s.id || '')) E.push('id must be lowercase letters/digits/_'); if (!s.title || s.title.length > 32) E.push('title missing or longer than 32 chars'); if (!s.caption) E.push('caption missing'); if (!s.tags) E.push('tags missing'); if (KINDS.indexOf(s.kind) < 0) E.push('unknown kind ' + s.kind);
    if (s.cat && CATS.indexOf(s.cat) < 0) E.push('cat not allowed ' + s.cat); if (s.look && !THEMES[s.look]) E.push('unknown look ' + s.look);
    if (!SETS[s.set]) E.push('unknown set: ' + s.set); if (!MUS[s.music]) E.push('unknown music: ' + s.music);
    const bs = s.beats || []; if (bs.length < 4 || bs.length > 6) E.push('needs 4 to 6 beats'); let total = 0;
    bs.forEach((b, i) => {
      const L = 'beat ' + (i + 1) + ': '; if (!b.vo) { E.push(L + 'vo text missing'); return; } const w = wordsOf(b.vo); total += w; if (w < 6 || w > 20) E.push(L + 'voice line must be 6 to 20 words (is ' + w + ')');
      if (b.set && !SETS[b.set]) E.push(L + 'unknown set ' + b.set); if (b.time && !TIMES[b.time]) E.push(L + 'unknown time ' + b.time); if (b.tr && TRANSITIONS.indexOf(b.tr) < 0) E.push(L + 'unknown transition ' + b.tr);
      const ids = {}; (b.actors || []).forEach((a) => { if (!MODELS[a.m]) E.push(L + 'unknown model ' + a.m); if (!a.id) E.push(L + 'actor without id'); else if (ids[a.id]) E.push(L + 'duplicate actor id ' + a.id); ids[a.id] = 1; if (!Array.isArray(a.at) || a.at.length !== 2) E.push(L + 'actor ' + a.id + ': at must be [x,z]'); if (a.anim && ALLANIM.indexOf(a.anim) < 0) E.push(L + 'unknown anim ' + a.anim); if (a.end && ALLANIM.indexOf(a.end) < 0) E.push(L + 'unknown end anim ' + a.end); (a.seq || []).forEach(([pp, nm]) => { if (ALLANIM.indexOf(nm) < 0) E.push(L + 'unknown seq anim ' + nm); }); if (a.ex && EXS.indexOf(a.ex) < 0) E.push(L + 'unknown expression ' + a.ex); });
      if ((b.actors || []).length > 16) E.push(L + 'too many actors (max 16)');
      const c = b.cam; if (c) { if (CAMS.indexOf(c.mode) < 0) E.push(L + 'unknown camera mode ' + c.mode); ['target', 'look', 'look2'].forEach((k) => { if (typeof c[k] === 'string' && !ids[c[k]]) E.push(L + 'camera ' + k + ' "' + c[k] + '" is not an actor id'); }); }
      (b.fx || []).forEach((f) => { if (FXS.indexOf(f) < 0) E.push(L + 'unknown fx ' + f); }); (b.sfx || []).forEach((f) => { if (SFX_NAMES.indexOf(f.split('@')[0]) < 0) E.push(L + 'unknown sfx ' + f); }); (b.tags || []).forEach((t) => { if (!t.count && (t.text || '').length > 24) E.push(L + 'tag text too long'); });
    });
    if (total < 44 || total > 70) E.push('total narration must be 44 to 70 words (is ' + total + ')'); return E;
  };

  // ---------------------------------------------------------------- CATALOG (people cycle through animations)
  const CATANIMS = ['stand', 'walk', 'run', 'wave', 'point', 'celebrate', 'sit', 'crouch', 'kneel', 'clap', 'bow', 'salute', 'think', 'jump', 'kick', 'dance', 'throw', 'climb'];
  const drawCatalogOrig = window.drawCatalog;
  window.drawCatalog = function (ctx, page, T) { CUR_THEME = THEMES.classic; return drawCatalogOrig(ctx, page, T); };
  window.CAT_ANIMS = CATANIMS;
  window.THEMES = THEMES;
})();
