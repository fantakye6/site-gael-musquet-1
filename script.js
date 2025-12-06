// Replace canvas animation with pin overlay generator
const pinsContainer = document.getElementById('map-pins');
if (pinsContainer) {
    // Example pins (x%, y%) relative to the map container
    const pins = [
        { x: 22, y: 34, label: 'Paris' },
        { x: 48, y: 28, label: 'Lyon' },
        { x: 70, y: 50, label: 'Marseille' },
        { x: 35, y: 68, label: 'Bordeaux' },
        { x: 82, y: 20, label: 'Nice' }
    ];

    function createPin(p) {
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.style.left = p.x + '%';
        pin.style.top = p.y + '%';
        pin.innerHTML = `<img src="images/image-removebg-preview-2.png" alt="pin"><div class="pin-label">${p.label}</div>`;
        pinsContainer.appendChild(pin);
        // staggered reveal
        setTimeout(() => pin.classList.add('show'), Math.random() * 1200 + 200);
    }

    pins.forEach(createPin);
}

// Hamburger menu
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
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
    if (!track) return; // no carousel on this page

    const items = Array.from(track.children);
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';
    track.parentNode.appendChild(indicatorsContainer);

    let currentIndex = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 4000;

    // set widths (items are 100% each, flexbox handles it)
    function updateTrackPosition() {
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        updateIndicators();
    }

    // indicators
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

    // next / prev
    function goTo(index) {
        currentIndex = (index + items.length) % items.length;
        updateTrackPosition();
    }

    nextBtn && nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); restartAutoplay(); });
    prevBtn && prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); restartAutoplay(); });

    // autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_DELAY);
    }
    function stopAutoplay() { if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; } }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    // pause on hover/focus
    const carouselEl = document.querySelector('.carousel');
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);
    carouselEl.addEventListener('focusin', stopAutoplay);
    carouselEl.addEventListener('focusout', startAutoplay);

    // touch swipe support
    let startX = 0;
    let isDragging = false;
    carouselEl.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; stopAutoplay(); });
    carouselEl.addEventListener('touchmove', (e) => { if (!isDragging) return; const dx = e.touches[0].clientX - startX; /* optionally implement drag preview */ });
    carouselEl.addEventListener('touchend', (e) => { if (!isDragging) return; const endX = e.changedTouches[0].clientX; const dx = endX - startX; isDragging = false; if (Math.abs(dx) > 40) { if (dx < 0) goTo(currentIndex + 1); else goTo(currentIndex - 1); } startAutoplay(); });

    // keyboard accessibility
    carouselEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { goTo(currentIndex - 1); restartAutoplay(); }
        if (e.key === 'ArrowRight') { goTo(currentIndex + 1); restartAutoplay(); }
    });

    // initial state
    updateTrackPosition();
    startAutoplay();
});
