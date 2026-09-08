/**
 * theme.js — Dark / Light theme toggle
 * Persists via localStorage, respects prefers-color-scheme
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kc-theme';
  const html = document.documentElement;

  /**
   * Get the saved theme, or fall back to system preference.
   */
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  /**
   * Apply theme to <html data-theme="...">
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply immediately (before paint) to avoid flash
  applyTheme(getInitialTheme());

  // Wire up the toggle button after DOM loads
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Update nav background on scroll
    updateNavBg();
  });

  /**
   * Keep navbar background opacity correct when scrolled vs. at top.
   */
  function updateNavBg() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        navbar.style.borderBottomColor = 'var(--border2)';
      } else {
        navbar.style.borderBottomColor = '';
      }
    }, { passive: true });
  }
})();
