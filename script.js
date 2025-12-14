// Hamburger menu
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
}

// =================== Scroll Animations Intro ===================
const introSection = document.querySelector('.intro');
const portraitCTA = document.querySelector('.portrait-cta');
const halo = document.querySelector('.halo');

function handleScroll() {
  if (!introSection || !portraitCTA || !halo) return;

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

// Animation d’apparition de la photo (accueil)
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-portrait');
  if (!hero) return;
  requestAnimationFrame(() => {
    hero.classList.add('is-visible');
  });
});

// Hacker text animation
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

function typeWritter() {
  if (!hackerElement) return;
  if (i < hackerText.length) {
    hackerElement.innerHTML += hackerText.charAt(i);
    i++;
    setTimeout(typeWritter, 35);
  }
}
typeWritter();

/* =================== Carousel functionality =================== */
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

  function updateIndicators() {
    const dots = Array.from(indicatorsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

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

  // touch swipe support
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

  // keyboard accessibility
  carouselEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(currentIndex - 1); restartAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(currentIndex + 1); restartAutoplay(); }
  });

  updateTrackPosition();
  startAutoplay();
});
/* =================== BIOGRAPHIE : cartes avec focus =================== */
document.addEventListener('DOMContentLoaded', () => {
  const bioSection = document.querySelector('.page-biographie .carte-personnalite');
  if (!bioSection) return;

  const cards = Array.from(bioSection.querySelectorAll('.bio-carte'));

  function setActiveCard(card) {
    cards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  }

  // Activer le flou général au premier survol
  let hasFocused = false;

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!hasFocused) {
        bioSection.classList.add('is-focusing');
        hasFocused = true;
      }
      setActiveCard(card);
    });

    card.addEventListener('click', () => {
      if (!hasFocused) {
        bioSection.classList.add('is-focusing');
        hasFocused = true;
      }
      setActiveCard(card);
    });
  });
});

/* =================== BIOGRAPHIE : frise chronologique =================== */
document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.page-biographie .timeline-immersive');
  if (!timeline) return;

  const track = timeline.querySelector('.timeline-track');
  const cards = Array.from(track.querySelectorAll('.timeline-card'));
  const tabs = Array.from(timeline.querySelectorAll('.timeline-tab'));
  const prevBtn = timeline.querySelector('.timeline-arrow.left');
  const nextBtn = timeline.querySelector('.timeline-arrow.right');

  let currentIndex = 0;

  function updateTimeline(index) {
    currentIndex = (index + cards.length) % cards.length;

    // activer la bonne carte
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentIndex);
    });

    // activer le bon onglet
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === currentIndex);
    });

    // déplacer la track (1 carte = 100%)
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // clic sur les onglets (dates)
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      updateTimeline(index);
    });
  });

  // clic sur flèches
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateTimeline(currentIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateTimeline(currentIndex + 1);
    });
  }

  // swipe sur mobile
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
      if (dx < 0) updateTimeline(currentIndex + 1);
      else updateTimeline(currentIndex - 1);
    }
  });

  // état initial
  updateTimeline(0);
});
/* =================== Animations de la page Projets (cards, publications, articles)  =================== */
function initProjectAnimations() {
  const animated = document.querySelectorAll(
    '.project-pane, .article-card'
  );

  if (!animated.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  animated.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  // ... ici tes autres initialisations (menu mobile, carousel, etc.)
  initProjectAnimations();
});
///* =================== Animations de la page Engament et Terrain   =================== 
document.addEventListener('DOMContentLoaded', () => {
  const animatedBlocks = document.querySelectorAll('.fade-in-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;

          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
    }
  );

  animatedBlocks.forEach((el) => observer.observe(el));

 // =================== Lightbox terrain ===================
document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.terrain-item'));
  const lightbox = document.getElementById('terrain-lightbox');
  if (!lightbox || !items.length) return;

  const imgEl = lightbox.querySelector('.lightbox-image');
  const titleEl = lightbox.querySelector('.lightbox-title');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  let currentIndex = 0;

  function render(index) {
    const item = items[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('.terrain-caption');

    imgEl.src = img.src;
    imgEl.alt = img.alt;
    titleEl.textContent = img.alt;
    captionEl.textContent = caption ? caption.textContent : '';
  }

  function openLightbox(index) {
    currentIndex = index;
    render(currentIndex);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showNext(delta) {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    render(currentIndex);
  }

  items.forEach((item, index) => {
    const img = item.querySelector('img');
    if (!img) return;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(index));
  });

  btnClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', () => showNext(-1));
  btnNext.addEventListener('click', () => showNext(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext(1);
    if (e.key === 'ArrowLeft') showNext(-1);
  });
});

});
// =================== Animation Page A Propos  ===================
 document.addEventListener('DOMContentLoaded', () => {
  const animatedBlocks = document.querySelectorAll('.fade-in-up');
  if (!animatedBlocks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // l'élément doit être au moins à 40 % dans le viewport
        if (entry.intersectionRatio >= 0.4) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.4
    }
  );

  animatedBlocks.forEach((el) => observer.observe(el));
});
