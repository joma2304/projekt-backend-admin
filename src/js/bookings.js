const messageElement = document.getElementById("message");

document.getElementById("bookingForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Förhindra att formuläret skickas som vanligt

    // Hämta formulärdata
    const formData = new FormData(this);

// Konvertera FormData till ett objekt
const bookingData = {};
formData.forEach((value, key) => {
    bookingData[key] = value;
});


    // Skicka bokningsdata till backend
    try {
        const response = await fetch("https://project-webbtjanst.onrender.com/public/booking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            showMessage("Din bokning är gjord!", "success");
            this.reset(); // Återställ formuläret efter framgångsrik bokning
        } else {
            throw new Error("Något gick fel vid bokningen.");
        }
    } catch (error) {
        console.error("Error:", error.message);
        showMessage("Något gick fel vid bokningen. Försök igen senare.", "error");
    }
});

function showMessage(message, type) {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
}

