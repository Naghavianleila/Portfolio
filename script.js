(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  function setNavOpen(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    navToggle.classList.toggle('active', isOpen);
    nav.classList.toggle('nav--open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  }

  function closeNav() {
    setNavOpen(false);
  }

  // Profile photo — show image when loaded, initials placeholder when missing
  const heroPhotoImg = document.querySelector('.hero__photo img');
  if (heroPhotoImg) {
    const heroPhoto = heroPhotoImg.closest('.hero__photo');
    const markLoaded = () => heroPhoto?.classList.remove('hero__photo--empty');
    const markEmpty = () => heroPhoto?.classList.add('hero__photo--empty');

    heroPhotoImg.addEventListener('load', () => {
      if (heroPhotoImg.naturalWidth > 0) markLoaded();
    });
    heroPhotoImg.addEventListener('error', markEmpty);

    if (heroPhotoImg.complete) {
      heroPhotoImg.naturalWidth > 0 ? markLoaded() : markEmpty();
    }
  }

  // Sticky nav background on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setNavOpen(!navLinks.classList.contains('open'));
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  document.querySelector('.nav__logo')?.addEventListener('click', closeNav);

  // Close menu on escape or outside click
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });

  // Close menu when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });

  // Scroll reveal animation
  const revealElements = document.querySelectorAll(
    '.timeline__item, .skill-category, .card, .pub-card, .cert-card, .section__header, .contact-wrapper > *'
  );

  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Animate skill bars when visible
  const skillBars = document.querySelectorAll('.skill-bar__fill');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => barObserver.observe(bar));

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.style.color =
              a.getAttribute('href') === `#${id}` ? 'var(--text-primary)' : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Contact form handling (client-side demo)
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = '';
    formNote.className = 'form-note';

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
      formNote.textContent = 'Please fill in all fields.';
      formNote.classList.add('error');
      return;
    }

    const mailtoLink = `mailto:naghavianleila@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\n${message}`
    )}`;

    window.location.href = mailtoLink;

    formNote.textContent = 'Opening your email client…';
    formNote.classList.add('success');
    contactForm.reset();
  });
})();
