# Foul Weather Warriors — Website

A plain HTML/CSS/JavaScript website. No build step, no accounts, no software to install.
Everything you'll normally change lives in **one file: `site-data.js`**.

---

## Quick start

**To see the site on your computer**, you need a tiny local web server — opening
`index.html` by double-clicking will make the photos and events fail to load.

If you have Python installed, open a terminal in this folder and run:

```
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the terminal to stop.

---

## The setup checklist

While anything is still unfinished, a small red-outlined **"Setup: N items left"** panel
appears in the bottom-left corner of the site. It lists exactly what's missing.

**It disappears on its own** once you've filled everything in. Visitors will see it too,
so clear it before sharing the site publicly.

---

## Editing the site

Open `site-data.js` in any text editor (Notepad works). It has three sections.

### 1. CONFIG — your organization's details

```js
const CONFIG = {
  donateUrl: "TODO",              // ← paste your donation page link here
  email:     "TODO@example.org",  // ← your public contact email
  ein:       "TODO",              // ← your 501(c)(3) EIN, e.g. "12-3456789"
  facebook:  "",
  instagram: "",
  youtube:   ""
};
```

- **donateUrl** — the full link from Givebutter, Zeffy, PayPal Giving Fund, Stripe, etc.
  Until you set it, the Donate buttons send people to your email instead of nowhere.
- **Social links** — paste the full profile URL. Leave one as `""` and that icon
  simply won't appear.

### 2. EVENTS — upcoming meetups

```js
const EVENTS = [
  {
    date:     "2026-08-15",
    title:    "Saturday Morning Coffee & Cards",
    location: "Miller's Diner, Springfield",
    blurb:    "Coffee is on us. No agenda, no sign-up sheet."
  }
];
```

- Dates are **YYYY-MM-DD** (year-month-day).
- **Old events disappear automatically** the day after they happen. You never have to
  delete them — though you can if the list gets long.
- To add another event, copy an entire `{ ... }` block including its comma, paste it
  below, and edit the text.
- If the list is empty, the site shows "Nothing on the calendar right now" instead.

### 3. ALBUMS — photos from past meetups

Three steps for each meetup:

1. **Make a folder** inside `images/meetups/`. Name it with no spaces —
   for example `images/meetups/2026-09-lake-day/`
2. **Copy your photos into it.** JPG or PNG. Any names you like.
3. **Add a block** to `ALBUMS` in `site-data.js`:

```js
{
  slug:   "2026-09-lake-day",     // must match the folder name exactly
  title:  "Lake Day Cookout",
  date:   "2026-09-12",
  blurb:  "Best turnout yet.",    // optional — delete this line to skip it
  cover:  "boat.jpg",
  photos: ["boat.jpg", "grill.jpg", "sunset.jpg"]
}
```

Albums show newest first. The six most recent photos also appear on the home page.

**Delete the `2026-06-example` block** (and its folder) once you have real photos.

> **Tip:** resize photos to about 1600px wide before uploading. Straight-from-the-phone
> photos are often 5–10 MB each and will make the page slow to load.

---

## Changing the words on the home page

Headlines and paragraphs live in `index.html`. Open it in a text editor and look for the
comment banners:

| Banner | What it controls |
|---|---|
| `<!-- HERO -->` | "Call your friends." headline and the intro paragraph |
| `<!-- STORY -->` | The "Why we exist" section |
| `<!-- PILLARS -->` | The three cards: Cost-Free Events, Camaraderie, Suicide Prevention |
| `<!-- DONATE -->` | Donation section wording |
| `<!-- CRISIS -->` | The crisis hotline numbers |
| `<!-- FOOTER -->` | Footer text and legal line |

Only change text **between** the `>` and `<` symbols. Leave the tags themselves alone.

---

## Changing the colors

All colors are defined once at the top of `styles.css`:

```css
:root {
  --bg:      #0b141a;   /* page background */
  --surface: #12202a;   /* cards */
  --accent:  #e8813c;   /* signal orange — buttons, links, highlights */
  ...
}
```

Change `--accent` and the entire site follows. If you pick a new accent color, check that
text on it is still readable — <https://webaim.org/resources/contrastchecker/> is free and
takes ten seconds.

---

## Putting the site online

Both of these are free for a site this size and connect directly to a folder or a
GitHub repository:

- **Netlify** — <https://app.netlify.com/drop> lets you literally drag this folder onto
  the page to publish it. Easiest option.
- **Vercel** — <https://vercel.com>, works the same way and is what 22-LIFE uses.

There's no build command to configure. Point it at this folder and it works.

**After you have a domain**, update these two files (both currently say `example.org`):

- `robots.txt`
- `sitemap.xml`

And in `index.html` and `gallery.html`, update the `og:image` meta tag to a full URL
(`https://yourdomain.org/images/og-card.jpg`) so shared links show a preview image on
Facebook. Facebook ignores relative paths, so this one genuinely matters.

---

## Files at a glance

| File | What it is |
|---|---|
| `site-data.js` | **Everything you edit.** Config, events, photo albums. |
| `index.html` | The home page |
| `gallery.html` | The photo gallery page |
| `styles.css` | All the styling |
| `script.js` | Menu, events, gallery, and photo viewer. You shouldn't need to touch this. |
| `images/` | The logo files and meetup photo folders |
| `robots.txt`, `sitemap.xml` | Help search engines find the site |

### The logo files

All three are generated from `FWWF Logo.png` (the 1254×1254 original — keep it
somewhere safe, it is not stored in this folder):

| File | Where it appears | Size |
|---|---|---|
| `images/logo.jpg` | The large emblem on the home page | 760px, 145 KB |
| `images/logo-mark.png` | The small mark in the menu bar, and the browser tab icon | 128px, 27 KB |
| `images/og-card.jpg` | The preview image when someone shares a link on Facebook | 1200×630, 82 KB |

The original is 2.7 MB, which is far too heavy to put on a web page — it would take
several seconds to appear on a phone. If you ever re-export the logo, shrink it the same
way rather than dropping the full-size file in.

**The emblem is displayed as a circle.** The source image is a square with a black
background; the site clips it to a round shape so it sits cleanly against the page.

### The meetup photos are still placeholders

The images in `images/meetups/` are hand-drawn SVG placeholders, not real photos. They
exist so the gallery renders correctly before you have pictures. Replace them with real
JPGs — the file extension doesn't matter as long as you update the names in
`site-data.js`.

---

## Still to hand over

- [x] ~~Logo~~ — done, in place on the home page, menu bar, and browser tab
- [ ] Meetup photos, grouped by event
- [ ] Donation platform link
- [ ] Public contact email
- [ ] 501(c)(3) EIN number
- [ ] Facebook / Instagram / YouTube links
- [x] ~~Confirm the exact legal organization name~~ — Foul Weather Warriors Foundation

The menu bar and footer wordmark stay as **Foul Weather Warriors** (the everyday name);
the full legal name **Foul Weather Warriors Foundation** is used in the intro paragraph
and the 501(c)(3) / copyright lines. If that split is wrong, say so and it's a quick fix.
