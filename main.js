// SmartByg — landing page interactions.
// Dependency-free for GitHub Pages: scroll-reveal, the interactive "what do you
// need help with?" selector, and posting both forms to the SmartByg backend.

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

  /* ---------- Submission to the SmartByg backend ---------- */
  /*
    The form posts a FormData to app.smartbyg.dk, which stores the case, creates
    the visitor an account and mails them a link into it. The request form has
    two submit buttons — send it now, or park it as a draft to finish later —
    and the difference between them is one field, `submit`.
  */

  // Only for a dropped connection or an answer we cannot read: anything the
  // backend has an opinion about arrives in Danish and is shown instead.
  // There is no address or number to fall back to — the site publishes neither —
  // so this asks for a retry rather than pointing somewhere that goes nowhere.
  var GENERIC_ERROR =
    "Beklager — der opstod en fejl. Tjek din forbindelse, og prøv igen om lidt.";

  /*
    A submission that trips the honeypot is answered as if it had worked, but
    with no reference — so the reference is only mentioned when there is one.
  */
  function successText(draft, reference) {
    var ref = reference ? " (" + reference + ")" : "";
    return draft
      ? "Gemt" + ref + "! Vi har sendt dig en mail med et link, så du kan færdiggøre sagen, når det passer dig."
      : "Tak! Vi har modtaget din henvendelse" + ref +
        " og vender tilbage hurtigst muligt. Du får en mail med et link, hvor du kan følge din sag.";
  }

  function wireForm(form, statusId) {
    if (!form) return;
    var status = document.getElementById(statusId);

    // Safari only gained event.submitter recently; remember the button that was
    // pressed, so the draft choice survives on older versions too.
    var lastPressed = null;
    form.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest('button[type="submit"]') : null;
      if (btn) lastPressed = btn;
    });

    function show(kind, msg) {
      if (!status) return;
      status.hidden = false;
      status.className = "form-status is-" + kind;
      status.textContent = msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) return;

      var btn = e.submitter || lastPressed || form.querySelector('button[type="submit"]');
      var draft = btn ? btn.dataset.submit === "false" : false;

      var body = new FormData(form);
      body.set("submit", draft ? "false" : "true");

      var buttons = form.querySelectorAll('button[type="submit"]');
      var btnText = btn ? btn.textContent : "";
      for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
      if (btn) btn.textContent = draft ? "Gemmer …" : "Sender …";

      fetch(form.action, { method: "POST", body: body })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function (data) {
          if (data && data.ok) {
            form.reset();
            show("success", successText(draft, data.reference));
          } else {
            // The backend's message is Danish and written to be shown as-is.
            show("error", (data && data.message) || GENERIC_ERROR);
          }
        })
        .catch(function () {
          show("error", GENERIC_ERROR);
        })
        .finally(function () {
          for (var j = 0; j < buttons.length; j++) buttons[j].disabled = false;
          if (btn) btn.textContent = btnText;
        });
    });
  }

  wireForm(document.getElementById("request-form"), "form-status");
  wireForm(document.getElementById("contact-form"), "contact-status");
})();
