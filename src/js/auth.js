// Funktion för att kontrollera JWT-token när sidan är laddad
document.addEventListener("DOMContentLoaded", function() {
    init();
});

async function init() {
    // Hämta JWT-token från localStorage
    const jwtToken = localStorage.getItem('jwtToken');

    // Kontrollera om JWT-token finns
    if (!jwtToken) {
        // Om inte, omdirigera till login-sidan
        window.location.href = "login.html";
    }
}