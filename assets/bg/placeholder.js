/* 希恩絲學院官網 v3 ── 暫代圖產生器（canvas 繪製；依「美術風格指南 v1」：乾淨線稿＋柔和賽璐珞、2～3 階陰影）
   ‧ 用途一：產生 assets/bg/（布景板）與 assets/prop/（小物）底下所有暫代 WebP（桌機版與 .m 手機版都由這支畫出來）。
   ‧ 用途二：正式圖讀不到時（例如直接雙擊 index.html 以 file:// 開啟），頁面改用這支現場畫暫代圖。
   ‧ 正式手繪圖只要用同名 .webp 覆蓋即可，這支檔案不需要改。
   ‧ 色票一律取自指南 4.1／4.2：深藍、奶油白、鈴蘭藍、石材米灰、胡桃、深木、樑柱深棕、黃銅；粉色只在社辦小面積出現。 */
(function (root) {
  'use strict';
  var TAU = Math.PI * 2, PI = Math.PI;
  function rng(seed) { var s = seed | 0; return function (a, b) { s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; var r = ((t ^ t >>> 14) >>> 0) / 4294967296; return a === undefined ? r : b === undefined ? r * a : a + r * (b - a); }; }
  function hx(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function mx(a, b, t) { a = typeof a === 'string' ? hx(a) : a; b = typeof b === 'string' ? hx(b) : b; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function C(c, a) { c = typeof c === 'string' ? hx(c) : c; return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (a === undefined ? 1 : a) + ')'; }

  /* ---------- 色票（指南 4.1 場景色、4.2 品牌色；其餘為同色系的明暗階） ---------- */
  var K = {
    navy: '#2C3F5F', navyF: '#1B2D51', cream: '#F7E3DA', lily: '#406A85', stone: '#DFCABF', walnut: '#966C59', wood: '#624239', beam: '#322A33', brass: '#AF845C', pink: '#E5B5B0',
    bnavy: '#0A1A36', champ: '#FBE6BC', ivory: '#FBF7EC', slate: '#6C7F96', tile: '#213C73', white: '#FFFFFF', line: '#2B2430', lineN: '#101A2E',
    sky1: '#5C9EDB', sky2: '#A9D0EE', sky3: '#DCEEF9', cloud: '#FFFFFF', cloudS: '#D3E5F4',
    leaf: '#6FA55C', leafD: '#4B8149', leafL: '#A3CB80', grass: '#8FBF6E', grassD: '#73A95C', stem: '#5B8F58',
    glassG: '#8DB58A', glassC: '#F3E9C9', book: ['#1B2D51', '#2C3F5F', '#2F5446', '#EADBC8', '#6B4A3E', '#48382F', '#3D5F86'],
    nSky1: '#0A1A36', nSky2: '#16305C', nSky3: '#2B4C7E', star: '#FBE6BC', lamp: '#FFE9B8'
  };
  /* 陰影偏藍灰、亮面往白提：每個顏色固定三階 */
  function sh(c, t) { return C(mx(mx(c, '#3F4E73', t === undefined ? 0.3 : t), '#0A1020', 0.05)); }
  function hi(c, t) { return C(mx(c, '#FFFFFF', t === undefined ? 0.36 : t)); }
  function nt(c, t) { return C(mx(mx(c, '#1B2F5E', t === undefined ? 0.55 : t), '#060D20', 0.12)); }      /* 夜色版：往深藍收 */

  /* ---------- 座標 ---------- */
  function px(P) { P.g.setTransform(P.k, 0, 0, P.k, 0, 0); P.up = -1; P.u = 1; P.lw = P.L; }
  /* 世界座標（y 向上）：畫布對應 ww×wh 個世界單位，x0/y0 為左下角 */
  function wt(P, ww, wh, x0, y0) { var sx = P.k * P.W / ww, sy = P.k * P.H / wh; P.g.setTransform(sx, 0, 0, -sy, -(x0 || 0) * sx, P.k * P.H + (y0 || 0) * sy); P.up = 1; P.u = ww / P.W; P.lw = P.L * P.u; }

  /* ---------- 畫具 ---------- */
  function F(P, c) { P.g.fillStyle = c; P.g.fill(); }
  function S(P, w, c) { var g = P.g; g.strokeStyle = c || K.line; g.lineWidth = (w === undefined ? 1 : w) * P.lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
  function R(P, x, y, w, h, c, lw, lc) { var g = P.g; g.beginPath(); g.rect(x, y, w, h); if (c) F(P, c); if (lw) S(P, lw, lc); }
  function pth(g, pts, open) { g.beginPath(); for (var i = 0; i < pts.length; i++) { if (i) g.lineTo(pts[i][0], pts[i][1]); else g.moveTo(pts[i][0], pts[i][1]); } if (!open) g.closePath(); }
  function PL(P, pts, c, lw, lc, open) { pth(P.g, pts, open); if (c) F(P, c); if (lw) S(P, lw, lc); }
  function EL(P, cx, cy, rx, ry, c, lw, lc) { var g = P.g; g.beginPath(); g.ellipse(cx, cy, rx, ry === undefined ? rx : ry, 0, 0, TAU); if (c) F(P, c); if (lw) S(P, lw, lc); }
  function LN(P, x1, y1, x2, y2, w, c) { var g = P.g; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); S(P, w, c); }
  function clip(P, pathFn, fn) { var g = P.g; g.save(); g.beginPath(); pathFn(g); g.clip(); fn(g); g.restore(); }
  function cut(P, pathFn) { var g = P.g; g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; g.beginPath(); pathFn(g); g.fill(); g.restore(); }
  function vgrad(P, x, y, w, h, stops) { var g = P.g, gr = g.createLinearGradient(0, y, 0, y + h); stops.forEach(function (s) { gr.addColorStop(s[0], typeof s[1] === 'string' && s[2] === undefined ? s[1] : C(s[1], s[2])); }); g.fillStyle = gr; g.fillRect(x, y, w, h); }
  function hgrad(P, x, y, w, h, stops) { var g = P.g, gr = g.createLinearGradient(x, 0, x + w, 0); stops.forEach(function (s) { gr.addColorStop(s[0], typeof s[1] === 'string' && s[2] === undefined ? s[1] : C(s[1], s[2])); }); g.fillStyle = gr; g.fillRect(x, y, w, h); }
  function soft(P, x, y, r, c, a, core) { var g = P.g, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, C(c, a)); if (core) gr.addColorStop(core, C(c, a)); gr.addColorStop(1, C(c, 0)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  function star4(P, x, y, r, c, k) { var g = P.g, i; g.beginPath(); for (i = 0; i < 8; i++) { var a = i * PI / 4 - PI / 2, rr = i % 2 ? r * (k || 0.16) : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); F(P, c); }
  /* 圓團（樹冠、雲、灌木）：先描邊再填色，只留下外輪廓線 */
  function blob(P, cs, fill, lw, lc) { var g = P.g, i; if (lw) for (i = 0; i < cs.length; i++) { g.beginPath(); g.arc(cs[i][0], cs[i][1], cs[i][2], 0, TAU); S(P, lw * 2, lc); } g.fillStyle = fill; for (i = 0; i < cs.length; i++) { g.beginPath(); g.arc(cs[i][0], cs[i][1], cs[i][2], 0, TAU); g.fill(); } }
  function blobPath(cs) { return function (g) { for (var i = 0; i < cs.length; i++) { g.moveTo(cs[i][0] + cs[i][2], cs[i][1]); g.arc(cs[i][0], cs[i][1], cs[i][2], 0, TAU); } }; }

  /* 尖拱（哥德復興）：直壁到 hy，上方兩段圓弧在中線交會。k = 弧半徑／半寬（1.25：略尖；1：半圓）。世界座標（y 向上）用 */
  var AK = 1.25;
  function archApex(hw, k) { k = k || AK; var d = (k - 1) * hw, R = k * hw; return Math.sqrt(R * R - d * d); }
  function archPath(g, cx, y0, hw, hy, k) {
    k = k || AK; var d = (k - 1) * hw, Rr = k * hw, a = Math.atan2(archApex(hw, k), d);
    g.moveTo(cx - hw, y0); g.lineTo(cx - hw, y0 + hy); g.arc(cx + d, y0 + hy, Rr, PI, PI - a, true); g.arc(cx - d, y0 + hy, Rr, a, 0, true); g.lineTo(cx + hw, y0); g.closePath();
  }
  /* 像素座標（y 向下）用的尖拱：底邊在 yb，直壁往上 hy */
  function archPx(g, cx, yb, hw, hy, k) {
    k = k || AK; var d = (k - 1) * hw, Rr = k * hw, a = Math.atan2(archApex(hw, k), d);
    g.moveTo(cx - hw, yb); g.lineTo(cx - hw, yb - hy); g.arc(cx + d, yb - hy, Rr, PI, PI + a, false); g.arc(cx - d, yb - hy, Rr, -a, 0, false); g.lineTo(cx + hw, yb); g.closePath();
  }

  /* ---------- 母題 ---------- */
  /* 壁紙上的鈴蘭小紋：一莖、兩葉、三朵垂鈴 */
  function lilyMotif(P, x, y, s, col) {
    var g = P.g, u = P.up; g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round'; g.lineWidth = s * 0.09;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - s * 0.04, y + u * s * 0.6, x + s * 0.2, y + u * s); g.stroke();
    g.beginPath(); g.moveTo(x, y + u * s * 0.05); g.quadraticCurveTo(x - s * 0.34, y + u * s * 0.3, x - s * 0.2, y + u * s * 0.72); g.quadraticCurveTo(x - s * 0.1, y + u * s * 0.36, x, y + u * s * 0.05); g.fill();
    g.beginPath(); g.moveTo(x, y + u * s * 0.05); g.quadraticCurveTo(x + s * 0.3, y + u * s * 0.22, x + s * 0.26, y + u * s * 0.56); g.quadraticCurveTo(x + s * 0.1, y + u * s * 0.3, x, y + u * s * 0.05); g.fill();
    for (var i = 0; i < 3; i++) { g.beginPath(); g.arc(x + s * (0.02 + i * 0.1) + s * 0.13, y + u * s * (0.72 + i * 0.1) - u * s * 0.1, s * 0.075, 0, TAU); g.fill(); }
  }
  function heart(P, x, y, s, col) { var g = P.g, u = P.up; g.fillStyle = col; g.beginPath(); g.moveTo(x, y - u * s * 0.5); g.bezierCurveTo(x - s, y + u * s * 0.2, x - s * 0.5, y + u * s * 0.9, x, y + u * s * 0.4); g.bezierCurveTo(x + s * 0.5, y + u * s * 0.9, x + s, y + u * s * 0.2, x, y - u * s * 0.5); g.fill(); }
  /* 奶油白壁紙＋鈴蘭藍小紋（pink：社辦才加的小愛心） */
  function wallpaper(P, x0, y0, w, h, step, pink, base) {
    var r = 0, x, y;
    R(P, x0, y0, w, h, base || K.cream);
    clip(P, function (g) { g.rect(x0, y0, w, h); }, function () {
      for (y = y0 + step * 0.3; y < y0 + h + step; y += step * 0.86, r++) for (x = x0 + (r % 2 ? step * 0.5 : 0) + step * 0.25; x < x0 + w + step; x += step) {
        lilyMotif(P, x, P.up > 0 ? y : y + step * 0.5, step * 0.42, K.lily);
        if (pink) heart(P, x + step * 0.5, (P.up > 0 ? y : y + step * 0.5) + P.up * step * 0.2, step * 0.055, K.pink);
      }
    });
  }
  /* 深藍護牆板：上緣壓條、一格一格的鑲板（亮邊在上左、暗邊在下右） */
  function wainscot(P, x0, y0, w, h, pw, col) {
    var c = col || K.navy, n = Math.max(1, Math.round(w / pw)), bw = w / n, m = Math.min(bw, h) * 0.13, i, capH = h * 0.07, baseH = h * 0.1, yT = y0 + h, x;
    R(P, x0, y0, w, h, c);
    R(P, x0, y0, w, baseH, sh(c, 0.35)); R(P, x0, yT - capH, w, capH, hi(c, 0.16)); LN(P, x0, yT - capH, x0 + w, yT - capH, 0.8, K.lineN); LN(P, x0, y0 + baseH, x0 + w, y0 + baseH, 0.7, K.lineN);
    for (i = 0; i < n; i++) {
      x = x0 + i * bw + m; var pwid = bw - 2 * m, py = y0 + baseH + m, ph = h - capH - baseH - 2 * m;
      R(P, x, py, pwid, ph, sh(c, 0.16)); R(P, x + m * 0.35, py + m * 0.35, pwid - m * 0.7, ph - m * 0.7, c);
      LN(P, x, py + ph, x + pwid, py + ph, 0.7, hi(c, 0.3)); LN(P, x, py, x, py + ph, 0.7, hi(c, 0.3));
      g_rect(P, x, py, pwid, ph, 0.8, K.lineN);
    }
    LN(P, x0, yT, x0 + w, yT, 1, K.lineN);
  }
  function g_rect(P, x, y, w, h, lw, lc) { P.g.beginPath(); P.g.rect(x, y, w, h); S(P, lw, lc); }
  /* 人字拼木地板（俯視）：一欄一欄左右交錯的斜木條。s = 一欄的寬度 */
  function herring(P, x0, y0, w, h, s, base) {
    var c = base || K.walnut, cs = [C(mx(c, '#FFFFFF', 0.045)), c, c, C(mx(c, '#3A2A28', 0.05)), C(mx(c, '#FFFFFF', 0.02))], t = s * 0.36, r = P.r, k, j, lc = C(mx(c, '#2B1E1E', 0.24));
    R(P, x0, y0, w, h, c);
    clip(P, function (g) { g.rect(x0, y0, w, h); }, function () {
      for (k = 0; k * s < w; k++) for (j = -Math.ceil(s / t) - 1; j * t < h + t; j++) {
        var x = x0 + k * s, y = y0 + j * t;
        PL(P, k % 2 ? [[x, y + s], [x + s, y], [x + s, y + t], [x, y + s + t]] : [[x, y], [x + s, y + s], [x + s, y + s + t], [x, y + t]], cs[(r() * cs.length) | 0], 0.3, lc);
      }
      for (k = 1; k * s < w; k++) LN(P, x0 + k * s, y0, x0 + k * s, y0 + h, 0.3, lc);
    });
  }
  /* 石灰岩砌面：整塊底色＋少數深淺石塊＋細縫 */
  function ashlar(P, x0, y0, w, h, bh, col, seedless) {
    var c = col || K.stone, r = P.r, y, x, row = 0, jc = sh(c, 0.36);
    R(P, x0, y0, w, h, c);
    clip(P, function (g) { g.rect(x0, y0, w, h); }, function () {
      for (y = y0; y < y0 + h; y += bh, row++) {
        x = x0 - (row % 2 ? bh * 1.1 : 0) - r(bh * 0.4);
        while (x < x0 + w) { var bw = bh * r(1.7, 2.9), t = r(); if (t < 0.16) R(P, x, y, bw, bh, hi(c, 0.22)); else if (t < 0.3) R(P, x, y, bw, bh, sh(c, 0.12)); LN(P, x, y, x, y + bh, 0.45, jc); x += bw; }
        LN(P, x0, y, x0 + w, y, 0.45, jc);
      }
    });
  }
  /* 鉛條菱格玻璃：在已經剪裁好的範圍裡畫斜格線 */
  function lattice(P, x0, y0, w, h, step, col, lw) {
    var g = P.g, i; g.beginPath();
    for (i = -h; i < w + h; i += step) { g.moveTo(x0 + i, y0); g.lineTo(x0 + i + h, y0 + h); g.moveTo(x0 + i + h, y0); g.lineTo(x0 + i, y0 + h); }
    S(P, lw || 0.5, col || '#5E6A7A');
  }
  /* 哥德尖拱窗（世界座標）：石框、中梃、兩個小尖拱、頂部四葉飾。glass：不給 = 挖空（看得到後面的景），給顏色 = 玻璃色；fill：畫玻璃後面的景 */
  function gothicWin(P, cx, y0, hw, hy, o) {
    o = o || {}; var g = P.g, t = o.t || hw * 0.16, fc = o.frame || K.stone, ap = archApex(hw), ihw = hw - t, ihy = hy, sub = ihw / 2, qy = y0 + hy + ap * 0.4, qr = ihw * 0.3, i, lc = o.line || K.line;
    function bar(w) { S(P, w + 0.9, lc); S(P, w, fc); }
    g.beginPath(); archPath(g, cx, y0 - t * 0.2, hw + t * 0.2, hy + t * 0.2); F(P, fc); S(P, 1, lc);
    /* 石框右側與下緣一階陰影 */
    clip(P, function (gg) { archPath(gg, cx, y0 - t * 0.2, hw + t * 0.2, hy + t * 0.2); }, function () { R(P, cx + ihw, y0 - t, t * 1.4, hy + t, sh(fc, 0.22)); });
    if (o.sill !== 0) { R(P, cx - hw - t * 0.9, y0 - t * 1.3, (hw + t * 0.9) * 2, t * 1.1, hi(fc, 0.2), 1, lc); R(P, cx - hw - t * 0.9, y0 - t * 1.3, (hw + t * 0.9) * 2, t * 0.35, sh(fc, 0.3)); }
    if (o.glass) { g.beginPath(); archPath(g, cx, y0 + t, ihw, ihy - t); F(P, o.glass); }
    else cut(P, function (gg) { archPath(gg, cx, y0 + t, ihw, ihy - t); });
    clip(P, function (gg) { archPath(gg, cx, y0 + t, ihw, ihy - t); }, function () {
      if (o.fill) o.fill();
      lattice(P, cx - ihw, y0 + t, ihw * 2, ihy + ap, o.lat || hw * 0.3, o.latCol || '#5F6C7C', o.latW || 0.55);
      g.beginPath(); archPath(g, cx - sub, y0 + t, sub, ihy - t - sub * 0.25, 1.3); bar(1.9); g.beginPath(); archPath(g, cx + sub, y0 + t, sub, ihy - t - sub * 0.25, 1.3); bar(1.9);
      g.beginPath(); g.arc(cx, qy, qr, 0, TAU); bar(1.9);
      for (i = 0; i < 4; i++) { g.beginPath(); g.arc(cx + Math.cos(i * PI / 2 + PI / 4) * qr * 0.42, qy + Math.sin(i * PI / 2 + PI / 4) * qr * 0.42, qr * 0.36, 0, TAU); S(P, 1.1, fc); }
      R(P, cx - t * 0.3, y0 + t, t * 0.6, ihy - t, fc); LN(P, cx - t * 0.3, y0 + t, cx - t * 0.3, y0 + ihy, 0.5, lc); LN(P, cx + t * 0.3, y0 + t, cx + t * 0.3, y0 + ihy, 0.5, lc);
    });
    g.beginPath(); archPath(g, cx, y0 + t, ihw, ihy - t); S(P, 0.8, lc);
  }
  /* 一排書背：深藍、深綠、奶油、深棕為主，偶爾一條金線 */
  function bookRow(P, x0, y0, w, h, night) {
    var r = P.r, x = x0, g = P.g;
    while (x < x0 + w - h * 0.05) {
      var bw = h * r(0.1, 0.24), bh = h * r(0.72, 0.97), c = K.book[(r() * K.book.length) | 0];
      if (x + bw > x0 + w) bw = x0 + w - x;
      if (r() < 0.06) { x += bw * 0.6; continue; }
      R(P, x, y0, bw, bh, night ? nt(c, 0.3) : c, 0.4, K.lineN);
      if (r() < 0.55) { R(P, x + bw * 0.12, y0 + bh * 0.72, bw * 0.76, bh * 0.05, night ? nt(K.brass, 0.25) : K.brass); if (r() < 0.5) R(P, x + bw * 0.12, y0 + bh * 0.2, bw * 0.76, bh * 0.04, night ? nt(K.brass, 0.25) : K.brass); }
      x += bw;
    }
  }
  /* 書櫃：外框、層板、書 */
  function bookcase(P, x0, y0, w, h, rows, fc, night) {
    var t = Math.min(w, h) * 0.035, rh = (h - t * 2) / rows, i;
    R(P, x0, y0, w, h, fc, 1, K.lineN); R(P, x0 + t, y0 + t, w - t * 2, h - t * 2, sh(fc, 0.45));
    for (i = 0; i < rows; i++) { bookRow(P, x0 + t * 1.2, y0 + t + i * rh + t * 0.5, w - t * 2.4, rh - t * 0.9, night); R(P, x0 + t, y0 + t + i * rh, w - t * 2, t * 0.5, hi(fc, 0.12), 0.5, K.lineN); }
  }
  /* 黃銅吊燈（世界座標）：鏈子、中軸、彎臂、白色鬱金香燈罩。lit：燈亮（夜景） */
  function chandelier(P, cx, top, s, n, lit) {
    var g = P.g, i, hubY = top - s * 1.5, armY = hubY - s * 0.15, bc = K.brass;
    for (i = 0; i < 7; i++) EL(P, cx, top - s * (0.08 + i * 0.16), s * 0.035, s * 0.07, null, 0.8, sh(bc, 0.2));
    PL(P, [[cx - s * 0.07, hubY + s * 0.5], [cx + s * 0.07, hubY + s * 0.5], [cx + s * 0.12, hubY + s * 0.1], [cx - s * 0.12, hubY + s * 0.1]], bc, 0.8);
    EL(P, cx, hubY, s * 0.2, s * 0.17, bc, 0.8); EL(P, cx - s * 0.06, hubY + s * 0.05, s * 0.06, s * 0.05, hi(bc, 0.45)); EL(P, cx, hubY - s * 0.28, s * 0.07, s * 0.09, bc, 0.8);
    for (i = 0; i < n; i++) {
      var f = n > 1 ? i / (n - 1) : 0.5, dx = (f - 0.5) * 2, ax = cx + dx * s * (0.95 + 0.12 * Math.abs(dx)), ay = armY + s * (0.3 + 0.1 * (1 - Math.abs(dx)));
      g.beginPath(); g.moveTo(cx + dx * s * 0.12, hubY); g.bezierCurveTo(cx + dx * s * 0.45, hubY - s * 0.5, ax, armY - s * 0.45, ax, ay - s * 0.02); S(P, 2.6, K.line); S(P, 1.5, bc);
      /* 綠玻璃托、白色鬱金香罩 */
      PL(P, [[ax - s * 0.1, ay], [ax + s * 0.1, ay], [ax + s * 0.07, ay + s * 0.09], [ax - s * 0.07, ay + s * 0.09]], '#7FA36E', 0.7);
      g.beginPath(); g.moveTo(ax - s * 0.1, ay + s * 0.09); g.bezierCurveTo(ax - s * 0.24, ay + s * 0.22, ax - s * 0.2, ay + s * 0.4, ax - s * 0.19, ay + s * 0.5); g.quadraticCurveTo(ax - s * 0.1, ay + s * 0.43, ax, ay + s * 0.52); g.quadraticCurveTo(ax + s * 0.1, ay + s * 0.43, ax + s * 0.19, ay + s * 0.5); g.bezierCurveTo(ax + s * 0.2, ay + s * 0.4, ax + s * 0.24, ay + s * 0.22, ax + s * 0.1, ay + s * 0.09); g.closePath();
      F(P, lit ? '#FFF6D8' : '#FFFDF6'); S(P, 0.8);
      clip(P, function (gg) { gg.rect(ax + s * 0.04, ay, s * 0.3, s * 0.6); }, function () { g.beginPath(); g.moveTo(ax - s * 0.1, ay + s * 0.09); g.bezierCurveTo(ax - s * 0.24, ay + s * 0.22, ax - s * 0.2, ay + s * 0.4, ax - s * 0.19, ay + s * 0.5); g.quadraticCurveTo(ax - s * 0.1, ay + s * 0.43, ax, ay + s * 0.52); g.quadraticCurveTo(ax + s * 0.1, ay + s * 0.43, ax + s * 0.19, ay + s * 0.5); g.bezierCurveTo(ax + s * 0.2, ay + s * 0.4, ax + s * 0.24, ay + s * 0.22, ax + s * 0.1, ay + s * 0.09); g.closePath(); F(P, lit ? '#F6E2A8' : '#E6E3E4'); });
    }
  }
  /* 鈴蘭（實景）：兩片寬葉、一條彎莖、一串白色垂鈴。s = 高度 */
  function lilyPlant(P, x, y, s, flip, night) {
    var g = P.g, u = P.up, f = flip ? -1 : 1, lc = night ? nt(K.leaf, 0.5) : K.leaf, ld = night ? nt(K.leafD, 0.5) : K.leafD, wc = night ? '#C9D6EE' : '#FFFFFF', ln = night ? K.lineN : K.line, i;
    function leaf(dx, hh, wd, col) { g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + f * (dx * 0.2 - wd), y + u * hh * 0.35, x + f * (dx - wd), y + u * hh * 0.8, x + f * dx, y + u * hh); g.bezierCurveTo(x + f * (dx + wd * 0.6), y + u * hh * 0.7, x + f * (dx * 0.5 + wd), y + u * hh * 0.3, x, y); F(P, col); S(P, 0.8, ln); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + f * dx * 0.5, y + u * hh * 0.5, x + f * dx, y + u * hh); S(P, 0.45, night ? K.lineN : sh(K.leafD, 0.4)); }
    leaf(-s * 0.3, s * 0.78, s * 0.16, ld); leaf(s * 0.14, s * 0.9, s * 0.17, lc);
    var b = [[x + f * s * 0.02, y + u * s * 0.1], [x + f * s * 0.05, y + u * s * 0.72], [x + f * s * 0.22, y + u * s * 1.04], [x + f * s * 0.52, y + u * s * 0.84]];
    g.beginPath(); g.moveTo(b[0][0], b[0][1]); g.bezierCurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]); S(P, 0.9, night ? nt(K.stem, 0.5) : K.stem);
    for (i = 0; i < 6; i++) {
      var t = 0.5 + i * 0.1, q = 1 - t, bx = q * q * q * b[0][0] + 3 * q * q * t * b[1][0] + 3 * q * t * t * b[2][0] + t * t * t * b[3][0], by = q * q * q * b[0][1] + 3 * q * q * t * b[1][1] + 3 * q * t * t * b[2][1] + t * t * t * b[3][1], br = s * (0.075 - i * 0.006);
      by -= u * br * 0.3;
      g.beginPath(); g.moveTo(bx - br * 0.75, by); g.quadraticCurveTo(bx - br * 1.15, by - u * br * 1.5, bx - br * 0.6, by - u * br * 1.9); g.lineTo(bx - br * 0.2, by - u * br * 1.55); g.lineTo(bx + br * 0.2, by - u * br * 1.9); g.lineTo(bx + br * 0.6, by - u * br * 1.55); g.quadraticCurveTo(bx + br * 1.15, by - u * br * 1.5, bx + br * 0.75, by); g.quadraticCurveTo(bx, by + u * br * 0.5, bx - br * 0.75, by); F(P, wc); S(P, 0.6, night ? '#3C4E78' : '#7C8CA6');
    }
  }
  /* 賽璐珞的樹：樹幹＋樹冠（暗、中、亮三階，亮面朝左上），外輪廓一條線 */
  function tree(P, cx, base, w, h, o) {
    o = o || {}; var r = P.r, u = P.up, cs = [], i, n = o.n || 9, cy = base + u * h * 0.64, rx = w * 0.5, ry = h * 0.36, lc = o.night ? nt(K.leaf, 0.6) : K.leaf, ld = o.night ? nt(K.leafD, 0.6) : K.leafD, ll = o.night ? nt(K.leafL, 0.62) : K.leafL, wc = o.night ? nt(K.wood, 0.5) : K.wood;
    PL(P, [[cx - w * 0.05, base], [cx + w * 0.05, base], [cx + w * 0.035, base + u * h * 0.5], [cx - w * 0.035, base + u * h * 0.5]], wc, o.lw === 0 ? 0 : 0.8, o.night ? K.lineN : K.line);
    for (i = 0; i < n; i++) { var a = i / n * TAU + r(0.5), d = 0.52 + r(0.18); cs.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, Math.min(rx, ry) * r(0.42, 0.6)]); }
    cs.push([cx, cy, Math.min(rx, ry) * 0.8]);
    blob(P, cs, lc, o.lw === 0 ? 0 : 0.8, o.night ? K.lineN : K.line);
    clip(P, blobPath(cs), function () {
      var sd = cs.map(function (c) { return [c[0] + rx * 0.16, c[1] - u * ry * 0.22, c[2] * 0.86]; }), lt = cs.map(function (c) { return [c[0] - rx * 0.2, c[1] + u * ry * 0.3, c[2] * 0.5]; });
      blob(P, sd, ld, 0); blob(P, cs.map(function (c) { return [c[0] - rx * 0.06, c[1] + u * ry * 0.1, c[2] * 0.82]; }), lc, 0); blob(P, lt, ll, 0);
    });
  }
  /* 動畫背景的雲：純白、底部一階淡藍陰影，邊緣俐落、不描線 */
  function cloud(P, cx, cy, w, h, c1, c2) {
    var r = P.r, u = P.up, cs = [], n = 5 + ((w / h) | 0), i;
    for (i = 0; i < n; i++) { var t = n > 1 ? i / (n - 1) : 0.5, rr = h * (0.3 + 0.34 * Math.sin(PI * t)) * r(0.8, 1.15); cs.push([cx + (t - 0.5) * w * 0.86, cy + u * rr * 0.75, rr]); }
    cs.push([cx - w * 0.12, cy + u * h * 0.62, h * 0.36], [cx + w * 0.16, cy + u * h * 0.5, h * 0.3]);
    clip(P, function (g) { if (u > 0) g.rect(cx - w, cy, w * 2, h * 2); else g.rect(cx - w, cy - h * 2, w * 2, h * 2); }, function () {
      blob(P, cs, c2 || K.cloudS, 0);
      blob(P, cs.map(function (c) { return [c[0] - w * 0.012, c[1] + u * h * 0.13, c[2] * 0.93]; }), c1 || K.cloud, 0);
    });
  }
  /* 灰藍石板屋頂：一排排瓦線 */
  function slate(P, pts, col, rowH, lc) {
    var c = col || K.slate, b = bbox(pts), y, row = 0, g = P.g, x;
    PL(P, pts, c, 0);
    clip(P, function (gg) { pth(gg, pts); }, function () {
      for (y = b[1]; y < b[3]; y += rowH, row++) { LN(P, b[0], y, b[2], y, 0.45, sh(c, 0.42)); for (x = b[0] + (row % 2 ? rowH * 0.6 : 0); x < b[2]; x += rowH * 1.2) LN(P, x, y, x, y + rowH, 0.35, sh(c, 0.3)); }
    });
    pth(g, pts); S(P, 1, lc);
  }
  function bbox(pts) { var a = [1e9, 1e9, -1e9, -1e9]; pts.forEach(function (p) { a[0] = Math.min(a[0], p[0]); a[1] = Math.min(a[1], p[1]); a[2] = Math.max(a[2], p[0]); a[3] = Math.max(a[3], p[1]); }); return a; }
  /* 四葉飾圓窗（綠＋奶油彩繪玻璃） */
  function roseWin(P, cx, cy, r, fc) {
    var g = P.g, i; fc = fc || K.stone;
    EL(P, cx, cy, r, r, fc, 1); EL(P, cx, cy, r * 0.84, r * 0.84, sh(fc, 0.22), 0.7); EL(P, cx, cy, r * 0.76, r * 0.76, K.glassC, 0.7);
    for (i = 0; i < 8; i++) { var a = i * PI / 4; g.beginPath(); g.ellipse(cx + Math.cos(a) * r * 0.44, cy + Math.sin(a) * r * 0.44, r * 0.28, r * 0.17, a, 0, TAU); F(P, i % 2 ? K.glassG : '#B5D3A9'); S(P, 0.7, '#55705A'); }
    EL(P, cx, cy, r * 0.17, r * 0.17, '#5C8A66', 0.7, '#3F5F49'); EL(P, cx, cy, r * 0.76, r * 0.76, null, 0.9);
  }
  /* 木樑托架（雕花）：L 形斜撐 */
  function bracket(P, x, y, s, flip) { var f = flip ? -1 : 1, g = P.g, u = P.up; g.beginPath(); g.moveTo(x, y); g.lineTo(x + f * s, y); g.quadraticCurveTo(x + f * s * 0.9, y - u * s * 0.55, x + f * s * 0.12, y - u * s * 1.25); g.lineTo(x, y - u * s * 1.3); g.closePath(); F(P, K.beam); S(P, 0.9, K.lineN); g.beginPath(); g.moveTo(x + f * s * 0.72, y - u * s * 0.1); g.quadraticCurveTo(x + f * s * 0.62, y - u * s * 0.5, x + f * s * 0.12, y - u * s * 0.95); S(P, 0.6, hi(K.beam, 0.25)); }

  var L_ = [], BY = {};
  function A(id, w, h, alpha, fn, lineW) { var e = { id: id, w: w, h: h, alpha: alpha, fn: fn, L: lineW }; L_.push(e); BY[id] = e; }

  /* ================= 戶外：天空、學院遠景、大門、花圃、鐘塔 ================= */
  /* ---------- 天空全景（220°×90°，地平線在下緣往上 1/9 處）。不畫夕陽：只有晴朗午後、深藍夜空、冷調清晨三種 ---------- */
  var SKY = {
    day: { g: [[0, K.sky1], [0.5, '#86BBE8'], [0.82, K.sky2], [0.9, K.sky3], [1, '#E9F4FB']], n: 13, big: 5, c1: K.cloud, c2: K.cloudS },
    room: { g: [[0, '#66A6DF'], [0.5, '#8FC1EA'], [0.84, '#B9D9F1'], [0.9, K.sky3], [1, '#E9F4FB']], n: 10, big: 4, c1: K.cloud, c2: K.cloudS },
    night: { g: [[0, K.nSky1], [0.46, '#102549'], [0.8, K.nSky2], [0.9, K.nSky3], [1, '#3A5C8E']], n: 7, big: 0, c1: '#2C4A7C', c2: '#1B3260', stars: 520 },
    morning: { g: [[0, '#8AB7E1'], [0.5, '#B9D6EE'], [0.82, '#E3EEF6'], [0.9, '#F6F1E6'], [1, '#F2EEE6']], n: 9, big: 2, c1: '#FFFFFF', c2: '#DCE8F2' }
  };
  function sky(P, m, seedMoon) {
    var g = P.g, r = P.r, W = P.W, H = P.H, S_ = SKY[m], hz = H * (1 - 10 / 90), i; px(P);
    vgrad(P, 0, 0, W, H, S_.g);
    if (S_.stars) {
      for (i = 0; i < S_.stars; i++) { var y = Math.pow(r(), 1.3) * hz * 0.97, s = r(); g.fillStyle = C(s > 0.8 ? K.star : '#DCE6F8', 0.45 + 0.5 * s); g.beginPath(); g.arc(r(W), y, 0.7 + s * s * 1.5, 0, TAU); g.fill(); }
      for (i = 0; i < 46; i++) star4(P, r(W), Math.pow(r(), 1.2) * hz * 0.9, r(4, 11), K.star, 0.14);
      if (seedMoon) { var mx_ = W * seedMoon, my = H * 0.3; EL(P, mx_, my, 34, 34, '#FBEFD0'); EL(P, mx_ + 13, my - 7, 30, 30, '#102549'); }
    }
    for (i = 0; i < S_.n; i++) { var big = i < S_.big, w = big ? r(330, 560) : r(120, 300), h = big ? r(90, 150) : r(26, 60), yy = big ? hz - r(10, 70) : r(H * 0.14, hz - 60); cloud(P, r(W), yy, w, h, S_.c1, S_.c2); }
    /* 地平線以下：收成一條乾淨的色帶（實際會被地面與遠景蓋住） */
    R(P, 0, hz, W, H - hz, S_.g[S_.g.length - 1][1]);
  }

  /* ---------- 遠方的學院天際線（夜）：米灰石造本館、中央鐘樓、灰藍斜屋頂；窗內亮著黃銅燈 ---------- */
  function skyline(P, ww, wh, y0, o) {
    var r = P.r, g = P.g, night = o.night, st = night ? nt(K.stone, 0.62) : C(mx(K.stone, K.sky3, o.haze || 0)), sl = night ? nt(K.slate, 0.6) : C(mx(K.slate, K.sky3, o.haze || 0)), ln = night ? K.lineN : C(mx(K.line, K.sky3, 0.35 + (o.haze || 0) * 0.5)), win = night ? K.lamp : '#7E9DBF', i, x;
    wt(P, ww, wh, -ww / 2, y0);
    function wins(x0, x1, yb, n, hgt, wd, rows) { for (var q = 0; q < rows; q++) for (var k = 0; k < n; k++) { var wx = x0 + (x1 - x0) * (k + 0.5) / n, lit = !night || r() < 0.62; g.beginPath(); archPath(g, wx, yb + q * hgt * 1.75, wd / 2, hgt * 0.6, 1.2); F(P, lit ? win : nt('#6C7F96', 0.5)); S(P, 0.5, ln); } }
    function block(x0, x1, hgt, roof) { R(P, x0, 0, x1 - x0, hgt, st, 0.8, ln); R(P, x0, hgt * 0.94, x1 - x0, hgt * 0.06, night ? nt(K.stone, 0.5) : hi(K.stone, 0.2)); slate(P, [[x0 - 1, hgt], [x1 + 1, hgt], [x1 - roof * 0.5, hgt + roof], [x0 + roof * 0.5, hgt + roof]], sl, roof / 4.5, ln); }
    function gable(cx, w, hgt, top) { PL(P, [[cx - w / 2, 0], [cx + w / 2, 0], [cx + w / 2, hgt], [cx, top], [cx - w / 2, hgt]], st, 0.8, ln); g.beginPath(); archPath(g, cx, hgt * 0.35, w * 0.16, hgt * 0.34, 1.25); F(P, night ? K.lamp : win); S(P, 0.5, ln); }
    function spire(cx, w, hgt, top) { R(P, cx - w / 2, 0, w, hgt, st, 0.8, ln); slate(P, [[cx - w / 2 - 0.6, hgt], [cx + w / 2 + 0.6, hgt], [cx, top]], sl, (top - hgt) / 6, ln); LN(P, cx, top, cx, top + (top - hgt) * 0.12, 0.8, ln); }
    var cx = o.cx || 0, s = o.s || 1;
    /* 兩翼 */
    block(cx - 230 * s, cx - 120 * s, 20 * s, 9 * s); block(cx + 120 * s, cx + 240 * s, 19 * s, 9 * s);
    wins(cx - 226 * s, cx - 124 * s, 5 * s, 9, 5 * s, 4 * s, 2); wins(cx + 124 * s, cx + 236 * s, 5 * s, 9, 5 * s, 4 * s, 2);
    spire(cx - 250 * s, 12 * s, 30 * s, 50 * s); spire(cx + 258 * s, 11 * s, 27 * s, 46 * s);
    /* 本館 */
    block(cx - 120 * s, cx + 120 * s, 26 * s, 11 * s); wins(cx - 114 * s, cx + 114 * s, 4.5 * s, 17, 5.2 * s, 4.2 * s, 3);
    gable(cx - 78 * s, 26 * s, 28 * s, 44 * s); gable(cx + 78 * s, 26 * s, 28 * s, 44 * s);
    for (i = 0; i < 6; i++) { x = cx + (-100 + i * 40 + (i > 2 ? 0 : 0)) * s; R(P, x, 34 * s, 3 * s, 9 * s, st, 0.6, ln); }
    /* 中央鐘樓 */
    R(P, cx - 9 * s, 0, 18 * s, 50 * s, st, 0.9, ln); R(P, cx - 10 * s, 49 * s, 20 * s, 2.4 * s, night ? nt(K.stone, 0.5) : hi(K.stone, 0.2), 0.7, ln);
    EL(P, cx, 40 * s, 5.2 * s, 5.2 * s, night ? '#FFF2CC' : '#F6EBD6', 0.8, ln); LN(P, cx, 40 * s, cx, 43.6 * s, 0.7, ln); LN(P, cx, 40 * s, cx + 2.4 * s, 39 * s, 0.7, ln);
    g.beginPath(); archPath(g, cx, 20 * s, 2.6 * s, 7 * s, 1.25); F(P, night ? K.lamp : win); S(P, 0.5, ln);
    slate(P, [[cx - 10 * s, 51.4 * s], [cx + 10 * s, 51.4 * s], [cx, 78 * s]], sl, 4 * s, ln); LN(P, cx, 78 * s, cx, 84 * s, 0.9, ln); star4(P, cx, 86 * s, 2.6 * s, night ? K.star : K.brass, 0.2);
    for (i = -1; i <= 1; i += 2) { R(P, cx + i * 9 * s - 1.2 * s, 50 * s, 2.4 * s, 7 * s, st, 0.6, ln); PL(P, [[cx + i * 9 * s - 1.4 * s, 57 * s], [cx + i * 9 * s + 1.4 * s, 57 * s], [cx + i * 9 * s, 62 * s]], sl, 0.6, ln); }
  }
  function treeLine(P, x0, x1, base, hMin, hMax, n, o) {
    var r = P.r, i; o = o || {};
    for (i = 0; i < n; i++) { var x = x0 + (x1 - x0) * (i + r(0.8)) / n; if (o.gap && Math.abs(x - (o.gapX || 0)) < o.gap) continue; var h = r(hMin, hMax); tree(P, x, base, h * r(0.75, 1.05), h, { night: o.night, n: 7, lw: o.lw }); }
  }
  function heroFar(P) {
    skyline(P, 1600, 200, -12, { night: 1, cx: -110, s: 0.74 });
    treeLine(P, -800, 800, -2, 24, 44, 60, { night: 1, gap: 30, gapX: -110 });
    R(P, -800, -12, 1600, 11, nt(K.grassD, 0.72));
  }
  function heroMid(P) {
    var r = P.r, i; wt(P, 420, 50, -210, -4);
    treeLine(P, -210, 210, 0, 22, 40, 22, { night: 1 });
    /* 鐵欄杆與幾盞路燈 */
    R(P, -210, 0, 420, 5.2, nt(K.stone, 0.82), 0.7, K.lineN);
    for (i = -208; i < 210; i += 3.2) LN(P, i, 5.2, i, 11, 0.5, '#0C1730'); LN(P, -210, 10.2, 210, 10.2, 0.7, '#0C1730');
    for (i = -170; i < 200; i += 85) { LN(P, i, 5, i, 21, 1.1, '#0C1730'); PL(P, [[i - 1.6, 21], [i + 1.6, 21], [i + 1.1, 25], [i - 1.1, 25]], K.lamp, 0.7, '#0C1730'); PL(P, [[i - 2, 25], [i + 2, 25], [i, 27]], '#0C1730', 0); }
    R(P, -210, -4, 420, 4, nt(K.grassD, 0.74));
  }
  /* 大門後方很遠的樹林與屋頂（中間留空給鐘塔）；遠方一座教堂尖塔 */
  function gateFar(P) {
    var r = P.r, g = P.g, hz = 0.42, i; wt(P, 1700, 159, -850, -3.5);
    var ln = C(mx(K.line, K.sky3, 0.55)), st = C(mx(K.stone, K.sky3, 0.45)), sl = C(mx(K.slate, K.sky3, 0.45));
    /* 教堂尖塔與幾座屋頂 */
    R(P, -338, 0, 16, 62, st, 0.7, ln); slate(P, [[-340, 62], [-320, 62], [-330, 112]], sl, 9, ln); LN(P, -330, 112, -330, 122, 0.8, ln);
    for (i = 0; i < 8; i++) { var x = (i < 4 ? -760 + i * 150 : 150 + (i - 4) * 170) + r(-30, 30), w = r(70, 130), h = r(24, 40); R(P, x, 0, w, h, st, 0.7, ln); slate(P, [[x - 3, h], [x + w + 3, h], [x + w - 16, h + 16], [x + 16, h + 16]], sl, 5, ln); }
    /* 兩層樹：後排淡、前排深，中間 ±42 留給鐘塔 */
    for (i = 0; i < 2; i++) {
      var n = i ? 34 : 30, k;
      for (k = 0; k < n; k++) { var tx = -850 + 1700 * (k + r(0.7)) / n; if (Math.abs(tx) < 46 + i * 6) continue; var th = r(38, 70) * (i ? 0.8 : 1), cs = [], q, cyy = th * 0.62, col = C(mx(i ? K.leaf : K.leafL, K.sky3, i ? 0.3 : 0.5));
        for (q = 0; q < 6; q++) { var a = q / 6 * TAU + r(0.6); cs.push([tx + Math.cos(a) * th * 0.3, cyy + Math.sin(a) * th * 0.22, th * r(0.2, 0.3)]); } cs.push([tx, cyy, th * 0.36]);
        R(P, tx - th * 0.03, 0, th * 0.06, th * 0.5, C(mx(K.wood, K.sky3, 0.45)));
        blob(P, cs, col, 0.7, ln);
        clip(P, blobPath(cs), function () { blob(P, cs.map(function (c) { return [c[0] + th * 0.07, c[1] - th * 0.09, c[2] * 0.85]; }), C(mx(i ? K.leafD : K.leaf, K.sky3, i ? 0.3 : 0.5)), 0); blob(P, cs.map(function (c) { return [c[0] - th * 0.03, c[1] + th * 0.04, c[2] * 0.8]; }), col, 0); });
      }
    }
    R(P, -850, -3.5, 1700, 3.3, C(mx(K.grassD, K.sky3, 0.25)));          /* 草地只畫到地面以下，免得這塊板子的下緣從長廊地板冒出來 */
  }
  /* ---------- 學院大門：米灰石灰岩門牆、尖拱門洞（挖空）、扶壁、哥德窗、雉堞 ---------- */
  function gateFrame(P) {
    var g = P.g, r = P.r, i, st = K.stone, hw = 17, hy = 34, ap = archApex(hw);
    wt(P, 192, 81, -96, 0);
    /* 牆身輪廓（上緣是雉堞，中央一座山牆） */
    var top = [[-96, 0], [-96, 62]], x;
    for (x = -96; x < -22; x += 6.2) { top.push([x, 68], [x + 3.1, 68], [x + 3.1, 62], [x + 6.2, 62]); }
    top.push([-22, 62], [-22, 66], [0, 80.4], [22, 66], [22, 62]);
    for (x = 22; x < 95; x += 6.2) { top.push([x, 62], [x + 3.1, 62], [x + 3.1, 68], [x + 6.2, 68]); }
    top.push([96, 62], [96, 0]);
    clip(P, function (gg) { pth(gg, top); }, function () { ashlar(P, -96, 0, 192, 81, 3.1, st); R(P, -96, 0, 192, 4.6, sh(st, 0.3)); R(P, -96, 56.4, 192, 2.2, hi(st, 0.3)); R(P, -96, 54.6, 192, 1.8, sh(st, 0.24)); });
    pth(g, top); S(P, 1.1);
    LN(P, -96, 4.6, 96, 4.6, 0.7); LN(P, -96, 56.4, 96, 56.4, 0.7); LN(P, -96, 58.6, 96, 58.6, 0.7);
    /* 扶壁：亮面在左、暗面在右 */
    [-88, -58.5, -31, 31, 58.5, 88].forEach(function (bx) { var w = 5.6; PL(P, [[bx - w / 2, 0], [bx + w / 2, 0], [bx + w / 2, 44], [bx + w / 2 - 0.9, 49], [bx + w / 2 - 0.9, 57], [bx, 60.5], [bx - w / 2 + 0.9, 57], [bx - w / 2 + 0.9, 49], [bx - w / 2, 44]], hi(st, 0.26), 0.9); R(P, bx + w / 2 - 1.6, 0, 1.6, 44, sh(st, 0.22)); LN(P, bx - w / 2, 44, bx + w / 2, 44, 0.6); LN(P, bx - w / 2, 4.6, bx + w / 2, 4.6, 0.6); });
    /* 哥德窗（玻璃映著天空） */
    [-73.5, -45, 45, 73.5].forEach(function (wx) { gothicWin(P, wx, 21, 5.4, 15, { glass: '#86A9CF', lat: 2.1, fill: function () { R(P, wx - 6, 21, 12, 9, '#9FBEDD'); } }); });
    /* 山牆上的圓形四葉飾 */
    EL(P, 0, 70, 4.4, 4.4, hi(st, 0.3), 0.9); EL(P, 0, 70, 3.2, 3.2, '#86A9CF', 0.7); for (i = 0; i < 4; i++) { g.beginPath(); g.arc(Math.cos(i * PI / 2 + PI / 4) * 1.45, 70 + Math.sin(i * PI / 2 + PI / 4) * 1.45, 1.25, 0, TAU); S(P, 1.3, hi(st, 0.3)); }
    /* 門洞：外圈拱石、內圈線腳，中間挖空 */
    g.beginPath(); archPath(g, 0, 0, hw + 4.6, hy + 1.4); F(P, hi(st, 0.34)); S(P, 1.1);
    clip(P, function (gg) { archPath(gg, 0, 0, hw + 4.6, hy + 1.4); }, function () { for (i = 0; i < 9; i++) LN(P, -hw - 5, i * 4, hw + 5, i * 4, 0.45, sh(st, 0.34)); for (i = 0; i < 13; i++) { var a = PI * (i + 0.5) / 13; LN(P, Math.cos(a) * (hw - 1), hy + Math.sin(a) * (hw - 1), Math.cos(a) * (hw + 9), hy + Math.sin(a) * (hw + 9) * 1.15, 0.45, sh(st, 0.34)); } });
    g.beginPath(); archPath(g, 0, 0, hw + 1.5, hy + 0.5); F(P, sh(st, 0.2)); S(P, 0.8);
    cut(P, function (gg) { archPath(gg, 0, -1, hw, hy + 1); }); g.beginPath(); archPath(g, 0, -1, hw, hy + 1); S(P, 1);
    /* 牆腳的常春藤（少量綠色點綴） */
    [[-94, 0, 1], [92, 0, -1]].forEach(function (v) { var cs = []; for (i = 0; i < 9; i++) cs.push([v[0] + v[2] * r(0, 9), r(1, 24), r(1.8, 3.4)]); blob(P, cs, K.leaf, 0.7); clip(P, blobPath(cs), function () { blob(P, cs.map(function (c) { return [c[0] + 0.8, c[1] - 0.9, c[2] * 0.8]; }), K.leafD, 0); blob(P, cs.map(function (c) { return [c[0] - 0.4, c[1] + 0.5, c[2] * 0.62]; }), K.leaf, 0); }); });
  }
  /* 石材貼面（可重複拼接）：隧道內壁、門洞內側 */
  function stoneTile(P, rows) {
    var W = P.W, H = P.H, bh = H / rows, i, j, r = P.r, st = K.stone; px(P);
    R(P, 0, 0, W, H, st);
    for (j = 0; j < rows; j++) for (i = -1; i < 2; i++) { var x = i * W / 2 + (j % 2 ? W / 4 : 0), t = r(); if (t < 0.2) R(P, x, j * bh, W / 2, bh, hi(st, 0.2)); else if (t < 0.38) R(P, x, j * bh, W / 2, bh, sh(st, 0.1)); }
    for (j = 0; j <= rows; j++) { LN(P, 0, j * bh, W, j * bh, 0.5, sh(st, 0.36)); for (i = -1; i < 3; i++) { var xx = i * W / 2 + (j % 2 ? W / 4 : 0); LN(P, xx, j * bh, xx, (j + 1) * bh, 0.5, sh(st, 0.36)); } }
  }
  /* 門柱：八角石柱、柱頭線腳、尖頂，上面一盞黃銅提燈 */
  function pillar(P) {
    var g = P.g, st = K.stone, i; wt(P, 14, 76, -7, 0);
    PL(P, [[-6.2, 0], [6.2, 0], [6.2, 3.4], [5.2, 4.6], [-5.2, 4.6], [-6.2, 3.4]], sh(st, 0.14), 1);
    R(P, -4.6, 4.6, 9.2, 46, st, 1); R(P, 1.6, 4.6, 3, 46, sh(st, 0.2)); R(P, -4.6, 4.6, 1.5, 46, hi(st, 0.3));
    for (i = 0; i < 11; i++) LN(P, -4.6, 4.6 + i * 4.2, 4.6, 4.6 + i * 4.2, 0.4, sh(st, 0.34));
    g.beginPath(); archPath(g, 0, 16, 2.1, 16, 1.25); F(P, sh(st, 0.26)); S(P, 0.7);
    PL(P, [[-5.6, 50.6], [5.6, 50.6], [6.4, 52.4], [6.4, 54], [-6.4, 54], [-6.4, 52.4]], hi(st, 0.3), 1);
    PL(P, [[-5.4, 54], [5.4, 54], [2, 60.4], [-2, 60.4]], st, 1); PL(P, [[1.2, 54], [5.4, 54], [2, 60.4], [0.8, 60.4]], sh(st, 0.2), 0);
    /* 提燈 */
    R(P, -0.5, 60.4, 1, 2.2, K.brass, 0.7); PL(P, [[-2.1, 62.6], [2.1, 62.6], [2.6, 69.4], [-2.6, 69.4]], '#EAF1F6', 0.9); R(P, -0.3, 62.6, 0.6, 6.8, K.brass); LN(P, -2.3, 66, 2.3, 66, 0.5, K.brass);
    PL(P, [[-3.2, 69.4], [3.2, 69.4], [1.4, 72.8], [-1.4, 72.8]], K.brass, 0.9); R(P, -0.4, 72.8, 0.8, 1.4, K.brass, 0.6); EL(P, 0, 74.8, 0.8, 0.8, K.brass, 0.6);
  }
  /* 鈴蘭花圃的一排：石砌矮邊、一叢叢鈴蘭 */
  function lilyBed(P) {
    var r = P.r, i; wt(P, 30, 10, -15, 0);
    for (i = 0; i < 9; i++) { var x = -13.2 + i * 3.3 + r(-0.3, 0.3); lilyPlant(P, x, 0.9, r(6.4, 8.6), i % 2 === 0); }
    for (i = 0; i < 6; i++) lilyPlant(P, -11.5 + i * 4.6 + r(-0.4, 0.4), 0.9, r(4.2, 5.4), i % 2 === 1);
    R(P, -15, 0, 30, 1.5, K.stone, 0.9); for (i = -15; i < 15; i += 2.5) LN(P, i, 0, i, 1.5, 0.45, sh(K.stone, 0.36)); R(P, -15, 0, 30, 0.4, sh(K.stone, 0.26));
  }
  /* 地面（俯視）：只畫石板路、路緣與花圃的土；其餘透明，露出下面跟著氛圍變色的草地 */
  function gardenGround(P) {
    var r = P.r, i, j, st = '#E9DACB'; wt(P, 120, 640, -60, -20);
    R(P, -11, -20, 22, 640, st);
    for (j = -20; j < 620; j += 5.5) { LN(P, -11, j, 11, j, 0.5, sh(st, 0.3)); var o = (Math.round(j / 5.5) % 2) ? 3.6 : 0; for (i = -11 + o; i < 11; i += 7.2) { LN(P, i, j, i, j + 5.5, 0.5, sh(st, 0.3)); if (r() < 0.2) R(P, i + 0.2, j + 0.2, 6.8, 5.1, hi(st, 0.3)); else if (r() < 0.16) R(P, i + 0.2, j + 0.2, 6.8, 5.1, sh(st, 0.08)); } }
    R(P, -12.4, -20, 1.4, 640, K.stone, 0.6); R(P, 11, -20, 1.4, 640, K.stone, 0.6);
    /* 門前的石階平台、花圃的土 */
    R(P, -34, 96, 68, 16, st, 0.7); for (i = -34; i < 34; i += 6.8) LN(P, i, 96, i, 112, 0.45, sh(st, 0.3));
    R(P, -41, 118, 28.6, 96, '#7A5C4E', 0.7); R(P, 12.4, 118, 28.6, 96, '#7A5C4E', 0.7);
    for (i = 0; i < 90; i++) { var s = r() < 0.5 ? -1 : 1; EL(P, s * r(14, 39), r(120, 212), r(0.5, 1.1), r(0.3, 0.7), '#6A4E42'); }
  }
  /* 路燈：鑄鐵燈柱、玻璃燈箱、黃銅頂飾 */
  function lampPost(P) {
    var ir = '#2B2E3A'; wt(P, 6, 22, -3, 0);
    PL(P, [[-1.3, 0], [1.3, 0], [0.9, 1.3], [-0.9, 1.3]], ir, 0.8); R(P, -0.5, 1.3, 1, 1.6, ir, 0.7); R(P, -0.28, 2.9, 0.56, 11.6, ir, 0.7); R(P, -0.1, 2.9, 0.16, 11.6, '#4A4F60');
    R(P, -0.6, 8.4, 1.2, 0.5, ir, 0.6); R(P, -1.5, 14.5, 3, 0.5, ir, 0.7);
    PL(P, [[-1.1, 15], [1.1, 15], [1.6, 18.6], [-1.6, 18.6]], '#EEF3F6', 0.9); R(P, -0.12, 15, 0.24, 3.6, ir); LN(P, -1.35, 16.8, 1.35, 16.8, 0.45, ir);
    PL(P, [[-2, 18.6], [2, 18.6], [0.7, 20.4], [-0.7, 20.4]], ir, 0.9); R(P, -0.2, 20.4, 0.4, 0.7, K.brass, 0.5); EL(P, 0, 21.4, 0.42, 0.42, K.brass, 0.5);
  }
  /* ---------- 鐘塔：石造塔身、扶壁、尖拱大窗、鐘面、百葉鐘室、灰藍石板尖頂；底部尖拱門洞挖空（鏡頭穿過） ---------- */
  function tower(P, mode) {
    var g = P.g, r = P.r, night = mode === 'night', mor = mode === 'morning', i,
      st = night ? nt(K.stone, 0.56) : mor ? C(mx(K.stone, '#E8EEF6', 0.25)) : K.stone, sl = night ? nt(K.slate, 0.5) : K.slate, ln = night ? K.lineN : K.line,
      stH = night ? nt(K.stone, 0.44) : hi(K.stone, 0.3), stS = night ? nt(K.stone, 0.7) : sh(K.stone, 0.2), br = night ? '#C9A56A' : K.brass, win = night ? K.lamp : '#86A9CF', hw = 13, hy = 27;
    wt(P, 80, 360, -40, 0);
    function shaft() {
      if (night) { R(P, -23, 0, 46, 250, st); for (i = 0; i < 80; i++) LN(P, -23, i * 3.2, 23, i * 3.2, 0.4, nt(K.stone, 0.74)); } else ashlar(P, -23, 0, 46, 250, 3.2, st);
      R(P, 13, 0, 10, 250, stS); R(P, -23, 0, 5, 250, stH);
    }
    clip(P, function (gg) { gg.rect(-23, 0, 46, 250); }, shaft);
    g.beginPath(); g.rect(-23, 0, 46, 250); S(P, 1.1, ln);
    /* 轉角扶壁、層間線腳 */
    [-1, 1].forEach(function (s) { PL(P, [[s * 23, 0], [s * 28, 0], [s * 28, 60], [s * 26.4, 66], [s * 26.4, 128], [s * 25, 134], [s * 25, 186], [s * 23, 192]], s > 0 ? stS : stH, 1, ln); LN(P, s * 23, 60, s * 28, 60, 0.6, ln); LN(P, s * 23, 128, s * 26.4, 128, 0.6, ln); });
    [56, 132, 188, 246].forEach(function (y) { R(P, -24.6, y, 49.2, 3, stH, 0.8, ln); R(P, -24.6, y, 49.2, 0.9, stS); });
    R(P, -26, 0, 52, 5, stS, 0.9, ln);
    /* 門洞上方的尖拱大窗 */
    gothicWin(P, 0, 68, 8.4, 34, { glass: win, lat: 2.6, frame: stH, line: ln, latCol: night ? '#B58E4E' : '#5F6C7C' });
    /* 鐘室：一對百葉尖拱 */
    [-9.5, 9.5].forEach(function (x) { g.beginPath(); archPath(g, x, 140, 5.2, 26, 1.25); F(P, stH); S(P, 0.9, ln); g.beginPath(); archPath(g, x, 142, 3.8, 23, 1.25); F(P, night ? '#0B1630' : '#4A5568'); S(P, 0.7, ln); clip(P, function (gg) { archPath(gg, x, 142, 3.8, 23, 1.25); }, function () { for (i = 0; i < 12; i++) LN(P, x - 4, 143.5 + i * 2.4, x + 4, 144.6 + i * 2.4, 1.1, night ? nt(K.stone, 0.6) : sh(K.stone, 0.12)); }); });
    /* 鐘面：奶油色面盤、深藍外圈、黃銅指針（放學時刻） */
    EL(P, 0, 217, 15.4, 15.4, stH, 1, ln); EL(P, 0, 217, 13.6, 13.6, night ? '#1B2F5C' : K.navy, 0.8, ln); EL(P, 0, 217, 11.8, 11.8, night ? '#FFF2CC' : '#FBF3E2', 0.8, ln);
    for (i = 0; i < 12; i++) { var a = i * PI / 6; LN(P, Math.cos(a) * 9.4, 217 + Math.sin(a) * 9.4, Math.cos(a) * 11, 217 + Math.sin(a) * 11, i % 3 ? 0.7 : 1.4, night ? '#3C3020' : K.navyF); }
    LN(P, 0, 217, 0, 226.4, 1.5, br); LN(P, 0, 217, -6.2, 213.4, 1.9, br); EL(P, 0, 217, 1.1, 1.1, br, 0.6, ln);
    /* 塔頂：四角小尖塔、石板尖頂、老虎窗、頂端四芒星 */
    [-21, 21].forEach(function (x) { R(P, x - 2.6, 249, 5.2, 16, st, 0.9, ln); PL(P, [[x - 3.2, 265], [x + 3.2, 265], [x, 281]], sl, 0.9, ln); });
    slate(P, [[-23.6, 249], [23.6, 249], [0, 330]], sl, 6.4, ln);
    PL(P, [[0, 330], [23.6, 249], [9, 249]], night ? nt(K.slate, 0.7) : sh(K.slate, 0.2), 0); LN(P, 0, 330, 23.6, 249, 1, ln);
    PL(P, [[-5, 262], [5, 262], [5, 272], [0, 280], [-5, 272]], stH, 0.9, ln); g.beginPath(); archPath(g, 0, 263.5, 2.4, 5.5, 1.25); F(P, win); S(P, 0.6, ln);
    LN(P, 0, 330, 0, 344, 1.6, br); EL(P, 0, 334.5, 1.5, 1.5, br, 0.6, ln); star4(P, 0, 350, 7.2, night ? K.star : br, 0.2); g.beginPath(); for (i = 0; i < 8; i++) { var a2 = i * PI / 4 - PI / 2, rr = i % 2 ? 7.2 * 0.2 : 7.2; g.lineTo(Math.cos(a2) * rr, 350 + Math.sin(a2) * rr); } g.closePath(); S(P, 0.7, ln);
    /* 門洞（挖空）與拱石 */
    g.beginPath(); archPath(g, 0, 0, hw + 3.6, hy + 1); F(P, stH); S(P, 1, ln);
    g.beginPath(); archPath(g, 0, 0, hw + 1.2, hy + 0.3); F(P, stS); S(P, 0.7, ln);
    cut(P, function (gg) { archPath(gg, 0, -1, hw, hy + 1); }); g.beginPath(); archPath(g, 0, -1, hw, hy + 1); S(P, 1, ln);
  }
  function towerSide(P, mode) {
    var i, night = mode !== 'day', st = night ? nt(K.stone, 0.66) : sh(K.stone, 0.14), ln = night ? K.lineN : K.line, g = P.g; wt(P, 46, 250, -23, 0);
    R(P, -23, 0, 46, 250, st); for (i = 0; i < 80; i++) LN(P, -23, i * 3.2, 23, i * 3.2, 0.4, night ? nt(K.stone, 0.78) : sh(K.stone, 0.4));
    [56, 132, 188, 246].forEach(function (y) { R(P, -23, y, 46, 3, night ? nt(K.stone, 0.56) : K.stone, 0.7, ln); });
    [-9.5, 9.5].forEach(function (x) { g.beginPath(); archPath(g, x, 142, 3.8, 23, 1.25); F(P, night ? '#0B1630' : '#4A5568'); S(P, 0.7, ln); });
    g.beginPath(); archPath(g, 0, 70, 6, 30, 1.25); F(P, night ? K.lamp : '#86A9CF'); S(P, 0.8, ln);
  }
  /* 鐘塔遠方的校舍屋頂與山丘；近處的屋脊（前景）。night = 夜晚版（窗內亮燈），否則是冷調的清晨版 */
  function tn(night, c, f) { return night ? nt(c, f) : C(mx(c, '#EEF2F6', 0.26)); }
  function yearFar(P, night) {
    var r = P.r, i; wt(P, 2600, 340, -1300, 0);
    for (i = 0; i < 9; i++) { var cx = -1300 + i * 330 + r(-60, 60); P.g.beginPath(); P.g.ellipse(cx, 0, r(260, 420), r(70, 150), 0, 0, TAU); F(P, night ? nt('#56789C', 0.5 + r(0.1)) : C(mx('#9DBF94', '#EEF2F6', 0.3 + r(0.2)))); }
    skylineLite(P, -1300, 1300, 0, 1.6, night);
    treeLine(P, -1300, 1300, 0, 50, 96, 34, { night: night, lw: 0 });
  }
  function skylineLite(P, x0, x1, base, s, night) {
    var r = P.r, x = x0, g = P.g, st = tn(night, K.stone, 0.66), sl = tn(night, K.slate, 0.62), ln = night ? K.lineN : C(mx(K.line, '#EEF2F6', 0.45));
    while (x < x1) { var w = r(90, 220) * s, h = r(40, 76) * s, k, n = Math.max(2, (w / (16 * s)) | 0); R(P, x, base, w, h, st, 0.7, ln); slate(P, [[x - 4, base + h], [x + w + 4, base + h], [x + w - 22 * s, base + h + 24 * s], [x + 22 * s, base + h + 24 * s]], sl, 7 * s, ln);
      for (k = 0; k < n; k++) if (r() < 0.6) { g.beginPath(); archPath(g, x + w * (k + 0.5) / n, base + h * 0.36, 3.2 * s, 9 * s, 1.25); F(P, night ? K.lamp : '#9FBEDD'); }
      if (r() < 0.4) { R(P, x + w * 0.5 - 7 * s, base + h, 14 * s, 30 * s, st, 0.7, ln); PL(P, [[x + w * 0.5 - 9 * s, base + h + 30 * s], [x + w * 0.5 + 9 * s, base + h + 30 * s], [x + w * 0.5, base + h + 66 * s]], sl, 0.7, ln); }
      x += w + r(20, 90) * s; }
  }
  function yearNear(P, night) {
    var r = P.r, i, g = P.g, sl = tn(night, K.slate, 0.56), st = tn(night, K.stone, 0.6), ln = night ? K.lineN : K.line; wt(P, 560, 78, -280, 0);
    /* 一整排斜屋頂、煙囪與老虎窗 */
    for (i = 0; i < 4; i++) { var x0 = -290 + i * 150 + r(-10, 10), w = r(150, 190), h = r(34, 52); slate(P, [[x0, 0], [x0 + w, 0], [x0 + w - 26, h], [x0 + 26, h]], sl, 4.2, ln); LN(P, x0 + 26, h, x0 + w - 26, h, 1.4, night ? nt(K.slate, 0.4) : hi(K.slate, 0.3));
      var k; for (k = 0; k < 2; k++) { var dx = x0 + w * (0.3 + k * 0.4); PL(P, [[dx - 8, 6], [dx + 8, 6], [dx + 8, 20], [dx, 28], [dx - 8, 20]], st, 0.9, ln); g.beginPath(); archPath(g, dx, 8, 3.4, 8, 1.25); F(P, night ? K.lamp : '#9FBEDD'); S(P, 0.6, ln); }
      R(P, x0 + w * 0.64, h - 4, 9, 22, st, 0.9, ln); R(P, x0 + w * 0.64 - 1.2, h + 16, 11.4, 3, night ? nt(K.stone, 0.5) : hi(K.stone, 0.3), 0.7, ln); }
  }

  /* ================= 室內：圖書館、長廊、社辦、圖書館一角 ================= */
  /* 牆面基本款：下半深藍護牆板、上半奶油白鈴蘭壁紙、頂部深棕木線。pink = 社辦才有的小愛心 */
  function wallBase(P, x0, w, h, o) {
    o = o || {}; var wh = o.wains || 12.2, top = o.top === undefined ? 3.4 : o.top;
    wallpaper(P, x0, wh, w, h - wh, o.step || 4.6, o.pink);
    wainscot(P, x0, 0, w, wh, o.pw || 7.6);
    if (top) { R(P, x0, h - top, w, top, K.beam, 0.9, K.lineN); R(P, x0, h - top, w, top * 0.28, hi(K.beam, 0.16)); R(P, x0, h - top - 0.7, w, 0.7, sh(K.cream, 0.16)); }
  }
  function sconce(P, x, y, s, lit) {
    var g = P.g; R(P, x - s * 0.16, y - s * 0.5, s * 0.32, s * 0.8, K.brass, 0.7); g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s * 0.02, y - s * 0.36, x, y + s * 0.26); S(P, 1.6, K.line); S(P, 0.9, K.brass);
    PL(P, [[x - s * 0.34, y + s * 0.3], [x + s * 0.34, y + s * 0.3], [x + s * 0.46, y + s * 1.0], [x, y + s * 1.12], [x - s * 0.46, y + s * 1.0]], lit ? '#FFF3CF' : '#FFFDF6', 0.8); PL(P, [[x + s * 0.1, y + s * 0.3], [x + s * 0.34, y + s * 0.3], [x + s * 0.46, y + s * 1.0], [x + s * 0.2, y + s * 1.06]], lit ? '#F4DC9E' : '#E6E3E4', 0);
  }
  /* 植物圖譜畫框：奶油紙、一株鈴蘭、深木框 */
  function botFrame(P, x, y, w, h, kind) {
    R(P, x, y, w, h, K.wood, 0.9); R(P, x + w * 0.09, y + w * 0.09, w - w * 0.18, h - w * 0.18, '#FBF3E4', 0.6);
    if (kind === 1) { var g = P.g; g.beginPath(); g.moveTo(x + w * 0.5, y + h * 0.16); g.quadraticCurveTo(x + w * 0.44, y + h * 0.5, x + w * 0.5, y + h * 0.8); S(P, 0.8, K.stem); EL(P, x + w * 0.5, y + h * 0.74, w * 0.15, w * 0.13, K.pink, 0.5, '#B98A86'); PL(P, [[x + w * 0.5, y + h * 0.36], [x + w * 0.72, y + h * 0.5], [x + w * 0.56, y + h * 0.52]], K.leaf, 0.5); PL(P, [[x + w * 0.48, y + h * 0.3], [x + w * 0.27, y + h * 0.44], [x + w * 0.44, y + h * 0.46]], K.leafD, 0.5); }
    else lilyPlant(P, x + w * 0.42, y + h * 0.16, h * 0.56, kind === 2);
  }
  /* 奶油白拱形飾板＋手繪鈴蘭（圖書館書櫃上方） */
  function lilyPanel(P, cx, y0, hw, hy) {
    var g = P.g; g.beginPath(); archPath(g, cx, y0, hw, hy, 1.6); F(P, '#FBF1E6'); S(P, 0.9);
    clip(P, function (gg) { archPath(gg, cx, y0, hw, hy, 1.6); }, function () { lilyPlant(P, cx - hw * 0.12, y0 + hy * 0.08, hy * 1.25, false); lilyPlant(P, cx + hw * 0.16, y0 + hy * 0.08, hy * 1.05, true); });
  }
  /* 深藍釉面磚（窗間牆） */
  function glazedTile(P, x0, y0, w, h, s) {
    var i, j, r = P.r; R(P, x0, y0, w, h, K.tile);
    clip(P, function (g) { g.rect(x0, y0, w, h); }, function () { for (j = 0; j * s * 0.5 < h; j++) for (i = -1; i * s < w; i++) { var x = x0 + i * s + (j % 2 ? s * 0.5 : 0), y = y0 + j * s * 0.5, t = r(); R(P, x, y, s, s * 0.5, t < 0.2 ? hi(K.tile, 0.12) : t < 0.4 ? sh(K.tile, 0.3) : K.tile, 0.35, '#122450'); R(P, x + s * 0.08, y + s * 0.34, s * 0.5, s * 0.06, hi(K.tile, 0.3)); } });
    g_rect(P, x0, y0, w, h, 0.8, K.lineN);
  }
  /* 白色拱廊柱（扁平立面）：柱礎、柱身（左亮右暗）、柱頭 */
  function pilaster(P, cx, y0, w, h, col) {
    var c = col || '#F4ECE6'; R(P, cx - w * 0.75, y0, w * 1.5, h * 0.035, sh(c, 0.14), 0.8); R(P, cx - w * 0.62, y0 + h * 0.035, w * 1.24, h * 0.025, c, 0.7);
    R(P, cx - w / 2, y0 + h * 0.06, w, h * 0.86, c, 0.9); R(P, cx + w * 0.16, y0 + h * 0.06, w * 0.34, h * 0.86, sh(c, 0.16)); R(P, cx - w / 2, y0 + h * 0.06, w * 0.16, h * 0.86, hi(c, 0.6));
    PL(P, [[cx - w / 2, y0 + h * 0.92], [cx + w / 2, y0 + h * 0.92], [cx + w * 0.8, y0 + h * 0.965], [cx + w * 0.8, y0 + h], [cx - w * 0.8, y0 + h], [cx - w * 0.8, y0 + h * 0.965]], c, 0.9); LN(P, cx - w * 0.8, y0 + h * 0.965, cx + w * 0.8, y0 + h * 0.965, 0.5);
  }
  function nightGlass(P, x, y, w, h) { var r = P.r, i; vgrad(P, x, y, w, h, P.up > 0 ? [[0, K.nSky3], [1, K.nSky1]] : [[0, K.nSky1], [1, K.nSky3]]); for (i = 0; i < 26; i++) EL(P, x + r(w), y + r(h), w * 0.012, w * 0.012, C(K.star, 0.9)); }

  /* ---------- 圖書館 ---------- */
  function libFront(P) {
    var g = P.g, hw = 13, hy = 27, i; wt(P, 66, 76, -33, 0);
    ashlar(P, -33, 0, 66, 76, 3.1, K.stone); R(P, -33, 0, 66, 4.2, sh(K.stone, 0.3)); LN(P, -33, 4.2, 33, 4.2, 0.7);
    glazedTile(P, -33, 52, 66, 9, 3); R(P, -33, 61, 66, 2.2, K.beam, 0.8, K.lineN); R(P, -33, 49.8, 66, 2.2, K.beam, 0.8, K.lineN);
    lilyPanel(P, -22.5, 63.4, 8, 5); lilyPanel(P, 22.5, 63.4, 8, 5); lilyPanel(P, 0, 63.4, 9, 6);
    [-24.5, 24.5].forEach(function (x) { pilaster(P, x, 0, 4.2, 49.8); sconce(P, x, 30, 3.2, 1); });
    /* 深木門框與拱形門洞 */
    g.beginPath(); archPath(g, 0, 0, hw + 3.4, hy + 1); F(P, K.wood); S(P, 1.1); g.beginPath(); archPath(g, 0, 0, hw + 1.3, hy + 0.3); F(P, K.beam); S(P, 0.8, K.lineN);
    for (i = 0; i < 7; i++) EL(P, Math.cos(PI * (i + 0.5) / 7) * (hw + 2.4), hy + 1 + Math.sin(PI * (i + 0.5) / 7) * (hw + 2.4) * 1.12, 0.5, 0.5, K.brass);
    cut(P, function (gg) { archPath(gg, 0, -1, hw, hy + 1); }); g.beginPath(); archPath(g, 0, -1, hw, hy + 1); S(P, 1);
    g_rect(P, -33, 0, 66, 76, 1);
  }
  /* 側牆（一整面，沿著長度 30 一跨）：下層深藍書櫃、迴廊欄杆、上層尖拱窗與深藍釉面磚、白色柱 */
  function libShelf(P) {
    var i, k, g = P.g, bay = 30; wt(P, 182, 72, 0, 0);
    R(P, 0, 0, 182, 72, '#EFE0D6');
    for (i = -1; i < 7; i++) {
      var x0 = 15 + i * bay, cx = x0 + bay / 2;
      /* 上層：窗間的深藍釉面磚＋尖拱窗（窗外是夜空） */
      glazedTile(P, x0, 38, bay, 26, 3.2);
      gothicWin(P, cx, 40.5, 7.2, 13, { glass: K.nSky2, lat: 2.6, frame: '#F1E6DE', latCol: '#6E7FA6', fill: function () { nightGlass(P, cx - 8, 40, 16, 26); } });
      /* 下層：深藍書櫃兩座，上方奶油白拱形飾板 */
      bookcase(P, x0 + 2.6, 2.2, 11.6, 21.5, 5, K.navy, 0); bookcase(P, x0 + 15.8, 2.2, 11.6, 21.5, 5, K.navy, 0);
      R(P, x0, 0, bay, 2.2, sh(K.navy, 0.3), 0.7, K.lineN);
      lilyPanel(P, x0 + 8.4, 24.2, 5.4, 2.9); lilyPanel(P, x0 + 21.6, 24.2, 5.4, 2.9);
      /* 迴廊：樓板邊與木欄杆 */
      R(P, x0, 30.2, bay, 1.6, K.wood, 0.8, K.lineN); R(P, x0, 30.2, bay, 0.5, sh(K.wood, 0.3));
      for (k = 0; k < 14; k++) { var bx = x0 + 1.4 + k * 2.1; PL(P, [[bx - 0.32, 31.8], [bx + 0.32, 31.8], [bx + 0.5, 33.6], [bx + 0.26, 35.2], [bx + 0.3, 36.6], [bx - 0.3, 36.6], [bx - 0.26, 35.2], [bx - 0.5, 33.6]], '#8A6A58', 0.5); }
      R(P, x0, 36.6, bay, 1.2, K.wood, 0.8, K.lineN);
      /* 天花下的木樑與托架 */
      R(P, x0, 66, bay, 6, K.beam, 0.8, K.lineN); R(P, x0, 64, bay, 2, hi(K.beam, 0.14), 0.6, K.lineN);
    }
    for (i = 0; i < 6; i++) { var px_ = 15 + i * bay; pilaster(P, px_, 0, 3.4, 30.2); pilaster(P, px_, 37.8, 3, 26.2); bracket(P, px_ + 1.5, 66, 3.6, false); bracket(P, px_ - 1.5, 66, 3.6, true); sconce(P, px_, 16, 1.7, 1); }
  }
  /* 橫跨長廊的木構拱架（中間挖空，鏡頭從下面穿過），兩側各吊一盞黃銅燈 */
  function libRib(P) {
    var g = P.g, i; wt(P, 54, 74, -27, 0);
    [-1, 1].forEach(function (s) {
      pilaster(P, s * 24.6, 0, 3.2, 40);
      g.beginPath(); g.moveTo(s * 26.4, 40.5); g.lineTo(s * 22.6, 40.5); g.quadraticCurveTo(s * 18, 60, 0, 66.5); g.lineTo(0, 70); g.quadraticCurveTo(s * 20, 66, s * 26.4, 52); g.closePath(); F(P, K.beam); S(P, 1, K.lineN);
      g.beginPath(); g.moveTo(s * 23.4, 44); g.quadraticCurveTo(s * 18.6, 60, s * 2, 66.6); S(P, 0.6, hi(K.beam, 0.3));
      bracket(P, s * 22.8, 40.5, 3.4, s > 0);
    });
    R(P, -27, 70, 54, 4, K.beam, 1, K.lineN); R(P, -27, 70, 54, 1, hi(K.beam, 0.16)); PL(P, [[-1.6, 66], [1.6, 66], [1, 62.4], [0, 61], [-1, 62.4]], K.beam, 0.8, K.lineN);
    chandelier(P, -11, 66.4, 7.2, 4, 1); chandelier(P, 11, 66.4, 7.2, 4, 1);
  }
  function ceilingBeams(P, ww, wd, step, off, o) {
    var y, i; o = o || {}; wt(P, ww, wd, 0, 0);
    R(P, 0, 0, ww, wd, o.base || '#F6E9DF');
    for (i = 1; i < (o.cols || 4); i++) { R(P, ww * i / (o.cols || 4) - 0.5, 0, 1, wd, hi(K.beam, 0.22), 0.4, K.lineN); }
    for (y = off; y < wd; y += step) { R(P, 0, y - 1.5, ww, 3, K.beam, 0.8, K.lineN); R(P, 0, y - 1.5, ww, 0.8, hi(K.beam, 0.16)); }
    R(P, ww / 2 - 1.1, 0, 2.2, wd, K.beam, 0.8, K.lineN); R(P, 0, 0, 1.6, wd, K.beam, 0.6, K.lineN); R(P, ww - 1.6, 0, 1.6, wd, K.beam, 0.6, K.lineN);
  }
  /* 深藍長地毯（俯視）：金邊＋鈴蘭小紋 */
  function runner(P, x0, y0, w, h) {
    var y; R(P, x0, y0, w, h, K.navyF, 0.9, K.lineN); R(P, x0 + w * 0.06, y0, w * 0.035, h, K.brass); R(P, x0 + w * 0.905, y0, w * 0.035, h, K.brass);
    for (y = y0 + w * 0.4; y < y0 + h; y += w * 0.8) { lilyMotif(P, x0 + w * 0.5, y, w * 0.26, '#C9B079'); star4(P, x0 + w * 0.5, y + w * 0.5, w * 0.05, '#C9B079', 0.2); }
  }
  function libFloor(P) { wt(P, 58, 186, 0, 0); herring(P, 0, 0, 58, 186, 2.9, K.walnut); runner(P, 21, 0, 16, 186); }

  /* ---------- 長廊 ---------- */
  /* 拱廊外的中庭（夜）：草地、對面校舍的燈窗、一棵樹；上方透明，露出星空 */
  function corOutside(P) {
    var i, g = P.g; wt(P, 300, 110, -150, -5);
    R(P, -150, 44, 300, 5, nt(K.slate, 0.5));
    slate(P, [[-150, 44], [150, 44], [150, 62], [-150, 62]], nt(K.slate, 0.52), 4.5, K.lineN);
    R(P, -150, 0, 300, 44, nt(K.stone, 0.58), 0.9, K.lineN); for (i = 0; i < 14; i++) LN(P, -150, i * 3.2, 150, i * 3.2, 0.4, nt(K.stone, 0.72));
    for (i = -4; i <= 4; i++) { var cx = i * 33; gothicWin(P, cx, 12, 6, 15, { glass: K.lamp, lat: 2.4, frame: nt(K.stone, 0.4), line: K.lineN, latCol: '#B58E4E' }); PL(P, [[cx + 14, 0], [cx + 19, 0], [cx + 19, 36], [cx + 16.5, 42], [cx + 14, 36]], nt(K.stone, 0.48), 0.8, K.lineN); }
    R(P, -150, -5, 300, 6.5, nt(K.grassD, 0.62)); R(P, -150, 0.6, 300, 1.2, nt(K.leafD, 0.6), 0.6, K.lineN);
    tree(P, -52, 0, 36, 50, { night: 1, n: 11 }); tree(P, 78, 0, 30, 42, { night: 1, n: 10 });
    for (i = -130; i < 140; i += 22) lilyPlant(P, i, 0.4, 6, i % 44 === 0, 1);
  }
  /* 拱廊立面：五個尖拱（挖空）、矮牆、拱上奶油白飾帶 */
  function corArcade(P) {
    var g = P.g, i, st = '#F1E6DE'; wt(P, 154, 72, 0, 0);
    R(P, 0, 0, 154, 72, st); for (i = 0; i < 12; i++) LN(P, 0, 44 + i * 2.6, 154, 44 + i * 2.6, 0.35, sh(st, 0.2));
    R(P, 0, 62, 154, 3, sh(st, 0.14), 0.7); R(P, 0, 66, 154, 6, K.beam, 0.9, K.lineN); R(P, 0, 66, 154, 1.4, hi(K.beam, 0.16));
    for (i = -1; i < 6; i++) {
      var cx = 25 + i * 30;
      g.beginPath(); archPath(g, cx, 0, 13, 27.5); F(P, hi(st, 0.5)); S(P, 0.9);
      cut(P, function (gg) { archPath(gg, cx, 6.2, 11, 20.4); }); g.beginPath(); archPath(g, cx, 6.2, 11, 20.4); S(P, 1);
      R(P, cx - 13, 0, 26, 6.2, st, 0.9); R(P, cx - 13.6, 6.2, 27.2, 1.1, hi(st, 0.5), 0.8); R(P, cx - 13, 0, 26, 1.4, sh(st, 0.22));
      EL(P, cx + 15, 48, 2.6, 2.6, hi(st, 0.5), 0.8); star4(P, cx + 15, 48, 1.9, K.navy, 0.22);
    }
    g_rect(P, 0, 0, 154, 72, 1);
  }
  function column(P) {
    var c = '#F4ECE6', i, g = P.g; wt(P, 4.4, 40, -2.2, 0);
    PL(P, [[-2.1, 0], [2.1, 0], [2.1, 1.3], [1.75, 2.1], [-1.75, 2.1], [-2.1, 1.3]], sh(c, 0.12), 0.9);
    R(P, -1.6, 2.1, 3.2, 33.4, c, 0.9); R(P, 0.5, 2.1, 1.1, 33.4, sh(c, 0.17)); R(P, -1.6, 2.1, 0.5, 33.4, hi(c, 0.7));
    for (i = 0; i < 3; i++) LN(P, -0.7 + i * 0.6, 3, -0.7 + i * 0.6, 34.6, 0.35, sh(c, 0.14));
    R(P, -1.8, 35.5, 3.6, 0.7, c, 0.7);
    PL(P, [[-1.6, 36.2], [1.6, 36.2], [2.15, 38.3], [2.15, 40], [-2.15, 40], [-2.15, 38.3]], c, 0.9); LN(P, -2.15, 38.3, 2.15, 38.3, 0.5);
    for (i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 1.1, 36.3); g.quadraticCurveTo(i * 1.1 + 0.5, 37.2, i * 1.1, 38.1); g.quadraticCurveTo(i * 1.1 - 0.5, 37.2, i * 1.1, 36.3); F(P, hi(c, 0.6)); S(P, 0.45); }
  }
  function corWall(P) {
    var i; wt(P, 154, 72, 0, 0);
    wallBase(P, 0, 154, 72, { wains: 14, top: 6, step: 5.2, pw: 8.6 });
    for (i = 0; i < 5; i++) {
      var cx = 25 + i * 30;
      if (i === 2) { /* 一扇深木門 */ R(P, cx - 7.4, 0, 14.8, 31, K.beam, 1, K.lineN); R(P, cx - 6, 0, 12, 29.6, K.wood, 0.8, K.lineN); R(P, cx - 4.6, 15.5, 9.2, 11.6, sh(K.wood, 0.24), 0.6, K.lineN); R(P, cx - 4.6, 2.4, 9.2, 10.6, sh(K.wood, 0.24), 0.6, K.lineN); EL(P, cx + 4.4, 14.2, 0.6, 0.6, K.brass, 0.5); }
      else { botFrame(P, cx - 9, 24, 7.4, 10, i % 3); botFrame(P, cx + 1.6, 24, 7.4, 10, (i + 1) % 3); }
      sconce(P, cx + 15, 31, 2.3, 1);
    }
  }
  function corFloor(P) {
    var i, j, s = 5.5, a = '#EDE0D4', b = '#DCCFC6', r = P.r; wt(P, 44, 154, 0, 0);
    for (j = 0; j * s < 154; j++) for (i = 0; i * s < 44; i++) R(P, i * s, j * s, s, s, (i + j) % 2 ? a : b, 0.4, sh(K.stone, 0.4));
    for (j = 0; j * s <= 154; j++) for (i = 0; i * s <= 44; i++) PL(P, [[i * s, j * s - 0.8], [i * s + 0.8, j * s], [i * s, j * s + 0.8], [i * s - 0.8, j * s]], K.navy, 0.35, K.lineN);
    runner(P, 15, 0, 14, 154);
  }
  /* 盡頭的牆：深木門框＋尖拱門洞（挖空），門後就是社辦 */
  function endFrame(P, ww, wh, cx, hw, hy, o) {
    var g = P.g, i; o = o || {}; wt(P, ww, wh, -ww / 2, 0);
    wallBase(P, -ww / 2, ww, wh, { wains: o.wains || 12.2, top: o.top === undefined ? 3.4 : o.top, pink: o.pink, step: o.step, pw: o.pw });
    if (o.deco) o.deco();
    g.beginPath(); archPath(g, cx, 0, hw + 3, hy + 0.9); F(P, K.wood); S(P, 1.1); g.beginPath(); archPath(g, cx, 0, hw + 1.1, hy + 0.3); F(P, K.beam); S(P, 0.8, K.lineN);
    cut(P, function (gg) { archPath(gg, cx, -1, hw, hy + 1); }); g.beginPath(); archPath(g, cx, -1, hw, hy + 1); S(P, 1);
    EL(P, cx, hy + archApex(hw + 3) + 3.6, 1.5, 1.5, K.brass, 0.7); star4(P, cx, hy + archApex(hw + 3) + 3.6, 1.1, '#FBF3E2', 0.24);
  }

  /* ---------- 社辦（放課後）：照 STYLE-01 的色調與語彙 ---------- */
  function campus(P) {
    var r = P.r, i; wt(P, 300, 100, -150, -8);
    R(P, -150, -8, 300, 14, K.grass); R(P, -150, 4.6, 300, 1.6, K.grassD);
    /* 遠方的教堂尖塔與校舍 */
    var st = C(mx(K.stone, K.sky3, 0.5)), sl = C(mx(K.slate, K.sky3, 0.5)), ln = C(mx(K.line, K.sky3, 0.6));
    R(P, 52, 6, 9, 40, st, 0.6, ln); slate(P, [[50.6, 46], [62.4, 46], [56.5, 76]], sl, 5, ln); LN(P, 56.5, 76, 56.5, 82, 0.7, ln);
    R(P, -120, 6, 70, 18, st, 0.6, ln); slate(P, [[-123, 24], [-47, 24], [-58, 34], [-112, 34]], sl, 3.4, ln);
    for (i = 0; i < 14; i++) { var x = -150 + 300 * (i + r(0.8)) / 14, h = r(26, 46); tree(P, x, 5, h * 0.9, h, { n: 8 }); }
    for (i = 0; i < 16; i++) { var hx_ = -150 + i * 20 + r(6); var cs = [[hx_, 8, 5], [hx_ + 5, 9.4, 5.6], [hx_ + 10.5, 8, 5]]; blob(P, cs, K.leafD, 0.7); clip(P, blobPath(cs), function () { blob(P, cs.map(function (c) { return [c[0] - 0.8, c[1] + 1.4, c[2] * 0.8]; }), K.leaf, 0); }); }
  }
  /* 左牆：三扇哥德尖拱窗（玻璃挖空，留下鉛條菱格與石花窗） */
  function roomWallL(P) {
    wt(P, 92, 50, -46, 0);
    wallBase(P, -46, 92, 50, { pink: 1 });
    [-24, 0, 24].forEach(function (cx) { gothicWin(P, cx, 8.6, 6.9, 25.6, { lat: 1.9, t: 1.15, latW: 0.5 }); });
    [-36, -12, 12, 36].forEach(function (x) { bracket(P, x, 46.6, 2.6, false); bracket(P, x, 46.6, 2.6, true); R(P, x - 0.7, 41.4, 1.4, 5.2, K.beam, 0.7, K.lineN); });
  }
  /* 後牆：軟木佈告板＋植物圖譜、深藍告示框、圓形彩繪玻璃窗、壁燈 */
  function roomWallB(P) {
    var i; wt(P, 92, 50, -46, 0);
    wallBase(P, -46, 92, 50, { pink: 1 });
    R(P, -40.5, 19, 15, 12.4, K.wood, 1); R(P, -39.5, 20, 13, 10.4, '#B98363', 0.6);
    botFrame(P, -38.6, 25.6, 4.2, 4.2, 0); botFrame(P, -33.2, 25.4, 4.2, 4.4, 2); botFrame(P, -38.2, 20.6, 4.4, 4.2, 1); botFrame(P, -32.8, 20.5, 4, 4.2, 0);
    R(P, -22.6, 19.6, 7.6, 11.4, K.beam, 1, K.lineN); R(P, -21.8, 20.4, 6, 9.8, K.navyF, 0.5, K.lineN); g_rect(P, -21.2, 21, 4.8, 8.6, 0.7, K.brass); star4(P, -18.8, 25.3, 1, K.brass, 0.22);
    roseWin(P, -6.5, 34, 5.4);
    [13, 31].forEach(function (x) { R(P, x - 4, 21.5, 8, 11, K.wood, 1); R(P, x - 3.3, 22.2, 6.6, 9.6, '#FBF3E4', 0.6); lilyPlant(P, x - 0.6, 23.4, 6.4, x > 20); });
    [4, 22, 40].forEach(function (x) { sconce(P, x, 27.6, 2.2, 0); });
    [-36, -12, 12, 36].forEach(function (x) { bracket(P, x, 46.6, 2.6, false); bracket(P, x, 46.6, 2.6, true); R(P, x - 0.7, 41.4, 1.4, 5.2, K.beam, 0.7, K.lineN); });
  }
  function roomWallR(P) { endFrame(P, 92, 50, -20, 10, 26, { pink: 1, deco: function () { botFrame(P, 6, 21, 6.4, 8.6, 0); botFrame(P, 15, 21, 6.4, 8.6, 1); botFrame(P, 24, 21, 6.4, 8.6, 2); sconce(P, 36, 27, 2.2, 0); sconce(P, -39, 27, 2.2, 0); } }); }
  function roomWallF(P) { endFrame(P, 92, 50, 0, 11, 29, { pink: 1, deco: function () { botFrame(P, -34, 21, 6.4, 8.6, 2); botFrame(P, 27, 21, 6.4, 8.6, 0); sconce(P, -20, 27, 2.2, 0); sconce(P, 20, 27, 2.2, 0); } }); }
  function roomCeiling(P) { ceilingBeams(P, 92, 92, 20, 16, { cols: 4 }); }
  function roomFloor(P) { wt(P, 92, 92, 0, 0); herring(P, 0, 0, 92, 92, 2.3, K.walnut); }
  /* 落在地板上的日光窗格：淡色、邊緣清楚（不是橘色夕陽）。左邊靠牆，右端是窗頂的尖拱 */
  function lightPatch(P) {
    var g = P.g, W = P.W, H = P.H, i, j; px(P);
    g.save(); g.transform(1, 0, -0.45, 1, H * 0.45, 0); g.fillStyle = '#FFE8D4';
    var x0 = W * 0.04, cw = W * 0.165, gap = W * 0.014, y0 = H * 0.16, rh = H * 0.33;
    for (j = 0; j < 2; j++) for (i = 0; i < 5; i++) {
      var x = x0 + i * (cw + gap), y = y0 + j * (rh + gap * 1.2);
      g.beginPath();
      if (i < 4) g.rect(x, y, cw, rh);
      else { if (j === 0) { g.moveTo(x, y + rh); g.lineTo(x, y + rh * 0.02); g.quadraticCurveTo(x + cw * 0.7, y + rh * 0.3, x + cw * 0.95, y + rh); } else { g.moveTo(x, y); g.lineTo(x, y + rh * 0.98); g.quadraticCurveTo(x + cw * 0.7, y + rh * 0.7, x + cw * 0.95, y); } g.closePath(); }
      g.fill();
    }
    g.restore();
  }
  /* 圓形深藍地毯（俯視）：外圈金線、一圈鈴蘭花環 */
  function rug(P) {
    var g = P.g, i, n = 22; wt(P, 23, 23, -11.5, -11.5);
    EL(P, 0, 0, 11.2, 11.2, K.navyF, 1, K.lineN); EL(P, 0, 0, 10.5, 10.5, null, 0.9, '#C9B079'); EL(P, 0, 0, 7.3, 7.3, null, 0.5, '#C9B079');
    for (i = 0; i < n; i++) {
      var a = i / n * TAU, x = Math.cos(a) * 8.9, y = Math.sin(a) * 8.9;
      g.save(); g.translate(x, y); g.rotate(a + PI / 2);
      g.beginPath(); g.moveTo(-1.1, 0); g.quadraticCurveTo(0, 0.5, 1.1, 0); S(P, 0.9, '#C9B079');
      g.beginPath(); g.ellipse(-0.5, 0.42, 0.52, 0.2, 0.5, 0, TAU); F(P, '#C9B079'); g.beginPath(); g.ellipse(0.5, -0.36, 0.52, 0.2, 0.5, 0, TAU); F(P, '#C9B079');
      if (i % 2 === 0) { for (var k = 0; k < 3; k++) EL(P, -0.7 + k * 0.7, -0.75 - (k === 1 ? 0.14 : 0), 0.3, 0.26, '#FFFFFF', 0.35, '#7C8CA6'); }
      g.restore();
    }
  }
  /* ---------- 社辦的家具（站立的紙板） ---------- */
  function clothTable(P, cx, y0, s, runnerOn) {
    var g = P.g, i, cl = K.cream, r = 6.9 * s, top = y0 + 7.64 * s, hem = y0 + 3.9 * s;
    /* 腳座 */
    PL(P, [[cx - 0.7 * s, y0 + 0.9 * s], [cx + 0.7 * s, y0 + 0.9 * s], [cx + 0.6 * s, hem + 0.6 * s], [cx - 0.6 * s, hem + 0.6 * s]], K.wood, 0.9); PL(P, [[cx - 3 * s, y0], [cx - 2.2 * s, y0 + 0.5 * s], [cx - 0.6 * s, y0 + 1.4 * s], [cx + 0.6 * s, y0 + 1.4 * s], [cx + 2.2 * s, y0 + 0.5 * s], [cx + 3 * s, y0], [cx + 1.6 * s, y0], [cx, y0 + 0.7 * s], [cx - 1.6 * s, y0]], K.wood, 0.9);
    /* 桌布：垂下的皺褶（三階：亮、底、暗） */
    function cloth(gg) { gg.moveTo(cx - r, top); for (var q = 0; q <= 10; q++) { var x = cx - r * 1.03 + (2 * r * 1.03) * q / 10, yy = hem + (q % 2 ? 0.34 * s : 0) - Math.cos((q / 10 - 0.5) * PI) * 0.5 * s; gg.quadraticCurveTo(x - r * 0.1, yy - 0.3 * s, x, yy); } gg.lineTo(cx + r, top); gg.closePath(); }
    g.beginPath(); cloth(g); F(P, cl);
    clip(P, cloth, function () {
      for (i = 0; i < 5; i++) { var fx = cx - r * 0.86 + i * r * 0.4; g.beginPath(); g.moveTo(fx + 0.3 * s, top); g.quadraticCurveTo(fx + 0.7 * s, (top + hem) / 2, fx, hem - s); g.lineTo(fx + 0.8 * s, hem - s); g.quadraticCurveTo(fx + 1.1 * s, (top + hem) / 2, fx + 0.62 * s, top); g.closePath(); F(P, sh(cl, 0.14)); }
      R(P, cx + r * 0.66, hem - s, r, top - hem + s, sh(cl, 0.18));
    });
    g.beginPath(); cloth(g); S(P, 1);
    if (runnerOn) { PL(P, [[cx - 1.75 * s, top], [cx + 1.75 * s, top], [cx + 1.85 * s, hem + 1.3 * s], [cx - 1.85 * s, hem + 1.3 * s]], K.navyF, 0.9, K.lineN); R(P, cx - 1.85 * s, hem + 1.3 * s, 3.7 * s, 0.34 * s, K.pink, 0.5, '#B98A86'); LN(P, cx - 1.5 * s, top, cx - 1.6 * s, hem + 1.64 * s, 0.6, K.pink); LN(P, cx + 1.5 * s, top, cx + 1.6 * s, hem + 1.64 * s, 0.6, K.pink); }
  }
  function tableTopEllipse(P, cx, top, s, k) { var cl = K.cream; EL(P, cx, top, 6.9 * s, 6.9 * s * k, hi(cl, 0.3), 1); P.g.save(); P.g.beginPath(); P.g.ellipse(cx, top, 6.9 * s, 6.9 * s * k, 0, 0, TAU); P.g.clip(); R(P, cx - 1.75 * s, top - 7 * s * k, 3.5 * s, 14 * s * k, K.navyF); LN(P, cx - 1.5 * s, top - 7 * s * k, cx - 1.5 * s, top + 7 * s * k, 0.6, K.pink); LN(P, cx + 1.5 * s, top - 7 * s * k, cx + 1.5 * s, top + 7 * s * k, 0.6, K.pink); P.g.restore(); EL(P, cx, top, 6.9 * s, 6.9 * s * k, null, 1); }
  /* 曲木椅（正面略側）：圓座墊、彎背、四支細腳 */
  function bentChair(P, cx, y0, s, flip) {
    var g = P.g, f = flip ? -1 : 1, w = K.wood;
    function leg(x1, x2, yb, yt) { g.beginPath(); g.moveTo(cx + f * x1 * s, y0 + yt * s); g.quadraticCurveTo(cx + f * (x1 + x2) / 2 * s + f * 0.1 * s, y0 + (yb + yt) / 2 * s, cx + f * x2 * s, y0 + yb * s); S(P, 2.3, K.line); S(P, 1.4, w); }
    leg(-1.5, -1.9, 0, 4.4); leg(1.5, 1.9, 0, 4.4); leg(-0.9, -1.1, 0.5, 4.4); leg(0.9, 1.1, 0.5, 4.4);
    g.beginPath(); g.ellipse(cx, y0 + 2 * s, 1.5 * s, 0.34 * s, 0, 0, TAU); S(P, 1.7, K.line); S(P, 0.9, w);
    /* 椅背：外圈＋內圈 */
    g.beginPath(); g.moveTo(cx - 1.7 * s, y0 + 4.6 * s); g.bezierCurveTo(cx - 2.1 * s, y0 + 8.4 * s, cx - 1.2 * s, y0 + 9.4 * s, cx, y0 + 9.4 * s); g.bezierCurveTo(cx + 1.2 * s, y0 + 9.4 * s, cx + 2.1 * s, y0 + 8.4 * s, cx + 1.7 * s, y0 + 4.6 * s); S(P, 2.5, K.line); S(P, 1.6, w);
    g.beginPath(); g.moveTo(cx - 0.9 * s, y0 + 4.8 * s); g.bezierCurveTo(cx - 1.1 * s, y0 + 7.4 * s, cx - 0.6 * s, y0 + 8.2 * s, cx, y0 + 8.2 * s); g.bezierCurveTo(cx + 0.6 * s, y0 + 8.2 * s, cx + 1.1 * s, y0 + 7.4 * s, cx + 0.9 * s, y0 + 4.8 * s); S(P, 1.9, K.line); S(P, 1.1, w);
    EL(P, cx, y0 + 4.6 * s, 2.1 * s, 0.62 * s, '#8A5E4E', 1); EL(P, cx - 0.3 * s, y0 + 4.72 * s, 1.5 * s, 0.36 * s, '#A17462');
  }
  function tableSet(P) { wt(P, 21, 11, -10.5, 0); bentChair(P, -7.6, 0, 1, false); bentChair(P, 7.4, 0, 1, true); clothTable(P, 0, 0, 1, true); tableTopEllipse(P, 0, 7.64, 1, 0.2); }
  /* 深藍絨布沙發＋兩個粉色蝴蝶結抱枕（粉色只在這裡小面積出現） */
  function sofa(P) {
    var g = P.g, i, j, c = '#243556'; wt(P, 24, 12, -12, 0);
    for (i = -1; i <= 1; i += 2) PL(P, [[i * 9.6, 0], [i * 10.4, 0], [i * 10.2, 1.2], [i * 9.8, 1.2]], K.wood, 0.8);
    g.beginPath(); g.moveTo(-9.6, 4.4); g.lineTo(-9.6, 9.6); g.quadraticCurveTo(-9.6, 10.9, -8, 10.9); g.lineTo(8, 10.9); g.quadraticCurveTo(9.6, 10.9, 9.6, 9.6); g.lineTo(9.6, 4.4); g.closePath(); F(P, c); S(P, 1, K.lineN);
    for (j = 0; j < 3; j++) for (i = 0; i < 9; i++) { var x = -8 + i * 2 + (j % 2 ? 1 : 0), y = 6 + j * 1.6; if (x > 8.4) continue; EL(P, x, y, 0.2, 0.2, sh(c, 0.5)); LN(P, x, y, x + 1, y + 1.6, 0.35, sh(c, 0.4)); LN(P, x, y, x - 1, y + 1.6, 0.35, sh(c, 0.4)); }
    for (i = -1; i <= 1; i += 2) { g.beginPath(); g.moveTo(i * 9, 1.2); g.lineTo(i * 9, 6.6); g.quadraticCurveTo(i * 9, 8.2, i * 10.6, 8.2); g.quadraticCurveTo(i * 12, 8.2, i * 12, 6.8); g.lineTo(i * 11.6, 1.2); g.closePath(); F(P, i > 0 ? sh(c, 0.26) : hi(c, 0.1)); S(P, 1, K.lineN); EL(P, i * 10.6, 7, 1, 1, sh(c, 0.3), 0.6, K.lineN); }
    R(P, -9, 1.2, 18, 1.5, sh(c, 0.3), 0.8, K.lineN); g.beginPath(); g.moveTo(-9, 2.7); g.lineTo(-9, 4.6); g.quadraticCurveTo(0, 5.2, 9, 4.6); g.lineTo(9, 2.7); g.closePath(); F(P, hi(c, 0.08)); S(P, 0.9, K.lineN); LN(P, 0, 2.7, 0, 4.9, 0.6, K.lineN);
    for (i = 0; i < 16; i++) EL(P, -8.6 + i * 1.15, 1.9, 0.14, 0.14, K.brass);
    [-3.4, 3.4].forEach(function (x) { g.save(); g.translate(x, 6.3); g.rotate(x > 0 ? -0.1 : 0.1); R(P, -1.9, -1.6, 3.8, 3.3, K.pink, 0.9, '#9C6F6C'); R(P, 0.6, -1.6, 1.3, 3.3, '#D9A29E'); PL(P, [[0, 0], [-1.5, 0.9], [-1.5, -0.9]], '#F3CFCB', 0.7, '#9C6F6C'); PL(P, [[0, 0], [1.5, 0.9], [1.5, -0.9]], '#F3CFCB', 0.7, '#9C6F6C'); EL(P, 0, 0, 0.36, 0.36, '#F3CFCB', 0.7, '#9C6F6C'); g.restore(); });
  }
  /* 留聲機與小几 */
  function gramophone(P) {
    var g = P.g, br = K.brass; wt(P, 9, 17, -4.5, 0);
    [-2.1, 2.1].forEach(function (x) { LN(P, x, 0, x * 0.86, 7.2, 2.2, K.line); LN(P, x, 0, x * 0.86, 7.2, 1.3, K.wood); });
    R(P, -2.6, 2.3, 5.2, 0.5, K.wood, 0.7); R(P, -2.7, 7.2, 5.4, 2.3, K.wood, 0.9); R(P, -1.6, 7.7, 3.2, 1.2, sh(K.wood, 0.3), 0.5); EL(P, 0, 8.3, 0.24, 0.24, br); R(P, -3, 9.5, 6, 0.5, K.beam, 0.8, K.lineN);
    R(P, -2.2, 10, 4.4, 1.5, K.wood, 0.9); EL(P, 0, 11.5, 1.9, 0.4, '#2A2A30', 0.8);
    g.beginPath(); g.moveTo(1.2, 11.6); g.quadraticCurveTo(2.9, 12.4, 1.4, 13.4); S(P, 1.9, K.line); S(P, 1.1, br);
    g.beginPath(); g.moveTo(1.6, 13.2); g.quadraticCurveTo(-0.2, 13.6, -1.6, 12.6); g.bezierCurveTo(-3.6, 12.2, -4.5, 14.4, -3.6, 16.4); g.quadraticCurveTo(-1.6, 17.2, 0.3, 15.4); g.quadraticCurveTo(1.3, 14.4, 1.6, 13.2); F(P, br); S(P, 0.9);
    g.beginPath(); g.ellipse(-2.3, 14.9, 1.2, 1.9, 0.5, 0, TAU); F(P, hi(br, 0.4)); S(P, 0.7); g.beginPath(); g.ellipse(-2.1, 14.7, 0.5, 0.9, 0.5, 0, TAU); F(P, sh(br, 0.5));
  }
  function chandelierBoard(P) { wt(P, 18, 14, -9, 0); chandelier(P, 0, 14, 6.3, 6, 0); }
  /* 琴葉榕盆栽：白瓷盆上畫著鈴蘭 */
  function plant(P) {
    var g = P.g, r = P.r, i; wt(P, 10, 20, -5, 0);
    g.beginPath(); g.moveTo(0, 4.6); g.quadraticCurveTo(0.5, 9, -0.3, 14.6); S(P, 2.4, K.line); S(P, 1.5, K.wood);
    for (i = 0; i < 13; i++) { var a = r(-1.25, 1.25) + (i % 2 ? 0.5 : -0.5), y = 8 + i * 0.86, L = r(2.6, 3.6), x = Math.sin(a) * 0.4, col = i % 3 === 0 ? K.leafD : i % 3 === 1 ? K.leaf : '#5E9450';
      g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(L * 0.5, L * 0.2, L * 0.72, L * 0.72, 0, L); g.bezierCurveTo(-L * 0.72, L * 0.72, -L * 0.5, L * 0.2, 0, 0); F(P, col); S(P, 0.8); LN(P, 0, 0.2, 0, L * 0.9, 0.4, sh(K.leafD, 0.4)); g.restore(); }
    PL(P, [[-2.5, 4.8], [2.5, 4.8], [2.1, 0.5], [1.7, 0], [-1.7, 0], [-2.1, 0.5]], '#FBF7F2', 1); PL(P, [[1, 4.8], [2.5, 4.8], [2.1, 0.5], [1.7, 0], [0.9, 0]], '#E4E0E2', 0); R(P, -2.8, 4.5, 5.6, 0.7, '#FBF7F2', 0.9); lilyMotif(P, -0.5, 1.2, 2.4, K.lily);
  }

  /* ---------- 圖書館一角（夜）：照 STYLE-02 的語彙 ---------- */
  function nookShelf(P) {
    var i; wt(P, 72, 50, 0, 0);
    R(P, 0, 0, 72, 50, '#EFE0D6');
    for (i = 0; i < 3; i++) { var x0 = 3 + i * 22.6; bookcase(P, x0, 2, 20.6, 28, 6, K.navy, 0); lilyPanel(P, x0 + 10.3, 31.4, 9.4, 5.6); glazedTile(P, x0 + 20.6, 2, 2, 28, 1.6); }
    R(P, 0, 0, 72, 2, sh(K.navy, 0.3), 0.7, K.lineN); R(P, 0, 30, 72, 1.4, K.wood, 0.8, K.lineN);
    glazedTile(P, 0, 42.6, 72, 3.4, 2.4); R(P, 0, 46, 72, 4, K.beam, 0.9, K.lineN); R(P, 0, 46, 72, 1, hi(K.beam, 0.16));
    [1.5, 24.6, 47.2, 70.5].forEach(function (x) { pilaster(P, x, 0, 2.2, 42.6); });
  }
  function nookWallR(P) {
    wt(P, 54, 50, -27, 0);
    R(P, -27, 0, 54, 50, '#EFE0D6'); glazedTile(P, -27, 13, 54, 30, 3); wainscot(P, -27, 0, 54, 13, 7.7);
    gothicWin(P, 0, 13.6, 8.4, 20, { lat: 2.4, t: 1.3, frame: '#F1E6DE' });
    bookcase(P, -25, 13.6, 12, 19, 4, K.navy, 0); bookcase(P, 13, 13.6, 12, 19, 4, K.navy, 0);
    R(P, -27, 46, 54, 4, K.beam, 0.9, K.lineN); R(P, -27, 46, 54, 1, hi(K.beam, 0.16)); sconce(P, -11.5, 36, 1.9, 1); sconce(P, 11.5, 36, 1.9, 1);
  }
  function nookWallF(P) {
    wt(P, 72, 50, 0, 0); wallBase(P, 0, 72, 50, { top: 4 });
    botFrame(P, 12, 21, 7, 9.4, 0); botFrame(P, 22, 21, 7, 9.4, 2); R(P, 40, 19, 18, 13, K.wood, 1); R(P, 41, 20, 16, 11, '#EADFC8', 0.6); EL(P, 49, 25.5, 4.4, 4.4, '#C9DCC3', 0.6, '#55705A'); EL(P, 47.6, 26.4, 1.6, 1.2, '#8DB58A'); sconce(P, 34, 27, 2, 1); sconce(P, 64, 27, 2, 1);
  }
  function nookFloor(P) {
    var i; wt(P, 72, 54, 0, 0); herring(P, 0, 0, 72, 54, 2.3, K.walnut);
    /* 書桌下的深藍地毯（金邊、四角鈴蘭） */
    R(P, 22, 16, 34, 20, K.navyF, 0.9, K.lineN); g_rect(P, 23.2, 17.2, 31.6, 17.6, 0.9, '#C9B079'); g_rect(P, 24, 18, 30, 16, 0.4, '#C9B079');
    [[25.6, 19.4], [52.4, 19.4], [25.6, 32.6], [52.4, 32.6]].forEach(function (p) { star4(P, p[0], p[1], 0.9, '#C9B079', 0.22); });
    for (i = 0; i < 5; i++) lilyMotif(P, 28.5 + i * 5.3, 25, 2.3, '#C9B079');
  }

  /* ================= 小物（原本的 3D 模型，全部改成手繪紙板：側面一張立牌、頂面一張平貼） ================= */
  var SIL = '#D9DEE5', SILS = '#9AA5B6', CER = '#FFFDF8', CERS = '#DDDCE4';
  /* ---------- 社辦主桌 ---------- */
  function tableTop(P) {
    var g = P.g, cl = K.cream; wt(P, 14, 14, -7, -7);
    EL(P, 0, 0, 6.78, 6.78, hi(cl, 0.34), 0);
    clip(P, function (gg) { gg.arc(0, 0, 6.78, 0, TAU); }, function () {
      EL(P, 1.1, -1.3, 6.78, 6.78, hi(cl, 0.12));                       /* 邊緣一圈淡陰影（桌布往下垂） */
      EL(P, 0, 0, 6.2, 6.2, hi(cl, 0.34));
      R(P, -1.6, -7, 3.2, 14, K.navyF); LN(P, -1.6, -7, -1.6, 7, 0.9, K.lineN); LN(P, 1.6, -7, 1.6, 7, 0.9, K.lineN);
      R(P, -1.43, -7, 0.13, 14, K.pink); R(P, 1.3, -7, 0.13, 14, K.pink);
      [-4.6, -2.3, 0, 2.3, 4.6].forEach(function (y) { lilyMotif(P, -0.2, y - 0.5, 1.15, '#C9B079'); });
    });
    EL(P, 0, 0, 6.78, 6.78, null, 1.1);
  }
  function tableSide(P) { wt(P, 14.6, 8, -7.3, 0); clothTable(P, 0, 0, 1, false); }
  function heroChair(P) {
    var g = P.g; wt(P, 5.2, 10, -2.6, 0); bentChair(P, 0, 0, 1, false);
    EL(P, 0, 4.72, 2.12, 0.66, K.navyF, 1, K.lineN); EL(P, -0.3, 4.86, 1.5, 0.36, K.navy); EL(P, 0, 4.42, 2.16, 0.5, null, 0.6, K.lineN);
  }
  /* ---------- 紅茶：茶碟（俯視）、杯身（側面）、杯口與茶湯（俯視） ---------- */
  function saucer(P) {
    wt(P, 2.2, 2.2, -1.1, -1.1);
    EL(P, 0, 0, 1.02, 1.02, CER, 1.1); EL(P, 0.06, -0.07, 0.93, 0.93, CERS); EL(P, 0, 0, 0.9, 0.9, CER);
    EL(P, 0, 0, 0.97, 0.97, null, 0.9, K.brass); EL(P, 0, 0, 0.52, 0.52, CERS, 0.6, '#A9A8B6'); EL(P, -0.03, 0.03, 0.47, 0.47, CER);
  }
  function cupSide(P) {
    var g = P.g; wt(P, 1.9, 0.76, -0.72, 0.14);
    function body(gg) { gg.moveTo(-0.615, 0.86); gg.bezierCurveTo(-0.6, 0.5, -0.5, 0.28, -0.3, 0.2); gg.lineTo(-0.26, 0.17); gg.lineTo(0.26, 0.17); gg.lineTo(0.3, 0.2); gg.bezierCurveTo(0.5, 0.28, 0.6, 0.5, 0.615, 0.86); gg.closePath(); }
    /* 把手 */
    g.beginPath(); g.moveTo(0.56, 0.74); g.bezierCurveTo(0.98, 0.84, 1.02, 0.36, 0.48, 0.36); S(P, 3.4, K.line); S(P, 2.1, CER);
    g.beginPath(); body(g); F(P, CER);
    clip(P, body, function () { R(P, 0.2, 0.1, 0.5, 0.8, CERS); R(P, -0.5, 0.1, 0.12, 0.8, '#FFFFFF'); lilyMotif(P, -0.16, 0.36, 0.34, K.lily); });
    g.beginPath(); body(g); S(P, 1.1); LN(P, -0.6, 0.83, 0.6, 0.83, 0.9, K.brass); LN(P, -0.28, 0.19, 0.28, 0.19, 0.8, K.brass);
  }
  function cupTea(P) {
    wt(P, 1.34, 1.34, -0.67, -0.67);
    EL(P, 0, 0, 0.62, 0.62, CER, 1.1); EL(P, 0, 0, 0.6, 0.6, null, 0.9, K.brass); EL(P, 0, 0, 0.545, 0.545, CERS, 0.5, '#A9A8B6');
    EL(P, 0, -0.02, 0.5, 0.5, '#A8541F', 0.6, '#6E3410'); EL(P, 0.05, -0.07, 0.42, 0.42, '#C06A2B'); EL(P, -0.16, 0.16, 0.13, 0.07, '#F1C592');
  }
  /* 拍立得（俯視）：白邊、照片是藍天下的鐘塔與樹 */
  function polaroid(P) {
    var g = P.g; wt(P, 1.0, 1.2, -0.5, -0.6);
    R(P, -0.44, -0.535, 0.88, 1.07, '#FFFDF8', 1.1); R(P, -0.38, -0.29, 0.76, 0.76, '#8CC0EA', 0.7);
    clip(P, function (gg) { gg.rect(-0.38, -0.29, 0.76, 0.76); }, function () {
      EL(P, -0.18, 0.3, 0.16, 0.06, '#FFFFFF'); EL(P, 0.16, 0.2, 0.12, 0.05, '#FFFFFF');
      R(P, -0.07, -0.29, 0.14, 0.42, K.stone, 0.5); PL(P, [[-0.09, 0.13], [0.09, 0.13], [0, 0.4]], K.slate, 0.5); EL(P, 0, 0.02, 0.045, 0.045, '#FBF3E2', 0.35);
      EL(P, -0.27, -0.2, 0.17, 0.15, K.leaf, 0.5); EL(P, 0.27, -0.22, 0.17, 0.14, K.leafD, 0.5); R(P, -0.38, -0.29, 0.76, 0.08, K.grass);
    });
    g_rect(P, -0.38, -0.29, 0.76, 0.76, 0.7);
  }
  /* 鋼筆（俯視，平放）：黃銅筆桿、深藍環、金筆尖（放在深藍桌旗或奶油白桌巾上都看得清楚） */
  function pen(P) {
    var b = '#D9B866'; wt(P, 2.2, 0.5, -1.1, -0.25);
    PL(P, [[-0.5, -0.085], [0.36, -0.092], [0.36, 0.092], [-0.5, 0.085]], b, 1); R(P, -0.5, 0.02, 0.86, 0.04, hi(b, 0.5)); R(P, -0.5, -0.085, 0.86, 0.035, sh(b, 0.3));
    PL(P, [[0.36, -0.1], [0.88, -0.1], [0.92, -0.06], [0.92, 0.06], [0.88, 0.1], [0.36, 0.1]], b, 1); R(P, 0.4, 0.03, 0.46, 0.04, hi(b, 0.5)); R(P, 0.38, -0.1, 0.5, 0.04, sh(b, 0.3));
    [0.36, 0.5, -0.5].forEach(function (x) { R(P, x - 0.02, -0.1, 0.05, 0.2, K.navyF, 0.6, K.lineN); });
    PL(P, [[-0.5, -0.07], [-0.82, -0.012], [-0.82, 0.012], [-0.5, 0.07]], '#F1DDA6', 0.9); LN(P, -0.56, 0, -0.8, 0, 0.5, '#8a6d2f');
    R(P, 0.46, 0.1, 0.36, 0.035, K.navyF, 0.5, K.lineN);
  }
  /* 玻璃花瓶裡的兩枝鈴蘭（側面） */
  function vase(P) {
    var g = P.g; wt(P, 3.4, 3.7, -1.3, 0);
    lilyPlant(P, 0.05, 1.5, 2.1, false); lilyPlant(P, -0.05, 1.5, 1.7, true);
    function vz(gg) { gg.moveTo(-0.36, 0); gg.lineTo(0.36, 0); gg.bezierCurveTo(0.56, 0.2, 0.5, 0.8, 0.4, 1.05); gg.bezierCurveTo(0.26, 1.4, 0.26, 1.6, 0.35, 1.92); gg.lineTo(-0.35, 1.92); gg.bezierCurveTo(-0.26, 1.6, -0.26, 1.4, -0.4, 1.05); gg.bezierCurveTo(-0.5, 0.8, -0.56, 0.2, -0.36, 0); gg.closePath(); }
    g.beginPath(); vz(g); F(P, 'rgba(214,232,244,.78)');
    clip(P, vz, function () { R(P, -0.6, 0, 1.2, 0.86, 'rgba(160,200,226,.8)'); LN(P, -0.6, 0.86, 0.6, 0.86, 0.6, '#7FA6C4'); R(P, -0.34, 0.1, 0.1, 1.6, 'rgba(255,255,255,.85)'); R(P, 0.2, 0, 0.3, 2, 'rgba(120,160,196,.35)'); });
    g.beginPath(); vz(g); S(P, 1.1, '#3F566E'); LN(P, -0.35, 1.92, 0.35, 1.92, 1.1, '#3F566E');
  }
  /* ---------- 櫃檯：正面（深藍鑲板、黃銅踢腳桿）、檯面（白色石面，俯視） ---------- */
  function counterFront(P) {
    var i; wt(P, 43, 9.9, 0, 0);
    R(P, 0.5, 0, 42, 9.4, K.navy, 1, K.lineN); R(P, 0.5, 0, 42, 0.9, K.beam, 0.8, K.lineN);
    for (i = 0; i < 7; i++) { var x = 1.4 + i * 5.9; R(P, x, 1.7, 5, 6.5, sh(K.navy, 0.2), 0.8, K.lineN); R(P, x + 0.36, 2.06, 4.28, 5.78, K.navy); LN(P, x, 8.2, x + 5, 8.2, 0.7, hi(K.navy, 0.3)); LN(P, x, 1.7, x, 8.2, 0.7, hi(K.navy, 0.3)); star4(P, x + 2.5, 4.95, 0.62, '#C9B079', 0.2); }
    LN(P, 0.9, 1.3, 42.1, 1.3, 2.6, K.line); LN(P, 0.9, 1.3, 42.1, 1.3, 1.5, K.brass);
    R(P, 0, 9.3, 43, 0.6, '#FBF8F4', 1); R(P, 0, 9.3, 43, 0.2, '#D9D6DE');
  }
  function counterTop(P) {
    var r = P.r, i, g = P.g; wt(P, 43, 5.8, 0, 0);
    R(P, 0, 0, 43, 5.8, '#FBF8F4', 0); for (i = 0; i < 16; i++) { g.beginPath(); var x = r(43), y = r(5.8); g.moveTo(x, y); g.quadraticCurveTo(x + r(1, 3), y + r(-0.8, 0.8), x + r(3, 7), y + r(-1.2, 1.2)); S(P, 0.5, '#DAD8E2'); }
    R(P, 0, 0, 43, 0.5, '#E6E3EA'); g_rect(P, 0, 0, 43, 5.8, 1.1);
  }
  /* 銀托盤（俯視）、餐蓋（側面） */
  function trayTop(P) { wt(P, 5, 5, -2.5, -2.5); EL(P, 0, 0, 2.4, 2.4, SIL, 1.1); EL(P, 0.12, -0.14, 2.2, 2.2, SILS); EL(P, 0, 0, 2.12, 2.12, '#E9EDF2'); EL(P, 0, 0, 1.96, 1.96, null, 0.6, SILS); P.g.beginPath(); P.g.arc(0, 0, 1.6, 1.9, 2.9); S(P, 1.6, '#FFFFFF'); }
  function cloche(P) {
    var g = P.g; wt(P, 4.4, 2.5, -2.2, 0);
    function dome(gg) { gg.moveTo(-1.95, 0.1); gg.bezierCurveTo(-1.95, 1.3, -1.0, 2.02, 0, 2.02); gg.bezierCurveTo(1.0, 2.02, 1.95, 1.3, 1.95, 0.1); gg.closePath(); }
    g.beginPath(); dome(g); F(P, SIL);
    clip(P, dome, function () { g.beginPath(); g.moveTo(0.5, 2.1); g.bezierCurveTo(1.4, 1.6, 1.5, 0.8, 1.4, 0); g.lineTo(2.1, 0); g.lineTo(2.1, 2.1); g.closePath(); F(P, SILS); g.beginPath(); g.moveTo(-1.5, 0.4); g.bezierCurveTo(-1.5, 1.2, -1.0, 1.7, -0.5, 1.84); g.bezierCurveTo(-1.0, 1.4, -1.2, 0.9, -1.2, 0.4); g.closePath(); F(P, '#FFFFFF'); });
    g.beginPath(); dome(g); S(P, 1.1); R(P, -2.1, 0, 4.2, 0.16, '#C4CAD3', 0.9);
    R(P, -0.1, 2.0, 0.2, 0.14, SILS, 0.6); EL(P, 0, 2.3, 0.2, 0.18, SIL, 0.9);
  }
  /* 服務鈴（側面）：黃銅 */
  function bell(P) {
    var g = P.g, b = K.brass; wt(P, 2.4, 1.3, -1.2, 0);
    function dm(gg) { gg.moveTo(-0.92, 0.1); gg.bezierCurveTo(-0.92, 0.66, -0.5, 0.92, 0, 0.92); gg.bezierCurveTo(0.5, 0.92, 0.92, 0.66, 0.92, 0.1); gg.closePath(); }
    R(P, -1.05, 0, 2.1, 0.12, sh(b, 0.3), 0.9); g.beginPath(); dm(g); F(P, b);
    clip(P, dm, function () { R(P, 0.36, 0, 0.7, 1, sh(b, 0.34)); g.beginPath(); g.ellipse(-0.42, 0.56, 0.12, 0.26, 0.5, 0, TAU); F(P, hi(b, 0.6)); });
    g.beginPath(); dm(g); S(P, 1.1); R(P, -0.07, 0.92, 0.14, 0.14, sh(b, 0.2), 0.6); EL(P, 0, 1.13, 0.13, 0.1, hi(b, 0.3), 0.8);
  }
  /* 魔法棒（俯視，平放）：金色細桿＋四芒星 */
  function wand(P) {
    var g = P.g, i, b = '#D9B866'; wt(P, 3.9, 1.3, -1.7, -0.65);
    R(P, -1.6, -0.06, 3.2, 0.12, b, 0.9); R(P, -1.6, 0.01, 3.2, 0.03, hi(b, 0.5)); R(P, -1.62, -0.09, 0.2, 0.18, K.navyF, 0.7, K.lineN);
    g.beginPath(); for (i = 0; i < 8; i++) { var a = i * PI / 4 + PI / 2, rr = i % 2 ? 0.55 * 0.24 : 0.55; g.lineTo(1.6 + Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); F(P, b); S(P, 1); star4(P, 1.56, 0.04, 0.26, hi(b, 0.6), 0.24);
  }
  /* ---------- 圖書館書桌 ---------- */
  function deskTop(P) {
    var i, w = K.wood; wt(P, 20, 9.6, 0, 0);
    R(P, 0, 0, 20, 9.6, w, 0); for (i = 1; i < 5; i++) LN(P, 0, i * 1.92, 20, i * 1.92, 0.5, sh(w, 0.4)); R(P, 0, 0, 20, 0.5, sh(w, 0.3)); R(P, 0, 9.3, 20, 0.3, hi(w, 0.16));
    R(P, 4, 1.5, 12, 6.6, K.navyF, 0.9, K.lineN); g_rect(P, 4.4, 1.9, 11.2, 5.8, 0.7, '#C9B079'); [[4.9, 2.4], [15.1, 2.4], [4.9, 7.2], [15.1, 7.2]].forEach(function (p) { star4(P, p[0], p[1], 0.3, '#C9B079', 0.24); });
    g_rect(P, 0, 0, 20, 9.6, 1.1);
  }
  function deskLeg(P, x, top) { var w = K.wood; PL(P, [[x - 0.36, 0], [x + 0.36, 0], [x + 0.3, 0.7], [x + 0.42, 1.2], [x + 0.26, 2], [x + 0.26, top - 1.4], [x + 0.42, top - 0.8], [x + 0.42, top], [x - 0.42, top], [x - 0.42, top - 0.8], [x - 0.26, top - 1.4], [x - 0.26, 2], [x - 0.42, 1.2], [x - 0.3, 0.7]], w, 1); R(P, x + 0.06, 2, 0.2, top - 3.4, sh(w, 0.3)); }
  function deskFront(P) {
    var w = K.wood; wt(P, 20, 7.9, 0, 0);
    deskLeg(P, 0.7, 6.2); deskLeg(P, 19.3, 6.2);
    R(P, 0.2, 5.9, 19.6, 1.5, w, 1); R(P, 0.2, 5.9, 19.6, 0.4, sh(w, 0.3)); [5, 15].forEach(function (x) { R(P, x - 3.2, 6.15, 6.4, 1, sh(w, 0.16), 0.7); EL(P, x, 6.65, 0.2, 0.2, K.brass, 0.6); });
    R(P, 0, 7.3, 20, 0.6, hi(w, 0.14), 1);
  }
  function deskSide(P) { var w = K.wood; wt(P, 9.6, 7.9, 0, 0); deskLeg(P, 0.7, 6.2); deskLeg(P, 8.9, 6.2); R(P, 0.2, 5.9, 9.2, 1.5, w, 1); R(P, 0.2, 5.9, 9.2, 0.4, sh(w, 0.3)); R(P, 1.2, 6.15, 7.2, 1, sh(w, 0.16), 0.7); R(P, 0, 7.3, 9.6, 0.6, hi(w, 0.14), 1); }
  function deskBack(P) { var w = sh(K.wood, 0.3), i; wt(P, 19, 5.4, 0, 0); R(P, 0, 0, 19, 5.4, w, 1); for (i = 0; i < 3; i++) g_rect(P, 0.6 + i * 6.1, 0.6, 5.6, 4.2, 0.7, K.lineN); }
  /* 燭台（側面）、底座（俯視）、火焰 */
  function candleSide(P) {
    var g = P.g, b = K.brass; wt(P, 1.9, 4.3, -0.95, 0);
    function st(gg) { gg.moveTo(-0.82, 0); gg.lineTo(0.82, 0); gg.lineTo(0.86, 0.08); gg.quadraticCurveTo(0.34, 0.24, 0.16, 0.6); gg.lineTo(0.22, 1.5); gg.lineTo(0.14, 1.72); gg.quadraticCurveTo(0.5, 2.0, 0.56, 2.32); gg.lineTo(-0.56, 2.32); gg.quadraticCurveTo(-0.5, 2.0, -0.14, 1.72); gg.lineTo(-0.22, 1.5); gg.lineTo(-0.16, 0.6); gg.quadraticCurveTo(-0.34, 0.24, -0.86, 0.08); gg.closePath(); }
    g.beginPath(); st(g); F(P, b); clip(P, st, function () { R(P, 0.05, 0, 1, 2.4, sh(b, 0.34)); R(P, -0.12, 0.5, 0.07, 1.2, hi(b, 0.6)); }); g.beginPath(); st(g); S(P, 1.1); LN(P, -0.2, 1.5, 0.2, 1.5, 0.6); LN(P, -0.52, 2.2, 0.52, 2.2, 0.6);
    R(P, -0.2, 2.32, 0.4, 1.74, '#FBF5E6', 1); R(P, 0.04, 2.32, 0.16, 1.74, '#E3DACB'); LN(P, 0, 4.06, 0, 4.2, 0.9, '#3A3030');
    g.beginPath(); g.moveTo(-0.2, 3.9); g.quadraticCurveTo(-0.24, 3.5, -0.2, 3.3); S(P, 0.6, '#C9BFAE');
  }
  function candleDish(P) { var b = K.brass; wt(P, 1.9, 1.9, -0.95, -0.95); EL(P, 0, 0, 0.86, 0.86, b, 1.1); EL(P, 0.06, -0.07, 0.74, 0.74, sh(b, 0.3)); EL(P, 0, 0, 0.7, 0.7, hi(b, 0.14)); EL(P, 0, 0, 0.3, 0.3, sh(b, 0.2), 0.7); EL(P, 0, 0, 0.2, 0.2, '#FBF5E6', 0.7); }
  function flame(P) {
    var g = P.g; wt(P, 0.4, 0.8, -0.2, 0);
    function fl(gg, k) { gg.moveTo(0, 0.02); gg.bezierCurveTo(-0.17 * k, 0.1, -0.13 * k, 0.36 * k, 0, 0.74 * k); gg.bezierCurveTo(0.13 * k, 0.36 * k, 0.17 * k, 0.1, 0, 0.02); gg.closePath(); }
    g.beginPath(); fl(g, 1); F(P, '#FFD27A'); g.beginPath(); fl(g, 0.72); F(P, '#FFF0B8'); g.beginPath(); fl(g, 0.4); F(P, '#FFFFFF');
  }
  /* 鑰匙（俯視，平放） */
  function keyP(P) {
    var g = P.g, b = K.brass; wt(P, 1.6, 0.8, -0.34, -0.4);
    R(P, 0.2, -0.045, 0.84, 0.09, b, 0.9); R(P, 0.86, 0.045, 0.09, 0.22, b, 0.8); R(P, 1.0, 0.045, 0.09, 0.16, b, 0.8);
    g.beginPath(); g.arc(0, 0, 0.24, 0, TAU); S(P, 3.4, K.line); S(P, 2.1, b); R(P, 0.2, 0.0, 0.84, 0.03, hi(b, 0.5));
  }
  function inkwell(P) {
    var g = P.g; wt(P, 1.0, 1.0, -0.5, 0);
    function bd(gg) { gg.moveTo(-0.4, 0); gg.lineTo(0.4, 0); gg.lineTo(0.42, 0.5); gg.quadraticCurveTo(0.3, 0.62, 0.2, 0.62); gg.lineTo(-0.2, 0.62); gg.quadraticCurveTo(-0.3, 0.62, -0.42, 0.5); gg.closePath(); }
    g.beginPath(); bd(g); F(P, K.navyF); clip(P, bd, function () { R(P, 0.14, 0, 0.3, 0.7, '#111E3A'); R(P, -0.3, 0.1, 0.08, 0.36, '#4E6AA0'); }); g.beginPath(); bd(g); S(P, 1.1, K.lineN);
    R(P, -0.2, 0.62, 0.4, 0.18, K.navyF, 0.9, K.lineN); R(P, -0.27, 0.8, 0.54, 0.1, K.brass, 0.9);
  }
  /* 三本疊起來的書：頂面（俯視）、書背（側面） */
  function booksTop(P) {
    var g = P.g; wt(P, 3.7, 2.8, -1.85, -1.4);
    [[3.2, 2.2, 0.2, K.navy], [2.9, 2.1, 0.04, '#EADBC8'], [2.6, 2.0, -0.12, '#7B5A45']].forEach(function (b, i) {
      g.save(); g.rotate(b[2]); R(P, -b[0] / 2, -b[1] / 2, b[0], b[1], b[3], 1); R(P, -b[0] / 2, -b[1] / 2, 0.16, b[1], sh(b[3], 0.3));
      if (i === 2) { g_rect(P, -b[0] / 2 + 0.3, -b[1] / 2 + 0.2, b[0] - 0.5, b[1] - 0.4, 0.7, '#C9B079'); star4(P, 0.1, 0, 0.3, '#C9B079', 0.24); }
      g.restore();
    });
  }
  function booksSide(P) {
    wt(P, 3.4, 1.42, -1.7, 0);
    [[3.2, K.navy, 0.06], [2.9, '#EADBC8', -0.04], [2.6, '#7B5A45', 0.08]].forEach(function (b, i) { var y = i * 0.46, x = -b[0] / 2 + b[2]; R(P, x, y, b[0], 0.46, b[1], 1); R(P, x + b[0] * 0.62, y, b[0] * 0.38, 0.46, sh(b[1], 0.26)); R(P, x + 0.12, y + 0.07, b[0] - 0.24, 0.32, '#FBF6EA', 0.5); R(P, x, y, 0.5, 0.46, b[1], 0.8); LN(P, x + 0.16, y + 0.05, x + 0.16, y + 0.41, 0.6, '#C9B079'); LN(P, x + 0.32, y + 0.05, x + 0.32, y + 0.41, 0.6, '#C9B079'); });
  }

  /* ================= 登記：id、桌機版像素尺寸、是否去背 ================= */
  A('bg/ch1/hero_00_sky', 2048, 1024, 0, function (P) { sky(P, 'night', 0.3); });
  A('bg/ch1/hero_01_far', 2048, 256, 1, heroFar, 1.6);
  A('bg/ch1/hero_02_mid', 2048, 244, 1, heroMid);
  A('bg/ch2/gate_00_sky', 2048, 1024, 0, function (P) { sky(P, 'day'); });
  A('bg/ch2/gate_01_far', 2048, 192, 1, gateFar);
  A('bg/ch2/gate_02_tower', 448, 2016, 1, function (P) { tower(P, 'day'); });
  A('bg/ch2/gate_02b_tunnel', 512, 512, 0, function (P) { stoneTile(P, 4); });
  A('bg/ch2/gate_03_frame', 2048, 864, 1, gateFrame);
  A('bg/ch2/gate_03b_reveal', 256, 256, 0, function (P) { stoneTile(P, 4); });
  A('bg/ch2/gate_04_pillar', 256, 1390, 1, pillar);
  A('bg/ch2/gate_05_lily', 1536, 512, 1, lilyBed);
  A('bg/ch2/gate_06_ground', 384, 2048, 1, gardenGround);
  A('bg/ch2/gate_07_lamp', 256, 938, 1, lampPost);
  A('bg/ch3/garden_00_sky', 2048, 1024, 0, function (P) { sky(P, 'night', 0.62); });
  A('bg/ch3/garden_02_tower', 448, 2016, 1, function (P) { tower(P, 'night'); });
  A('bg/ch6/year_00_sky', 2048, 1024, 0, function (P) { sky(P, 'night', 0.74); });
  A('bg/ch6/year_01_far', 2048, 268, 1, function (P) { yearFar(P, 1); });
  A('bg/ch6/year_02_tower', 448, 2016, 1, function (P) { tower(P, 'night'); });
  A('bg/ch6/year_02b_side', 256, 1392, 0, function (P) { towerSide(P, 'night'); });
  A('bg/ch6/year_03_near', 2048, 286, 1, function (P) { yearNear(P, 1); });
  A('bg/ch7/visit_00_sky', 2048, 1024, 0, function (P) { sky(P, 'morning'); });
  A('bg/ch7/visit_01_far', 2048, 268, 1, function (P) { yearFar(P, 0); });
  A('bg/ch7/visit_02_tower', 448, 2016, 1, function (P) { tower(P, 'morning'); });
  A('bg/ch7/visit_02b_side', 256, 1392, 0, function (P) { towerSide(P, 'day'); });
  A('bg/ch7/visit_03_near', 2048, 286, 1, function (P) { yearNear(P, 0); });
  A('bg/ch3/lib_01_front', 896, 1032, 1, libFront);
  A('bg/ch3/lib_02_shelf', 2048, 810, 0, libShelf);
  A('bg/ch3/lib_03_rib', 752, 1030, 1, libRib);
  A('bg/ch3/lib_04_ceiling', 352, 1034, 0, function (P) { ceilingBeams(P, 64, 188, 30, 17, { cols: 4 }); });
  A('bg/ch3/lib_05_floor', 320, 1026, 0, libFloor);
  A('bg/ch3/cor_01_outside', 2048, 752, 1, corOutside);
  A('bg/ch3/cor_02_arcade', 2048, 958, 1, corArcade);
  A('bg/ch3/cor_03_column', 256, 1024, 1, column, 3.2);
  A('bg/ch3/cor_04_wall', 2048, 958, 0, corWall);
  A('bg/ch3/cor_05_ceiling', 372, 1024, 0, function (P) { ceilingBeams(P, 56, 154, 30, 10, { cols: 2 }); });
  A('bg/ch3/cor_06_floor', 288, 1008, 0, corFloor);
  A('bg/ch3/cor_07_endframe', 944, 1028, 1, function (P) { endFrame(P, 68, 74, 0, 11, 29, { wains: 14, top: 6, step: 5.2, deco: function () { sconce(P, -22, 30, 2.4, 1); sconce(P, 22, 30, 2.4, 1); } }); });
  A('bg/ch4/room_00_sky', 2048, 1024, 0, function (P) { sky(P, 'room'); });
  A('bg/ch4/room_01_campus', 2048, 682, 1, campus);
  A('bg/ch4/room_02_wall_l', 2048, 1112, 1, roomWallL);
  A('bg/ch4/room_04_wall_b', 2048, 1112, 0, roomWallB);
  A('bg/ch4/room_05_wall_r', 2048, 1112, 1, roomWallR);
  A('bg/ch4/room_06_wall_f', 2048, 1112, 1, roomWallF);
  A('bg/ch4/room_07_ceiling', 1024, 1024, 0, roomCeiling);
  A('bg/ch4/room_08_floor', 1024, 1024, 0, roomFloor);
  A('bg/ch4/room_09_lightpatch', 1024, 512, 1, lightPatch);
  A('bg/ch4/room_10_rug', 1024, 1024, 1, rug, 3);
  A('bg/ch4/room_11_tableset', 1024, 536, 1, tableSet, 3);
  A('bg/ch4/room_12_sofa', 1024, 512, 1, sofa, 3);
  A('bg/ch4/room_13_gramophone', 512, 968, 1, gramophone, 3);
  A('bg/ch4/room_14_chandelier', 1024, 796, 1, chandelierBoard, 3);
  A('bg/ch4/room_15_plant', 512, 1024, 1, plant, 3);
  A('bg/ch5/nook_00_sky', 2048, 1024, 0, function (P) { sky(P, 'night', 0.5); });
  A('bg/ch5/nook_01_wall_r', 1104, 1022, 1, nookWallR);
  A('bg/ch5/nook_02_shelf', 1472, 1022, 0, nookShelf);
  A('bg/ch5/nook_03_wall_f', 1472, 1022, 0, nookWallF);
  A('bg/ch5/nook_04_ceiling', 1024, 768, 0, function (P) { ceilingBeams(P, 72, 54, 18, 9, { cols: 4 }); });
  A('bg/ch5/nook_05_floor', 1024, 768, 0, nookFloor);
  /* ---- 小物（assets/prop/）：原本的 3D 模型 ---- */
  A('prop/ch4/table_01_top', 2048, 2048, 1, tableTop, 5);
  A('prop/ch4/table_02_side', 1168, 640, 1, tableSide, 3.4);
  A('prop/ch4/chair_01_side', 520, 1000, 1, heroChair, 3.6);
  A('prop/ch4/cup_01_saucer', 512, 512, 1, saucer, 4);
  A('prop/ch4/cup_02_side', 1024, 410, 1, cupSide, 5);
  A('prop/ch4/cup_03_tea', 512, 512, 1, cupTea, 4.4);
  A('prop/ch4/polaroid_01', 500, 600, 1, polaroid, 4);
  A('prop/ch4/pen_01', 1024, 232, 1, pen, 4);
  A('prop/ch4/vase_01_side', 680, 740, 1, vase, 3.2);
  A('prop/ch4/counter_01_front', 2048, 472, 1, counterFront, 3);
  A('prop/ch4/counter_02_top', 2048, 276, 0, counterTop, 3);
  A('prop/ch4/tray_01_top', 512, 512, 1, trayTop, 3.4);
  A('prop/ch4/cloche_01_side', 880, 500, 1, cloche, 3.6);
  A('prop/ch4/bell_01_side', 624, 338, 1, bell, 3.6);
  A('prop/ch4/wand_01', 1024, 342, 1, wand, 3.4);
  A('prop/ch5/desk_01_top', 2048, 984, 0, deskTop, 3.4);
  A('prop/ch5/desk_02_front', 2048, 808, 1, deskFront, 3.4);
  A('prop/ch5/desk_03_side', 1024, 842, 1, deskSide, 3.4);
  A('prop/ch5/desk_04_back', 1024, 292, 0, deskBack, 3);
  A('prop/ch5/candle_01_side', 380, 860, 1, candleSide, 3.6);
  A('prop/ch5/candle_02_dish', 256, 256, 1, candleDish, 3);
  A('prop/ch5/candle_03_flame', 128, 256, 1, flame, 2);
  A('prop/ch5/key_01', 512, 256, 1, keyP, 3.4);
  A('prop/ch5/inkwell_01_side', 256, 256, 1, inkwell, 3.4);
  A('prop/ch5/books_01_top', 740, 560, 1, booksTop, 3.6);
  A('prop/ch5/books_02_side', 680, 284, 1, booksSide, 3.4);
  /*@@MORE@@*/

  function paint(id, scale) {
    var e = BY[id]; if (!e) return null;
    var k = scale || 1, c = document.createElement('canvas'); c.width = Math.max(2, Math.round(e.w * k)); c.height = Math.max(2, Math.round(e.h * k));
    var seed = 7; for (var i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) | 0;
    var P = { g: c.getContext('2d'), W: e.w, H: e.h, k: c.width / e.w, r: rng(seed), up: -1, u: 1, L: e.L || Math.max(1.4, Math.sqrt(e.w * e.h) / 520) };
    P.lw = P.L; P.g.setTransform(P.k, 0, 0, P.k, 0, 0); e.fn(P); P.g.setTransform(1, 0, 0, 1, 0, 0);
    return c;
  }
  root.SA_BG = { list: L_, paint: paint };
})(window);
