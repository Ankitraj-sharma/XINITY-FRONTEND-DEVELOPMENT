// =============================================
//  XINITY COMMUNITY — main.js  [v3 — FULL UPGRADE]
//  Nav · Events + Search/Filter · FAQ · Counter
//  3D Cube · Theme Toggle · Contact Form JS
//  Toast Notifications · Tilt Cards · Particles
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════
    // 1. PAGE FADE IN
    // ══════════════════════════════════════════
    document.body.classList.add('page-loading');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-ready');
    }));
  
    // ══════════════════════════════════════════
    // 2. NAVBAR SCROLL EFFECT
    // ══════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      });
    }
  
    // ══════════════════════════════════════════
    // 3. HAMBURGER MENU
    // ══════════════════════════════════════════
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
      });
    }

    // ══════════════════════════════════════════
    // 4. CONTACT FORM SUBMISSION
    // ══════════════════════════════════════════
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (submitBtn) submitBtn.disabled = true;
        if (submitText) submitText.style.display = 'none';
        if (submitLoader) submitLoader.style.display = 'block';

        setTimeout(() => {
          if (submitBtn) submitBtn.disabled = false;
          if (submitText) {
            submitText.style.display = '';
            submitText.textContent = '✓ You\'re in!';
          }
          if (submitLoader) submitLoader.style.display = 'none';
          if (submitBtn) submitBtn.style.background = '#7DF9C2';

          showToast('🎉 Welcome to Xinity! Check your email for next steps.', 'success');

          setTimeout(() => {
            contactForm.reset();
            if (submitText) submitText.textContent = 'Join Xinity →';
            if (submitBtn) submitBtn.style.background = '';
            // Clear validation classes
            contactForm.querySelectorAll('input, select, textarea').forEach(el => {
              el.classList.remove('field-valid', 'field-error-state');
            });
            document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('visible'));
            _updateProgress();
          }, 3000);
        }, 1800);
      });

      // Init progress
      _updateProgress();
    }

    // ══════════════════════════════════════════
    // 12. TOAST NOTIFICATION SYSTEM
    // ══════════════════════════════════════════
    window.showToast = function(msg, type = 'success') {
      // Remove any existing toast
      const existingToast = document.querySelector('.toast');
      if (existingToast) {
        existingToast.remove();
      }

      // Create a new toast element
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = msg;

      // Append to the body and auto-remove after 3 seconds
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    };
});