const jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta desserter
    async function fetchDesserts() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/dessert");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av desserter");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid hämtning av desserter:", error);
        }
    }

    // Funktion för att uppdatera en dessert
    async function updateDessert(dessertId, newName, newPrice) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/dessert/${dessertId}`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    dessertName: newName,
                    dessertPrice: newPrice
                })
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid uppdatering av dessert");
            }
            const updatedDessert = await response.json();
            return updatedDessert;
        } catch (error) {
            console.error("Fel vid uppdatering av dessert:", error);
        }
    }

    // Funktion för att radera en dessert
    async function deleteDessert(id) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/dessert/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid radering av dessert");
            }
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
        } catch (error) {
            console.error("Fel vid radering av dessert:", error);
        }
    }

    // Funktion för att visa desserter på sidan
    async function displayDesserts() {
        const desserts = await fetchDesserts();
        const dessertList = document.getElementById("dessert-list");
        desserts.forEach(dessert => {
            const listItem = document.createElement("li");
            listItem.textContent = `${dessert.dessertName} - ${dessert.dessertPrice} kr`;

            // Skapa knapp för att radera dessert
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add("delete-button"); // Lägg till klassen "delete-button"
            deleteButton.addEventListener("click", async () => {
                await deleteDessert(dessert._id); // Anropa deleteDessert med dessertens id
            });

            // Skapa knapp för att ändra dessert
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; 
            editButton.classList.add("edit-button"); // Lägg till klassen "edit-button"
            editButton.addEventListener("click", () => {
                const modal = document.getElementById("myDessertModal");
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
                document.getElementById("newDessertName").value = dessert.dessertName;
                document.getElementById("newDessertPrice").value = dessert.dessertPrice;

                const updateBtn = document.getElementById("updateDessertBtn");
                updateBtn.onclick = async () => {
                    const newName = document.getElementById("newDessertName").value;
                    const newPrice = document.getElementById("newDessertPrice").value;
                    if (newName && newPrice) {
                        const updatedDessert = await updateDessert(dessert._id, newName, newPrice);
                        location.reload(); // Ladda om sidan för att visa uppdaterad lista
                        modal.style.display = "none";
                        
                    }
                };
            });

            // Lägg till knapparna bredvid dessert
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            // Lägg till dessert och knapparna i listan
            dessertList.appendChild(listItem);
        });
    }

    // Visa läggatill-modal när användaren klickar på knappen för att lägga till dessert
    document.getElementById("addDessertBtn").addEventListener("click", function() {
        document.getElementById("addDessertModal").style.display = "block";
    });

    // Stäng läggatill-modalen när användaren klickar på X
    document.getElementsByClassName("close")[2].addEventListener("click", function() {
        document.getElementById("addDessertModal").style.display = "none";
    });

    // Funktion för att lägga till en ny dessert
    document.getElementById("addDessertForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        // Hämta värdena från formuläret
        const dessertName = document.getElementById("dessertName").value;
        const dessertPrice = document.getElementById("dessertPrice").value;

        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/protected/dessert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken // Lägg till JWT-token i header
                },
                body: JSON.stringify({ dessertName, dessertPrice }) // Konvertera till JSON-format
            });
            if (response.ok) {
                const data = await response.json();
                location.reload(); // Ladda om sidan för att visa uppdaterad lista
                // Stäng modalen efter att desserten har lagts till
                document.getElementById("addDessertModal").style.display = "none";
                
            } else {
                // Visa felmeddelande om något gick fel med POST
                console.error("POST-begäran misslyckades:", response.statusText);
            }
        } catch (error) {
            console.error("Ett fel inträffade:", error);
        }
    });

    // Anropa funktionen för att visa desserter när sidan har laddats
    displayDesserts();

});
