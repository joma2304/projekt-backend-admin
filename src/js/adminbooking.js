///Token
const jwtToken = localStorage.getItem('jwtToken');

// Funktion för att hämta bordsbokningar från backend
async function fetchBookings() {
    try {
        const response = await fetch("https://project-webbtjanst.onrender.com/protected/booking", {
            method: "GET",
            headers: {
                'Authorization': "Bearer " + jwtToken,
                "Content-Type": "application/json"
            }
        });
        const bookings = await response.json();
        return bookings;
    } catch (error) {
        console.error("Kunde inte hämta bordsbokningar:", error);
        return [];
    }
}

// Funktion för att visa bordsbokningar på sidan
function displayBookings(bookings) {
    const bookingsList = document.getElementById("bookings-list");
    bookingsList.innerHTML = ""; // Rensa befintlig data

    if (bookings.length === 0) {
        bookingsList.innerHTML = "<p>Inga bordsbokningar hittades.</p>";
        return;
    }

    bookings.forEach(booking => {
        const bookingItem = document.createElement("li");
        bookingItem.classList.add("booking-item");
        bookingItem.innerHTML = `
            <h3>${booking.name}</h3>
            <p>Telefonnummer: ${booking.phoneNumber}</p>
            <p>Antal personer: ${booking.numberOfPeople}</p>
            <p>Datum: ${booking.date}</p>
            <p>Tid: ${booking.time}</p>
            <div class="actions">
                <button onclick="deleteBooking('${booking._id}')">Ta bort</button>
            </div>
        `;
        bookingsList.appendChild(bookingItem);
    });
}

// Funktion för att ta bort en bordsbokning
async function deleteBooking(id) {
    if (!confirm("Är du säker på att du vill ta bort bokningen?")) {
        return;
    }

    try {
        const response = await fetch(`https://project-webbtjanst.onrender.com/protected/booking/${id}`, {
            method: "DELETE"
        });
        if (response.ok) {
            alert("Bokningen har tagits bort.");
            const bookings = await fetchBookings();
            displayBookings(bookings);
        } else {
            const errorMessage = await response.text();
            alert(`Ett fel uppstod: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Ett fel uppstod:", error);
        alert("Ett fel uppstod. Försök igen senare.");
    }
}

// Ladda in bordsbokningar när sidan har laddats
window.onload = async function () {
    const bookings = await fetchBookings();
    displayBookings(bookings);
};

