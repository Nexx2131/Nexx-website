// NEXX website: shared header/footer, coin tables, the coin order form, live downloads, motion.
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
    play: '<svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 5v14l12-7z"/></svg>',
    // Brand glyphs from Simple Icons (CC0), https://simpleicons.org
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>'
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
      '<div class="demo-bar"><b>Early preview</b> · <span class="long">coin orders are confirmed by hand: DM @cocnexx after you order</span><span class="short">orders confirmed by DM</span></div>' +
      '<div class="wrap">' +
        '<a class="brand" href="index.html"><span class="mark">' + ICON.mark + '</span>NEXX</a>' +
        '<nav class="nav" aria-label="Main">' + navLinks(false) + '</nav>' +
        '<a class="btn small head-cta" href="coins.html">Buy coins</a>' +
        '<button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav">' +
          '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span></button>' +
      '</div>' +
      '<nav class="mobile-nav" id="mobile-nav" aria-label="Main"><div class="inner">' + navLinks(true) + '</div></nav>';
  }

  // Instagram / Telegram / Discord icons; only the ones with a link in data.js are shown.
  function socials() {
    var list = (D.socials || []).filter(function (s) { return s.href && ICON[s.id]; });
    if (!list.length) return "";
    return '<div class="socials">' + list.map(function (s) {
      return '<a class="social" href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="NEXX on ' + esc(s.label) + '" title="' + esc(s.label) + '">' + ICON[s.id] + '</a>';
    }).join("") + '</div>';
  }

  function footer() {
    return '' +
      '<div class="wrap">' +
        '<div class="cols">' +
          '<div><a class="brand" href="index.html" style="color:var(--ink)"><span class="mark">' + ICON.mark + '</span>NEXX</a>' +
          '<p class="muted small" style="margin-top:10px;max-width:420px">Bots for Clash of Clans that keep running while you are away. One NEXX account and one coin balance for every NEXX app.</p>' +
          socials() + '</div>' +
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

  // ---------- coin burst (a placed order) ----------
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

  // ---------- coin order form (Coins page) ----------
  // The order goes to the NEXX server's public function nexx_orders (F:\NEXX Admin\server\015_website_orders.sql).
  // The server checks everything again and keeps the password only as a bcrypt hash; the owner approves the
  // order in NEXX Admin → Orders after the buyer's DM. The password is never put in a link, stored or shown.
  // 016_order_limits.sql: at most 2 orders in any 24 h per internet address and per contact name. The server's refusal
  // ("You can place up to 2 orders a day. You can order again in 5 h 12 min, or DM us.") shows above the button.
  var orderBox = $("[data-order]");
  if (orderBox && D.orders) {
    var O = D.orders;
    var oForm = $(".order-form", orderBox), oDone = $(".order-done", orderBox), oBtn = $("[data-submit]", oForm);
    var oErr = $(".form-err", oForm);
    var idIn = $("#o-id"), pw = $("#o-pw"), pw2 = $("#o-pw2"), range = $("#o-range"), num = $("#o-coins"), who = $("#o-contact");
    // the buyer's own username, checked as the server checks it (stored without the @)
    var APPS = [
      { id: "telegram", label: "Telegram", re: /^[A-Za-z0-9_]{5,32}$/, hint: "Your Telegram username (Settings → Username).",
        bad: "A Telegram username is 5–32 letters, digits or _." },
      { id: "instagram", label: "Instagram", re: /^[A-Za-z0-9._]{1,30}$/, hint: "Your Instagram username.",
        bad: "An Instagram username is up to 30 letters, digits, . or _." },
      { id: "discord", label: "Discord", re: /^[A-Za-z0-9_.]{2,32}$/, hint: "Your Discord username (not the display name).",
        bad: "A Discord username is 2–32 letters, digits, . or _." }
    ].filter(function (a) { return O.dm[a.id]; }); // only apps NEXX can be messaged on (Discord shows once data.js has its link)
    var kind = function () { return $('input[name="o-kind"]:checked', oForm).value; };
    var app = function () {
      var r = $('input[name="o-app"]:checked', oForm);
      return APPS.filter(function (a) { return r && a.id === r.value; })[0] || APPS[0];
    };
    var bytes = function (s) { return window.TextEncoder ? new TextEncoder().encode(s).length : unescape(encodeURIComponent(s)).length; };
    var plural = function (n, one, many) { return n.toLocaleString("en-US") + " " + (n === 1 ? one : many); };

    $("[data-pay]", oForm).innerHTML = O.payMethods.map(function (m) {
      return '<label class="opt"><input type="radio" name="o-pay" value="' + esc(m) + '"> ' + esc(m) + "</label>";
    }).join("");
    $("[data-apps]", oForm).classList.toggle("three", APPS.length > 2);
    $("[data-apps]", oForm).innerHTML = APPS.map(function (a, i) {
      return '<label><input type="radio" name="o-app" value="' + a.id + '"' + (i === 0 ? " checked" : "") + "><span>" +
        (ICON[a.id] || "") + a.label + "</span></label>";
    }).join("");
    $("[data-quick]", oForm).innerHTML = O.quick.map(function (n) {
      return '<button class="chip" type="button" data-n="' + n + '">' + n.toLocaleString("en-US") + "</button>";
    }).join("");
    num.max = O.maxCoins;

    // How many coins: the slider, the number and the quick buttons move together.
    var lastLine = $("[data-last]", oForm);
    var setCoins = function (n, from) {
      n = Math.max(1, Math.min(O.maxCoins, Math.round(n) || 1));
      if (from !== num) num.value = n;
      if (from !== range) range.value = Math.min(n, +range.max);
      range.style.setProperty("--p", ((Math.min(n, +range.max) - 1) / (+range.max - 1) * 100).toFixed(1) + "%");
      $all("[data-n]", oForm).forEach(function (c) { c.classList.toggle("on", +c.getAttribute("data-n") === n); });
      lastLine.textContent = "About " + plural(n, "day", "days") + " of NEXX Bot on one device" +
        (n >= 2 ? ", or " + plural(Math.floor(n / 2), "day", "days") + " of NEXX Farm." : ".");
    };
    range.addEventListener("input", function () { setCoins(+range.value, range); });
    num.addEventListener("input", function () { if (num.value !== "") setCoins(+num.value, num); });
    num.addEventListener("blur", function () { setCoins(+num.value || 1); });
    $("[data-quick]", oForm).addEventListener("click", function (e) {
      var c = e.target.closest("[data-n]");
      if (c) { setCoins(+c.getAttribute("data-n")); ok(fieldOf("coins")); }
    });

    var fieldOf = function (k) { return $('[data-f="' + k + '"]', oForm); };
    var ok = function (f) {
      if (!f) return;
      f.classList.remove("bad");
      $all("[aria-invalid]", f).forEach(function (i) { i.removeAttribute("aria-invalid"); i.removeAttribute("aria-describedby"); });
    };
    var clearErrs = function () {
      $all(".field.bad", oForm).forEach(ok);
      oErr.hidden = true;
    };
    // A problem: under its field (and that field focused, so a screen reader reads it), or above the button.
    var bad = function (k, msg) {
      var f = k && fieldOf(k);
      if (!f) { oErr.textContent = msg; oErr.hidden = false; replay(oErr, "pop"); return; }
      var e = $(".err", f);
      e.textContent = msg;
      e.id = e.id || "o-err-" + k;
      replay(f, "bad");
      var inp = $('input:not([type="radio"])', f) || $("input", f);
      if (inp) {
        inp.setAttribute("aria-invalid", "true");
        inp.setAttribute("aria-describedby", e.id);
        inp.focus({ preventScroll: true });
      }
      f.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    };

    var showKind = function () {
      var isNew = kind() === "new";
      $all("[data-new-only]", oForm).forEach(function (el) { el.hidden = !isNew; });
      $all("[data-topup-only]", oForm).forEach(function (el) { el.hidden = isNew; });
      if (!isNew) { pw.value = ""; pw2.value = ""; }
      clearErrs();
    };
    var showApp = function () {
      var a = app();
      $("[data-app-hint]", oForm).textContent = a.hint;
      who.setAttribute("aria-label", "Your " + a.label + " username");
      who.placeholder = "your " + a.label + " username";
      ok(fieldOf("contact"));
    };
    oForm.addEventListener("change", function (e) {
      if (e.target.name === "o-kind") showKind();
      else if (e.target.name === "o-app") showApp();
      else if (e.target.name === "o-pay") ok(fieldOf("pay"));
    });
    oForm.addEventListener("input", function (e) {
      // the box already shows an @, so a typed or pasted one is dropped
      if (e.target === who && /^\s*@/.test(who.value)) who.value = who.value.replace(/^\s*@+/, "");
      ok(e.target.closest(".field"));
    });
    $("[data-eye]", oForm).addEventListener("click", function () {
      var show = pw.type === "password";
      pw.type = pw2.type = show ? "text" : "password";
      this.textContent = show ? "Hide" : "Show";
      this.setAttribute("aria-pressed", show ? "true" : "false");
      this.setAttribute("aria-label", show ? "Hide the password" : "Show the password");
    });

    // The server's public key (base64, written backwards in data.js, as the apps keep it out of plain text).
    var serverKey = function () { try { return atob(O.key).split("").reverse().join(""); } catch (err) { return ""; } };
    // Answers {order:…} or {error, field?}: also when the server cannot be reached, so the form always says why.
    var placeOrder = function (p) {
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = ctl ? setTimeout(function () { ctl.abort(); }, 20000) : 0;
      return fetch(O.server.replace(/\/+$/, "") + "/rest/v1/rpc/nexx_orders", {
        method: "POST", cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer",
        headers: { "apikey": serverKey(), "Content-Type": "application/json" },
        body: JSON.stringify({ p: p }), signal: ctl ? ctl.signal : undefined
      }).then(function (res) {
        clearTimeout(timer);
        // no such function: the server's orders part (015) is not set up yet
        if (res.status === 404) return { error: "Ordering on the website is not open yet. DM " + O.dm.handle + " on Telegram or Instagram to buy coins." };
        if (!res.ok) return { error: "The NEXX server is busy right now (" + res.status + "). Try again in a minute." };
        return res.json().then(function (j) {
          return j && typeof j === "object" && (j.order || j.error) ? j : { error: "The NEXX server gave an answer we don't understand. Try again." };
        });
      }).catch(function () {
        clearTimeout(timer);
        return { error: "Can't reach the NEXX server. Check your internet and try again." };
      });
    };

    oForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (oBtn.getAttribute("data-state") === "busy") return;
      clearErrs();
      var k = kind(), id = idIn.value.trim().toLowerCase(), a = app(), handle = who.value.trim().replace(/^@+/, "");
      var n = Number(String(num.value).replace(/[,\s]/g, ""));
      var payEl = $('input[name="o-pay"]:checked', oForm);
      if (!/^[a-z0-9_.-]{3,20}$/.test(id)) return bad("account", id ? "3–20 characters: letters, digits, _ . or - (no spaces)." : "Type " + (k === "new" ? "the ID you want." : "your NEXX ID."));
      if (k === "new") {
        if (bytes(pw.value) < 8) return bad("password", "At least 8 characters.");
        if (bytes(pw.value) > 72) return bad("password", "At most 72 characters.");
        if (pw2.value !== pw.value) return bad("password2", "The two passwords are not the same.");
      }
      if (!(n >= 1 && n <= O.maxCoins && Math.floor(n) === n)) return bad("coins", "A whole number from 1 to " + O.maxCoins.toLocaleString("en-US") + ".");
      if (!payEl) return bad("pay", "Choose how you will pay.");
      if (!a.re.test(handle)) return bad("contact", handle ? a.bad : "Type your " + a.label + " username, so we know the DM is yours.");

      var body = { op: "place", kind: k, account: id, coins: n, pay: payEl.value, contactApp: a.id, contact: handle };
      if (k === "new") body.password = pw.value;
      oBtn.setAttribute("data-state", "busy");
      placeOrder(body).then(function (r) {
        oBtn.removeAttribute("data-state");
        if (r.order) showDone(r, a, handle, payEl.value);
        else bad(r.field, r.error || "Not placed. Try again.");
      });
    });

    var showDone = function (r, a, handle, pay) {
      var isNew = r.kind === "new";
      var msg = "Hi! NEXX order #" + r.order + ": " + plural(r.coins, "coin", "coins") +
        (isNew ? " for my new account " : " for my ID ") + r.account + ", paying with " + pay + ".";
      $("[data-o-num]", oDone).textContent = "#" + r.order;
      $("[data-o-handle]", oDone).textContent = O.dm.handle;
      $("[data-o-from]", oDone).textContent = a.label + " @" + handle;
      $("[data-o-msg]", oDone).textContent = msg;
      $("[data-o-after]", oDone).textContent = "We check that the DM comes from " + a.label + " @" + handle +
        ", sort out the payment with you, then add the coins" + (isNew ? " and open your account" : "") +
        ". An order we have not confirmed in " + plural(O.waitDays, "day", "days") + " expires.";
      // a DM button for each of the owner's apps; the buyer's own app first and dark
      var dms = APPS.filter(function (x) { return O.dm[x.id]; });
      dms.sort(function (x, y) { return (y.id === a.id) - (x.id === a.id); });
      $("[data-dm-btns]", oDone).innerHTML = dms.map(function (x, i) {
        return '<a class="btn' + (i === 0 ? "" : " light") + '" href="' + esc(O.dm[x.id]) + '" target="_blank" rel="noopener">' +
          (ICON[x.id] || "") + "DM on " + x.label + "</a>";
      }).join("");
      pw.value = ""; pw2.value = "";            // the password is on the server now, and nowhere here
      burst(oBtn);
      oForm.hidden = true; oDone.hidden = false;
      var h = $("h3", oDone);
      h.focus({ preventScroll: true });
      orderBox.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    };

    var copyBtn = $("[data-copy]", oDone);
    copyBtn.addEventListener("click", function () {
      var text = $("[data-o-msg]", oDone).textContent;
      var ok = function () {
        copyBtn.setAttribute("data-state", "done");
        clearTimeout(copyBtn._t); copyBtn._t = setTimeout(function () { copyBtn.removeAttribute("data-state"); }, 1800);
      };
      var fallback = function () {
        var sel = window.getSelection(), rg = document.createRange();
        rg.selectNodeContents($("[data-o-msg]", oDone)); sel.removeAllRanges(); sel.addRange(rg);
        try { if (document.execCommand("copy")) ok(); } catch (err) { /* the text stays selected to copy by hand */ }
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    });
    $("[data-again]", oDone).addEventListener("click", function () {
      oDone.hidden = true; oForm.hidden = false;
      idIn.value = ""; pw.value = ""; pw2.value = "";
      clearErrs();
      idIn.focus();
    });

    setCoins(O.start || 30);
    showKind();
    showApp();
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

  function hostOf(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (err) { return ""; } }

  // A download page on a file host (data.js → releases.<app>.downloadPage): the button opens it in a new tab and says so.
  function pageButton(btn, page) {
    btn.href = page;
    btn.target = "_blank";
    btn.removeAttribute("aria-disabled");
    btn.setAttribute("data-page", "");
    btn.setAttribute("aria-label", "Download APK from " + hostOf(page) + " (opens in a new tab)");
    var busy = $(".st-busy", btn), done = $(".st-done", btn);
    if (busy && busy.lastChild) busy.lastChild.textContent = "Opening download page…";
    if (done && done.lastChild) done.lastChild.textContent = "Opened in a new tab";
  }

  $all("[data-release]").forEach(function (card) {
    var key = card.getAttribute("data-release"), rel = D.releases[key];
    var btn = $("[data-dl]", card), ver = $("[data-ver]", card), meta = $("[data-meta]", card), dot = $(".status-dot", card);
    var note = $("[data-dl-note]", card), pill = dot ? dot.parentNode : null;
    var page = /^https:\/\/[^\s"<>]+$/.test(rel.downloadPage || "") ? rel.downloadPage : "";
    var from = page ? "<dt>From</dt><dd>" + esc(hostOf(page)) + "</dd>" : "";
    if (IOS) androidOnly(btn, note);
    else if (page) pageButton(btn, page);
    else if (rel.fallbackApk) { btn.href = rel.fallbackApk; btn.removeAttribute("aria-disabled"); }
    fetch(rel.updateJson + "?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (m) {
        if (!IOS && !page) { btn.href = apkUrl(rel, m); btn.removeAttribute("aria-disabled"); }
        if (ver) ver.textContent = "v" + m.versionName;
        if (dot) dot.className = "status-dot live";
        if (pill) replay(pill, "pop");
        if (meta) meta.innerHTML =
          "<dt>Version</dt><dd>v" + esc(m.versionName) + " (build " + esc(m.versionCode) + ")</dd>" +
          "<dt>Size</dt><dd>" + fmtSize(m.size) + "</dd>" + from +
          "<dt>SHA-256</dt><dd><code>" + esc(String(m.sha256).slice(0, 16)) + "…</code></dd>";
      })
      .catch(function () {
        if (dot) dot.className = "status-dot off";
        if (ver) ver.textContent = rel.fallbackApk ? "latest" : page ? "see page" : "unavailable";
        if (meta) meta.innerHTML = "<dt>Status</dt><dd>Could not read the current version" +
          (rel.fallbackApk ? "; the button gives the latest release." : page ? "; the button opens the download page." : ". Ask the seller for the link.") +
          "</dd>" + from;
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
        note.textContent = a.hasAttribute("data-page")
          ? "The download page opened in a new tab: press its Download button there. When the file has finished, open it to install."
          : "Your browser may ask you to confirm the download. When it has finished, open the file to install.";
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

  // ---------- scroll reveal ----------
  // Runs after the tables above have been rendered, so they are included.
  var groups = [
    ["main .section-head", ""],
    ["main .grid > *", ""],
    ["main .wrap > .steps > li", "left"],
    ["main .order-steps > li", "left"],
    ["main .order-card", ""],
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
  var show = function (el) { el.classList.add("in"); };
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
