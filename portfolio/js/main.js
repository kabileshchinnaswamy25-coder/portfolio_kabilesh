/**
 * main.js
 * – Hamburger / mobile menu
 * – Smooth scroll (with nav offset)
 * – Career path tabs
 * – Project view tabs
 */

(function () {
  'use strict';

  /* ── MOBILE MENU ── */
  function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      menu.removeAttribute('aria-hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      const isOpen = menu.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    menu.querySelectorAll('.mobile-link, .mobile-resume').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') &&
          !menu.contains(e.target) &&
          !btn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ── SMOOTH SCROLL ── */
  function initSmoothScroll() {
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
      10
    ) || 64;

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 4;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── CAREER PATH TABS ── */
  function initCareerTabs() {
    const tabs   = document.querySelectorAll('.role-tab');
    const panels = document.querySelectorAll('.career-panel');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        // Deactivate all
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });

        // Activate selected
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const panelId = tab.getAttribute('data-panel');
        const panel   = document.getElementById(panelId);
        if (panel) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        }
      });
    });
  }

  /* ── PROJECT VIEW TABS ── */
  function initProjectTabs() {
    document.querySelectorAll('.project-view-tabs').forEach(function (tabGroup) {
      const card   = tabGroup.closest('.project-card');
      if (!card) return;
      const panels = card.querySelectorAll('.project-view-panel');
      const tabs   = tabGroup.querySelectorAll('.view-tab');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          // Deactivate all tabs
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          // Hide all panels
          panels.forEach(function (p) {
            p.setAttribute('hidden', '');
          });

          // Activate clicked tab
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          // Show matching panel
          const target = tab.getAttribute('data-target');
          const panel  = document.getElementById(target);
          if (panel) panel.removeAttribute('hidden');
        });
      });
    });
  }

  /* ── KEYBOARD NAV FOR CUSTOM TABS ── */
  function initTabKeyboard() {
    ['.role-tabs', '.project-view-tabs'].forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (group) {
        const tabs = Array.from(group.querySelectorAll('[role="tab"]'));
        tabs.forEach(function (tab, idx) {
          tab.addEventListener('keydown', function (e) {
            let next = -1;
            if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
            if (e.key === 'ArrowLeft')  next = (idx - 1 + tabs.length) % tabs.length;
            if (next >= 0) {
              tabs[next].focus();
              tabs[next].click();
            }
          });
        });
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSmoothScroll();
    initCareerTabs();
    initProjectTabs();
    initTabKeyboard();
  });
})();
