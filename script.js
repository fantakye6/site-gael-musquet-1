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
