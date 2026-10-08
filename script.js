/* ============================================================================
   FOUL WEATHER WARRIORS — site behavior
   ----------------------------------------------------------------------------
   You should not need to edit this file. All the content lives in site-data.js.

   Contents:
     1. Helpers
     2. CONFIG wiring (donate links, email, EIN, year, socials)
     3. Drawer menu
     4. Gallery (albums + lightbox)
     5. Lightbox
     6. Partner and donor belt
     7. Setup checklist (only appears while TODOs remain)
     8. Hero backdrop photo
     9. Donation panel and donation window
    10. Impact numbers
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------ 1. Helpers */

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /** Escape text before it goes into an HTML string. */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** True when a config value has not been filled in yet. */
  function isTodo(v) {
    return !v || String(v).trim() === '' || String(v).trim().toUpperCase().indexOf('TODO') === 0;
  }

  /**
   * Parse "YYYY-MM-DD" as a LOCAL date.
   * new Date("2026-08-15") parses as UTC midnight, which renders as Aug 14
   * anywhere west of Greenwich. Splitting the parts avoids that.
   */
  function parseDate(str) {
    var p = String(str || '').split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }

  var MONTHS_LONG = ['January','February','March','April','May','June','July',
                     'August','September','October','November','December'];

  function longDate(d) {
    return MONTHS_LONG[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  var cfg    = typeof CONFIG === 'object' && CONFIG ? CONFIG : {};
  var albums = typeof ALBUMS === 'object' && ALBUMS ? ALBUMS : [];
  var partners = typeof PARTNERS === 'object' && PARTNERS ? PARTNERS : [];


  /* ------------------------------------------------------ 2. CONFIG wiring */

  var SOCIAL_ICONS = {
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
    youtube:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.9-.5-5.77a3 3 0 0 0-2.12-2.13C18.5 3.6 12 3.6 12 3.6s-6.5 0-8.38.5A3 3 0 0 0 1.5 6.23C1 8.1 1 12 1 12s0 3.9.5 5.77a3 3 0 0 0 2.12 2.13c1.88.5 8.38.5 8.38.5s6.5 0 8.38-.5a3 3 0 0 0 2.12-2.13C23 15.9 23 12 23 12zM9.9 15.5v-7l6.1 3.5-6.1 3.5z"/></svg>'
  };
  var SOCIAL_NAMES = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' };

  function applyConfig() {
    var mailto = isTodo(cfg.email) ? null : 'mailto:' + cfg.email;

    // Donate buttons
    $$('[data-donate]').forEach(function (el) {
      if (!isTodo(cfg.donateUrl)) {
        el.setAttribute('href', cfg.donateUrl);
        el.setAttribute('rel', 'noopener');
        el.setAttribute('target', '_blank');
      } else if (mailto) {
        // No donation platform yet — route to email rather than a dead link.
        el.setAttribute('href', mailto + '?subject=' + encodeURIComponent('I want to donate'));
      }
    });


    // Apparel link. With no store yet it stays in the menu as a "Soon" item
    // rather than a link to nowhere; filling in CONFIG.apparelUrl makes it live.
    $$('[data-apparel]').forEach(function (el) {
      if (isTodo(cfg.apparelUrl)) {
        el.classList.add('is-soon');
        el.setAttribute('aria-disabled', 'true');
        el.insertAdjacentHTML('beforeend', '<span class="soon-tag">Soon</span>');
        return;
      }
      el.setAttribute('href', cfg.apparelUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });

    // EIN
    $$('[data-ein]').forEach(function (el) {
      if (isTodo(cfg.ein)) {
        el.innerHTML = '<span class="todo-flag">EIN needed</span>';
      } else {
        el.textContent = cfg.ein;
      }
    });

    // Copyright year
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    // Social icon rows
    var links = Object.keys(SOCIAL_ICONS).filter(function (k) { return !isTodo(cfg[k]); });
    $$('[data-socials]').forEach(function (row) {
      if (!links.length) { row.remove(); return; }
      row.innerHTML = links.map(function (k) {
        return '<a href="' + esc(cfg[k]) + '" target="_blank" rel="noopener"' +
               ' aria-label="' + SOCIAL_NAMES[k] + '">' + SOCIAL_ICONS[k] + '</a>';
      }).join('');
    });
  }


  /* ---------------------------------------------------------- 3. Drawer menu */

  function initDrawer() {
    var toggle  = $('#nav-toggle');
    var drawer  = $('#drawer');
    var overlay = $('#nav-overlay');
    var closeBtn = $('#drawer-close');
    if (!toggle || !drawer || !overlay) return;

    function isOpen() { return drawer.classList.contains('open'); }

    function setOpen(open) {
      drawer.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);

      if (open) {
        // flush the pending style change so the drawer is visible, and
        // therefore focusable, before we move focus into it
        void drawer.offsetWidth;
        var first = drawer.querySelector('a, button');
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () { setOpen(!isOpen()); });
    overlay.addEventListener('click', function () { setOpen(false); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });

    // Tapping a menu link closes the drawer (same-page anchors especially)
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;

      if (e.key === 'Escape') { setOpen(false); return; }

      // Keep Tab inside the drawer while it is open
      if (e.key !== 'Tab') return;
      var items = $$('a, button', drawer).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0];
      var last  = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }




  /* ---------------------------------------------------------- 5. Gallery */

  // group id -> [{ src, alt, caption }]
  var galleries = {};

  function albumPhotos(album) {
    return (album.photos || []).map(function (file, i) {
      return {
        src: 'images/meetups/' + album.slug + '/' + file,
        alt: (album.title || 'Meetup') + ' — photo ' + (i + 1),
        caption: (album.title || 'Meetup') +
                 (album.date && parseDate(album.date) ? ' · ' + longDate(parseDate(album.date)) : '')
      };
    });
  }

  function shotHTML(photo, group, index) {
    return '' +
      '<button type="button" class="shot" data-gallery="' + esc(group) + '" data-index="' + index + '">' +
        '<img src="' + esc(photo.src) + '" alt="' + esc(photo.alt) + '" loading="lazy" ' +
             'width="400" height="300" />' +
        '<span class="sr-only">Open photo</span>' +
      '</button>';
  }

  function sortedAlbums() {
    return albums.slice().sort(function (a, b) {
      var da = parseDate(a.date), db = parseDate(b.date);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db - da; // newest first
    });
  }


  function initAlbums() {
    var root = $('#albums');
    if (!root) return;

    var list = sortedAlbums();
    if (!list.length) {
      root.innerHTML =
        '<p class="empty-state">No photos posted yet. Check back after the next meetup.</p>';
      return;
    }

    root.innerHTML = list.map(function (album) {
      var photos = albumPhotos(album);
      galleries[album.slug] = photos;

      var d = parseDate(album.date);
      var count = photos.length;

      return '' +
        '<section class="album">' +
          '<div class="album-head">' +
            '<h2>' + esc(album.title || album.slug) + '</h2>' +
            '<span class="album-meta">' +
              (d ? longDate(d) : '') + (d && count ? ' · ' : '') +
              (count ? count + ' photo' + (count === 1 ? '' : 's') : '') +
            '</span>' +
          '</div>' +
          (album.blurb ? '<p class="album-blurb">' + esc(album.blurb) + '</p>' : '') +
          (count
            ? '<div class="photo-grid">' +
                photos.map(function (p, i) { return shotHTML(p, album.slug, i); }).join('') +
              '</div>'
            : '<p class="empty-state">No photos in this album yet.</p>') +
        '</section>';
    }).join('');
  }


  /* ------------------------------------------------------------- 6. Lightbox */

  function initLightbox() {
    var box     = $('#lightbox');
    var img     = $('#lb-img');
    var caption = $('#lb-caption');
    var btnClose = $('#lb-close');
    var btnPrev  = $('#lb-prev');
    var btnNext  = $('#lb-next');
    if (!box || !img) return;

    var current = [];   // active photo array
    var index   = 0;
    var opener  = null; // element to return focus to

    function show(i) {
      if (!current.length) return;
      index = (i + current.length) % current.length;   // wrap around
      var p = current[index];
      img.src = p.src;
      img.alt = p.alt;
      caption.textContent = p.caption
        ? p.caption + ' · ' + (index + 1) + ' of ' + current.length
        : (index + 1) + ' of ' + current.length;

      var multi = current.length > 1;
      btnPrev.style.display = multi ? '' : 'none';
      btnNext.style.display = multi ? '' : 'none';
    }

    function open(group, i, trigger) {
      current = galleries[group] || [];
      if (!current.length) return;
      opener = trigger || null;
      show(i);
      box.classList.add('open');
      document.body.classList.add('nav-open');   // reuse the scroll lock
      // The viewer is visibility:hidden until the class lands, and a hidden
      // element cannot take focus. Reading offsetWidth flushes the pending
      // style change so the button is actually focusable on the next line.
      void box.offsetWidth;
      btnClose.focus();
    }

    function close() {
      box.classList.remove('open');
      document.body.classList.remove('nav-open');
      img.src = '';
      if (opener) { opener.focus(); opener = null; }
    }

    // Open from any thumbnail, including ones rendered later
    document.addEventListener('click', function (e) {
      var shot = e.target.closest ? e.target.closest('.shot') : null;
      if (!shot) return;
      open(shot.dataset.gallery, parseInt(shot.dataset.index, 10) || 0, shot);
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { show(index - 1); });
    btnNext.addEventListener('click', function () { show(index + 1); });

    // Click the backdrop (not the photo or a button) to close
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.tagName === 'FIGURE') close();
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;

      if (e.key === 'Escape')     { close(); return; }
      if (e.key === 'ArrowLeft')  { show(index - 1); return; }
      if (e.key === 'ArrowRight') { show(index + 1); return; }

      // Keep Tab on the viewer's own controls
      if (e.key !== 'Tab') return;
      var items = [btnClose, btnPrev, btnNext].filter(function (b) {
        return b.style.display !== 'none';
      });
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }


  /* ---------------------------------------------- 7. Setup checklist (TODOs) */

  function initSetupChecklist() {
    var missing = [];
    if (isTodo(cfg.donateUrl)) missing.push('Donation link (CONFIG.donateUrl)');
    if (isTodo(cfg.ein))       missing.push('EIN number (CONFIG.ein)');
    if (isTodo(cfg.facebook) && isTodo(cfg.instagram) && isTodo(cfg.youtube)) {
      missing.push('At least one social link (CONFIG.facebook / instagram / youtube)');
    }
    // Matches the placeholder title only, so a real album is never flagged.
    albums.forEach(function (a) {
      if (/replace me/i.test(a.title || '')) missing.push('Replace the example photo album');
    });
    if (!partners.length) missing.push('Partners & donors list (PARTNERS in site-data.js)');

    // Nothing outstanding — the panel never renders.
    if (!missing.length) return;
    if (sessionStorage.getItem('fww-setup-dismissed') === '1') return;

    var panel = document.createElement('aside');
    panel.className = 'setup-panel';
    panel.innerHTML =
      '<div class="setup-head">' +
        '<strong>Setup: ' + missing.length + ' item' + (missing.length === 1 ? '' : 's') + ' left</strong>' +
        '<button type="button" class="setup-close" aria-label="Hide setup checklist">&times;</button>' +
      '</div>' +
      '<ul>' + missing.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      '<p>Edit <code>site-data.js</code>. This panel disappears on its own once everything is filled in.</p>';

    document.body.appendChild(panel);
    $('.setup-close', panel).addEventListener('click', function () {
      sessionStorage.setItem('fww-setup-dismissed', '1');
      panel.remove();
    });
  }




  /* ------------------------------------------- 7c. Partner and donor belt */

  var PARTNER_TILE = 230;   // keep in step with .marquee-item width in styles.css

  /**
   * One tile. The second copy of the belt is decorative: it repeats logos a
   * screen reader has already been given, so it carries no alt text and stays
   * out of the tab order.
   */
  function partnerHTML(p, decorative) {
    var name = esc(p.name || '');

    var mark = p.logo
      ? '<img class="partner-logo" src="images/partners/' + esc(p.logo) +
        '" alt="' + (decorative ? '' : name) + '" loading="lazy" />'
      : '<span class="partner-name">' + name + '</span>';

    // A partner without a link simply has no link, rather than a dead one.
    var inner = p.url
      ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener"' +
        (decorative ? ' tabindex="-1"' : '') + '>' + mark +
        (decorative ? '' : '<span class="sr-only">' + name + ' (opens in a new tab)</span>') +
        '</a>'
      : mark;

    return '<div class="marquee-item">' + inner + '</div>';
  }

  function initPartners() {
    var track = $('[data-marquee-track]');
    if (!track) return;
    var belt = track.parentNode;

    if (!partners.length) {
      belt.innerHTML = '<p class="empty-state">Partner and donor logos coming soon.</p>';
      return;
    }

    function build() {
      // One copy has to be at least as wide as the screen, or the belt shows a
      // gap between the end of the list and the start of the repeat. With a
      // short list that means cycling through it several times over, rounded
      // up to whole passes so the sequence never breaks off mid-list.
      var needed = Math.max(partners.length,
                            Math.ceil(window.innerWidth / PARTNER_TILE) + 1);
      var perCopy = Math.ceil(needed / partners.length) * partners.length;

      var copy = [];
      for (var i = 0; i < perCopy; i++) copy.push(partners[i % partners.length]);

      function copyHTML(decorative) {
        return '<div class="marquee-copy"' + (decorative ? ' aria-hidden="true"' : '') + '>' +
               copy.map(function (p) { return partnerHTML(p, decorative); }).join('') +
               '</div>';
      }

      // Two identical copies. The animation slides the track exactly half its
      // own width, which lands copy 2 where copy 1 started — no visible seam.
      track.innerHTML = copyHTML(false) + copyHTML(true);

      // Same travel speed however many logos there are, so adding a partner
      // lengthens the loop instead of speeding it up.
      var PX_PER_SECOND = 45;
      track.style.setProperty('--marquee-duration',
        Math.round(perCopy * PARTNER_TILE / PX_PER_SECOND) + 's');

      // A single logo has nothing to scroll past; centre it instead.
      belt.classList.toggle('marquee--static', partners.length < 2);
      return perCopy;
    }

    var built = build();

    // Widening the window past the built width would open a gap in the loop,
    // so rebuild — but only when more tiles are actually needed.
    var timer;
    window.addEventListener('resize', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        if (Math.ceil(window.innerWidth / PARTNER_TILE) + 1 > built) built = build();
      }, 200);
    });
  }


  /* ------------------------------------------------- 8. Hero backdrop photo */

  function initHeroImage() {
    var bg = $('[data-hero-bg]');
    if (!bg) return;
    if (isTodo(cfg.heroImage)) return;          // storm gradient stays
    bg.style.backgroundImage = 'url("' + String(cfg.heroImage).replace(/"/g, '%22') + '")';
    bg.classList.add('has-photo');
  }


  /* --------------------------------------------- 9. Donation panel + window */

  /**
   * Zeffy serves the same form twice: a full page at /<locale>/donation-form/...
   * and a stripped-down version at /embed/donation-form/... that is meant to be
   * framed. Swap the locale segment for "embed" to get the second from the
   * first. Anything that is not a Zeffy link has no known embed, so we return
   * "" and the Donate buttons fall back to opening a new tab.
   */
  function embedUrlFor(url) {
    if (!isTodo(cfg.zeffyEmbedUrl)) return cfg.zeffyEmbedUrl;
    if (isTodo(url)) return '';
    var m = String(url).match(/^(https:\/\/(?:www\.)?zeffy\.com)\/[a-z]{2}-[A-Z]{2}\/(.+)$/);
    return m ? m[1] + '/embed/' + m[2] : '';
  }

  /** 1250 -> "$1,250"; 12.5 -> "$12.50" */
  function money(n) {
    var whole = Math.round(n) === n;
    return '$' + n.toFixed(whole ? 0 : 2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var give = {
    freq: 'monthly',
    amount: 0,
    form: null,
    embed: ''
  };

  function giveConfig() {
    var d = (typeof DONATION === 'object' && DONATION) ? DONATION : {};
    return {
      pitch: d.pitch || '',
      once: (d.once && d.once.presets && d.once.presets.length)
              ? d.once : { presets: [250, 120, 55, 30, 25, 12], default: 55 },
      monthly: (d.monthly && d.monthly.presets && d.monthly.presets.length)
              ? d.monthly : { presets: [100, 50, 25, 22, 15, 10], default: 22 },
      startOn: d.startOn === 'once' ? 'once' : 'monthly'
    };
  }

  function initGive() {
    give.embed = embedUrlFor(cfg.donateUrl);

    var form = $('#give');
    if (!form) return;                          // gallery.html has no panel
    give.form = form;

    var d       = giveConfig();
    var tabs    = $$('.give-tab', form);
    var amounts = $('[data-give-amounts]', form);
    var input   = $('#give-amount');
    var pitch   = $('[data-give-pitch]', form);
    var cta     = $('[data-give-cta]', form);
    var dedicate = $('#give-dedicate');
    var dedication = $('#give-dedication');

    if (pitch) {
      if (d.pitch) pitch.textContent = d.pitch;
      else pitch.remove();
    }

    /** Redraw the six buttons for whichever tab is showing. */
    function renderAmounts() {
      var set = d[give.freq];
      amounts.innerHTML = set.presets.map(function (n) {
        return '<button type="button" class="give-amount" data-amount="' + n + '"' +
               ' aria-pressed="false">' + esc(money(n)) + '</button>';
      }).join('');
      markSelected();
    }

    /** Light up whichever preset matches the amount in the field, if any. */
    function markSelected() {
      $$('.give-amount', amounts).forEach(function (b) {
        b.setAttribute('aria-pressed',
          parseFloat(b.dataset.amount) === give.amount ? 'true' : 'false');
      });
    }

    function updateCta() {
      if (!cta) return;
      var label = 'Donate';
      if (give.amount > 0) label += ' ' + money(give.amount);
      if (give.freq === 'monthly' && give.amount > 0) label += ' / month';
      cta.textContent = label;
    }

    function setAmount(n, fromInput) {
      give.amount = isFinite(n) && n > 0 ? n : 0;
      if (!fromInput && input) input.value = give.amount ? String(give.amount) : '';
      markSelected();
      updateCta();
    }

    function setFreq(next) {
      give.freq = next;
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', t.dataset.freq === next ? 'true' : 'false');
      });
      renderAmounts();
      // A monthly default is a different number from the one-time default, so
      // switching tabs re-seeds the amount rather than carrying one across.
      setAmount(d[next]['default']);
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { setFreq(t.dataset.freq); });
    });

    amounts.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.give-amount') : null;
      if (!btn) return;
      setAmount(parseFloat(btn.dataset.amount));
    });

    if (input) {
      input.addEventListener('input', function () {
        setAmount(parseFloat(input.value), true);
      });
    }

    if (dedicate && dedication) {
      dedicate.addEventListener('change', function () {
        dedication.hidden = !dedicate.checked;
        if (dedicate.checked) {
          var field = $('#give-honoree');
          if (field) field.focus();
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      openGive();
    });

    setFreq(d.startOn);
  }


  /* --- the window that holds the real donation form --- */

  var giveModal = {
    root: null,
    frame: null,
    opener: null,
    loaded: false,
    hideTimer: 0
  };

  function giveRecapText() {
    if (!give.form || !give.amount) return '';
    var honoree = '';
    var box = $('#give-dedicate');
    var field = $('#give-honoree');
    if (box && box.checked && field && field.value.trim()) {
      honoree = ' in honor of <b>' + esc(field.value.trim()) + '</b>';
    }
    return 'You chose <b>' + esc(money(give.amount)) +
           (give.freq === 'monthly' ? ' a month' : '') + '</b>' + honoree +
           '. Enter it on the form below to confirm.';
  }

  function openGive(trigger) {
    var root = giveModal.root;
    if (!root) return false;

    giveModal.opener = trigger || document.activeElement || null;

    var recap = $('[data-give-recap]', root);
    if (recap) recap.innerHTML = giveRecapText();

    // The form is only fetched the first time somebody opens the window, so a
    // visitor who never donates never pays for loading it.
    if (!giveModal.loaded) {
      var frame = document.createElement('iframe');
      frame.src = give.embed;
      frame.title = 'Donation form';
      frame.setAttribute('loading', 'lazy');
      frame.setAttribute('allow', 'payment');
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      giveModal.frame.appendChild(frame);
      giveModal.loaded = true;
    }

    // Reopening during the closing fade would otherwise let that pending
    // timeout hide the window again a moment later.
    window.clearTimeout(giveModal.hideTimer);

    root.hidden = false;
    document.body.classList.add('nav-open');     // reuse the scroll lock
    // Flush the pending style change so the panel is visible, and therefore
    // focusable, before focus moves into it.
    void root.offsetWidth;
    root.classList.add('open');

    var close = $('#give-modal-close');
    if (close) close.focus();
    return true;
  }

  function closeGive() {
    var root = giveModal.root;
    if (!root || root.hidden) return;
    root.classList.remove('open');
    document.body.classList.remove('nav-open');

    // let the fade finish before the panel leaves the layout
    giveModal.hideTimer = window.setTimeout(function () { root.hidden = true; }, 220);

    if (giveModal.opener && giveModal.opener.focus) giveModal.opener.focus();
    giveModal.opener = null;
  }

  function initGiveModal() {
    var root = $('#give-modal');
    if (!root) return;

    giveModal.root  = root;
    giveModal.frame = $('#give-modal-frame', root);

    // A link we cannot frame is a link we should not intercept.
    if (!give.embed) { root.remove(); giveModal.root = null; }

    $$('[data-donate-raw]').forEach(function (a) {
      if (isTodo(cfg.donateUrl)) { a.remove(); return; }
      a.setAttribute('href', cfg.donateUrl);
    });

    if (!giveModal.root) return;

    var close = $('#give-modal-close');
    if (close) close.addEventListener('click', closeGive);

    root.addEventListener('click', function (e) {
      if (e.target === root) closeGive();        // backdrop only
    });

    document.addEventListener('keydown', function (e) {
      if (giveModal.root.hidden) return;
      if (e.key === 'Escape') { closeGive(); return; }

      // Hold Tab on the window's own controls. The form inside the frame runs
      // its own focus order once the pointer or Tab lands in it.
      if (e.key !== 'Tab') return;
      var items = $$('button, a[href]', giveModal.root)
                    .filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Every Donate button on the site opens the window instead of navigating.
    // The href stays put, so ctrl-click and middle-click still open a tab.
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-donate]') : null;
      if (!btn) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      openGive(btn);
    });
  }


  /* ------------------------------------------------- 10. Impact numbers */

  function initImpact() {
    var row = $('[data-impact]');
    if (!row) return;
    var stats = (typeof IMPACT === 'object' && IMPACT) ? IMPACT : [];
    if (!stats.length) return;                   // band stays hidden

    row.innerHTML = stats.map(function (s) {
      return '<div class="stat">' +
               '<span class="stat-figure">' + esc(s.figure || '') + '</span>' +
               '<span class="stat-label">' + esc(s.label || '') + '</span>' +
             '</div>';
    }).join('');

    var band = row.closest ? row.closest('.impact-band') : null;
    if (band) band.hidden = false;
  }


  /* ------------------------------------------------------------------- init */

  function init() {
    applyConfig();
    initHeroImage();
    initDrawer();
    initAlbums();
    initLightbox();
    initGive();
    initGiveModal();
    initImpact();
    initPartners();
    initSetupChecklist();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
