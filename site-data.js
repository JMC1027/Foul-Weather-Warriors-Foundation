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

  // Public contact email. Nothing on the site displays this any more (the
  // contact section was removed) - it is only a fallback destination for the
  // Donate buttons if donateUrl above is ever emptied. Optional.
  email:     "",

  // Your 501(c)(3) Employer Identification Number, e.g. "12-3456789"
  ein:       "41-4111270",

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
const ALBUMS = [
  {
    slug:   "2026-06-example",
    title:  "EXAMPLE ALBUM — replace me",
    date:   "2026-06-14",
    blurb:  "This is a sample album so you can see how the gallery looks. Delete this block once you add real photos.",
    cover:  "01.svg",
    photos: ["01.svg", "02.svg", "03.svg"]
  }
];

/* ----------------------------------------------------------------------------
   3. PARTNERS & DONORS — the organizations standing with FWWF.

   "name" is required. "url" and "logo" are optional:
     - leave "url" as "" and the entry shows as plain text instead of a link
     - leave "logo" as "" and the name is shown as text instead of an image
     - to use a logo, drop the file in images/partners/ and put the
       file name here, e.g. "acme.png"

   Leave the list empty and the section says logos are coming soon.
   -------------------------------------------------------------------------- */
const PARTNERS = [
  // { name: "Example Partner Co.", url: "https://example.com", logo: "" }
];
