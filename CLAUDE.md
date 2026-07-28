# SmartByg

Brand / page name: **SmartByg** (written as one word in all copy).
Domain: `smartbyg.dk` (no æ/ø/å in the URL). This is the only domain — the
earlier `renoraad.dk` was abandoned at the move, not redirected. Do not
reintroduce it anywhere, and do not "fix" the copy back to RenoRaad.

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

### The backend / app site (`app.smartbyg.dk`)

This landing page is only the front door. Everything that happens *after* a
visitor sends the form lives in a **separate repo**:

> `~/Git/smartbyg/app.smartbyg.dk` (GitHub `12fdk/app.smartbyg.dk`) — an
> Appwrite backend plus the app site. Read its `CLAUDE.md` for how it is built
> and `docs/api.md` for the HTTP contract before changing anything that touches
> it. Treat that repo as the source of truth for backend behaviour; do not
> describe the flow on this page from memory.

What it means for the copy on this site:

- An enquiry is not an e-mail, it is a **sag (case)**. The backend stores it,
  creates the visitor an Appwrite account and mails them a link into their own
  view of it. Every case gets a reference like `SB-7K2Q9F`.
- The customer's view is **`https://app.smartbyg.dk/sag`**; the staff admin
  (Simon) is `https://app.smartbyg.dk/requests`. Same build, different rights.
- Login is **passwordless** — a link by e-mail. Every update mails a fresh one,
  and `/sag` can request a new one for an address that has a case.
- On the case the customer follows the status (**ny → kontaktet → tilbud sendt
  → accepteret → … → afsluttet**), reads one shared timeline, writes messages
  and uploads files. Internal notes are absent from their copy by construction.
- The customer can **save a draft** and finish it later, and can *ask* for
  `accepteret` or `annulleret` — an admin answers; nothing moves on its own.
- **All communication belongs on the case**, which is why this site publishes no
  phone number (see below) and points people at the form and their sag.
- Inbound e-mail is *not* wired: a customer who replies to a notification lands
  in Simon's inbox only. Do not write copy inviting e-mail replies as the way to
  reach a case.

**Form wiring.** Both forms post to the backend —
`https://smartbyg-api.fra.appwrite.run/requests`, `multipart/form-data`, no key
and no token (PR #20). Web3Forms is gone. Before changing either form:

- The request form has **two submit buttons**, telling "send it now" apart from
  "gem og færdiggør senere" with `data-submit="false"`. A draft never notifies
  Simon; the visitor sends it themselves, from the link they are mailed.
- The inputs keep their Danish `name`s (`Navn`, `Mail`, `Telefon`, `Adresse`,
  `Kommentar`, `Besked`, `Projekttype`, `Hvad_har_du_brug_for`) — the backend
  accepts them as aliases, including all six picker labels.
- The **`botcheck` honeypot** is used by this backend too — keep it. It answers
  a caught submission `ok: true` with **no reference**, so never print the
  reference unguarded.
- Both forms **require a phone number**: a case is rejected without one.
- Error text comes back from the backend already written in Danish and is shown
  as-is; the generic fallback is for a dropped connection only.

[backend-integration.md](backend-integration.md) is the full specification: the
endpoint, every field name and alias, the markup and `main.js` changes, and what
the customer's e-mail and login link actually contain. Read it before touching
either form.

**The site publishes no address, no phone number, no CVR and no legal pages** —
all four were removed on purpose (#27, #28, #29), not left out by accident. Do
not reintroduce any of them without being asked.

- **No e-mail address.** `smartbyg.dk` has no MX records and none is being set
  up: everything belongs on the sag. Mail flows one way — we write to the
  customer, always with a link back into their case — so a published address
  would only collect replies nobody reads. The channels are the request form,
  the contact form and `app.smartbyg.dk/sag`. This is why `main.js`'s
  `GENERIC_ERROR` asks for a retry instead of naming somewhere to write.
- **No phone number.** Simon still rings customers back, so copy may say *we*
  call — just never publish a number.
- **No CVR** until there is one to print.
- **No Handelsbetingelser / Privatlivspolitik / Cookiepolitik.** The dead
  footer links are gone rather than sitting there saying *"kommer snart"*. Worth
  knowing that the site now collects personal data and creates accounts, so this
  is a deliberate gap and not a solved problem.

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
- [backend-integration.md](backend-integration.md) — how the two forms connect
  to the backend: endpoint, fields, markup, `main.js`, and the e-mail link the
  visitor gets back
- `~/Git/smartbyg/app.smartbyg.dk` — the backend and the app site behind every
  submission; its `CLAUDE.md`, `README.md` and `docs/api.md` are the source of
  truth for what happens to an enquiry after it leaves this page
