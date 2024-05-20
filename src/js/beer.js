const jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta öl
    async function fetchBeers() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/beer");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av öl");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid hämtning av öl:", error);
        }
    }

    // Funktion för att uppdatera en öl
    async function updateBeer(beerId, newName, newPrice) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/beer/${beerId}`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    beerName: newName,
                    beerPrice: newPrice
                })
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid uppdatering av öl");
            }
            const updatedBeer = await response.json();
            return updatedBeer;
        } catch (error) {
            console.error("Fel vid uppdatering av öl:", error);
        }
    }

    // Funktion för att radera en öl
    async function deleteBeer(id) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/beer/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid radering av öl");
            }
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
        } catch (error) {
            console.error("Fel vid radering av öl:", error);
        }
    }

    // Funktion för att visa öl på sidan
    async function displayBeers() {
        const beers = await fetchBeers();
        const beerList = document.getElementById("beer-list");
        beers.forEach(beer => {
            const listItem = document.createElement("li");
            listItem.textContent = `${beer.beerName} - ${beer.beerPrice} kr`;

            // Skapa knapp för att radera öl
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add("delete-button"); // Lägg till klassen "delete-button"
            deleteButton.addEventListener("click", async () => {
                await deleteBeer(beer._id); // Anropa deleteBeer med ölets id
            });

            // Skapa knapp för att ändra öl
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.classList.add("edit-button"); // Lägg till klassen "edit-button"
            editButton.addEventListener("click", () => {
                const modal = document.getElementById("myModal");
                modal.style.display = "block";

                const span = document.getElementsByClassName("close1")[0];
                span.onclick = function () {
                    modal.style.display = "none";
                };

                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };

                // Fyll modalen med befintliga värden
                document.getElementById("newName").value = beer.beerName;
                document.getElementById("newPrice").value = beer.beerPrice;

                const updateBtn = document.getElementById("updateBtn");
                updateBtn.onclick = async () => {
                    const newName = document.getElementById("newName").value;
                    const newPrice = document.getElementById("newPrice").value;
                    if (newName && newPrice) {
                        const updatedBeer = await updateBeer(beer._id, newName, newPrice);
                        location.reload(); // Ladda om sidan för att visa uppdaterad lista
                        modal.style.display = "none";
                    }
                };
            });

            // Lägg till knapparna bredvid ölet
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            // Lägg till ölet och knapparna i listan
            beerList.appendChild(listItem);
        });
    }

    // Visa läggatill-modal när användaren klickar på knappen för att lägga till öl
    document.getElementById("addBeerBtn").addEventListener("click", function () {
        document.getElementById("addBeerModal").style.display = "block";
    });

    // Stäng läggatill-modalen när användaren klickar på X
    document.getElementsByClassName("close")[3].addEventListener("click", function () {
        document.getElementById("addBeerModal").style.display = "none";
    });

    // Funktion för att lägga till en ny öl
    document.getElementById("addBeerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Hämta värdena från formuläret
        const beerName = document.getElementById("beerName").value;
        const beerPrice = document.getElementById("beerPrice").value;

        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/protected/beer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken // Lägg till JWT-token i header
                },
                body: JSON.stringify({ beerName, beerPrice }) // Konvertera till JSON-format
            });
            if (response.ok) {
                const data = await response.json();
                location.reload(); // Ladda om sidan för att visa uppdaterad lista
                // Stäng modalen efter att ölen har lagts till
                document.getElementById("addBeerModal").style.display = "none";

            } else {
                // Visa felmeddelande om något gick fel med POST
                console.error("POST-begäran misslyckades:", response.statusText);
            }
        } catch (error) {
            console.error("Ett fel inträffade:", error);
        }
    });

    // Anropa funktionen för att visa öl när sidan har laddats
    displayBeers();

});