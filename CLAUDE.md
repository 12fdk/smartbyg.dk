# RenoRaad

Brand / page name: **RenoRaad** (written as one word in all copy; from
**Reno**vations **Råd**givning).
Domain: `renoraad.dk` (no æ/ø/å in the URL).

Landing page for the RenoRaad service, hosted on GitHub Pages.

## Purpose

Marketing / landing page that introduces visitors to RenoRaad and directs them
to get started — by uploading a material list or requesting help.

RenoRaad is a **multi-service helper for DIY homeowners** building their own
projects. It is run by **Simon, an educated carpenter (uddannet tømrer)**. The
service helps across five areas:

1. **Byggematerialer** — the user uploads a material list (PDF / Excel / image)
   and receives a single combined quote (tilbud).
2. **Rådgivning** — sparring/advice from an educated carpenter.
3. **Værktøjsudlejning** — rental of professional tools.
4. **Levering** — materials delivered to the door (free over 6.000 kr. to
   brofaste øer; otherwise quoted).
5. **Projektgennemgang** — a review of the project before the user starts.

The user always gets a price *before* work begins — no hidden fees. (There is
**no MobilePay step** anymore.)

### Centrepiece: the interactive selector

The front page's defining element is the **"Hvad har du brug for hjælp til?"**
selector (`#start`): a card with options (Materialer / Rådgivning / Værktøj /
Levering / Noget andet). Picking one reveals an adapted request form below —
**Materialer** and **Levering** show the file-upload field; the others show a
plain request form. Hero CTAs and service-card links deep-link into it via
`data-select`. It should feel like a modern service, not a static brochure.

### History / do NOT revert

This positioning **replaces** an earlier "advice-only, no materials, 6-step
MobilePay flow" direction (see commit `f303902`). Materials, tool rental,
delivery, the multi-service framing, and the **RenoRaad** brand name are all
intentional. Do not reintroduce the advisory-only / MobilePay positioning.

### Forms / backend

Forms post to **Web3Forms** (`api.web3forms.com/submit`) via AJAX (`main.js`),
which works on static GitHub Pages and supports file uploads. The access key is
a placeholder — search `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in `index.html` and
insert the real key from web3forms.com (the key is public by design). Other
placeholders to finalise: the public e-mail (`kontakt@renoraad.dk`), the CVR
number (footer), and the Handelsbetingelser / Privatlivspolitik / Cookiepolitik
pages. Phone number is live: **29 90 02 95**.

## Audience & languages

- Primary audience: **private individuals doing home renovations** (DIY
  homeowners, not professional contractors). Tone, imagery, examples, and
  copy should appeal to this audience — approachable, trustworthy, and
  practical, not industry/B2B.
- Primary language: Danish (da)
- Also translated to English (en)

## Hosting

- GitHub Pages

## See also

- [design.md](design.md) — design system, visual direction, and UI conventions
