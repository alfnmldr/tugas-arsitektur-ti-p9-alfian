(function () {
  "use strict";

  var KEY = "aurum-theme";
  var WINDOW_PREFIX = "aurum-theme:";
  var root = document.documentElement;
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function readStore() {
    try {
      var value = localStorage.getItem(KEY);
      if (value === "dark" || value === "light") return value;
    } catch (err) {}
    return null;
  }

  function readWindowName() {
    try {
      var name = window.name || "";
      if (name.indexOf(WINDOW_PREFIX) === 0) {
        var value = name.slice(WINDOW_PREFIX.length);
        if (value === "dark" || value === "light") return value;
      }
    } catch (err) {}
    return null;
  }

  function persist(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (err) {}
    try {
      window.name = WINDOW_PREFIX + value;
    } catch (err) {}
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#121211" : "#f5f2ec");
    }
  }

  function resolveTheme() {
    return readStore() || readWindowName() || (systemDark.matches ? "dark" : "light");
  }

  var stored = readStore() || readWindowName();
  apply(stored || (systemDark.matches ? "dark" : "light"));
  if (stored) persist(stored);

  window.AurumTheme = {
    get: function () {
      return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    },
    set: function (theme) {
      var value = theme === "dark" ? "dark" : "light";
      apply(value);
      persist(value);
      return value;
    },
    toggle: function () {
      var next = window.AurumTheme.get() === "dark" ? "light" : "dark";
      apply(next);
      persist(next);
      return next;
    }
  };

  if (systemDark.addEventListener) {
    systemDark.addEventListener("change", function (event) {
      if (readStore() || readWindowName()) return;
      apply(event.matches ? "dark" : "light");
    });
  }

  window.addEventListener("pageshow", function () {
    apply(resolveTheme());
  });

  window.addEventListener("storage", function (event) {
    if (event.key !== KEY) return;
    if (event.newValue === "dark" || event.newValue === "light") {
      apply(event.newValue);
    }
  });
})();
