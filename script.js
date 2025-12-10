// ===== Navbar hamburger =====
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
}

// ===== Scroll anim intro (si présent) =====
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

// ===== Hacker text (si présent) =====
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
if (hackerElement) typeWritter();

// ===== Carousel galerie (si présent) =====
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

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

  const carouselEl = document.querySelector('.carousel');
  if (carouselEl) {
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
  }

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

// ===== Timeline slider (version centrage sur la carte active) =====
document.addEventListener('DOMContentLoaded', () => {
  const bioPage = document.querySelector('.page-biographie');
  if (!bioPage) return;

  const track = bioPage.querySelector('.timeline-track');
  const cards = Array.from(bioPage.querySelectorAll('.timeline-card'));
  const prevArrow = bioPage.querySelector('.timeline-arrow.left');
  const nextArrow = bioPage.querySelector('.timeline-arrow.right');

  if (!track || !cards.length || !prevArrow || !nextArrow) return;

  let currentIndex = 0;

  function setActiveCard(index) {
    currentIndex = (index + cards.length) % cards.length;

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentIndex);
    });

    const targetCard = cards[currentIndex];
    const cardRect = targetCard.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const offset = cardRect.left - trackRect.left - (trackRect.width - cardRect.width) / 2;

    track.scrollBy({ left: offset, behavior: 'smooth' });
  }

  prevArrow.addEventListener('click', () => {
    setActiveCard(currentIndex - 1);
  });

  nextArrow.addEventListener('click', () => {
    setActiveCard(currentIndex + 1);
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
      if (dx < 0) setActiveCard(currentIndex + 1);
      else setActiveCard(currentIndex - 1);
    }
  });

  // init
  setActiveCard(currentIndex);
});
