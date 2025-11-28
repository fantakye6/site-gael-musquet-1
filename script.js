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
