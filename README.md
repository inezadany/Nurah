
# For Nurah ♥

A one-page love letter built with plain HTML, CSS and JavaScript. No build step, no framework — just open it.

## What's inside

- **Hero** — a layered photo composition, floating hearts, and a soft spotlight that follows the cursor.
- **About** — an editorial introduction with the chef photos and little "love facts".
- **Moments** — a polaroid-style gallery of all six photos with a keyboard/touch-friendly lightbox.
- **Reasons** — a shuffled deck of 24 reasons, plus a "hold the heart" love meter that maxes out at infinity.
- **The letter** — a wax-sealed envelope that opens into a full love letter.
- **Promises** — four things worth putting in writing.
- **Write back** — a note form that sends to your inbox through Web3Forms.
- **Passcode gate** — a private door before the page: enter `2026` to come in.
- **Secret** — the footer heart has a surprise if she taps it five times.

## Files

```
index.html
css/styles.css
js/config.js        ← your Web3Forms key and email
js/app.js
assets/images/      ← the six photos, renamed semantically
img1–img6.jpeg      ← originals (kept)
```

## The passcode gate

The page opens on a private screen. The code is **2026**.

- Change it in `js/app.js`: `const PASSCODE = "2026";`
- Once she enters it, the page stays unlocked for that browser session (`sessionStorage`), so a refresh won't ask again.
- **Quiet notification:** when the correct code is entered, the page sends a background Web3Forms submission with the subject *“Nurah opened her site”* — date, time zone and device. Nothing appears on screen, so she won't know it was sent.
- The gate is a convenience, not real security: the code lives in the JavaScript, so anyone who reads the source can find it.

## Activate the reply form

The access key is already set in `js/config.js`. If you ever need to replace it:

1. Go to [web3forms.com](https://web3forms.com) and create an access key for **inezabyishimod@gmail.com** (the email must be verified once).
2. Open `js/config.js`.
3. Paste the key between the quotes:

```js
web3formsAccessKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
```

If the key is ever missing, submitting the form opens an email draft to your address instead, so nothing gets lost.

> Web3Forms access keys are designed to be used in the browser — the key is not a secret password.

## Run it

Double-click `index.html`, or serve the folder for the most reliable experience:

```powershell
# if you have Python
python -m http.server 8080
# then visit http://localhost:8080
```

Because the form calls `https://api.web3forms.com`, deploying the site (Netlify Drop, Vercel, GitHub Pages, etc.) is the most reliable way to use it.

> **Privacy note:** photos on a public deployment are public. If this is meant only for her, use a private link or a host with password protection (Netlify has this on paid plans), or keep it local. The page also asks search engines not to index it.

## Easy customisations

- **Her name / your name** — search for `Nurah` and `Dany` in `index.html`.
- **The letter** — the whole letter lives in `index.html` inside `<div class="letter-body">`.
- **Reasons** — edit the `reasons` array near the top of the reasons section in `js/app.js`.
- **Captions** — each gallery button has `data-caption="..."` and `data-alt="..."`.
- **Email address** — change it in `js/config.js`, in the footer/mail links in `index.html`, and in the hidden fallback if needed.
- **Colours** — the whole palette is at the top of `css/styles.css` under `:root`.

## Accessibility & polish

- Keyboard navigation for the menu, lightbox, letter, love meter and form.
- `prefers-reduced-motion` is respected (no floating hearts, no tilt, no marquee).
- Alt text on photos, labelled controls, live regions for form/meter feedback.
- Responsive from small phones to wide desktops.

Made with too much love (and a little CSS).

