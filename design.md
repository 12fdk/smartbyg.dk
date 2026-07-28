# Design

This document captures the visual identity, layout conventions, typography,
colour, and component patterns for **smartbyg.dk** — the marketing / landing
page for the **SmartByg** service (a multi-service helper for DIY homeowners:
materials, advice, tool rental, house-purchase review, project review).

## Direction: "Nordisk Tillid" (Confident Nordic-Tech)

A clean, warm, Scandinavian aesthetic that signals a **smart, capable service**
without feeling cold or corporate. The page should reassure a private homeowner
mid-renovation that their renovation decisions are in safe hands — competent and
precise, but approachable.

**Personality:** trustworthy · calm · precise · modern · Danish.

Guiding principles:

- **Warm, not stark.** Backgrounds are an unbleached off-white, never pure
  `#FFFFFF`. This reduces screen fatigue and reads as "human" rather than
  clinical — in line with 2026 Scandinavian web trends.
- **One confident accent.** A deep teal (blue-green) carries all primary
  actions and brand moments. Blue-green is the colour of 2026 precisely because
  it blends *nature* with *clean technology* — exactly our positioning.
- **Structure signals competence.** A tight, visible grid with crisp dividers
  communicates that the service is organised and dependable.
- **Real over stock.** Use authentic project photography (real Danish homes,
  real renovations) wherever possible. Authentic visuals are the strongest trust
  signal for this audience.

## Colour

Warm off-white base, deep teal accent, charcoal text, plus a small set of
earthy supporting tones. Avoid pure white and pure black.

### Core palette

| Token              | Hex       | Use                                                        |
| ------------------ | --------- | ---------------------------------------------------------- |
| `--bg`             | `#FAF8F4` | Page background (warm off-white / "unbleached paper")      |
| `--surface`        | `#FFFFFF` | Cards / raised surfaces (used sparingly, on top of `--bg`) |
| `--surface-sunken` | `#F1ECE3` | Sunken sections, alternating bands, input fields           |
| `--text`           | `#1A1A1A` | Primary text (charcoal, not pure black)                    |
| `--text-muted`     | `#5C574F` | Secondary text, captions, labels                           |
| `--border`         | `#E3DCD0` | Hairline dividers, card borders, grid lines                |

### Accent (brand)

| Token              | Hex       | Use                                                     |
| ------------------ | --------- | ------------------------------------------------------- |
| `--accent`         | `#1F5E5B` | Primary buttons, links, brand marks, key highlights     |
| `--accent-hover`   | `#184B49` | Hover / pressed state for accent elements               |
| `--accent-soft`    | `#DCE8E5` | Tinted backgrounds, badges, selected states             |
| `--accent-contrast`| `#FAF8F4` | Text/icons on top of `--accent` (warm off-white)        |

### Supporting (use sparingly, for warmth & illustration)

| Token         | Hex       | Use                                              |
| ------------- | --------- | ------------------------------------------------ |
| `--clay`      | `#C8956D` | Warm secondary accent, decorative, friendly tags |
| `--sage`      | `#8A9A7B` | Tertiary, success states, eco/material cues      |
| `--sand`      | `#EAE0CE` | Texture blocks, illustration backgrounds         |

### Semantic

| Token        | Hex       | Use            |
| ------------ | --------- | -------------- |
| `--success`  | `#3F7A4E` | Confirmation   |
| `--warning`  | `#C8853A` | Caution        |
| `--error`    | `#B5482E` | Errors         |

### Usage rules

- **60 / 30 / 10:** ~60% `--bg`, ~30% surfaces & neutral text, ~10% teal accent.
  Teal should feel deliberate, not everywhere.
- Primary CTA is **always** `--accent`. Never use clay/sage for primary actions.
- Body text on `--bg`/`--surface` meets WCAG AA (`--text` ≥ 7:1). Verify any
  text placed on accent or supporting colours.

## Typography

**One geometric/humanist sans across the whole page** — consistency reads as
precision. No serif. Set generous line-height for calm, readable copy.

- **Primary typeface:** `Schibsted Grotesk` (variable). A characterful Nordic
  grotesk (originally commissioned by a Scandinavian media group), free on
  Google Fonts, with full Danish glyph coverage (æ ø å). Distinctive but calm —
  precise without feeling generic.
- **Fallback stack:** `"Schibsted Grotesk", "Helvetica Neue", "Segoe UI", system-ui, -apple-system, sans-serif`
- Keep it to **one** family. If a more neutral option is ever needed, `Geist`
  or `General Sans` are acceptable substitutes — never default to Arial/Inter.

### Type scale (desktop → mobile)

| Role        | Size (desktop) | Weight | Line-height | Notes                         |
| ----------- | -------------- | ------ | ----------- | ----------------------------- |
| Display/H1  | 56px → 36px    | 600    | 1.05        | Tight tracking `-0.02em`      |
| H2          | 40px → 28px    | 600    | 1.1         | Section headers               |
| H3          | 24px → 20px    | 600    | 1.2         | Card titles                   |
| Lead        | 20px → 18px    | 400    | 1.5         | Hero subhead, intro paragraph |
| Body        | 17px → 16px    | 400    | 1.6         | Default running text          |
| Small/Label | 14px           | 500    | 1.4         | Eyebrows, captions, nav       |
| Eyebrow     | 13px           | 600    | 1.3         | Uppercase, `+0.08em` tracking |

- Numerals for the journey steps and section eyebrows (`01 02 03 04`) use
  **tabular figures** and the accent colour.
- Max text measure: ~65–70 characters per line for body copy.

## Layout & grid

- **Max content width:** 1200px, centred, with 24px (mobile) → 80px (desktop)
  side gutters.
- **Grid:** 12-column, 24px gutter on desktop. Make structure *visible* —
  crisp 1px `--border` dividers between sections and around the hero's
  content/image split.
- **Hero:** asymmetric two-column split — copy + CTA on the left, a single
  strong image (teal-tinted or with a teal frame) on the right. Stacks on mobile.
- **Vertical rhythm:** section padding 96px (desktop) / 56px (mobile). Use an
  8px spacing base unit (`4, 8, 12, 16, 24, 32, 48, 64, 96`).
- **Section banding:** alternate `--bg` and `--surface-sunken` to separate
  sections without heavy borders.

## Components

### Buttons

- **Primary:** `--accent` fill, `--accent-contrast` text, 8px radius, 14px×24px
  padding, weight 600. Hover → `--accent-hover`. Subtle lift on hover only
  (translateY(-1px)), no large shadows.
- **Secondary:** transparent fill, 1px `--accent` border, `--accent` text.
- **Tertiary / text link:** `--accent` text with underline on hover.
- Generous tap targets (min 44px height) — many users are on mobile mid-project.

### Cards

- `--surface` background, 1px `--border`, 12px radius, 24px padding.
- Soft, low shadow only (`0 1px 2px rgba(26,26,26,0.04)`); rely on borders and
  the grid for structure, not heavy shadows.

### Interactive selector ("Hvad har du brug for hjælp til?")

- The page's centrepiece (`.picker`, `#start`): a raised surface card with 6
  selectable options (Materialer / Rådgivning / Værktøj / Huskøb /
  Projektgennemgang / Noget andet). Picking one reveals an adapted request form
  beneath it. Selected option uses `--accent` border + `--accent-soft` fill.
- Laid out 2-up on mobile, 3-up from 720px (two tidy rows). A single 6-across
  row clips the longest labels, so don't reach for it. `.picker-label` sets
  `hyphens: auto`; "Projekt&shy;gennemgang" carries a soft hyphen so it breaks
  cleanly in the narrow mobile column.
- Materialer / Huskøb / Projektgennemgang show the file-upload field (each with
  its own label); others show a plain form.
- Should read as a modern, app-like service — not a static brochure.

### Service blocks (`.services` / `.service`)

- The "Vores ydelser" section is **five detailed blocks**, not a grid of terse
  cards — each offering has to sell itself. A block is a `.card`-style surface
  split two ways from 880px: `.service-main` (icon badge, small accent kicker
  with the short service name, sentence-length `h3`, two or three short
  paragraphs, primary CTA) and `.service-facts` (a sunken panel with a label
  and a tick-marked list of what you get / what we look at).
- A block with no list takes `.service-solo`, which collapses it to one column
  and keeps the copy at a readable measure.
- Every CTA deep-links into the selector via `data-select`.

### "Sådan foregår det" (customer journey)

- A **vertical** numbered walk-through (`.journey`), not a row of terse tiles —
  the flow is the main trust-builder, so it gets room to explain itself.
- Each `.journey-step` is a card: round accent numeral, heading, one paragraph,
  and a short `.journey-example` (accent-tinted left rule) that follows one
  named customer through the whole flow, so the process reads as real.
- Five steps: **Fortæl om dit projekt → Vi gennemgår det sammen → Du får ét
  samlet tilbud → Godkend og få det leveret → Du bygger, vi er stadig med.**
  (No MobilePay step.)
- Closes with a `.journey-foot`: primary CTA plus the e-mail address, so the
  section converts on its own. (No phone number anywhere on the site.)

### Trust strip (`.strip`)

- Full-width sunken band directly under the selector: four short factual
  claims (uddannet tømrer · pris før opstart · fri levering · én
  kontaktperson). 2-up on mobile, 4-up from 800px. Facts only — no numbers we
  cannot document.

### Value / savings band (`.savings`)

- Accent-soft band that answers "hvad kan jeg spare?": one large accent figure
  plus a checklist of *why* the saving exists. Figures are illustrative and must
  be defensible.

### Project cards

- "Populære projekter" uses the standard `.card` grid (icon badge, title, one
  line of copy, deep link), not bare chips — each card is an entry point that
  pre-selects an option in the selector via `data-select`.

### Navigation

- Desktop: full inline nav (Forside · Ydelser · Sådan foregår det · Projekter ·
  FAQ · Kontakt) plus the language switch and the primary CTA.
- Below 800px the nav collapses behind `.nav-toggle` and drops down from the
  header bar; the "Få et tilbud" CTA stays visible at all widths.

### Trust elements (high priority for conversion)

- Testimonials from real homeowners (name + project type, e.g. "Køkken, Aarhus").
- Logos / certifications / "samarbejder med" strip if available.
- Concrete reassurance copy near CTAs ("Gratis at komme i gang", "Ingen
  binding", "Svar inden for X").

### Forms / inputs

- `--surface-sunken` fill, 1px `--border`, 8px radius. Focus ring uses
  `--accent`. Labels above fields, in `--text-muted`.

### "Din sag" — talking about the app site

Everything after a submission happens on the customer's case at
`app.smartbyg.dk/sag` (the backend repo is `~/Git/smartbyg/app.smartbyg.dk` —
see [CLAUDE.md](CLAUDE.md)). The copy on this page has to hand the visitor over
to it without turning into a manual:

- Call it **"din sag"** in customer-facing Danish, never "portalen", "systemet"
  or "app'en". The journey and the FAQ both use that phrase.
- The journey mentions it three times and no more — step 1 (you get the link),
  step 3 (the tilbud lands there, you say yes there), step 5 (you write there).
- The FAQ carries the detail: what happens after you send, how you get in, files
  and messages, drafts, accepting a tilbud. Five entries, kept right after the
  materialeliste question so they read as one block.
- Link the case as `https://app.smartbyg.dk/sag` with `rel="noopener"` — once in
  the FAQ, once in the contact list, once in the footer. It is a *returning*
  customer's door, so it never competes with the primary CTA.
- Never promise e-mail replies as a way to reach a case: inbound e-mail is not
  wired on the backend.

### Iconography

- Thin-to-medium line icons, consistent stroke (1.5–2px), rounded caps. Calm,
  not playful. Teal or charcoal stroke.

## Imagery & texture

- **Photography:** real Danish homes mid- or post-renovation, natural light,
  light wood, neutral interiors. Warm tone, never blue/cold colour grade.
- **Renovation moments:** in-progress builds, light wood, tools at rest,
  materials staged for a project, finished details — adds tactility and
  reinforces the "real DIY project" theme. Materials, tools and delivery are all
  part of the offering, so they are fair subjects.
- **Subtle texture only:** a faint paper/grain on large flat sections is OK for
  depth; never let it compete with content or hurt performance.
- Avoid generic corporate stock, handshakes, and clip-art.

## Motion

- Restrained and quick (150–250ms, ease-out). Fade/slide-in on scroll for
  sections. Buttons: colour + 1px lift only. No bouncy or attention-grabbing
  animation — motion should feel composed and confident.
- Respect `prefers-reduced-motion`.

## Voice & tone (copy)

- Approachable, trustworthy, practical — speaking to a **private homeowner**,
  not a contractor. Plain Danish, "du"-form, no industry jargon.
- Lead with reassurance and outcomes ("Gør dit byggeprojekt nemmere",
  "Kom godt fra start", "Pris altid før vi går i gang"), not features.
- Keep CTAs concrete and low-pressure: **"Kom i gang"**, **"Få et tilbud"**,
  **"Upload materialeliste"**, **"Få rådgivning"**.

## Languages

- Primary: **Danish (da)**. Also fully translated to **English (en)**.
- Design for text expansion: EN strings can run ~15–30% longer than DA. Don't
  hard-code widths around copy; let buttons and headings wrap gracefully.
- Use full Danish characters (æ ø å) — confirm the chosen webfont renders them.
- Brand name renders as **SmartByg** (one word) in all copy, and the domain is
  `smartbyg.dk` to match.

## Accessibility

- Target **WCAG 2.2 AA**. Verify contrast for every text/background pair,
  especially text on `--accent`, `--clay`, and `--sage`.
- Visible keyboard focus states (use `--accent` focus ring).
- Semantic HTML landmarks; alt text on all meaningful imagery.
- Honour `prefers-reduced-motion` and `prefers-color-scheme` (see below).

## Dark mode (optional / future)

Not required for launch. If added, invert to a warm dark base (`#1A1815`,
not pure black) with a slightly brightened teal (`#2E8A85`) so the accent keeps
its contrast. Keep the same warm character — avoid cold grey-blue darks.

## Tech notes

- Static site on **GitHub Pages**. Keep it lightweight: no heavy frameworks
  required for a landing page; semantic HTML + CSS (custom properties for the
  tokens above) is sufficient.
- Define the colour and spacing tokens as CSS custom properties on `:root` so
  the palette stays single-sourced.
- Self-host or subset the webfont for performance and reliable æ/ø/å rendering.

## See also

- [CLAUDE.md](CLAUDE.md) — project purpose, audience, and constraints.
