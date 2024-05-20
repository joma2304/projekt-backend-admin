// Hämta hamburgarmenyknappen
const navToggle = document.querySelector('.nav-toggle');

// Lägg till klickhändelse till hamburgarmenyknappen
navToggle.addEventListener('click', toggleMenu);

// Funktion för att visa/dölja navigeringsmenyn
function toggleMenu() {
    const navList = document.getElementById('navList');
    navList.classList.toggle('active');
}
