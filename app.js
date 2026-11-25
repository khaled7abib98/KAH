/* =========================================================
   KAH v2 — interactions
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const P = window.PROJECTS || [];
  const { img, cover } = window.KAH_IMG;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  const byId = (id) => P.find((p) => p.id === id);
  const imgTag = (src, alt = "", cls = "", fb = "") =>
    `<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${cls ? ` class="${cls}"` : ""}${fb ? ` onerror="this.onerror=null;this.src='${fb}'"` : ""} />`;

  /* ---------------- loader ---------------- */
  const loader = $("#loader");
  $$(".loader-logo path").forEach((p, i) => {
    p.style.setProperty("--len", Math.ceil(p.getTotalLength()));
    p.style.animationDelay = `${i * 0.05}s, ${1.25 + i * 0.03}s`;
  });
  let pct = 0;
  const cnt = $("#loaderCount");
  const tk = setInterval(() => { pct = Math.min(100, pct + Math.ceil(Math.random() * 9)); cnt.textContent = String(pct).padStart(2, "0"); if (pct >= 100) clearInterval(tk); }, 65);
  const t0 = performance.now();
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.remove("is-loading");
      document.body.classList.add("ready");
    }, reduce ? 0 : Math.max(0, 1900 - (performance.now() - t0)));
  };
  if (document.readyState === "complete") finish(); else addEventListener("load", finish);
  setTimeout(finish, 4500);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  const go = (sel) => {
    const el = sel === "#top" ? document.body : $(sel);
    if (!el) return;
    lenis ? lenis.scrollTo(el, { offset: -10, duration: 1.3 }) : el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    e.preventDefault();
    if (!$("#case").hidden) closeCase();
    go(id);
  });

  /* ---------------- starfield (quiet) ---------------- */
  const cv = $("#space"), cx = cv.getContext("2d");
  let W, H, D, stars = [], mx = 0, my = 0, smx = 0, smy = 0, shoot = null;
  const resize = () => {
    D = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * D; H = cv.height = innerHeight * D;
    stars = Array.from({ length: Math.round(innerWidth * innerHeight / 7000) }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.9 + 0.1,
      t: Math.random() * 6.28, s: 0.4 + Math.random() * 1.4, warm: Math.random() < 0.12
    }));
  };
  resize(); addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  const draw = (t) => {
    smx += (mx - smx) * 0.04; smy += (my - smy) * 0.04;
    cx.clearRect(0, 0, W, H);
    const sc = scrollY;
    for (const s of stars) {
      let x = (s.x - smx * 50 * s.z * D) % W; if (x < 0) x += W;
      let y = (s.y - sc * 0.06 * s.z * D - smy * 30 * s.z * D) % H; if (y < 0) y += H;
      cx.globalAlpha = (0.3 + 0.7 * Math.abs(Math.sin(s.t + t * 0.001 * s.s))) * s.z;
      cx.fillStyle = s.warm ? "#c8bfff" : "#fff";
      cx.beginPath(); cx.arc(x, y, s.z * 1.2 * D, 0, 6.283); cx.fill();
    }
    if (!shoot && Math.random() < 0.002) shoot = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.4, l: 0 };
    if (shoot) {
      shoot.l += 13 * D;
      const x2 = shoot.x + shoot.l, y2 = shoot.y + shoot.l * 0.4;
      const g = cx.createLinearGradient(x2, y2, x2 - 110 * D, y2 - 44 * D);
      g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
      cx.globalAlpha = Math.max(0, 1 - shoot.l / (320 * D)); cx.strokeStyle = g; cx.lineWidth = 1.3 * D;
      cx.beginPath(); cx.moveTo(x2, y2); cx.lineTo(x2 - 110 * D, y2 - 44 * D); cx.stroke();
      if (shoot.l > 320 * D) shoot = null;
    }
    cx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);

  /* ---------------- cursor ---------------- */
  const cur = $("#cursor");
  if (!touch) {
    let x = -100, y = -100, ax = x, ay = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
    (function loop() { ax += (x - ax) * 0.22; ay += (y - ay) * 0.22; cur.style.transform = `translate(${ax}px,${ay}px)`; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", (e) => {
      const v = e.target.closest("[data-open]");
      cur.classList.toggle("view", !!v);
      cur.classList.toggle("hover", !v && !!e.target.closest("a,button,.opt,summary"));
    });
  }

  /* ---------------- pill nav ---------------- */
  const pill = $("#pill");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    pill.classList.toggle("hide", y > lastY + 4 && y > 500);
    if (y < lastY - 4) pill.classList.remove("hide");
    lastY = y;
  }, { passive: true });
  const secObs = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) $$(".pill-links a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["work", "more", "process", "experience"].forEach((id) => secObs.observe($("#" + id)));

  /* ---------------- headline ---------------- */
  const PAIRS = [["BRANDS", "VISUALS"], ["IDEAS", "IDENTITY"], ["ADS", "SOCIAL"], ["DESIGNER", "STORYTELLER"]];
  let pi = 0;
  const splitInto = (el, word, delay = 0) => {
    el.innerHTML = [...word].map((c, i) => `<span class="ch" style="transition-delay:${delay + i * 0.035}s">${c}</span>`).join("");
  };
  splitInto($("#wordA"), PAIRS[0][0], 0.05);
  splitInto($("#wordB"), PAIRS[0][1], 0.3);
  $("#amp").addEventListener("click", () => {
    pi = (pi + 1) % PAIRS.length;
    [["#wordA", 0], ["#wordB", 1]].forEach(([sel, k]) => {
      const el = $(sel);
      $$(".ch", el).forEach((c) => { c.style.transitionDelay = "0s"; c.style.opacity = 0; c.style.transform = "translateY(-.4em)"; });
      setTimeout(() => {
        splitInto(el, PAIRS[pi][k], k * 0.12);
        $$(".ch", el).forEach((c) => { c.style.opacity = 0; c.style.transform = "translateY(.5em) rotate(4deg)"; });
        requestAnimationFrame(() => requestAnimationFrame(() => $$(".ch", el).forEach((c) => { c.style.opacity = ""; c.style.transform = ""; })));
      }, 260);
    });
  });

  /* ---------------- arc carousel ---------------- */
  const ARC = ["nobilia", "ethra", "markethome", "mfa", "vivy", "coconuts", "taw", "osool", "abuelias", "logofolio", "portfolio", "pingpong"].map(byId).filter(Boolean);
  const arc = $("#arc"), ring = $("#arcRing");
  const N = ARC.length, STEP = 360 / N;
  let cw = 260;
  ring.innerHTML = ARC.map((p, i) => `
    <a class="arc-card" href="${p.url}" data-open="${p.id}" style="--a:${i * STEP}deg" aria-label="Open ${p.title}">
      ${imgTag(cover(p.cover), p.title, "", img(p.images[0]))}
      <span class="tl">${p.cats[0] === "branding" ? "Branding" : p.cats[0] === "social" ? "Social" : "Ads"}</span>
      <span class="tr">${p.year}</span>
      <b>${p.title}</b>
    </a>`).join("");
  const cards = $$(".arc-card", ring);
  let RX = 700, RY = 120;
  const layoutArc = () => {
    cw = Math.max(150, Math.min(280, innerWidth * 0.19));
    RX = cw * 1.85;
    RY = Math.max(60, Math.min(140, innerWidth * 0.09));
    ring.style.setProperty("--cw", cw + "px");
  };
  layoutArc(); addEventListener("resize", layoutArc);
  let rot = 0, vel = reduce ? 0 : -0.05, dragging = false, moved = 0, lastX = 0;
  const renderArc = () => {
    cards.forEach((c, i) => {
      const a = (((i * STEP + rot) % 360) + 540) % 360 - 180;      // -180..180, 0 = front centre
      const r = a * Math.PI / 180;
      const vis = Math.abs(a) < 105;
      const f = Math.max(0, Math.cos(r));
      c.style.visibility = vis ? "visible" : "hidden";
      if (!vis) return;
      const x = Math.sin(r) * RX, y = (1 - Math.cos(r)) * RY;
      c.style.transform = `translate3d(${x}px,${y}px,0) rotate(${a * 0.16}deg) rotateY(${a * -0.2}deg) scale(${0.8 + 0.25 * f})`;
      c.style.zIndex = Math.round(f * 100);
      c.style.filter = `brightness(${0.5 + 0.5 * f})`;
      c.style.opacity = Math.min(1, f * 1.6 + 0.15).toFixed(3);
      c.style.pointerEvents = f > 0.3 ? "auto" : "none";
    });
  };
  const arcLoop = () => {
    if (!dragging) { rot += vel; vel += ((reduce ? 0 : -0.05) - vel) * 0.03; }
    renderArc();
    requestAnimationFrame(arcLoop);
  };
  arcLoop();
  arc.addEventListener("pointerdown", (e) => {
    dragging = true; moved = 0; lastX = e.clientX; arc.classList.add("drag");
  });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
    rot += dx * 0.09; vel = dx * 0.09;
  });
  addEventListener("pointerup", () => { if (dragging) { dragging = false; arc.classList.remove("drag"); } });
  arc.addEventListener("click", (e) => {
    const c = e.target.closest(".arc-card");
    e.preventDefault();
    if (c && moved < 8) openCase(c.dataset.open);
  });

  /* ---------------- brands strip ---------------- */
  const names = P.filter((p) => p.id !== "portfolio" && p.id !== "logofolio").map((p) => `<span style="--sw:${p.accent}">${p.title}</span>`).join("");
  $("#strip").innerHTML = names + names;

  /* ---------------- reveals & counters ---------------- */
  const rev = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); }
  }), { threshold: 0.2 });
  const watch = (root = document) => $$(".reveal,.sec-head,.ruler", root).forEach((el) => rev.observe(el));
  const cntObs = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || "", from = end > 1000 ? end - 30 : 0, s = performance.now();
    const step = (t) => { const k = Math.min(1, (t - s) / 1500), e = 1 - (1 - k) ** 3; el.textContent = Math.round(from + (end - from) * e) + (k === 1 ? suf : ""); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); cntObs.unobserve(el);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => cntObs.observe(el));

  /* manifesto */
  const man = $("#manifesto");
  man.innerHTML = man.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  const mw = $$(".w", man);
  const lightUp = () => {
    const r = man.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3)));
    const n = Math.round(p * mw.length);
    mw.forEach((w, i) => w.classList.toggle("lit", i < n));
  };
  addEventListener("scroll", lightUp, { passive: true }); lightUp();

  /* ---------------- stacked case cards ---------------- */
  const FEAT = [
    { id: "nobilia", bg: "#ece5d8", ink: "#17140f", client: "Brand identity" },
    { id: "ethra", bg: "#0f3440", ink: "#e8f5f7", client: "Ethra Human Resources" },
    { id: "markethome", bg: "#ff9f5a", ink: "#1a0e05", client: "Retail brand" },
    { id: "mfa", bg: "#1f2c22", ink: "#eaf2e4", client: "Fashion brand" },
    { id: "osool", bg: "#1a2637", ink: "#f2e4c8", client: "Real estate · Sadat City" }
  ];
  const catName = { branding: "Branding", social: "Social media", advertising: "Advertising" };
  $("#stack").innerHTML = FEAT.map((f, i) => {
    const p = byId(f.id);
    return `<article class="case-card" data-open="${p.id}" tabindex="0" role="button" aria-label="Open ${p.title} case study" style="--i:${i};--cbg:${f.bg};--cink:${f.ink}">
      <div>
        <span class="client">${f.client}</span>
        <h3>${p.title}</h3>
        <p class="desc">${p.blurb}</p>
        <dl class="meta">
          <div><dt>Discipline</dt><dd>${p.kind}</dd></div>
          <div><dt>Year</dt><dd>${p.year}</dd></div>
          <div class="wide"><dt>Scope</dt><dd>${p.cats.map((c) => catName[c]).join(" · ")} · ${p.images.length} visuals</dd></div>
        </dl>
        <span class="read"><i>→</i>Open case study</span>
      </div>
      <div class="case-media">
        ${imgTag(img(p.images[0], "1400_webp"), p.title, "", cover(p.cover))}
        ${p.images[2] ? imgTag(img(p.images[2], "1400_webp"), "", "b") : ""}
        <span class="case-count">${p.images.length} images</span>
        <div class="case-thumbs">${p.images.slice(3, 6).map((f2) => imgTag(img(f2), "")).join("")}</div>
      </div>
    </article>`;
  }).join("");
  const stackCards = $$(".case-card");
  const stackScale = () => {
    stackCards.forEach((c, i) => {
      const next = stackCards[i + 1];
      if (!next) { c.style.transform = ""; return; }
      const top = parseFloat(getComputedStyle(c).top);
      const d = next.getBoundingClientRect().top - top;      // distance of next card to this one's sticky line
      const k = Math.min(1, Math.max(0, 1 - d / c.offsetHeight));
      c.style.transform = `scale(${1 - k * 0.05})`;
      c.style.filter = `brightness(${1 - k * 0.35})`;
    });
  };
  addEventListener("scroll", stackScale, { passive: true }); stackScale();

  /* ---------------- more grid ---------------- */
  const rest = P.filter((p) => !FEAT.some((f) => f.id === p.id));
  $("#grid").innerHTML = rest.map((p) => `
    <article class="card reveal" data-open="${p.id}" data-cats="${p.cats.join(" ")}" tabindex="0" role="button" aria-label="Open ${p.title}" style="--ca:${p.accent}">
      <div class="card-media">${imgTag(cover(p.cover), p.title, "", img(p.images[0]))}${p.images[1] ? imgTag(img(p.images[1]), "", "b") : ""}</div>
      <div class="card-body"><span class="k">${p.kind} · ${p.year}</span><h3>${p.title}<span>↗</span></h3><p>${p.blurb}</p></div>
    </article>`).join("");
  $$(".chip").forEach((ch) => ch.addEventListener("click", () => {
    $$(".chip").forEach((x) => { x.classList.toggle("on", x === ch); x.setAttribute("aria-selected", x === ch); });
    const f = ch.dataset.filter;
    $$("#grid .card").forEach((c) => c.classList.toggle("hide", !(f === "all" || c.dataset.cats.includes(f))));
  }));

  /* ---------------- wall of frames ---------------- */
  const pool = [];
  P.forEach((p) => p.images.slice(1, 10).forEach((f) => pool.push({ p, f })));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const renderWall = () => {
    const seen = new Set(), pick = [];
    for (const it of shuffle(pool.slice())) { if (!seen.has(it.p.id)) { seen.add(it.p.id); pick.push(it); } if (pick.length === 8) break; }
    $("#frames").innerHTML = pick.map(({ p, f }, i) => `
      <li class="frame" data-open="${p.id}" style="--rot:${(i % 2 ? 1 : -1) * (0.6 + Math.random() * 1.2)}deg">
        <div>${imgTag(img(f), p.title)}</div><p><span>${p.title}</span><span>${p.year}</span></p>
      </li>`).join("");
  };
  renderWall();
  $("#shuffle").addEventListener("click", renderWall);

  /* ---------------- pixel icons ---------------- */
  const ICONS = {
    search: ["....XXXX....", "..XX....XX..", ".X........X.", ".X........X.", "X..........X", "X..........X", ".X........X.", ".X........X.", "..XX....XXX.", "....XXXX..XX", "...........X", "............"],
    pen:    ["........XX..", ".......X..X.", "......X..X..", ".....X..X...", "....X..X....", "...X..X.....", "..X..X......", ".XX.X.......", ".X.X........", "XXX.........", "X...........", "............"],
    grid:   ["XXXX.XXXX...", "X..X.X..X...", "X..X.X..X...", "XXXX.XXXX...", "............", "XXXX.XXXX...", "X..X.X..X...", "X..X.X..X...", "XXXX.XXXX...", "............", "............", "............"],
    rocket: [".....XX.....", "....X..X....", "....X..X....", "...X.XX.X...", "...X.XX.X...", "...X....X...", "..XX....XX..", ".X.X....X.X.", ".X.XXXXXX.X.", "....X..X....", ".....XX.....", "....X..X...."]
  };
  $$(".px").forEach((el) => {
    const m = ICONS[el.dataset.icon]; if (!m) return;
    let r = "";
    m.forEach((row, y) => [...row].forEach((c, x) => { if (c === "X") r += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
    el.innerHTML = `<svg viewBox="0 0 12 12" fill="${el.dataset.icon === "rocket" ? "#9d8cff" : "#f3f1ec"}">${r}</svg>`;
  });

  /* ---------------- experience ruler ---------------- */
  const Y0 = 2016, Y1 = 2027, n = Y1 - Y0;
  const bars = [
    { t: "Al-Menoufia University · B.A.", a: 2016, b: 2020.5, row: 0, cls: "soft" },
    { t: "LAVIO PRINT", a: 2019.67, b: 2020.17, row: 1, cls: "soft" },
    { t: "Freelance · Remote", a: 2022.25, b: 2026.95, row: 0, cls: "hot" },
    { t: "Vendo", a: 2022.42, b: 2023.25, row: 1, cls: "" },
    { t: "Handile Agency", a: 2023.25, b: 2025.75, row: 1, cls: "" },
    { t: "DGlab", a: 2025.33, b: 2026.67, row: 2, cls: "" },
    { t: "OMC Kuwait", a: 2025.75, b: 2026.25, row: 1, cls: "" }
  ];
  const ruler = $("#ruler");
  ruler.style.setProperty("--n", n); ruler.style.setProperty("--rows", 3);
  ruler.innerHTML = `<div class="r-years">${Array.from({ length: n }, (_, i) => `<span>${i === 0 || (Y0 + i) % 5 === 0 ? Y0 + i : String(Y0 + i).slice(2)}</span>`).join("")}</div>
    <div class="r-bars">${bars.map((b, i) => `<span class="r-bar ${b.cls}" style="left:${(b.a - Y0) / n * 100}%;width:${(b.b - b.a) / n * 100}%;top:${8 + b.row * 30}px;transition-delay:${i * 0.15}s" title="${b.t}">${b.t}</span>`).join("")}</div>`;

  watch();

  /* ---------------- case modal ---------------- */
  const caseEl = $("#case"), caseScroll = $("#caseScroll"), gal = $("#caseGallery");
  let ci = 0, lastFocus = null;
  const galObs = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); galObs.unobserve(en.target); } }), { root: caseScroll, threshold: 0.05 });
  function openCase(id) {
    ci = Math.max(0, P.findIndex((p) => p.id === id));
    const p = P[ci];
    if (caseEl.hidden) lastFocus = document.activeElement;
    caseEl.style.setProperty("--ca", p.accent);
    $("#caseKind").textContent = `${p.kind} · ${p.year}`;
    $("#caseTitle").textContent = p.title;
    $("#caseBlurb").textContent = p.blurb;
    $("#caseBehance").href = $("#caseBehance2").href = p.url;
    gal.innerHTML = p.images.map((f, i) => `<figure data-i="${i}">${imgTag(img(f), `${p.title}, image ${i + 1}`)}</figure>`).join("");
    $$("figure", gal).forEach((f) => galObs.observe(f));
    caseEl.hidden = false; caseScroll.scrollTop = 0;
    requestAnimationFrame(() => caseEl.classList.add("open"));
    lenis && lenis.stop(); document.body.style.overflow = "hidden";
    $("#caseClose").focus({ preventScroll: true });
    history.replaceState(null, "", "#project-" + p.id);
  }
  function closeCase() {
    caseEl.classList.remove("open");
    setTimeout(() => (caseEl.hidden = true), 400);
    lenis && lenis.start(); document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  const stepCase = (d) => openCase(P[(ci + d + P.length) % P.length].id);
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (!t || t.classList.contains("arc-card")) return;
    e.preventDefault(); openCase(t.dataset.open);
  });
  document.addEventListener("keydown", (e) => {
    const t = e.target.closest && e.target.closest("[data-open][tabindex]");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCase(t.dataset.open); }
  });
  $("#caseClose").addEventListener("click", closeCase);
  $("#casePrev").addEventListener("click", () => stepCase(-1));
  $("#caseNext").addEventListener("click", () => stepCase(1));
  caseEl.addEventListener("click", (e) => { if (e.target === caseScroll) closeCase(); });
  $("#caseBrief").addEventListener("click", () => {
    const p = P[ci];
    selectOpt("need", { branding: "Brand identity", social: "Social media", advertising: "Advertising" }[p.cats[0]]);
    $("#fMsg").value = `I loved your ${p.title} project and want something similar.`;
    updateBrief();
  });
  const hm = location.hash.match(/^#project-(.+)/);
  if (hm) setTimeout(() => openCase(hm[1]), 2100);

  /* lightbox */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let li = 0;
  const lbShow = (i) => { const p = P[ci]; li = (i + p.images.length) % p.images.length; lbImg.src = img(p.images[li], "1400_webp"); lbImg.alt = `${p.title}, image ${li + 1}`; lbCap.textContent = `${p.title} · ${li + 1} / ${p.images.length}`; };
  gal.addEventListener("click", (e) => { const f = e.target.closest("figure"); if (f) { lbShow(+f.dataset.i); lb.hidden = false; } });
  $("#lbClose").addEventListener("click", () => (lb.hidden = true));
  $("#lbPrev").addEventListener("click", () => lbShow(li - 1));
  $("#lbNext").addEventListener("click", () => lbShow(li + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.hidden = true; });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) lbShow(li + (d < 0 ? 1 : -1)); });
  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) { if (e.key === "Escape") lb.hidden = true; if (e.key === "ArrowRight") lbShow(li + 1); if (e.key === "ArrowLeft") lbShow(li - 1); }
    else if (!caseEl.hidden) { if (e.key === "Escape") closeCase(); if (e.key === "ArrowRight") stepCase(1); if (e.key === "ArrowLeft") stepCase(-1); }
  });

  /* ---------------- brief builder ---------------- */
  const state = { need: [], timeline: "", budget: "" };
  function selectOpt(name, label) {
    const g = $(`.opts[data-name="${name}"]`);
    $$(".opt", g).forEach((o) => { if (o.textContent === label && !o.classList.contains("on")) o.click(); });
  }
  $$(".opts").forEach((g) => {
    const name = g.dataset.name, multi = !!g.dataset.multi;
    $$(".opt", g).forEach((o) => o.addEventListener("click", () => {
      if (multi) { o.classList.toggle("on"); state[name] = $$(".opt.on", g).map((x) => x.textContent); }
      else { $$(".opt", g).forEach((x) => x.classList.toggle("on", x === o)); state[name] = o.textContent; }
      updateBrief();
    }));
  });
  ["fName", "fMsg"].forEach((id) => $("#" + id).addEventListener("input", updateBrief));
  function updateBrief() {
    const nm = $("#fName").value.trim(), msg = $("#fMsg").value.trim();
    $("#sName").textContent = nm || "—";
    $("#sNeed").textContent = state.need.join(", ") || "—";
    $("#sTime").textContent = state.timeline || "—";
    $("#sBudget").textContent = state.budget || "—";
    const v = Math.round([state.need.length, state.timeline, state.budget, nm, msg].filter(Boolean).length / 5 * 100);
    $("#fuel").style.width = v + "%"; $("#sumPct").textContent = v + "%";
  }
  const briefText = () => ["Hi Khaled 👋 — new project brief from your website:", `• Name/brand: ${$("#fName").value.trim() || "-"}`, `• Need: ${state.need.join(", ") || "-"}`, `• Timeline: ${state.timeline || "-"}`, `• Budget: ${state.budget || "-"}`, `• Details: ${$("#fMsg").value.trim() || "-"}`].join("\n");
  $("#sendWa").addEventListener("click", (e) => {
    const b = e.currentTarget; b.classList.add("launching");
    setTimeout(() => { window.open("https://wa.me/201552309125?text=" + encodeURIComponent(briefText()), "_blank", "noopener"); b.classList.remove("launching"); }, 450);
  });
  $("#sendMail").addEventListener("click", () => {
    location.href = "mailto:khaledamgadhabib@gmail.com?subject=" + encodeURIComponent("New design project brief") + "&body=" + encodeURIComponent(briefText());
  });

  /* ---------------- copy email, clock ---------------- */
  const toast = $("#toast");
  $$(".copy").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); toast.textContent = "Email copied"; }
    catch { location.href = "mailto:" + b.dataset.copy; return; }
    toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800);
  }));
  const clock = $("#clock");
  const tick2 = () => { try { clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }).format(new Date()); } catch {} };
  tick2(); setInterval(tick2, 30000);
  $("#year").textContent = new Date().getFullYear();
})();
