// Token
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
        const bookingItem = document.createElement("div");
        bookingItem.classList.add("booking-item");
        bookingItem.innerHTML = `
            <h3>${booking.name}</h3>
            <p>Telefonnummer: ${booking.phoneNumber}</p>
            <p>Antal personer: ${booking.numberOfPeople}</p>
            <p>Datum: ${booking.date}</p>
            <p>Tid: ${booking.time}</p>
            <div class="actions">
                <button class="delete-btn">Ta bort</button>
            </div>
        `;
        bookingsList.appendChild(bookingItem);

        // Lägg till eventlyssnare för varje delete-knapp
        const deleteBtn = bookingItem.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => deleteBooking(booking._id));
    });
}

// Funktion för att ta bort en bordsbokning
async function deleteBooking(id) {
    if (!confirm("Är du säker på att du vill ta bort bokningen?")) { //För att inte råka ta bort bokningar
        return;
    }

    try {
        const response = await fetch(`https://project-webbtjanst.onrender.com/protected/booking/${id}`, {
            method: "DELETE", 
            headers: {
                'Authorization': "Bearer " + jwtToken,
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            alert("Bokningen har tagits bort.");
            const bookings = await fetchBookings();
            displayBookings(bookings);
        } else {
            const errorMessage = await response.text();
            const errContainer = document.getElementById('err-msg');
            errContainer.textContent = `Ett fel uppstod: ${errorMessage}`;
            errContainer.style.display = 'block'; //Visa meddelande
        }
    } catch (error) {
        console.error("Ett fel uppstod:", error);
        const errContainer = document.getElementById("err-msg");
        errContainer.textContent = "Ett fel uppstod. Försök igen senare.";
        errContainer.style.display = "block"; // Visa felmeddelandet
    }
}

// Ladda in bordsbokningar när sidan har laddats
window.onload = async function () {
    const bookings = await fetchBookings();
    displayBookings(bookings);
};


