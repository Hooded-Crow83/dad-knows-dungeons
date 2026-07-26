(function () {
  "use strict";

  // ---------------------------------------------------------------
  // Mobile nav toggle
  // ---------------------------------------------------------------
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  var scrim = document.getElementById("nav-scrim");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    scrim.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav) return;
    nav.classList.add("is-open");
    scrim.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  if (toggle && nav && scrim) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    scrim.addEventListener("click", closeNav);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    // Close menu when a nav link is chosen (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  // ---------------------------------------------------------------
  // Journal search filter (client-side, no backend required)
  // ---------------------------------------------------------------
  var searchInput = document.querySelector("[data-journal-search]");
  var items = document.querySelectorAll("[data-journal-item]");

  if (searchInput && items.length) {
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();

      items.forEach(function (item) {
        var title = item.getAttribute("data-title") || "";
        var tags = item.getAttribute("data-tags") || "";
        var matches = !query || title.indexOf(query) !== -1 || tags.indexOf(query) !== -1;
        item.style.display = matches ? "" : "none";
      });
    });
  }
})();
