// SmartByg — landing page interactions.
// Dependency-free for GitHub Pages: scroll-reveal, the interactive "what do you
// need help with?" selector, and Web3Forms AJAX submission for both forms.

(function () {
  "use strict";

  /* ---------- Scroll reveal ---------- */
  (function () {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Mobile navigation ---------- */
  (function () {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Picking a destination should close the menu again.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // The drop-down only exists below the desktop breakpoint.
    window.matchMedia("(min-width: 800px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  })();

  /* ---------- Interactive selector ---------- */
  // Per-option copy + which fields the request form should show.
  var OPTIONS = {
    materialer: {
      title: "Byggematerialer",
      desc: "Upload din materialeliste som PDF, Excel eller billede — så vender vi tilbage med et samlet tilbud.",
      service: "Materialer",
      upload: true,
      comment: "Kommentar / beskrivelse"
    },
    raadgivning: {
      title: "Rådgivning",
      desc: "Beskriv dit projekt, så får du sparring fra en uddannet håndværker — om materialer, metode eller de valg, du står med.",
      service: "Rådgivning",
      upload: false,
      comment: "Beskriv dit projekt"
    },
    vaerktoej: {
      title: "Leje af værktøj",
      desc: "Fortæl, hvilket værktøj du mangler og hvornår — så finder vi det rette til dit projekt.",
      service: "Værktøj",
      upload: false,
      comment: "Hvilket værktøj har du brug for?"
    },
    huskoeb: {
      title: "Huskøbsgennemgang",
      desc: "Fortæl om boligen, du overvejer at købe — så aftaler vi en gennemgang, inden du skriver under. Har du salgsopstilling eller tilstandsrapport, kan du uploade den.",
      service: "Huskøb",
      upload: true,
      uploadLabel: "Upload salgsopstilling eller tilstandsrapport",
      comment: "Fortæl om boligen — adresse, type og hvornår det haster"
    },
    projektgennemgang: {
      title: "Projektgennemgang",
      desc: "Har du tegninger, billeder eller en idé? Upload det, du har — så gennemgår vi projektet med dig, inden du går i gang.",
      service: "Projektgennemgang",
      upload: true,
      uploadLabel: "Upload tegninger, billeder eller skitser",
      comment: "Beskriv dit projekt"
    },
    andet: {
      title: "Noget andet",
      desc: "Skriv til os, så finder vi ud af det rette næste skridt sammen.",
      service: "Andet",
      upload: false,
      comment: "Skriv din besked"
    }
  };

  var options = document.querySelectorAll(".picker-option");
  var panel = document.getElementById("picker-panel");

  if (options.length && panel) {
    var panelTitle = document.getElementById("picker-panel-title");
    var panelDesc = document.getElementById("picker-panel-desc");
    var subjectField = document.getElementById("form-subject");
    var serviceField = document.getElementById("form-service");
    var uploadField = document.getElementById("field-upload");
    var uploadLabel = document.getElementById("upload-label");
    var commentLabel = document.getElementById("comment-label");

    function selectOption(key, focusPanel) {
      var cfg = OPTIONS[key];
      if (!cfg) return;

      options.forEach(function (btn) {
        btn.setAttribute("aria-checked", btn.dataset.option === key ? "true" : "false");
      });

      if (panelTitle) panelTitle.textContent = cfg.title;
      if (panelDesc) panelDesc.textContent = cfg.desc;
      if (serviceField) serviceField.value = cfg.service;
      if (subjectField) subjectField.value = "SmartByg — " + cfg.title + " (forespørgsel)";
      if (uploadField) uploadField.hidden = !cfg.upload;
      // Each option that takes a file asks for a different document.
      if (uploadLabel) uploadLabel.textContent = cfg.uploadLabel || "Upload materialeliste";
      if (commentLabel) commentLabel.textContent = cfg.comment;

      panel.hidden = false;

      if (focusPanel) {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }

    options.forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectOption(btn.dataset.option, true);
      });
    });

    // Deep-link buttons elsewhere on the page (hero CTAs, service cards):
    // pre-select the matching option, then let the #start anchor scroll there.
    document.querySelectorAll("[data-select]").forEach(function (link) {
      link.addEventListener("click", function () {
        selectOption(link.dataset.select, false);
      });
    });
  }

  /* ---------- Web3Forms AJAX submission ---------- */
  function wireForm(form, statusId) {
    if (!form) return;
    var status = document.getElementById(statusId);

    function show(kind, msg) {
      if (!status) return;
      status.hidden = false;
      status.className = "form-status is-" + kind;
      status.textContent = msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) return;

      var keyField = form.querySelector('input[name="access_key"]');
      if (keyField && /^REPLACE_WITH/.test(keyField.value)) {
        show("error", "Formularen er endnu ikke koblet til. Indsæt jeres Web3Forms-nøgle for at modtage henvendelser.");
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var btnText = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sender …"; }

      fetch(form.action, { method: "POST", body: new FormData(form) })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            show("success", "Tak! Vi har modtaget din henvendelse og vender tilbage hurtigst muligt.");
          } else {
            show("error", "Beklager — der opstod en fejl. Prøv igen, eller skriv til os på kontakt@smartbyg.dk.");
          }
        })
        .catch(function () {
          show("error", "Beklager — der opstod en fejl. Prøv igen, eller skriv til os på kontakt@smartbyg.dk.");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnText; }
        });
    });
  }

  wireForm(document.getElementById("request-form"), "form-status");
  wireForm(document.getElementById("contact-form"), "contact-status");
})();
