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

**Form wiring — check before writing copy.** On `main` both forms still post to
**Web3Forms** (`api.web3forms.com/submit`) with a placeholder access key, i.e.
they deliver nothing. The switch to the backend
(`https://smartbyg-api.fra.appwrite.run/requests`, two submit buttons for
send-vs-draft, Danish field-name aliases, the `botcheck` honeypot kept, Danish
error text straight from the backend) is **open PR #20**, branch
`feature/post-to-smartbyg-backend`, not yet merged. Until it lands, front-page
copy about "din sag" describes the backend's behaviour, not what this site
actually does. Note that PR #20 predates the domain move and the phone removal,
so it still carries `renoraad.dk` and the phone number — fix both when merging.

[backend-integration.md](backend-integration.md) is the specification for that
wiring: the endpoint, every field name and alias, the markup and `main.js`
changes, what the customer's e-mail and login link actually contain, and the
four things to fix in PR #20 before it merges. Read it before touching either
form.

Other placeholders to finalise: the public e-mail (`kontakt@smartbyg.dk` — the
address is in the copy, but no mailbox exists yet; smartbyg.dk has no MX
records), the CVR number (footer), and the Handelsbetingelser /
Privatlivspolitik / Cookiepolitik pages. There is deliberately **no phone number
anywhere on the site** — do not reintroduce one; the request form, the case at
`app.smartbyg.dk/sag` and e-mail are the contact channels. Simon still rings
customers back, so copy may say *we* call — just never publish a number.

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
