# Connecting the forms to the SmartByg backend

How a visitor on this page becomes a **case** they can open from their own
inbox. This is the specification for the wiring — the exact endpoint, the exact
field names, the exact markup and JavaScript changes, and what the backend does
after the form is gone from the screen.

Nothing here changes behaviour on its own. It is the plan the code change
follows, so the two sides can be read against each other without opening two
repos at once.

The backend lives in `~/Git/smartbyg/app.smartbyg.dk` (GitHub
`12fdk/app.smartbyg.dk`). Its `docs/api.md` is the contract and wins over this
document if the two ever drift; everything below was read out of that repo's
source, not from memory.

---

## 1. The flow, end to end

What we want the visitor to experience:

1. They pick an option in **"Hvad har du brug for hjælp til?"** and fill in the
   form that appears.
2. They press **Send forespørgsel** — or **Gem og færdiggør senere**, which
   parks it as a draft.
3. The browser posts the form as `multipart/form-data` to the public API. No
   page reload; the status line under the form answers.
4. The backend, in one request:
   - validates the fields and answers in Danish if something is wrong;
   - creates an Appwrite **account** for that e-mail (or reuses the one that
     address already has — an address is one customer, however many times they
     write in);
   - uploads the attachments, readable by that account and by admins, nobody
     else;
   - stores the case with a reference like `SB-7K2Q9F`;
   - seeds the timeline with the enquiry itself, so the case reads as a
     conversation from its first line;
   - mails the customer a **login link straight into the case**, and mails
     Simon that a new enquiry arrived (a draft mails only the customer — there
     is nothing for us to act on yet).
5. The page shows the reference and tells them to look in their inbox.
6. The customer clicks the link in the mail, lands signed in on
   `https://app.smartbyg.dk/sag/<id>`, and from there follows the status, sends
   the drawing they forgot, and writes to Simon.

Step 4 is entirely the backend's. This page's whole job is step 3 — one `fetch`
of a `FormData` — plus showing the answer honestly.

## 2. The endpoint

```
POST https://smartbyg-api.fra.appwrite.run/requests
```

`multipart/form-data` (what we send — it is the only way to carry a material
list) or `application/json`. No API key, no token, no signature: the guard is
CORS plus a honeypot plus a per-IP rate limit, all described below.

There is nothing secret to put in this repo. The Web3Forms `access_key`,
`subject` and `from_name` inputs have no counterpart here and are deleted, not
replaced.

## 3. Field map

The backend already accepts this site's Danish field names as aliases, so the
inputs keep their `name` attributes and only the form's `action` changes.

| Input on this page | Backend field | Required | Notes |
|---|---|---|---|
| `Navn` | `name` | yes | max 128 |
| `Mail` | `email` | yes | lowercased and stored; it is the customer's identity |
| `Telefon` | `phone` | **yes** | 8–15 digits after stripping non-digits |
| `Adresse` | `address` | no | max 255 |
| `Projekttype` | `project_type` | no | matched case-insensitively; an unknown value is stored as null, not an error |
| `Kommentar` / `Besked` | `message` | no | max 5000 |
| `Hvad_har_du_brug_for` | `service` | yes | see below |
| `attachment` | *(any file field)* | no | up to 5 files, 10 MB each |
| `botcheck` | — | — | honeypot, must stay empty |
| `submit` | `submit` | no | `"false"` stores a draft; default `true` |
| `source` | `source` | no | defaults to `web` |

Two of these decide whether a submission is accepted at all:

**`service`.** The picker's Danish labels are accepted alongside the slugs, so
`main.js` needs no translation table. All six of its current values are already
aliases — `Materialer`, `Rådgivning`, `Værktøj`, `Huskøb`, `Projektgennemgang`,
`Andet` map to `materialer`, `raadgivning`, `vaerktoej`, `huskoeb`,
`projektgennemgang`, `andet`. A missing or unrecognised value is a `422` with
*"Vælg hvad du har brug for hjælp til."* — so if the picker's copy ever changes,
check `functions/_shared/validate.js` in the backend repo before shipping it.

**`phone`.** The contact form's phone field is optional today. It cannot stay
optional: a case needs a number, and the whole submission is rejected without
one. Make it `required` in the markup so the visitor is told at the field rather
than after a round trip.

`Projekttype`'s `<option>`s carry no `value`, so their visible text is what gets
posted — `Gipsvæg`, `Terrasse`, and so on. That is fine; those are aliases too.

### Attachments

The file input's `accept` list (`.pdf,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.heic`) is
narrower than what the bucket allows (it also takes `doc`, `docx`, `odt`, `ods`,
`heif`, `webp`, `gif`). Leaving it narrow is deliberate — the four Office
formats are download-only in the case view, so we would rather not invite them
— but it means a file the visitor drags past the picker can still be refused by
the bucket with `400 upload_failed` and a Danish message naming the file.

## 4. What changes in `index.html`

### The request form (`#request-form`)

```html
<form class="request-form" id="request-form"
      action="https://smartbyg-api.fra.appwrite.run/requests"
      method="POST" enctype="multipart/form-data" novalidate>
  <input type="hidden" name="Hvad_har_du_brug_for" id="form-service" value="Materialer" />
  <!-- Honeypot anti-spam (must stay empty). -->
  <input type="checkbox" name="botcheck" class="visually-hidden" tabindex="-1" autocomplete="off" />
```

- `action` moves from `api.web3forms.com/submit` to the endpoint above.
- **Delete** `access_key`, `subject` (`#form-subject`) and `from_name`. The
  backend writes its own subject lines.
- **Keep** `botcheck` — this backend uses the same honeypot.
- **Keep** `Hvad_har_du_brug_for` (`#form-service`); `main.js` still sets it
  from the picker.

Deleting `#form-subject` means dropping the `subjectField` lookup and the line
that writes to it in `selectOption` (`main.js`) — three lines, nothing else
reads it.

Then the second button, which is the only new UI:

```html
<div class="form-foot">
  <!--
    Two ways out of the form. "Gem" stores the case as a draft the visitor
    finishes later from the link we mail them; nothing reaches us until they
    send it.
  -->
  <button type="submit" class="btn btn-primary btn-lg" data-submit="true">Send forespørgsel</button>
  <button type="submit" class="btn btn-ghost btn-lg" data-submit="false">Gem og færdiggør senere</button>
  <p class="form-note">Du får altid en pris, inden vi går i gang — uden skjulte gebyrer.</p>
</div>
```

`data-submit` is the whole difference between the two paths. Everything else —
fields, validation, request, error handling — is shared.

### The contact form (`#contact-form`)

Same `action`, same three deletions, same honeypot, plus:

```html
<!-- A message from here is a case too, just without a chosen service. -->
<input type="hidden" name="Hvad_har_du_brug_for" value="andet" />
<input type="hidden" name="source" value="kontaktformular" />
```

and the phone field becomes required:

```html
<label class="field">
  <span class="field-label">Telefon</span>
  <input type="tel" name="Telefon" autocomplete="tel" required />
</label>
```

The contact form gets **no** draft button. There is no material list to come
back to; a message is either sent or it is not.

`source` is worth setting: it is stored on the row and shows in the admin, so
Simon can see at a glance which enquiries came from the picker and which from
the bottom of the page. Do not use the value `demo` — that string is reserved,
and the backend refuses to mail anything for a row carrying it.

## 5. What changes in `main.js`

One function, `wireForm`, and it keeps its shape. The Web3Forms
placeholder-key guard goes away — there is no key to be missing.

```js
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

  function show(kind, msg) { /* unchanged */ }

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
      .catch(function () { show("error", GENERIC_ERROR); })
      .finally(function () {
        for (var j = 0; j < buttons.length; j++) buttons[j].disabled = false;
        if (btn) btn.textContent = btnText;
      });
  });
}
```

Four things in there are load-bearing:

- **`body.set("submit", …)`** — set it explicitly on both paths rather than
  relying on the default. A form with two submit buttons that only sometimes
  carries the field is a bug waiting for the next person.
- **Disable every submit button, restore every submit button.** Disabling only
  the pressed one leaves the other live during the request.
- **Show `data.message`.** The backend writes its errors in Danish precisely so
  the site can print them. *"Indtast en gyldig e-mailadresse."* is worth far
  more than *"der opstod en fejl"*, and the `error` code beside it is the stable
  thing to branch on if we ever want to focus the offending field — `422` also
  carries `field`.
- **The generic fallback is for `fetch` rejecting and for a non-JSON answer
  only** — a dropped connection, an origin that is not allow-listed. It must not
  name a phone number: this site publishes none.

### The success text, and the reference that can be null

```js
function successText(draft, reference) {
  var ref = reference ? " (" + reference + ")" : "";
  return draft
    ? "Gemt" + ref + "! Vi har sendt dig en mail med et link, så du kan færdiggøre sagen, når det passer dig."
    : "Tak! Vi har modtaget din henvendelse" + ref +
      " og vender tilbage hurtigst muligt. Du får en mail med et link, hvor du kan følge din sag.";
}
```

A submission that trips the honeypot is answered `200 {"ok": true,
"reference": null}` and silently discarded — the bot must not learn it was
caught. That means the success branch runs with **no reference**, and
concatenating it unguarded prints *"Din reference er null."* to anyone whose
password manager or accessibility tool happened to fill the hidden field.
Guard it, as above.

## 6. What comes back

```
201 {"ok": true, "reference": "SB-7K2Q9F", "id": "6a68…", "status": "new"}
201 {"ok": true, "reference": "SB-7K2Q9F", "id": "6a68…", "status": "draft"}
200 {"ok": true, "reference": null}                       // honeypot
400 {"ok": false, "error": "upload_failed",     "message": "Filen \"…\" kunne ikke uploades. …"}
403 {"ok": false, "error": "origin_not_allowed", …}
413 {"ok": false, "error": "file_too_large" | "too_many_files", …}
422 {"ok": false, "error": "validation_failed", "message": "…", "field": "email"}
429 {"ok": false, "error": "rate_limited",      "message": "Vi har lige modtaget flere henvendelser fra dig. Prøv igen om lidt."}
```

`ok` is the only thing to branch on for success. `error` is stable and
machine-readable; `message` is Danish and safe to print as-is.

## 7. The e-mail, and the link

This is the half of the promise the page makes, so it is worth knowing exactly
what lands in the inbox.

**Submitted** — subject *"Vi har modtaget din henvendelse (SB-7K2Q9F)"*, with
the case reference, the status, and a button reading **Følg din sag**.

**Draft** — subject *"Din sag er gemt (SB-7K2Q9F)"*, saying in as many words
that it has *not* been sent to us yet, with a button reading **Færdiggør din
sag**.

Simon is mailed only for a submitted case, at `NOTIFY_TO`, with the customer's
address as `Reply-To`.

The button points at:

```
https://app.smartbyg.dk/sag/login?userId=<id>&secret=<48-char token>&sag=<case id>
```

- The token is minted per mail by `users.createToken`, is **single-use**, and
  expires after **14 days** (`PORTAL_TOKEN_TTL_DAYS`).
- The portal trades it for a session and redirects to `/sag/<case id>` — the
  `sag` parameter is what makes the link land on the case rather than the list.
- **Nothing secret is stored or mailed.** The account is created with no
  password at all, so there is none to leak; the customer can set one later if
  they want.
- Every later update mails a fresh link, so the newest mail in the inbox is
  always a working way in. If they lose it, `/sag` takes an e-mail address and
  sends a new one.

None of this is our concern on this page beyond the copy — but the copy must
match it. Do not write "log ind med din kode", and do not invite a reply to the
notification: inbound e-mail is not wired, so a reply reaches Simon's personal
inbox and never the case.

Two operational limits worth carrying in your head before adding a form
anywhere: mail goes out over Brevo's free plan, **300 a day**, and every
enquiry costs two of them.

## 8. Origins, and running it locally

CORS is an allow-list on the backend (`ALLOWED_ORIGINS`); an origin that is not
on it gets `403 origin_not_allowed` and the form shows the generic error. On the
list today:

```
https://smartbyg.dk, https://www.smartbyg.dk,
https://renoraad.dk, https://www.renoraad.dk,
https://app.smartbyg.dk, https://smartbyg-admin.appwrite.network,
http://localhost:8000, http://localhost:5173
```

So `python3 -m http.server 8000` in this repo talks to the live backend
unchanged. Opening `index.html` from `file://` does **not** — the origin is
`null`. Use the server.

The old `renoraad.dk` entries are for links already sitting in people's inboxes,
not an invitation to reintroduce the domain in this repo's copy.

## 9. Spam, and what is not enabled

- **Honeypot** — the `botcheck` checkbox. Filled means discarded, answered as if
  it had worked.
- **Rate limit** — more than 5 submissions from one IP in 10 minutes gets `429`.
  The IP is stored hashed, never raw.
- **Turnstile** — the backend will verify a `cf-turnstile-response` field if
  `TURNSTILE_SECRET` is set. It is empty, so the check passes unconditionally
  and this page needs no widget. If it is ever turned on, the form must send
  that field or every submission becomes `400 captcha_failed`.

## 10. Verifying it

Against the live backend, from this repo's directory:

```bash
python3 -m http.server 8000
# then, in the browser: fill the form, press each button in turn
```

Or without a browser:

```bash
curl -sS https://smartbyg-api.fra.appwrite.run/requests \
  -H 'Origin: https://smartbyg.dk' \
  -F 'Navn=Test Testesen' -F 'Mail=…' -F 'Telefon=12345678' \
  -F 'Hvad_har_du_brug_for=Materialer' -F 'Kommentar=test' -F 'submit=false'
```

What to check, in order: `ok` and a `SB-` reference come back; the case appears
in the admin at `https://app.smartbyg.dk/requests`; the mail arrives; its button
signs you in on the case without a password; the draft one says the case has not
been sent.

**The project is production.** Use an address you own, and delete the row, the
files and the account afterwards — the backend repo's `CLAUDE.md` says the same
thing and means it. The `Demodata` screen in the admin exists so training never
has to touch a real case; it is not a place to point this form.

## 11. Relationship to PR #20

[#20](https://github.com/12fdk/smartbyg.dk/pull/20) — *Post the forms to the
SmartByg backend instead of Web3Forms* — is the implementation of most of this,
written before the domain move. It is still the right shape. Before it merges:

- it carries `renoraad.dk` in the copy and in `CLAUDE.md`, and **the phone
  number**, which has since been removed from the whole site — both error
  fallbacks in its `main.js` say *"ring til os på 29 90 02 95"*;
- its success text concatenates `data.reference` unguarded, so the honeypot path
  prints `null` (§5);
- its `CLAUDE.md` hunk edits a section that no longer exists on `main`, so it
  will conflict;
- its "not yet true" caveat is out of date: `BREVO_API_KEY` is set and mail does
  send now.

Rebasing it onto `main` and fixing those four is less work than starting again.
