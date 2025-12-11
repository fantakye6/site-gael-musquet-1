// ===== Navbar hamburger =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }
});

// ===== Scroll anim intro (si présent) =====
document.addEventListener('DOMContentLoaded', () => {
  const introSection = document.querySelector('.intro');
  const portraitCTA = document.querySelector('.portrait-cta');
  const halo = document.querySelector('.halo');

  if (!introSection || !portraitCTA || !halo) return;

  function handleScroll() {
    const rect = introSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight * 0.8) {
      portraitCTA.style.opacity = '1';
      portraitCTA.style.transform = 'translateX(-50%) translateY(-6px)';
      halo.style.transform = 'translate(-50%, -50%) scale(1.05)';
    } else {
      portraitCTA.style.opacity = '0';
      portraitCTA.style.transform = 'translateX(-50%) translateY(10px)';
      halo.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
  }

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('load', handleScroll);
});

// ===== Hacker text (si présent) =====
document.addEventListener('DOMContentLoaded', () => {
  const hackerText = `Météorologue de formation et hacker citoyen,
Gaël Musquet place la technologie au service de l’humain.

À travers des initiatives comme HAND et OpenStreetMap,
il mobilise la cartographie et les données ouvertes
pour sauver des vies et redonner du pouvoir aux citoyens.

Son engagement illustre une conviction simple :
la technologie n’a de sens que si elle renforce
la solidarité et la résilience collective.`;

  let i = 0;
  const hackerElement = document.getElementById("hacker-text");
  if (!hackerElement) return;

  function typeWritter() {
    if (i < hackerText.length) {
      hackerElement.innerHTML += hackerText.charAt(i);
      i++;
      setTimeout(typeWritter, 35);
    }
  }
  typeWritter();
});

// ===== Carousel galerie (si présent) =====
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const carouselEl = document.querySelector('.carousel');
  if (!track || !carouselEl) return;

  const items = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'carousel-indicators';
  track.parentNode.appendChild(indicatorsContainer);

  let currentIndex = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 4000;

  function updateIndicators() {
    const dots = Array.from(indicatorsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function updateTrackPosition() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateIndicators();
  }

  items.forEach((_, idx) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => {
      currentIndex = idx;
      updateTrackPosition();
      restartAutoplay();
    });
    indicatorsContainer.appendChild(btn);
  });

  function goTo(index) {
    currentIndex = (index + items.length) % items.length;
    updateTrackPosition();
  }

  nextBtn && nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); restartAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); restartAutoplay(); });

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  carouselEl.addEventListener('mouseenter', stopAutoplay);
  carouselEl.addEventListener('mouseleave', startAutoplay);
  carouselEl.addEventListener('focusin', stopAutoplay);
  carouselEl.addEventListener('focusout', startAutoplay);

  let startX = 0;
  let isDragging = false;
  carouselEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoplay();
  });
  carouselEl.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    isDragging = false;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
    startAutoplay();
  });

  updateTrackPosition();
  startAutoplay();
});

// ===== BIO : focus sur une carte =====
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.page-biographie .carte-personnalite');
  if (!container) return;

  const cards = Array.from(container.querySelectorAll('.bio-carte'));
  if (!cards.length) return;

  container.addEventListener('mouseenter', () => {
    container.classList.add('is-focusing');
  });
  container.addEventListener('mouseleave', () => {
    container.classList.remove('is-focusing');
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
});

// ===== Timeline : tabs + slider lié =====
document.addEventListener('DOMContentLoaded', () => {
  const bioPage = document.querySelector('.page-biographie');
  if (!bioPage) return;

  const track = bioPage.querySelector('.timeline-track');
  const cards = Array.from(bioPage.querySelectorAll('.timeline-card'));
  const tabs = Array.from(bioPage.querySelectorAll('.timeline-tab'));
  const prevArrow = bioPage.querySelector('.timeline-arrow.left');
  const nextArrow = bioPage.querySelector('.timeline-arrow.right');

  if (!track || !cards.length || !tabs.length || !prevArrow || !nextArrow) return;

  let currentIndex = 0;

  function syncUI(index) {
    currentIndex = (index + cards.length) % cards.length;

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentIndex);
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === currentIndex);
    });

    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      syncUI(idx);
    });
  });

  prevArrow.addEventListener('click', () => {
    syncUI(currentIndex - 1);
  });
  nextArrow.addEventListener('click', () => {
    syncUI(currentIndex + 1);
  });

  // swipe mobile
  let startX = 0;
  let isDragging = false;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    isDragging = false;
    if (Math.abs(dx) > 40) {
      if (dx < 0) syncUI(currentIndex + 1);
      else syncUI(currentIndex - 1);
    }
  });

  syncUI(0);
});
