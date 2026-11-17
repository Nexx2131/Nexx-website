// NEXX website: shared header/footer, coin tables, demo checkout, live downloads, motion.
(function () {
  "use strict";
  var D = window.NEXX;
  var page = document.body.getAttribute("data-page") || "";
  var root = document.documentElement;
  if (!root.classList.contains("js")) root.classList.add("js"); // normally set in <head>

  var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  // Preview switch: "?motion=full" plays the full animations in this tab even when the device asks
  // for reduced motion (e.g. Windows "Animation effects" off). "?motion=auto" goes back to the device setting.
  try {
    var mq = /[?&]motion=(full|auto)(&|$)/.exec(location.search);
    if (mq) { if (mq[1] === "full") sessionStorage.setItem("nxMotion", "full"); else sessionStorage.removeItem("nxMotion"); }
    if (reduce && sessionStorage.getItem("nxMotion") === "full") {
      reduce = false;
      Array.prototype.forEach.call(document.styleSheets, function (sh) {
        var rules; try { rules = sh.cssRules; } catch (err) { return; } // other sites' sheets (fonts) are not readable
        for (var i = rules.length - 1; i >= 0; i--) {
          if (rules[i].media && /prefers-reduced-motion:\s*reduce/.test(rules[i].media.mediaText)) sh.deleteRule(i);
        }
      });
    }
  } catch (err) { /* storage blocked: keep the device setting */ }
  // iPhone / iPad (iPadOS reports itself as a Mac with touch). "?as=iphone" previews that state on a PC.
  var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    /[?&]as=iphone(&|$)/.test(location.search);

  var ICON = {
    mark: '<svg viewBox="0 0 108 108"><path fill="#fff" d="M36,74V34h9l18,24V34h9v40h-9L45,50v24z"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 5v14l12-7z"/></svg>'
  };

  var NAV = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "bot", href: "nexx-bot.html", label: "NEXX Bot" },
    { id: "farm", href: "nexx-farm.html", label: "NEXX Farm" },
    { id: "coins", href: "coins.html", label: "Coins" },
    { id: "tutorials", href: "tutorials.html", label: "Tutorials" },
    { id: "downloads", href: "downloads.html", label: "Downloads" }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, rootEl) { return (rootEl || document).querySelector(sel); }
  function $all(sel, rootEl) { return Array.prototype.slice.call((rootEl || document).querySelectorAll(sel)); }
  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  // ---------- header + footer ----------
  function navLinks(withIndex) {
    return NAV.map(function (n, i) {
      return '<a href="' + n.href + '"' + (n.id === page ? ' class="on" aria-current="page"' : "") +
        (withIndex ? ' style="--i:' + i + '"' : "") + ">" + n.label + "</a>";
    }).join("");
  }
  function header() {
    return '' +
      '<div class="demo-bar"><b>Rough draft</b> · <span class="long">local preview, buying is a demo and takes no money</span><span class="short">demo only, no money taken</span></div>' +
      '<div class="wrap">' +
        '<a class="brand" href="index.html"><span class="mark">' + ICON.mark + '</span>NEXX</a>' +
        '<nav class="nav" aria-label="Main">' + navLinks(false) + '</nav>' +
        '<a class="btn small head-cta" href="coins.html">Buy coins</a>' +
        '<button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav">' +
          '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span></button>' +
      '</div>' +
      '<nav class="mobile-nav" id="mobile-nav" aria-label="Main"><div class="inner">' + navLinks(true) + '</div></nav>';
  }

  function footer() {
    return '' +
      '<div class="wrap">' +
        '<div class="cols">' +
          '<div><a class="brand" href="index.html" style="color:var(--ink)"><span class="mark">' + ICON.mark + '</span>NEXX</a>' +
          '<p class="muted small" style="margin-top:10px;max-width:420px">Bots for Clash of Clans that keep running while you are away. One NEXX account and one coin balance for every NEXX app.</p></div>' +
          '<div><b>Apps</b><a href="nexx-bot.html">NEXX Bot</a><a href="nexx-farm.html">NEXX Farm</a><a href="downloads.html">Downloads</a></div>' +
          '<div><b>Help</b><a href="tutorials.html">Tutorials</a><a href="coins.html">Coins</a><a href="' + esc(D.support.href) + '">' + esc(D.support.label) + '</a></div>' +
        '</div>' +
        '<p class="fine">NEXX is an independent tool, not made by or affiliated with Supercell. Follow the game\'s rules: NEXX cannot promise the game accepts automation or that an account stays unrestricted. NEXX coins are prepaid bot running time, not a currency or an investment.</p>' +
      '</div>';
  }

  var head = $("#site-head");
  if (head) {
    head.className = "site-head";
    head.innerHTML = header();
    var menuBtn = $(".menu-btn", head), mob = $(".mobile-nav", head);
    var setMenu = function (open) {
      mob.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function () { setMenu(!mob.classList.contains("open")); });
    mob.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    document.addEventListener("click", function (e) { if (!head.contains(e.target)) setMenu(false); });
    // Turning a phone or widening the window past the menu size closes it, so it never sticks open.
    if (window.matchMedia) {
      var wide = matchMedia("(min-width: 900px)");
      var onWide = function () { if (wide.matches) setMenu(false); };
      if (wide.addEventListener) wide.addEventListener("change", onWide); else if (wide.addListener) wide.addListener(onWide);
    }
    // Soft shadow under the header once the page is scrolled.
    var onScroll = function () { head.classList.toggle("scrolled", (window.scrollY || window.pageYOffset) > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  var foot = $("#site-foot");
  if (foot) { foot.className = "site-foot"; foot.innerHTML = footer(); }

  // ---------- hero title: each line slides up on its own ----------
  $all(".hero h1").forEach(function (h) {
    var lines = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = lines.map(function (l, i) {
      return '<span class="ln"><span style="--i:' + i + '">' + l.trim() + "</span></span>";
    }).join("");
  });

  // ---------- coin usage table ----------
  $all("[data-usage]").forEach(function (el) {
    var only = el.getAttribute("data-usage"); // "", "NEXX Bot" or "NEXX Farm"
    var rows = D.usage.filter(function (u) { return !only || u.app === only; });
    el.innerHTML = '<div class="table-wrap"><table><thead><tr>' +
      (only ? "" : "<th>App</th>") + "<th>Mode</th><th>Coins</th><th>For</th></tr></thead><tbody>" +
      rows.map(function (u) {
        // Cells are labelled so phones can show each row as a small card (see style.css "Phones").
        return "<tr>" + (only ? "" : '<td class="app">' + esc(u.app) + "</td>") + '<td class="mode">' + esc(u.mode) + '</td>' +
          '<td class="num">' + u.coins + '<span class="unit">' + (u.coins === 1 ? "coin" : "coins") + "</span></td>" +
          '<td class="per">' + esc(u.per) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  });

  // ---------- coin packages ----------
  function money(n) { return D.currency + n; }
  $all("[data-packages]").forEach(function (el) {
    el.innerHTML = D.packages.map(function (p) {
      return '<div class="tile pack' + (p.popular ? " popular" : "") + '">' +
        (p.popular ? '<span class="pill ink flag">Popular</span>' : "") +
        '<span class="eyebrow">' + esc(p.label) + "</span>" +
        '<div class="coins">' + p.coins + '</div><div class="muted">NEXX coins</div>' +
        '<p class="small muted">' + esc(p.note) + "</p>" +
        '<div class="spacer"></div>' +
        '<div><div class="price">' + money(p.price) + "</div>" +
        (D.pricesAreSamples ? '<div class="sample">sample price</div>' : "") + "</div>" +
        '<button class="btn block" type="button" data-buy="' + esc(p.id) + '">Buy ' + p.coins + " coins</button>" +
      "</div>";
    }).join("");
  });

  // ---------- coin burst from a Buy button ----------
  function burst(el) {
    if (reduce) return;
    var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (var i = 0; i < 12; i++) {
      var c = document.createElement("span"), a = -Math.PI * (0.1 + 0.8 * Math.random()), d = 70 + Math.random() * 90;
      c.className = "coin-fly";
      c.style.left = cx + "px"; c.style.top = cy + "px";
      c.style.setProperty("--x", (Math.cos(a) * d).toFixed(1) + "px");
      c.style.setProperty("--y", (Math.sin(a) * d).toFixed(1) + "px");
      c.style.setProperty("--r", Math.round(Math.random() * 360 - 180) + "deg");
      c.style.animationDelay = i * 12 + "ms";
      c.addEventListener("animationend", function () { this.remove(); });
      document.body.appendChild(c);
    }
  }

  // ---------- demo checkout ----------
  var modal = $("#checkout");
  if (modal) {
    var form = $("form", modal), done = $(".done-box", modal), current = null, opener = null;
    var submitBtn = $("[data-submit]", form);
    var payWrap = $("[data-pay]", modal);
    payWrap.innerHTML = D.payMethods.map(function (m, i) {
      return '<label class="opt"><input type="radio" name="pay" value="' + esc(m.id) + '"' + (i === 0 ? " checked" : "") + "> " + esc(m.label) + "</label>";
    }).join("");

    var openFor = function (id) {
      current = D.packages.filter(function (p) { return p.id === id; })[0];
      if (!current) return;
      $("[data-sum-coins]", modal).textContent = current.coins + " NEXX coins";
      $("[data-sum-price]", modal).textContent = money(current.price) + (D.pricesAreSamples ? " (sample)" : "");
      form.hidden = false; done.hidden = true;
      if (submitBtn) submitBtn.removeAttribute("data-state");
      $(".field", form).classList.remove("bad");
      modal.classList.remove("closing");
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(function () { $("#acct", form).focus({ preventScroll: true }); }, reduce ? 0 : 350);
    };
    var close = function () {
      if (!modal.classList.contains("open") || modal.classList.contains("closing")) return;
      var finish = function () {
        modal.classList.remove("open", "closing");
        document.body.style.overflow = "";
        if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
      };
      modal.classList.add("closing");
      setTimeout(finish, 220);
    };

    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-buy]");
      if (!b) return;
      opener = b;
      burst(b);
      var id = b.getAttribute("data-buy");
      if (reduce) openFor(id); else setTimeout(function () { openFor(id); }, 260);
    });
    $all("[data-close]", modal).forEach(function (b) { b.addEventListener("click", close); });
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submitBtn && submitBtn.getAttribute("data-state") === "busy") return;
      var input = $("#acct", form), field = input.closest(".field");
      var id = input.value.trim();
      // NEXX account IDs are 3-20 characters.
      if (id.length < 3 || id.length > 20) { replay(field, "bad"); input.focus(); return; }
      field.classList.remove("bad");
      if (submitBtn) submitBtn.setAttribute("data-state", "busy");
      setTimeout(function () {
        // Demo only: nothing is sent anywhere.
        $("[data-done-text]", modal).innerHTML = "In the finished site, <b>" + current.coins + " coins</b> would be added to the NEXX account <b>" + esc(id) + "</b> after payment. No payment was taken and nothing was sent.";
        form.hidden = true; done.hidden = false;
        if (submitBtn) submitBtn.removeAttribute("data-state");
      }, 700);
    });
  }

  // ---------- downloads: read each app's public update file ----------
  function fmtSize(b) { return (b / 1e6).toFixed(1) + " MB"; }
  function apkUrl(rel, m) { return /^https?:\/\//.test(m.apk) ? m.apk : rel.apkBase + m.apk; }

  // NEXX apps are Android APKs: an iPhone cannot install them, so say so instead of offering the file.
  function androidOnly(btn, note) {
    btn.setAttribute("aria-disabled", "true");
    btn.removeAttribute("href");
    btn.classList.add("android-only");
    var idle = $(".st-idle", btn);
    if (idle) idle.textContent = "Android only";
    if (note) {
      note.textContent = "NEXX apps run on Android. Open this page on the Android phone or emulator that will run the bot.";
      note.hidden = false;
    }
  }

  $all("[data-release]").forEach(function (card) {
    var key = card.getAttribute("data-release"), rel = D.releases[key];
    var btn = $("[data-dl]", card), ver = $("[data-ver]", card), meta = $("[data-meta]", card), dot = $(".status-dot", card);
    var note = $("[data-dl-note]", card), pill = dot ? dot.parentNode : null;
    if (IOS) androidOnly(btn, note);
    else if (rel.fallbackApk) { btn.href = rel.fallbackApk; btn.removeAttribute("aria-disabled"); }
    fetch(rel.updateJson + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (m) {
        if (!IOS) { btn.href = apkUrl(rel, m); btn.removeAttribute("aria-disabled"); }
        if (ver) ver.textContent = "v" + m.versionName;
        if (dot) dot.className = "status-dot live";
        if (pill) replay(pill, "pop");
        if (meta) meta.innerHTML =
          "<dt>Version</dt><dd>v" + esc(m.versionName) + " (build " + esc(m.versionCode) + ")</dd>" +
          "<dt>Size</dt><dd>" + fmtSize(m.size) + "</dd>" +
          "<dt>SHA-256</dt><dd><code>" + esc(String(m.sha256).slice(0, 16)) + "…</code></dd>";
      })
      .catch(function () {
        if (dot) dot.className = "status-dot off";
        if (ver) ver.textContent = rel.fallbackApk ? "latest" : "unavailable";
        if (meta) meta.innerHTML = "<dt>Status</dt><dd>Could not read the current version" + (rel.fallbackApk ? "; the button gives the latest release." : ". Ask the seller for the link.") + "</dd>";
      });
  });

  // The Download APK button is a real link: the browser starts the download as usual,
  // and the button plays busy -> done on top of it. It never cancels the click.
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-dl]");
    if (!a || a.getAttribute("aria-disabled") === "true") return;
    var href = a.getAttribute("href");
    if (!href || href === "#") return;
    if (a.getAttribute("data-state") === "busy") { e.preventDefault(); return; } // no double download
    clearTimeout(a._nxT);
    a.style.minWidth = a.offsetWidth + "px";
    a.setAttribute("data-state", "busy");
    var note = $("[data-dl-note]", a.closest("[data-release]") || document);
    a._nxT = setTimeout(function () {
      a.setAttribute("data-state", "done");
      if (note) {
        note.textContent = "Your browser may ask you to confirm the download. When it has finished, open the file to install.";
        note.hidden = false;
        replay(note, "dl-note");
      }
      a._nxT = setTimeout(function () { a.removeAttribute("data-state"); a.style.minWidth = ""; }, 6000);
    }, 1200);
  });

  // ---------- tutorial filter ----------
  var chips = $all(".chip[data-filter]");
  chips.forEach(function (c) {
    c.setAttribute("aria-pressed", c.classList.contains("on") ? "true" : "false");
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-filter");
      chips.forEach(function (x) {
        x.classList.toggle("on", x === c);
        x.setAttribute("aria-pressed", x === c ? "true" : "false");
      });
      $all("[data-topic]").forEach(function (t) {
        var show = f === "all" || t.getAttribute("data-topic").split(" ").indexOf(f) !== -1;
        t.hidden = !show;
        if (show) { t.classList.add("in"); replay(t, "pop"); }
      });
    });
  });
  // Open a tutorial from a link like tutorials.html#farm-setup
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) { var dt = $("details", target); if (dt) dt.open = true; }
  }

  // ---------- count up the coin numbers on the packs ----------
  function countUp(el) {
    var to = parseInt(el.textContent, 10);
    if (!(to > 0) || reduce || !window.requestAnimationFrame) return;
    var t0 = null, dur = 900;
    var step = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = p < 1 ? Math.round(to * (1 - Math.pow(1 - p, 3))) : to;
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  // ---------- scroll reveal ----------
  // Runs after the packs and tables above have been rendered, so they are included.
  var groups = [
    ["main .section-head", ""],
    ["main .grid > *", ""],
    ["main .wrap > .steps > li", "left"],
    ["main .wrap > [data-usage]", ""],
    ["main .wrap > .chips", ""]
  ];
  var revealEls = [];
  groups.forEach(function (g) {
    $all(g[0]).forEach(function (el) {
      if (el.hasAttribute("data-reveal")) return;
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.setAttribute("data-reveal", g[1]);
      el.style.setProperty("--d", Math.min(i, 6) * 80 + "ms");
      revealEls.push(el);
    });
  });
  var show = function (el) {
    el.classList.add("in");
    if (el.classList.contains("pack")) { var n = $(".coins", el); if (n) countUp(n); }
  };
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Printing or saving the page shows everything.
    window.addEventListener("beforeprint", function () { revealEls.forEach(function (el) { el.classList.add("in"); }); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- click ripple ----------
  document.addEventListener("pointerdown", function (e) {
    if (e.button !== undefined && e.button !== 0) return;
    var el = e.target.closest(".btn, .chip, .opt, .x, .menu-btn");
    if (!el || el.getAttribute("aria-disabled") === "true") return;
    var r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2, s = document.createElement("span");
    s.className = "rip-ink";
    s.style.width = s.style.height = size + "px";
    s.style.left = e.clientX - r.left - size / 2 + "px";
    s.style.top = e.clientY - r.top - size / 2 + "px";
    s.addEventListener("animationend", function () { s.remove(); });
    el.appendChild(s);
  });
})();
