const canvas = document.getElementById('world-lines');
let ctx = null;
let lines = [];
if (canvas) {
    ctx = canvas.getContext('2d');

    // Debug helpers: log canvas presence and make it briefly visible with an outline
    try {
        console.log('[debug] world-lines canvas found:', canvas, 'size:', canvas.width, 'x', canvas.height);
        // add a visible outline to help spotting the canvas in the page
        canvas.style.outline = '3px solid rgba(255,0,0,0.6)';
        // remove the outline after 2s so it doesn't remain
        setTimeout(() => { canvas.style.outline = ''; }, 2000);
    } catch (e) { console.log('[debug] canvas debug failed', e); }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Shooting-line animation (staggered, star-like)
    const NUM = 55; // fewer lines

    function createLine(now) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const angle = Math.random() * Math.PI * 2;
        const dirX = Math.cos(angle);
        const dirY = Math.sin(angle);
        const maxLen = 60 + Math.random() * 220; // length in px
        const speed = 5 + Math.random() * 0.9; // px per ms
        const delay = Math.random() * 2500; // staggered start
        const fade = 300 + Math.random() * 600; // fade duration ms
        return {
            x, y, dirX, dirY, maxLen, speed, delay,
            state: 'waiting', start: now, runStart: 0, fadeStart: 0, alpha: 1
        };
    }

    const now0 = performance.now();
    lines = [];
    for (let i = 0; i < NUM; i++) lines.push(createLine(now0));

    function animate(now) {
        if (!ctx) return;
        if (!now) now = performance.now();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw subtle background faint lines for depth
        // (optional, light grid effect)
        // ctx.globalAlpha = 0.08; // keep disabled for now

        lines.forEach((l, idx) => {
            const t = now - l.start;
            if (l.state === 'waiting') {
                if (t >= l.delay) {
                    l.state = 'running';
                    l.runStart = now;
                    l.progress = 0;
                }
            }
            if (l.state === 'running') {
                const runT = now - l.runStart;
                l.progress = runT * l.speed; // px
                const prog = Math.min(l.progress, l.maxLen);
                const x2 = l.x + l.dirX * prog;
                const y2 = l.y + l.dirY * prog;

                // line alpha eases out when approaching end
                const alpha = 0.95 * (1 - (prog / l.maxLen));
                ctx.strokeStyle = `rgba(255,255,255,${Math.max(0.12, alpha)})`;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(l.x, l.y);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // red endpoint markers
                ctx.fillStyle = `rgba(255,70,70,${Math.min(1, 0.9 * (alpha + 0.2))})`;
                ctx.beginPath();
                ctx.arc(l.x, l.y, 2.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x2, y2, 2.6, 0, Math.PI * 2);
                ctx.fill();

                if (l.progress >= l.maxLen) {
                    l.state = 'fading';
                    l.fadeStart = now;
                }
            }

            if (l.state === 'fading') {
                const fadeT = now - l.fadeStart;
                const fadeProgress = fadeT / (300 + Math.random() * 400);
                const alpha = Math.max(0, 1 - fadeProgress);
                // draw final thin line with reduced alpha
                const prog = l.maxLen;
                const x2 = l.x + l.dirX * prog;
                const y2 = l.y + l.dirY * prog;
                ctx.strokeStyle = `rgba(255,255,255,${0.4 * alpha})`;
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(l.x, l.y);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                ctx.fillStyle = `rgba(255,70,70,${0.6 * alpha})`;
                ctx.beginPath();
                ctx.arc(l.x, l.y, 2.2 * alpha + 0.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x2, y2, 2.2 * alpha + 0.6, 0, Math.PI * 2);
                ctx.fill();

                if (fadeProgress >= 1) {
                    // reset this line
                    const idxNow = performance.now();
                    lines[idx] = createLine(idxNow);
                }
            }
        });

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
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
