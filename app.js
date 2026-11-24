/* =========================================================
   KAH — interactions
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const P = window.PROJECTS || [];
  const { img, cover } = window.KAH_IMG;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none), (pointer: coarse)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const root = document.documentElement;

  /* ---------------- loader ---------------- */
  const loader = $("#loader");
  $$(".loader-logo path").forEach((p, i) => {
    const len = Math.ceil(p.getTotalLength());
    p.style.setProperty("--len", len);
    p.style.animationDelay = `${i * 0.06}s, ${1.3 + i * 0.04}s`;
  });
  const countEl = $("#loaderCount");
  let pct = 0;
  const tick = setInterval(() => {
    pct = Math.min(100, pct + Math.ceil(Math.random() * 9));
    countEl.textContent = String(pct).padStart(2, "0");
    if (pct >= 100) clearInterval(tick);
  }, 70);
  const start = performance.now();
  const finish = () => {
    const wait = Math.max(0, 2100 - (performance.now() - start));
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.remove("is-loading");
      document.body.classList.add("ready");
      if (hasGSAP) ScrollTrigger.refresh();
    }, reduce ? 0 : wait);
  };
  if (document.readyState === "complete") finish(); else addEventListener("load", finish);
  setTimeout(finish, 5000); // safety

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const scrollTo = (target) => {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    e.preventDefault();
    closeMenu();
    if (!$("#case").hidden) closeCase();
    scrollTo(id === "#top" ? document.body : id);
  }));

  /* ---------------- starfield ---------------- */
  const cv = $("#space"), cx = cv.getContext("2d");
  let W, H, DPR, stars = [], shooting = null, mx = 0, my = 0, smx = 0, smy = 0, sy = 0;
  const resize = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
    const n = Math.round((innerWidth * innerHeight) / 5200);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      z: Math.random() * 0.9 + 0.1,               // depth 0.1 (far) – 1 (near)
      tw: Math.random() * Math.PI * 2, ts: 0.5 + Math.random() * 1.5
    }));
  };
  resize(); addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  let lastScroll = scrollY, vel = 0;
  const draw = (t) => {
    const s = scrollY; vel += ((s - lastScroll) - vel) * 0.1; lastScroll = s;
    smx += (mx - smx) * 0.04; smy += (my - smy) * 0.04;
    cx.clearRect(0, 0, W, H);
    for (const st of stars) {
      const px = (st.x - smx * 60 * st.z * DPR) % W;
      let py = (st.y - s * 0.08 * st.z * DPR - smy * 40 * st.z * DPR) % H;
      if (py < 0) py += H;
      const a = 0.35 + 0.65 * Math.abs(Math.sin(st.tw + t * 0.001 * st.ts));
      const r = st.z * 1.3 * DPR;
      cx.globalAlpha = a * st.z;
      cx.fillStyle = "#fff";
      const stretch = Math.min(9, Math.abs(vel) * st.z * 0.25) * DPR;
      if (stretch > 1.5) { cx.fillRect((px + W) % W, py, r, r + stretch); }
      else { cx.beginPath(); cx.arc((px + W) % W, py, r, 0, 6.283); cx.fill(); }
    }
    // occasional shooting star
    if (!shooting && Math.random() < 0.0025) shooting = { x: Math.random() * W, y: Math.random() * H * 0.5, l: 0, max: 200 + Math.random() * 200 };
    if (shooting) {
      shooting.l += 14 * DPR;
      const { x, y, l } = shooting;
      const g = cx.createLinearGradient(x + l, y + l * 0.45, x + l - 120 * DPR, y + l * 0.45 - 54 * DPR);
      g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
      cx.globalAlpha = 1 - l / (shooting.max * DPR); cx.strokeStyle = g; cx.lineWidth = 1.4 * DPR;
      cx.beginPath(); cx.moveTo(x + l, y + l * 0.45); cx.lineTo(x + l - 120 * DPR, y + l * 0.45 - 54 * DPR); cx.stroke();
      if (l > shooting.max * DPR) shooting = null;
    }
    cx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);

  /* ---------------- cursor ---------------- */
  const cur = $("#cursor"), curLabel = $(".cursor-label");
  if (!touch) {
    let x = innerWidth / 2, y = innerHeight / 2, cx2 = x, cy2 = y;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
    const loop = () => { cx2 += (x - cx2) * 0.2; cy2 += (y - cy2) * 0.2; cur.style.transform = `translate(${cx2}px,${cy2}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener("pointerover", (e) => {
      const v = e.target.closest("[data-cursor]");
      const h = e.target.closest("a,button,.opt,.chip");
      cur.classList.toggle("is-view", !!v);
      cur.classList.toggle("is-hover", !v && !!h);
      if (v) curLabel.textContent = v.dataset.cursor;
    });
  }

  /* ---------------- nav + menu ---------------- */
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  let lastY = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    nav.classList.toggle("hide", y > lastY && y > 400 && !menu.classList.contains("open"));
    lastY = y;
  }, { passive: true });
  function closeMenu() { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", () => {
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", String(open));
  });

  /* ---------------- chapters: rail, hue, active link ---------------- */
  const railNum = $("#railNum"), railName = $("#railName"), railFill = $("#railFill");
  const chapters = $$(".chapter");
  const chObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const c = en.target;
      railNum.textContent = c.dataset.chapter; railName.textContent = c.dataset.name;
      root.style.setProperty("--hue", c.dataset.hue);
      $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + c.id));
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  chapters.forEach((c) => chObs.observe(c));
  addEventListener("scroll", () => {
    const p = scrollY / (document.documentElement.scrollHeight - innerHeight);
    railFill.style.height = (p * 100).toFixed(1) + "%";
  }, { passive: true });

  /* ---------------- hero rotator + planet parallax ---------------- */
  const words = $$("#rotator b"); let wi = 0;
  words[0].classList.add("on");
  setInterval(() => {
    const cur = words[wi]; cur.classList.remove("on"); cur.classList.add("out");
    setTimeout(() => cur.classList.remove("out"), 800);
    wi = (wi + 1) % words.length; words[wi].classList.add("on");
  }, 2400);
  const planet = $("#planet");
  if (!touch) addEventListener("pointermove", (e) => {
    const rx = (e.clientX / innerWidth - 0.5), ry = (e.clientY / innerHeight - 0.5);
    planet.style.translate = `${rx * -24}px ${ry * -24}px`;
  });

  /* ---------------- manifesto word lighting ---------------- */
  const man = $("#manifesto");
  man.innerHTML = man.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join("");
  const mWords = $$(".w", man);
  const lightWords = () => {
    const r = man.getBoundingClientRect();
    const prog = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(prog * mWords.length);
    mWords.forEach((w, i) => w.classList.toggle("lit", i < n));
  };
  addEventListener("scroll", lightWords, { passive: true }); lightWords();

  /* ---------------- reveal on scroll ---------------- */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); revObs.unobserve(en.target); }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  const watchReveals = (c = document) => $$(".from-left,.from-right,.from-bottom,.step", c).forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.08 + "s"; revObs.observe(el);
  });
  watchReveals();

  /* ---------------- counters ---------------- */
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
      const from = end > 1000 ? end - 40 : 0, t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(from + (end - from) * e) + (k === 1 ? suf : "");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step); cntObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => cntObs.observe(el));

  /* ---------------- service spotlight ---------------- */
  $$(".service").forEach((s) => s.addEventListener("pointermove", (e) => {
    const r = s.getBoundingClientRect();
    s.style.setProperty("--mx", e.clientX - r.left + "px"); s.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  /* ---------------- image helper ---------------- */
  const imgTag = (src, alt, cls = "", fallback = "") =>
    `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" class="${cls}" ${fallback ? `onerror="this.onerror=null;this.src='${fallback}'"` : ""} />`;
  const coverSrc = (p) => cover(p.cover);
  const coverFallback = (p) => img(p.images[0]);

  /* ---------------- featured horizontal track ---------------- */
  const FEATURED = ["nobilia", "ethra", "markethome", "mfa", "vivy", "osool"];
  const track = $("#htrack");
  track.innerHTML = FEATURED.map((id, i) => {
    const p = P.find((x) => x.id === id); if (!p) return "";
    const heroImg = img(p.images[0], "1400_webp");
    return `<article class="feature" data-id="${p.id}" data-cursor="Open" tabindex="0" role="button" aria-label="Open ${p.title} project" style="--fa:${p.accent}">
      <span class="feature-index">${String(i + 1).padStart(2, "0")} / ${String(FEATURED.length).padStart(2, "0")}</span>
      <div class="feature-media">${imgTag(heroImg, p.title + " — " + p.kind, "", coverSrc(p))}</div>
      <div class="feature-info"><div><span class="mono">${p.kind} · ${p.year}</span><h3>${p.title}</h3><p>${p.blurb}</p></div><span class="feature-open" aria-hidden="true">↗</span></div>
    </article>`;
  }).join("") + `<div class="end-card"><span class="mono" style="color:var(--accent)">More in the archive</span><h3>${P.length} projects.<br/>One designer.</h3><a href="#archive" class="btn btn-ghost">Browse all ↓</a></div>`;

  if (hasGSAP && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    const hs = $("#hscroll");
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: hs, start: "center center", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    // inner parallax on each feature image
    $$(".feature-media", track).forEach((m) => {
      gsap.fromTo(m, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: m.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
    });
  } else {
    $("#hscroll").style.overflowX = "auto";
  }

  /* ---------------- marquee constellation ---------------- */
  const pool = [];
  P.forEach((p) => p.images.slice(1, 4).forEach((f) => pool.push({ p, f })));
  const half = Math.ceil(pool.length / 2);
  const mqFill = (el, items) => {
    const html = items.map(({ p, f }) => `<div class="mq-item" data-id="${p.id}" data-cursor="Open">${imgTag(img(f), p.title)}</div>`).join("");
    el.innerHTML = html + html; // duplicate for seamless loop
  };
  mqFill($("#mq1"), pool.slice(0, half));
  mqFill($("#mq2"), pool.slice(half));
  const mqs = $$(".marquee").map((m) => ({ el: $(".mq-inner", m), dir: +m.dataset.dir, x: 0 }));
  let mqVel = 0, mqLast = scrollY;
  const mqLoop = () => {
    const d = scrollY - mqLast; mqLast = scrollY; mqVel += (d - mqVel) * 0.08;
    mqs.forEach((m) => {
      const w = m.el.scrollWidth / 2;
      m.x += (0.5 + Math.abs(mqVel) * 0.25) * m.dir;
      if (m.x <= -w) m.x += w; if (m.x > 0) m.x -= w;
      m.el.style.transform = `translate3d(${m.x}px,0,0)`;
    });
    requestAnimationFrame(mqLoop);
  };
  if (!reduce) { mqs[1].x = -500; mqLoop(); }

  /* ---------------- archive grid ---------------- */
  const grid = $("#grid");
  grid.innerHTML = P.map((p) => `
    <article class="card from-bottom" data-id="${p.id}" data-cats="${p.cats.join(" ")}" data-cursor="Open" tabindex="0" role="button" aria-label="Open ${p.title} project" style="--ca:${p.accent}">
      <div class="card-media">
        ${imgTag(coverSrc(p), p.title, "", coverFallback(p))}
        ${p.images[1] ? imgTag(img(p.images[1]), "", "alt") : ""}
        <span class="card-badge">${p.year}</span>
      </div>
      <div class="card-body"><div><span class="mono">${p.kind}</span><h3>${p.title}</h3></div><span class="card-count">${p.images.length} img ↗</span></div>
    </article>`).join("");
  watchReveals(grid);

  // tilt
  if (!touch && !reduce) $$(".card", grid).forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });

  // filters
  $$(".chip").forEach((ch) => ch.addEventListener("click", () => {
    $$(".chip").forEach((x) => { x.classList.toggle("is-on", x === ch); x.setAttribute("aria-selected", x === ch); });
    const f = ch.dataset.filter;
    $$(".card", grid).forEach((c) => {
      const show = f === "all" || c.dataset.cats.includes(f);
      c.classList.toggle("hide", !show);
      if (show) { c.classList.remove("in"); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add("in"))); }
    });
    if (hasGSAP) ScrollTrigger.refresh();
  }));

  /* ---------------- case study modal ---------------- */
  const caseEl = $("#case"), caseScroll = $("#caseScroll"), gal = $("#caseGallery");
  let curIdx = 0, lastFocus = null;
  const galObs = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); galObs.unobserve(en.target); } }), { root: caseScroll, threshold: 0.1 });

  function openCase(id) {
    curIdx = Math.max(0, P.findIndex((p) => p.id === id));
    const p = P[curIdx];
    lastFocus = document.activeElement;
    caseEl.style.setProperty("--ca", p.accent);
    $("#caseKind").textContent = `${p.kind} · ${p.year}`;
    $("#caseTitle").textContent = p.title;
    $("#caseBlurb").textContent = p.blurb;
    $("#caseBehance").href = $("#caseBehance2").href = p.url;
    gal.innerHTML = p.images.map((f, i) => `<figure data-i="${i}">${imgTag(img(f), `${p.title} — image ${i + 1}`)}</figure>`).join("");
    $$("figure", gal).forEach((f) => galObs.observe(f));
    caseEl.hidden = false; caseScroll.scrollTop = 0;
    requestAnimationFrame(() => caseEl.classList.add("open"));
    lenis && lenis.stop(); document.body.style.overflow = "hidden";
    $("#caseClose").focus({ preventScroll: true });
    history.replaceState(null, "", "#project-" + p.id);
  }
  function closeCase() {
    caseEl.classList.remove("open");
    setTimeout(() => { caseEl.hidden = true; }, 450);
    lenis && lenis.start(); document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  const step = (d) => { curIdx = (curIdx + d + P.length) % P.length; openCase(P[curIdx].id); };
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".feature,.card,.mq-item");
    if (t && t.dataset.id) openCase(t.dataset.id);
  });
  document.addEventListener("keydown", (e) => {
    const t = e.target.closest && e.target.closest(".feature,.card");
    if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCase(t.dataset.id); }
  });
  $("#caseClose").addEventListener("click", closeCase);
  $("#casePrev").addEventListener("click", () => step(-1));
  $("#caseNext").addEventListener("click", () => step(1));
  $("#caseBrief").addEventListener("click", () => {
    const p = P[curIdx];
    const map = { branding: "Brand identity", social: "Social media", advertising: "Advertising" };
    selectOpt("need", map[p.cats[0]]);
    $("#fMsg").value = `I loved your ${p.title} project and want something similar.`;
    updateBrief();
  });
  caseEl.addEventListener("click", (e) => { if (e.target === caseScroll) closeCase(); });
  // open from URL (#project-osool)
  const fromHash = location.hash.match(/^#project-(.+)/);
  if (fromHash) setTimeout(() => openCase(fromHash[1]), 2300);

  /* ---------------- lightbox ---------------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let lbI = 0;
  const lbShow = (i) => {
    const p = P[curIdx]; lbI = (i + p.images.length) % p.images.length;
    lbImg.src = img(p.images[lbI], "1400_webp"); lbImg.alt = `${p.title} — image ${lbI + 1}`;
    lbCap.textContent = `${p.title} · ${lbI + 1} / ${p.images.length}`;
  };
  gal.addEventListener("click", (e) => { const f = e.target.closest("figure"); if (!f) return; lbShow(+f.dataset.i); lb.hidden = false; });
  $("#lbClose").addEventListener("click", () => (lb.hidden = true));
  $("#lbPrev").addEventListener("click", () => lbShow(lbI - 1));
  $("#lbNext").addEventListener("click", () => lbShow(lbI + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.hidden = true; });
  let tx = 0;
  lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) lbShow(lbI + (d < 0 ? 1 : -1)); });
  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) {
      if (e.key === "Escape") lb.hidden = true;
      if (e.key === "ArrowRight") lbShow(lbI + 1);
      if (e.key === "ArrowLeft") lbShow(lbI - 1);
    } else if (!caseEl.hidden) {
      if (e.key === "Escape") closeCase();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    } else if (e.key === "Escape") closeMenu();
  });

  /* ---------------- trajectory comet ---------------- */
  const path = $("#path"), pathFill = $("#pathFill"), comet = $("#comet");
  const pathUpdate = () => {
    const r = path.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    pathFill.style.height = p * 100 + "%"; comet.style.top = p * 100 + "%";
  };
  addEventListener("scroll", pathUpdate, { passive: true }); pathUpdate();

  /* ---------------- brief builder ---------------- */
  const state = { need: [], timeline: "", budget: "" };
  function selectOpt(name, label) {
    const group = $(`.opts[data-name="${name}"]`);
    $$(".opt", group).forEach((o) => {
      if (o.textContent === label) {
        if (group.dataset.multi) { if (!o.classList.contains("on")) o.click(); }
        else o.click();
      }
    });
  }
  $$(".opts").forEach((g) => {
    const name = g.dataset.name, multi = !!g.dataset.multi;
    $$(".opt", g).forEach((o) => o.addEventListener("click", () => {
      if (multi) {
        o.classList.toggle("on");
        state[name] = $$(".opt.on", g).map((x) => x.textContent);
      } else {
        $$(".opt", g).forEach((x) => x.classList.toggle("on", x === o));
        state[name] = o.textContent;
      }
      updateBrief();
    }));
  });
  ["fName", "fMsg"].forEach((id) => $("#" + id).addEventListener("input", updateBrief));
  function updateBrief() {
    const name = $("#fName").value.trim(), msg = $("#fMsg").value.trim();
    $("#sName").textContent = name || "—";
    $("#sNeed").textContent = state.need.join(", ") || "—";
    $("#sTime").textContent = state.timeline || "—";
    $("#sBudget").textContent = state.budget || "—";
    const filled = [state.need.length, state.timeline, state.budget, name, msg].filter(Boolean).length;
    const pctv = Math.round((filled / 5) * 100);
    $("#fuel").style.width = pctv + "%"; $("#sumPct").textContent = pctv + "%";
  }
  const briefText = () => [
    "Hi Khaled 👋 — new project brief from your website:",
    `• Name/brand: ${$("#fName").value.trim() || "-"}`,
    `• Need: ${state.need.join(", ") || "-"}`,
    `• Timeline: ${state.timeline || "-"}`,
    `• Budget: ${state.budget || "-"}`,
    `• Details: ${$("#fMsg").value.trim() || "-"}`
  ].join("\n");
  $("#sendWa").addEventListener("click", (e) => {
    const b = e.currentTarget; b.classList.add("launching");
    setTimeout(() => { window.open("https://wa.me/201552309125?text=" + encodeURIComponent(briefText()), "_blank", "noopener"); b.classList.remove("launching"); }, 650);
  });
  $("#sendMail").addEventListener("click", () => {
    location.href = "mailto:khaledamgadhabib@gmail.com?subject=" + encodeURIComponent("New design project brief") + "&body=" + encodeURIComponent(briefText());
  });

  $("#year").textContent = new Date().getFullYear();
  addEventListener("load", () => hasGSAP && ScrollTrigger.refresh());
})();
