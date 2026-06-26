// RenoRaad — landing page interactions.
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
      title: "Værktøjsudlejning",
      desc: "Fortæl, hvilket værktøj du mangler og hvornår — så finder vi det rette til dit projekt.",
      service: "Værktøj",
      upload: false,
      comment: "Hvilket værktøj har du brug for?"
    },
    levering: {
      title: "Levering",
      desc: "Fortæl, hvad der skal leveres og hvortil — så oplyser vi pris og muligheder. Har du en liste, kan du uploade den.",
      service: "Levering",
      upload: true,
      comment: "Hvad skal leveres — og hvortil?"
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
      if (subjectField) subjectField.value = "RenoRaad — " + cfg.title + " (forespørgsel)";
      if (uploadField) uploadField.hidden = !cfg.upload;
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
            show("error", "Beklager — der opstod en fejl. Prøv igen, eller ring til os på 29 90 02 95.");
          }
        })
        .catch(function () {
          show("error", "Beklager — der opstod en fejl. Prøv igen, eller ring til os på 29 90 02 95.");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnText; }
        });
    });
  }

  wireForm(document.getElementById("request-form"), "form-status");
  wireForm(document.getElementById("contact-form"), "contact-status");
})();
