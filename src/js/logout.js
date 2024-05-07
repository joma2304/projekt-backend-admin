// Funktion för att logga ut
document.getElementById("logout-link").addEventListener("click", function logout() {
    // Ta bort JWT-token från localStorage
    localStorage.removeItem("jwtToken");
    // Omdirigera användaren till startsidan 
    window.location.href = "index.html"; // Vid utlogg skickas till index
});