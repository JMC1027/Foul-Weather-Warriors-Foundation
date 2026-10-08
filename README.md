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

Open `site-data.js` in any text editor (Notepad works). It has five sections.

### 1. CONFIG — your organization's details

```js
const CONFIG = {
  donateUrl:     "https://www.zeffy.com/...",  // ← your donation page link
  zeffyEmbedUrl: "",                           // ← leave empty, see below
  heroImage:     "",                           // ← big photo at the top
  apparelUrl:    "",                           // ← merch store link
  email:         "",
  ein:           "41-4111270",
  facebook:      "",
  instagram:     "",
  youtube:       ""
};
```

- **donateUrl** — the full link from Zeffy. Everything else about donating follows
  from this one line.
- **zeffyEmbedUrl** — leave it empty. The site works out the embeddable version of
  your Zeffy form on its own. Only fill this in if you move to a different
  platform and need to point the donation window somewhere else by hand.
- **apparelUrl** — your merch store link. Until it is filled in, the **Apparel**
  item in the menu shows a small "Soon" tag and isn't clickable. Paste the link
  and it becomes live — nothing else to change.
- **heroImage** — the large photo across the top of the home page. Put a wide shot
  in the `images/` folder and write its path here, e.g. `"images/hero.jpg"`.
  Leave it empty and a dark storm backdrop is used instead. A landscape photo
  around 2000px wide works best; the left third sits behind the donation panel,
  so put the people on the **right** side of the frame.
- **Social links** — paste the full profile URL. Leave one as `""` and that icon
  simply won't appear.

---

### 2. DONATION — the amount buttons on the home page

```js
const DONATION = {
  pitch: "On our watch, no veteran stands in foul weather alone.",

  once:    { presets: [250, 120, 55, 30, 25, 12], default: 55 },
  monthly: { presets: [100, 50, 25, 22, 15, 10], default: 22 },

  startOn: "monthly"
};
```

- **pitch** — the sentence above the amount buttons.
- **presets** — the six buttons, in the order shown (three across, two rows).
  One-time and monthly have their own sets, because $250 once and $250 a month
  are very different asks.
- **default** — which button starts selected. Use one of the numbers above it.
- **startOn** — `"monthly"` or `"once"`, whichever tab opens first.

**How donating actually works.** The panel on the home page is yours — your
colors, your wording, your amounts. When somebody presses the Donate button,
your real Zeffy form opens in a window on top of the page, so they never leave
the site. They confirm the amount there and pay on Zeffy.

The amount they pick on your panel is shown at the top of that window as a
reminder, but it is **not** carried into the Zeffy form automatically — Zeffy has
no setting for that. This is why the window says "Enter it on the form below to
confirm."

Every Donate button on the site opens that same window, including the one in the
menu bar and the one on the photos page.

---

### 3. IMPACT — the big numbers band

```js
const IMPACT = [];
```

This starts empty and the whole section stays hidden while it is. Fill it in
once you have figures you can stand behind:

```js
const IMPACT = [
  { figure: "100%", label: "Of every donation reaches the mission" },
  { figure: "0",    label: "Dollars charged to attend an FWWF event" }
];
```

`figure` is the large orange number, `label` is the line underneath. Three
entries fit best; two or four also work.

---

### 4. ALBUMS — photos from past meetups

> **The gallery is currently switched off.** There are no photos yet, so the
> Meetup Photos page is parked: its menu links are commented out, the sample
> album in `site-data.js` is commented out, and search engines are told to skip
> it. Nothing was deleted. To bring it back:
>
> 1. Add a real album block to `ALBUMS` (steps below)
> 2. In `index.html`, uncomment the two lines marked `PARKED`
> 3. In `sitemap.xml`, uncomment the gallery block
> 4. In `robots.txt`, remove the `Disallow: /gallery.html` line
>
> Each spot is marked `PARKED` so you can search for the word.

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

Albums show newest first.

The commented-out `2026-06-example` block shows the shape. Replace it rather than
uncommenting it — its images are placeholders.

> **Tip:** resize photos to about 1600px wide before uploading. Straight-from-the-phone
> photos are often 5–10 MB each and will make the page slow to load.

---

### 5. PARTNERS — the scrolling logo belt

```js
const PARTNERS = [
  { name: "M.O.S Energy Pouches", url: "https://www.mosnootropics.com/", logo: "mos-nootropics.png" },
  { name: "Fuel 1 Team",          url: "https://fuel1team.com/",         logo: "fuel-1-team.png" }
];
```

The logos scroll steadily across the screen and pause when somebody points at
them. `name` is required; `url` and `logo` are optional:

- leave `url` as `""` and the logo shows without being a link
- leave `logo` as `""` and the name is shown as text instead
- to use a logo, drop the file in `images/partners/` and put the file name here

Logos are shown in grey and turn full color when you point at one, so that a
belt of very different logos still reads as one strip. Transparent PNGs look
best. The belt repeats the list as many times as it takes to fill the screen, so
it keeps working whether you have two partners or twenty.

---

## Changing the words on the home page

Headlines and paragraphs live in `index.html`. Open it in a text editor and look for the
comment banners:

| Banner | What it controls |
|---|---|
| `<!-- HERO -->` | The wordmark and the intro paragraph beside the donation panel |
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

## Going live, step by step

The code lives on GitHub at `JMC1027/Foul-Weather-Warriors-Foundation`. Netlify
watches that repository and republishes the site every time something is pushed
to it. The domain is registered at Wix and only needs to be pointed at Netlify.

### 1. Put the site on Netlify

1. Go to <https://app.netlify.com> and sign up — **Sign up with GitHub** is easiest.
2. **Add new site → Import an existing project → GitHub.**
3. Choose the `Foul-Weather-Warriors-Foundation` repository.
4. Leave **Build command** empty and **Publish directory** empty. There is no build step.
5. **Deploy.**

Half a minute later the site is live at an address like
`random-words-12345.netlify.app`. Open it and click around — especially the
**Donate** button, which should open the Zeffy form in a window over the page.

You can rename that address under **Site configuration → Change site name**,
which is handy but not required once the real domain is connected.

### 2. Point the Wix domain at Netlify

In Netlify: **Domain management → Add a domain** and type the domain.

> **Important:** Netlify will offer to run your DNS for you ("Netlify DNS").
> **Do not choose that.** It needs a nameserver change, and Wix does not allow
> nameserver changes on domains registered with them. Pick the option to point
> the domain yourself / use external DNS. Netlify then shows you two records.

In Wix: **Domains → your domain → Manage DNS records**, and add the two records
Netlify gave you:

| Type  | Host  | Value                                                  |
|-------|-------|--------------------------------------------------------|
| A     | `@`   | Netlify's IP address (they display it — `75.2.60.5` as of this writing) |
| CNAME | `www` | `your-site-name.netlify.app`                           |

It usually takes 15–60 minutes for the domain to start working, occasionally
longer. Once it does, Netlify issues a free SSL certificate on its own. A
certificate warning in the first hour is normal — wait it out.

### 3. The domain inside the files — done

`https://www.foulweatherwarriors.org` is already written into `robots.txt`,
`sitemap.xml`, and the `canonical` / `og:url` / `og:image` tags in both pages.
If the domain ever changes, those are the spots to update.

The site uses the **www** form as its main address. In Netlify, under
**Domain management**, make sure `www.foulweatherwarriors.org` is set as the
**primary domain** so the bare `foulweatherwarriors.org` redirects to it rather
than the other way round.

### 4. Get found on Google

Being online and being findable are different things. Search engines need to be told:

1. <https://search.google.com/search-console> → **Add property** → enter the
   domain → verify by adding the TXT record it gives you in the same Wix DNS
   screen as step 2.
2. In Search Console, **Sitemaps** → submit `https://yourdomain.org/sitemap.xml`.
3. <https://www.bing.com/webmasters> — same idea, covers Bing and DuckDuckGo.

Expect to appear in results within a few days to two weeks. Searches for the
organization's own name will rank quickly. Broader terms take months of real
content and links from other sites; that is normal and not a settings problem.

The fastest early boost: link the site from the Facebook page, the Instagram
profile, and the Zeffy page. Those links are how crawlers find a new site in the
first place.

### Making changes after launch

Edit `site-data.js` (or whatever needs changing), commit, push. Netlify picks it
up and the live site updates within a minute. There is nothing to click on
Netlify's side.

---

## Files at a glance

| File | What it is |
|---|---|
| `site-data.js` | **Everything you edit.** Config, events, photo albums. |
| `index.html` | The home page |
| `gallery.html` | The photo gallery page — **parked** until there are photos, see section 4 |
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
