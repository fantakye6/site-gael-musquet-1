// ===== Animation texte effet hacker =====
const hackerText = document.getElementById("hacker-text");

const content = `Météorologue de formation et hacker citoyen,
Gaël Musquet place la technologie au service de l’humain.

À travers des initiatives comme HAND et OpenStreetMap,
il mobilise la cartographie et les données ouvertes
pour sauver des vies et redonner du pouvoir aux citoyens.

Son engagement illustre une conviction simple :
la technologie n’a de sens que si elle renforce
la solidarité et la résilience collective.
`;

let index = 0;
function typeEffect() {
    if (index < content.length) {
        hackerText.textContent += content.charAt(index);
        index++;
        setTimeout(typeEffect, 50); // vitesse d’écriture
    }
}

/* ---------------------------------------
   2) Animation des images de la GALERIE
-----------------------------------------*/
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
