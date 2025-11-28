// ===== Animation texte effet hacker =====
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

function typeWriter() {
    if (i < hackerText.length) {
        hackerElement.innerHTML += hackerText.charAt(i);
        i++;
        setTimeout(typeWriter, 35); // vitesse d’écriture
    }
}

typeWriter();

// ===== Menu sur Mobile =====
const toggle = document.getElementById("nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
});

// ===== Animation des images de la galerie =====
const galleryImages = document.querySelectorAll('.gallery img');

window.addEventListener('scroll', () => {
    const triggerBottom = window.innerHeight * 0.9;

    galleryImages.forEach(img => {
        const imgTop = img.getBoundingClientRect().top;

        if(imgTop < triggerBottom){
            img.style.opacity = 1;
            img.style.transform = 'translateY(0)';
        }
    });
});
