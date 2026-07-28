# SmartByg

Brand / page name: **SmartByg** (written as one word in all copy).
Domain: `smartbyg.dk` (no æ/ø/å in the URL). The old `renoraad.dk` domain
301-redirects here and is kept alive for inbound links — do not reintroduce it
in copy, and do not "fix" the copy back to RenoRaad.

Landing page for the SmartByg service, hosted on GitHub Pages.

## Purpose

Marketing / landing page that introduces visitors to SmartByg and directs them
to get started — by uploading a material list or requesting help.

SmartByg is a **multi-service helper for DIY homeowners** building their own
projects. It is run by **Simon, an educated carpenter (uddannet tømrer)**. The
service helps across five areas:

1. **Byggematerialer** — the user uploads a material list (PDF / Excel / image)
   and receives a single combined quote (tilbud). Free delivery over 6.000 kr.
   to brofaste øer is a benefit *of this service*, not a service of its own.
2. **Rådgivning** — sparring/advice from an educated carpenter.
3. **Leje af værktøj** — rental of professional tools.
4. **Huskøbsgennemgang** — a carpenter walks a property with the buyer *before*
   they sign, assessing condition and likely renovation costs.
5. **Projektgennemgang** — a review of the project before the user starts.

The user always gets a price *before* work begins — no hidden fees. (There is
**no MobilePay step** anymore.)

### Centrepiece: the interactive selector

The front page's defining element is the **"Hvad har du brug for hjælp til?"**
selector (`#start`): a card with six options (Materialer / Rådgivning / Værktøj
/ Huskøb / Projektgennemgang / Noget andet). Picking one reveals an adapted
request form below — **Materialer**, **Huskøb** and **Projektgennemgang** show
the file-upload field (each with its own label, set from `uploadLabel` in
`main.js`); the others show a plain request form. Hero CTAs, service blocks and
footer links deep-link into it via `data-select`. It should feel like a modern
service, not a static brochure.

### History / do NOT revert

This positioning **replaces** an earlier "advice-only, no materials, 6-step
MobilePay flow" direction (see commit `f303902`). Materials, tool rental, the
multi-service framing and the owner-supplied service copy are all intentional.
Do not reintroduce the advisory-only / MobilePay positioning.

Two later, deliberate changes (issue #18):

- The brand was renamed **RenoRaad → SmartByg**. The domain initially stayed
  `renoraad.dk`; it later moved to `smartbyg.dk` (issue #21), along with the
  repo name.
- **Levering** was dropped as a standalone service and picker option; it now
  appears only as a selling point (materials bullet, trust strip, FAQ).
  **Huskøbsgennemgang** took its place in the five-service line-up.

### Forms / backend

Forms post to **Web3Forms** (`api.web3forms.com/submit`) via AJAX (`main.js`),
which works on static GitHub Pages and supports file uploads. The access key is
a placeholder — search `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` in `index.html` and
insert the real key from web3forms.com (the key is public by design). Other
placeholders to finalise: the public e-mail (`kontakt@smartbyg.dk` — the address
is in the copy, but no mailbox exists yet; smartbyg.dk has no MX records), the
CVR number (footer), and the Handelsbetingelser / Privatlivspolitik /
Cookiepolitik pages. Phone number is live: **29 90 02 95**.

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
