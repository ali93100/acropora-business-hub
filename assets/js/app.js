/* =========================================================
   ACROPORA DATA — Digital Business Hub
   Moteur i18n + rendu des blocs + interactions.
   Aucune dépendance externe.
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.HUB_CONFIG;
  var CONTENT = window.HUB_CONTENT;
  var STORAGE_KEY = "acropora-hub-lang";
  var EXPERTISE_ICONS = ["i-mdm", "i-gov", "i-quality", "i-integration", "i-lineage", "i-ai"];
  var current = null;

  /* ---------- Utilitaires ---------- */
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(id) { return '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- Choix de la langue ---------- */
  function initialLang() {
    var url = new URLSearchParams(location.search).get("lang");
    if (url && CONTENT[url]) return url;
    var saved = read(STORAGE_KEY);
    if (saved && CONTENT[saved]) return saved;
    return CFG.defaultLanguage;
  }

  /* ---------- Liens dynamiques ---------- */
  function hrefFor(key, lang) {
    var c = CFG.contact;
    switch (key) {
      case "email": return "mailto:" + c.email;
      case "whatsapp": return "https://wa.me/" + c.whatsapp;
      case "linkedin": return c.linkedin;
      case "booking": return c.booking;
      case "website": return CFG.company.website;
      case "vcard": return CFG.files.vcard;
      case "presentation": return CFG.files.presentation[lang] || CFG.files.presentation[CFG.defaultLanguage];
    }
    return "#";
  }
  function textFor(key) {
    return CFG.contact[key] || CFG.company[key] || "";
  }

  /* ---------- Rendu des blocs répétés ---------- */
  var renderers = {
    "about-paragraphs": function (t, node) {
      node.innerHTML = t.about.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    },
    "about-pillars": function (t, node) {
      node.innerHTML = t.about.pillars.map(function (p, i) {
        return '<li><span class="pillars__num">' + pad(i + 1) + '</span><div><strong>' + esc(p.title) + "</strong><p>" + esc(p.text) + "</p></div></li>";
      }).join("");
    },
    "expertise": function (t, node) {
      node.innerHTML = t.expertise.items.map(function (it, i) {
        return '<article class="card"><div class="card__top"><span class="card__icon">' + icon(EXPERTISE_ICONS[i]) +
          '</span><span class="card__num">' + pad(i + 1) + "</span></div><h3>" + esc(it.title) + "</h3><p>" + esc(it.text) + "</p></article>";
      }).join("");
    },
    "services": function (t, node) {
      var letters = ["A", "B", "C", "D"];
      node.innerHTML = t.services.items.map(function (s, i) {
        return '<article class="service service--' + (i + 1) + '"><header class="service__head"><span class="service__letter">' + letters[i] +
          "</span><h3>" + esc(s.title) + '</h3></header><ul class="service__list">' +
          s.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></article>";
      }).join("");
    },
    "steps": function (t, node) {
      node.innerHTML = t.approach.steps.map(function (s, i) {
        return '<li class="step"><div class="step__badge"><span class="step__num">' + pad(i + 1) + "</span><h3>" + esc(s.title) +
          '</h3></div><p class="step__text">' + esc(s.text) + "</p></li>";
      }).join("");
    },
    "figures": function (t, node) {
      node.innerHTML = t.figures.items.map(function (f) {
        return '<li class="figure"><span class="figure__value">' + esc(f.value) + '</span><span class="figure__label">' + esc(f.label) + "</span></li>";
      }).join("");
    },
    "mauritius": function (t, node) {
      node.innerHTML = t.mauritius.items.map(function (x) {
        return "<li>" + icon("i-check") + "<span>" + esc(x) + "</span></li>";
      }).join("");
    },
    "topics": function (t, node) {
      var prev = node.selectedIndex;
      node.innerHTML = t.contact.form.topics.map(function (x, i) {
        return '<option value="' + i + '">' + esc(x) + "</option>";
      }).join("");
      if (prev > -1) node.selectedIndex = prev;
    }
  };

  /* ---------- Application d'une langue ---------- */
  function applyLang(lang) {
    var t = CONTENT[lang];
    if (!t) return;
    current = lang;
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t.meta.description);

    document.querySelectorAll("[data-i18n]").forEach(function (n) {
      var v = get(t, n.getAttribute("data-i18n"));
      if (v != null) n.textContent = v;
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (n) {
      n.setAttribute("alt", get(t, n.getAttribute("data-i18n-alt")) || "");
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (n) {
      n.setAttribute("placeholder", get(t, n.getAttribute("data-i18n-placeholder")) || "");
    });
    document.querySelectorAll("[data-render]").forEach(function (n) {
      var r = renderers[n.getAttribute("data-render")];
      if (r) r(t, n);
    });
    document.querySelectorAll("[data-href]").forEach(function (n) {
      n.setAttribute("href", hrefFor(n.getAttribute("data-href"), lang));
    });
    document.querySelectorAll("[data-text]").forEach(function (n) {
      n.textContent = textFor(n.getAttribute("data-text"));
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var burger = document.getElementById("burger");
    if (burger) burger.setAttribute("aria-label", t.nav.menu);

    var msg = document.getElementById("form-msg");
    if (msg) { msg.textContent = ""; msg.className = "form__msg"; }

    store(STORAGE_KEY, lang);
    var u = new URL(location.href);
    if (lang === CFG.defaultLanguage) u.searchParams.delete("lang"); else u.searchParams.set("lang", lang);
    history.replaceState(null, "", u.pathname + u.search + u.hash);
  }

  /* ---------- Sélecteur FR | EN ---------- */
  function buildSwitch() {
    var wrap = document.getElementById("lang-switch");
    CFG.languages.forEach(function (code, i) {
      if (i > 0) wrap.appendChild(el("span", "lang-switch__sep", "|"));
      var b = el("button", null, code.toUpperCase());
      b.type = "button";
      b.setAttribute("data-lang", code);
      b.setAttribute("lang", code);
      b.setAttribute("title", CONTENT[code] ? CONTENT[code].meta.langName : code);
      b.addEventListener("click", function () { applyLang(code); });
      wrap.appendChild(b);
    });
  }

  /* ---------- Photo (avec repli monogramme) ---------- */
  function setupPhoto() {
    var src = CFG.person.photo;
    ["portrait-img", "avatar-img"].forEach(function (id) {
      var img = document.getElementById(id);
      if (!img || !src) return;
      img.addEventListener("load", function () { img.parentElement.classList.add("has-photo"); });
      img.addEventListener("error", function () { img.remove(); });
      img.src = src;
    });
  }

  /* ---------- Bandeau événement ---------- */
  function setupEvent() {
    var strip = document.getElementById("event-strip");
    if (!strip || !CFG.event || !CFG.event.enabled) return;
    var limit = new Date(CFG.event.hideAfter + "T23:59:59+01:00");
    if (new Date() <= limit) strip.hidden = false;
  }

  /* ---------- En-tête : état au défilement + menu mobile ---------- */
  function setupHeader() {
    var bar = document.querySelector(".topbar");
    var hero = document.querySelector(".hero");
    function onScroll() {
      var limit = hero ? hero.offsetHeight - 80 : 200;
      bar.classList.toggle("is-solid", window.scrollY > limit);
      bar.classList.toggle("is-scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var burger = document.getElementById("burger");
    var nav = document.getElementById("site-nav");
    function close() { document.body.classList.remove("nav-open"); burger.setAttribute("aria-expanded", "false"); }
    burger.addEventListener("click", function () {
      var open = !document.body.classList.contains("nav-open");
      document.body.classList.toggle("nav-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- Apparition discrète des sections ---------- */
  function setupReveal() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var targets = document.querySelectorAll(".section__head, .card, .service, .step, .figure, .about__main, .about__pillars, .mu__map, .mu__text, .bizcard, .form");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  /* ---------- Formulaire : e-mail ou WhatsApp pré-rempli ---------- */
  function setupForm() {
    var form = document.getElementById("contact-form");
    var msg = document.getElementById("form-msg");
    var channel = "email";
    form.querySelectorAll('button[type="submit"]').forEach(function (b) {
      b.addEventListener("click", function () { channel = b.value; });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = CONTENT[current].contact.form;
      var d = {
        name: form.name.value.trim(),
        company: form.company.value.trim(),
        email: form.email.value.trim(),
        topic: f.topics[form.topic.selectedIndex] || "",
        message: form.message.value.trim()
      };
      msg.className = "form__msg";
      if (!d.name || !d.email || !d.message || !form.consent.checked) {
        msg.textContent = f.required; msg.classList.add("is-error"); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) {
        msg.textContent = f.invalidEmail; msg.classList.add("is-error"); form.email.focus(); return;
      }

      var lines = [
        f.bodyName + " : " + d.name,
        d.company ? f.bodyCompany + " : " + d.company : null,
        f.bodyEmail + " : " + d.email,
        f.bodyTopic + " : " + d.topic,
        "",
        d.message
      ].filter(function (x) { return x !== null; });
      var body = lines.join("\n");

      if (channel === "whatsapp") {
        window.open("https://wa.me/" + CFG.contact.whatsapp + "?text=" + encodeURIComponent(body), "_blank", "noopener");
        msg.textContent = f.successWhatsapp;
      } else {
        var subject = f.subjectPrefix + " — " + d.topic + " — " + d.name + (d.company ? " (" + d.company + ")" : "");
        location.href = "mailto:" + CFG.contact.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        msg.textContent = f.success;
      }
      msg.classList.add("is-success");
    });
  }

  /* ---------- Démarrage ---------- */
  buildSwitch();
  applyLang(initialLang());
  setupPhoto();
  setupEvent();
  setupHeader();
  setupReveal();
  setupForm();
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
