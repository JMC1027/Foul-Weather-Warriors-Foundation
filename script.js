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
     6. Partners
     7. Setup checklist (only appears while TODOs remain)
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




  /* ------------------------------------------- 7c. Partners and donors */

  function initPartners() {
    var grid = document.getElementById('partners-grid');
    if (!grid) return;

    if (!partners.length) {
      grid.innerHTML = '<p class="empty-state">Partner and donor logos coming soon.</p>';
      return;
    }

    grid.innerHTML = partners.map(function (p) {
      var name = esc(p.name || '');
      var inner = p.logo
        ? '<img src="images/partners/' + esc(p.logo) + '" alt="' + name + '" loading="lazy" />'
        : name;
      // A partner without a link is a plain block, not a dead anchor.
      return p.url
        ? '<a class="partner" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + inner + '</a>'
        : '<div class="partner">' + inner + '</div>';
    }).join('');
  }


  /* ------------------------------------------------------------------- init */

  function init() {
    applyConfig();
    initDrawer();
    initAlbums();
    initLightbox();
    initPartners();
    initSetupChecklist();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
