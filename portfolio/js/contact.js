/**
 * contact.js — Web3Forms submission + validation
 * Submits in-page via fetch. Never opens a mail client.
 */

(function () {
  'use strict';

  const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

  document.addEventListener('DOMContentLoaded', function () {
    const form      = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const statusEl  = document.getElementById('formStatus');
    const modal     = document.getElementById('contactSuccessModal');
    const modalClose = document.getElementById('contactSuccessClose');
    if (!form || !submitBtn || !statusEl) return;

    const defaultBtnLabel = submitBtn.textContent;

    /* ── FIELD REFS ── */
    const fields = {
      name:    { input: document.getElementById('contactName'),    error: document.getElementById('nameError') },
      email:   { input: document.getElementById('contactEmail'),   error: document.getElementById('emailError') },
      subject: { input: document.getElementById('contactSubject'), error: document.getElementById('subjectError') },
      message: { input: document.getElementById('contactMessage'), error: document.getElementById('messageError') },
    };

    /* ── VALIDATION ── */
    function validateEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function clearFieldErrors() {
      Object.values(fields).forEach(function (f) {
        if (!f.input || !f.error) return;
        f.error.textContent = '';
        f.input.style.borderColor = '';
      });
    }

    function setStatus(message, type) {
      statusEl.textContent = message;
      statusEl.className = type ? 'form-status ' + type : 'form-status';
    }

    function markError(field, msg) {
      field.error.textContent = msg;
      field.input.style.borderColor = '#f87171';
      return false;
    }

    function validate() {
      clearFieldErrors();
      setStatus('', '');
      let valid = true;
      let firstInvalid = null;

      if (!fields.name.input.value.trim()) {
        markError(fields.name, 'Please enter your name or company.');
        valid = false;
        firstInvalid = firstInvalid || fields.name.input;
      }
      if (!validateEmail(fields.email.input.value)) {
        markError(fields.email, 'Please enter a valid email address.');
        valid = false;
        firstInvalid = firstInvalid || fields.email.input;
      }
      if (!fields.subject.input.value.trim()) {
        markError(fields.subject, 'Please specify the role or opportunity.');
        valid = false;
        firstInvalid = firstInvalid || fields.subject.input;
      }
      if (!fields.message.input.value.trim()) {
        markError(fields.message, 'Please enter a message.');
        valid = false;
        firstInvalid = firstInvalid || fields.message.input;
      }

      if (firstInvalid) firstInvalid.focus();
      return valid;
    }

    /* ── LIVE VALIDATION ── */
    Object.values(fields).forEach(function (f) {
      if (!f.input) return;
      f.input.addEventListener('input', function () {
        if (f.error.textContent) {
          f.error.textContent = '';
          f.input.style.borderColor = '';
        }
      });
    });

    /* ── SUCCESS MODAL ── */
    function openSuccessModal() {
      if (!modal) {
        setStatus('Message sent successfully! Thanks for reaching out. I\'ll get back to you soon.', 'success');
        return;
      }
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (modalClose) modalClose.focus();
    }

    function closeSuccessModal() {
      if (!modal) return;
      modal.hidden = true;
      document.body.style.overflow = '';
      submitBtn.focus();
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-modal-close')) closeSuccessModal();
      });
    }
    if (modalClose) {
      modalClose.addEventListener('click', closeSuccessModal);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeSuccessModal();
    });

    function setSending(isSending) {
      submitBtn.disabled = isSending;
      submitBtn.setAttribute('aria-busy', isSending ? 'true' : 'false');
      submitBtn.textContent = isSending ? 'Sending...' : defaultBtnLabel;
    }

    /* ── SUBMIT (Web3Forms only — no mailto) ── */
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (submitBtn.disabled) return;
      if (!validate()) return;

      setSending(true);
      setStatus('', '');

      try {
        const data = new FormData(form);
        const res = await fetch(WEB3FORMS_URL, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        var json = null;
        try {
          json = await res.json();
        } catch (parseErr) {
          json = null;
        }

        if (res.ok && json && json.success) {
          form.reset();
          clearFieldErrors();
          setStatus('', '');
          openSuccessModal();
        } else {
          var failMsg = (json && json.message) ? json.message : 'Something went wrong. Please try again.';
          setStatus(failMsg, 'error');
        }
      } catch (err) {
        setStatus('Something went wrong. Please try again. Your message has been kept so you can resend it.', 'error');
      } finally {
        setSending(false);
        if (statusEl.textContent) {
          statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });
})();
