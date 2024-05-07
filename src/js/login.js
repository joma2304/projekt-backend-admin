function showProtectedPage() {
    window.location.href = "admin.html"; // Omdirigeras till den skyddade sidan
}
    
// För att logga in
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    try {
        const response = await fetch("https://project-webbtjanst.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            const jwtToken = data.response.token; // Accessing the token from the 'response' object
            // Sparar JWT-tokenet i localStorage
            localStorage.setItem("jwtToken", jwtToken);
            console.log(jwtToken);
            showProtectedPage(); // Visa skyddad sida efter inloggning
        } else {
            // Visa felmeddelande på webbplatsen om användaren inte hittades eller inloggningen misslyckades
            const errorContainer = document.getElementById("error-message");
            errorContainer.textContent = "Fel användarnamn eller lösenord.";
        }
    } catch (error) {
        const errorContainer = document.getElementById("error-message");
        errorContainer.textContent = "Ett fel inträffade. Försök igen senare.";
    }
});