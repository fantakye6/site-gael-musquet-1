// Pin overlay: generate animated pins only on land by sampling the background image
const pinsContainer = document.getElementById('map-pins');
if (pinsContainer) {
    const N = 20; // desired number of pins
    const imgEl = document.querySelector('.map-bg img');

    function createPinAt(xPercent, yPercent, delay) {
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.style.left = xPercent + '%';
        pin.style.top = yPercent + '%';
        pin.innerHTML = `<img src="images/image-removebg-preview-2.png" alt="pin">`;
        pinsContainer.appendChild(pin);
        setTimeout(() => pin.classList.add('show'), delay);
    }

    function sampleAndPlace() {
        // create offscreen canvas at image natural size
        const w = imgEl.naturalWidth || imgEl.width;
        const h = imgEl.naturalHeight || imgEl.height;
        if (!w || !h) return;
        const off = document.createElement('canvas');
        off.width = w; off.height = h;
        const offCtx = off.getContext('2d');
        offCtx.drawImage(imgEl, 0, 0, w, h);

        function isLand(px, py) {
            try {
                const d = offCtx.getImageData(px, py, 1, 1).data;
                const r = d[0], g = d[1], b = d[2], a = d[3];
                if (a === 0) return false; // transparent -> not land
                // heuristics: if blue is dominant by a margin -> treat as sea
                if (b > r + 18 && b > g + 18) return false;
                // otherwise consider as land
                return true;
            } catch (e) {
                // getImageData can fail cross-origin; fallback to random placement
                return true;
            }
        }

        let placed = 0;
        const maxAttempts = 5000;
        let attempts = 0;
        while (placed < N && attempts < maxAttempts) {
            attempts++;
            const px = Math.floor(Math.random() * w);
            const py = Math.floor(Math.random() * h);
            if (!isLand(px, py)) continue;
            const xPct = (px / w) * 100;
            const yPct = (py / h) * 100;
            createPinAt(xPct, yPct, placed * 120 + Math.random() * 400);
            placed++;
        }

        // If nothing placed (e.g. CORS blocked), fall back to random-ish placement
        if (placed === 0) {
            for (let i = 0; i < N; i++) {
                const x = 6 + Math.random() * 88;
                const y = 10 + Math.random() * 78;
                createPinAt(x, y, i * 100);
            }
        }
    }

    if (imgEl) {
        if (imgEl.complete) sampleAndPlace();
        else imgEl.addEventListener('load', sampleAndPlace);
    } else {
        // no image found, fallback to simple random pins
        for (let i = 0; i < N; i++) createPinAt(6 + Math.random() * 88, 10 + Math.random() * 78, i * 100);
    }
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
