(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var themeApi = window.AurumTheme;

  function syncThemeToggle() {
    var isDark = themeApi && themeApi.get() === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  if (themeApi) {
    syncThemeToggle();
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        themeApi.toggle();
        syncThemeToggle();
      });
    });
    window.addEventListener("pageshow", syncThemeToggle);
    window.addEventListener("storage", syncThemeToggle);
  }

  var header = document.querySelector("[data-header]");
  var toTop = document.querySelector("[data-to-top]");
  var scrollQueued = false;

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 620);
      scrollQueued = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");

  if (nav && navToggle) {
    var closeNav = function () {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  function wheelMarkup(cx, cy, accent) {
    return (
      "<g>" +
      '<circle cx="' + cx + '" cy="' + cy + '" r="60" fill="#17160f"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="34" fill="#2b2820"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="' + accent + '"/>' +
      "</g>"
    );
  }

  function carMarkup(model) {
    var uid = "car-" + model.id + "-" + Math.random().toString(36).slice(2, 8);
    var bodyPath =
      "M92 246C92 208 126 190 186 180L300 136C338 112 392 100 456 102C512 104 566 118 610 142L712 182C764 196 802 212 816 238L820 250C821 259 814 264 805 264L112 264C99 264 92 256 92 246Z";
    var glassPath =
      "M330 146C362 126 408 117 456 119C504 121 548 133 582 152L560 172C522 156 476 148 434 150C396 152 358 160 336 172Z";
    var reflectionPath = "M356 150C404 138 470 140 540 158";

    return (
      '<svg viewBox="0 0 900 340" role="img" aria-label="Silhouette of ' + model.full + '" class="car-svg">' +
      "<defs>" +
      '<linearGradient id="' + uid + '-shade" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".38"/>' +
      '<stop offset=".42" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#000" stop-opacity=".3"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + uid + '-glass" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2a2a26"/>' +
      '<stop offset=".5" stop-color="#14140f"/>' +
      '<stop offset="1" stop-color="#33322c"/>' +
      "</linearGradient>" +
      "</defs>" +
      '<ellipse cx="450" cy="305" rx="330" ry="15" fill="rgba(0,0,0,.14)"/>' +
      wheelMarkup(250, 248, model.accent) +
      wheelMarkup(660, 248, model.accent) +
      '<path d="' + bodyPath + '" fill="' + model.body + '"/>' +
      '<path d="' + bodyPath + '" fill="url(#' + uid + '-shade)"/>' +
      '<path d="' + glassPath + '" fill="url(#' + uid + '-glass)"/>' +
      '<path d="' + reflectionPath + '" stroke="' + model.accent + '" stroke-opacity=".35" stroke-width="2" fill="none"/>' +
      '<path d="M150 236C320 224 560 218 792 240" stroke="' + model.accent + '" stroke-width="2.5" fill="none" opacity=".85"/>' +
      '<path d="M772 198L808 210L802 224L762 212Z" fill="' + model.accent + '" opacity=".9"/>' +
      '<path d="M104 206L132 210L130 222L100 218Z" fill="' + model.accent + '" opacity=".65"/>' +
      '<path d="M120 258L800 258" stroke="rgba(0,0,0,.15)" stroke-width="1"/>' +
      "</svg>"
    );
  }

  function specMini(value, label) {
    return '<div class="spec-mini"><strong>' + value + "</strong><small>" + label + "</small></div>";
  }

  function modelCard(model, index) {
    var delay = index % 3;
    return (
      '<article class="model-card" data-reveal data-delay="' + delay + '">' +
      '<a class="model-card__link" href="model.html?id=' + encodeURIComponent(model.id) + '" aria-label="View ' + model.full + '">' +
      '<div class="model-card__visual">' + carMarkup(model) + "</div>" +
      '<div class="model-card__body">' +
      '<p class="model-card__cat">' + model.categoryLabel + " · " + model.year + "</p>" +
      '<h3 class="model-card__name">' + model.name + "</h3>" +
      '<div class="model-card__specs">' +
      specMini(model.power.toLocaleString("en-GB") + " hp", "Power") +
      specMini(model.accel + " s", "0–100") +
      specMini(model.topSpeed + " km/h", "Top speed") +
      "</div>" +
      '<span class="model-card__cta">View model ' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      "</span>" +
      "</div>" +
      "</a>" +
      "</article>"
    );
  }

  var featuredGrid = document.querySelector("[data-featured-grid]");
  if (featuredGrid && typeof AURUM_MODELS !== "undefined") {
    featuredGrid.innerHTML = AURUM_MODELS.slice(0, 3).map(modelCard).join("");
  }

  var modelGrid = document.querySelector("[data-model-grid]");
  if (modelGrid && typeof AURUM_MODELS !== "undefined") {
    var filterButtons = document.querySelectorAll("[data-filter]");
    var emptyState = document.querySelector("[data-empty]");

    var renderModels = function (filter) {
      var list =
        filter === "all"
          ? AURUM_MODELS
          : AURUM_MODELS.filter(function (model) {
              return model.category === filter;
            });

      modelGrid.innerHTML = list.map(modelCard).join("");
      if (emptyState) emptyState.hidden = list.length > 0;
      modelGrid.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.add("is-visible");
      });
    };

    renderModels("all");

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (other) {
          other.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        renderModels(btn.getAttribute("data-filter"));
      });
    });
  }

  var detailName = document.querySelector("[data-model-name]");
  if (detailName && typeof AURUM_MODELS !== "undefined") {
    var params = new URLSearchParams(window.location.search);
    var requestedId = params.get("id");
    var selected = AURUM_MODELS.find(function (model) {
      return model.id === requestedId;
    }) || AURUM_MODELS[0];

    var setText = function (selector, value) {
      var el = document.querySelector(selector);
      if (el) el.textContent = value;
    };

    document.title = selected.full + " — AURUM";
    setText("[data-model-name]", selected.full);
    setText("[data-model-category]", selected.categoryLabel + " · " + selected.year);
    setText("[data-model-tagline]", selected.tagline);
    setText("[data-model-desc]", selected.desc);
    setText("[data-spec-power]", selected.power.toLocaleString("en-GB") + " hp");
    setText("[data-spec-accel]", selected.accel + " seconds");
    setText("[data-spec-speed]", selected.topSpeed + " km/h");
    setText("[data-spec-year]", selected.year);
    setText("[data-spec-price]", selected.price);

    var modelVisual = document.querySelector("[data-model-visual]");
    if (modelVisual) modelVisual.innerHTML = carMarkup(selected);

    var highlights = document.querySelector("[data-model-highlights]");
    if (highlights) {
      highlights.innerHTML = selected.highlights
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("");
    }
  }

  function initReveal() {
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  initReveal();

  var counters = document.querySelectorAll("[data-count]");

  function animateCount(el) {
    var target = Number(el.getAttribute("data-count"));
    if (!isFinite(target)) return;
    if (reduceMotion) {
      el.textContent = target.toLocaleString("en-GB");
      return;
    }
    var duration = 1600;
    var start = performance.now();

    var tick = function (now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-GB");
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) {
        counterObserver.observe(el);
      });
    } else {
      counters.forEach(animateCount);
    }
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var success = document.querySelector("[data-form-success]");
    var rules = {
      name: function (value) {
        return value.trim().length >= 2 || "Please enter your full name.";
      },
      email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || "Please enter a valid email address.";
      },
      message: function (value) {
        return value.trim().length >= 10 || "Please tell us a little more (at least 10 characters).";
      }
    };

    var validateField = function (field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var result = rule(field.value);
      var wrap = field.closest(".field");
      var errorEl = wrap ? wrap.querySelector(".error") : null;
      var valid = result === true;

      if (wrap) wrap.classList.toggle("has-error", !valid);
      field.setAttribute("aria-invalid", String(!valid));
      if (errorEl) errorEl.textContent = valid ? "" : result;
      return valid;
    };

    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        if (wrap && wrap.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var valid = true;

      Object.keys(rules).forEach(function (name) {
        var field = form.elements[name];
        if (field && !validateField(field)) valid = false;
      });

      if (!valid) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }

      form.reset();

      Object.keys(rules).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var wrap = field.closest(".field");
        if (wrap) wrap.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
