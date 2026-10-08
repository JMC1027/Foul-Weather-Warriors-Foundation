/* ============================================================================
   FOUL WEATHER WARRIORS — SITE DATA
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to keep the site up to date.
   Change the text between the "quotes". Keep the commas and brackets exactly
   where they are. See README.md for step-by-step instructions.
   ========================================================================== */


/* ----------------------------------------------------------------------------
   1. CONFIG — organization details, links, and contact info.
   Anything still marked TODO shows a visible warning on the site.
   Leave a social link as "" (empty) to hide that icon.
   -------------------------------------------------------------------------- */
const CONFIG = {
  orgName:   "Foul Weather Warriors Foundation",   // full legal name, used in legal lines
  tagline:   "Call your friends.",

  // Where the Donate buttons go. Paste the full link from your donation
  // platform (Givebutter, Zeffy, PayPal Giving Fund, Stripe, etc.)
  donateUrl: "https://www.zeffy.com/en-US/donation-form/foul-weather-warriors-donations",

  // The same Zeffy form, in its embeddable (stripped-down) form. This is what
  // loads inside the donation window on the site so nobody has to leave the
  // page. Leave it as "" and the site works it out from donateUrl above.
  zeffyEmbedUrl: "",

  // Big photo behind the top of the home page. Drop a wide shot of a meetup
  // into images/ and put the path here, e.g. "images/hero.jpg".
  // Leave it as "" and the site uses a dark storm backdrop instead.
  heroImage: "",

  // Public contact email. Nothing on the site displays this any more (the
  // contact section was removed) - it is only a fallback destination for the
  // Donate buttons if donateUrl above is ever emptied. Optional.
  email:     "",

  // Your 501(c)(3) Employer Identification Number, e.g. "12-3456789"
  ein:       "41-4111270",

  // Where the Apparel link in the menu goes (your merch store — Bonfire,
  // Shopify, etc.). While this is "" the menu shows "Apparel — Soon" and
  // it is not clickable. Paste the link and it goes live.
  apparelUrl: "",

  // Social profiles. Leave "" to hide the icon entirely.
  facebook:  "https://www.facebook.com/profile.php?id=61560673681849",
  instagram: "https://www.instagram.com/foul_weather_warriors/",
  youtube:   ""
};




/* ----------------------------------------------------------------------------
   2. ALBUMS — photos from past meetups. Newest first.

   For each meetup:
     1. Make a folder:  images/meetups/YOUR-FOLDER-NAME/
     2. Drop the photos in it
     3. Add a block below, listing every photo file name

   "slug"   = the folder name you made (exact spelling, no spaces)
   "cover"  = which photo to use as the album's cover tile
   "photos" = every photo file name, in the order you want them shown
   -------------------------------------------------------------------------- */
// PARKED — the gallery page is switched off until there are photos to show.
// To bring it back: (1) add a real album block here, (2) uncomment the two
// gallery links in index.html, (3) uncomment the gallery entry in sitemap.xml,
// (4) remove the Disallow line from robots.txt. The sample block below shows
// the shape of an album; leave it commented out.
const ALBUMS = [
  // {
  //   slug:   "2026-06-example",
  //   title:  "EXAMPLE ALBUM — replace me",
  //   date:   "2026-06-14",
  //   blurb:  "This is a sample album so you can see how the gallery looks.",
  //   cover:  "01.svg",
  //   photos: ["01.svg", "02.svg", "03.svg"]
  // }
];

/* ----------------------------------------------------------------------------
   3. DONATION PANEL — the amount buttons on the home page.

   These are just the suggested amounts. Whatever a visitor picks here, they
   confirm it on the Zeffy form that opens, so nothing breaks if you change them.

   "presets" = the six buttons, in the order shown (3 across, 2 rows)
   "default" = which one starts selected — must be one of the numbers above it
   -------------------------------------------------------------------------- */
const DONATION = {
  // The line of text above the amount buttons.
  pitch: "On our watch, no veteran stands in foul weather alone.",

  once: {
    presets: [250, 120, 55, 30, 25, 12],
    default: 55
  },

  monthly: {
    presets: [100, 50, 25, 22, 15, 10],
    default: 22
  },

  // Which tab opens first: "once" or "monthly".
  startOn: "monthly"
};


/* ----------------------------------------------------------------------------
   4. IMPACT — the big numbers band on the home page.

   Leave this list empty and the whole section stays hidden, which is where it
   starts. Fill it in once you have figures you can stand behind.

   "figure" is the big orange number, "label" is the line under it.
   Three entries fit best; two or four also work.

   const IMPACT = [
     { figure: "100%", label: "Of every donation reaches the mission" },
     { figure: "0",    label: "Dollars charged to attend an FWWF event" }
   ];
   -------------------------------------------------------------------------- */
const IMPACT = [];


/* ----------------------------------------------------------------------------
   5. PARTNERS & DONORS — the organizations standing with FWWF.

   "name" is required. "url" and "logo" are optional:
     - leave "url" as "" and the entry shows as plain text instead of a link
     - leave "logo" as "" and the name is shown as text instead of an image
     - to use a logo, drop the file in images/partners/ and put the
       file name here, e.g. "acme.png"

   Leave the list empty and the section says logos are coming soon.
   -------------------------------------------------------------------------- */
const PARTNERS = [
  {
    name: "M.O.S Energy Pouches",
    url:  "https://www.mosnootropics.com/",
    logo: "mos-nootropics.png"
  },
  {
    name: "Fuel 1 Team",
    url:  "https://fuel1team.com/",
    logo: "fuel-1-team.png"
  }
];
