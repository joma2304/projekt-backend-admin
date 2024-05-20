const jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta viner
    async function fetchWines() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/wine");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av viner");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid hämtning av viner:", error);
        }
    }

    // Funktion för att uppdatera ett vin
    async function updateWine(wineId, newName, newPrice) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/wine/${wineId}`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    wineName: newName,
                    winePrice: newPrice
                })
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid uppdatering av vin");
            }
            const updatedWine = await response.json();
            return updatedWine;
        } catch (error) {
            console.error("Fel vid uppdatering av vin:", error);
        }
    }

    // Funktion för att radera ett vin
    async function deleteWine(id) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/wine/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid radering av vin");
            }
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
        } catch (error) {
            console.error("Fel vid radering av vin:", error);
        }
    }

    // Funktion för att visa viner på sidan
    async function displayWines() {
        const wines = await fetchWines();
        const wineList = document.getElementById("wine-list");
        wines.forEach(wine => {
            const listItem = document.createElement("li");
            listItem.textContent = `${wine.wineName} - ${wine.winePrice} kr`;

            // Skapa knapp för att radera vin
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add("delete-button"); // Lägg till klassen "delete-button"
            deleteButton.addEventListener("click", async () => {
                await deleteWine(wine._id); // Anropa deleteWine med vinets id
            });

            // Skapa knapp för att ändra vin
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; 
            editButton.classList.add("edit-button"); // Lägg till klassen "edit-button"
            editButton.addEventListener("click", () => {
                const modal = document.getElementById("updateWineModal");
                modal.style.display = "block";

                const span = document.getElementsByClassName("close3")[0]; // Uppdaterad index för stängningsknapp
                span.onclick = function () {
                    modal.style.display = "none";
                };

                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };

                // Fyll modalen med befintliga värden
                document.getElementById("newWineName").value = wine.wineName;
                document.getElementById("newWinePrice").value = wine.winePrice;

                const updateBtn = document.getElementById("updateWineBtn");
                updateBtn.onclick = async () => {
                    const newName = document.getElementById("newWineName").value;
                    const newPrice = document.getElementById("newWinePrice").value;
                    if (newName && newPrice) {
                        const updatedWine = await updateWine(wine._id, newName, newPrice);
                        location.reload(); // Ladda om sidan för att visa uppdaterad lista
                        modal.style.display = "none";
                        
                    }
                };
            });

            // Lägg till knapparna bredvid vinet
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            // Lägg till vinet och knapparna i listan
            wineList.appendChild(listItem);
        });
    }

    // Visa läggatill-modal när användaren klickar på knappen för att lägga till vin
    document.getElementById("addWineBtn").addEventListener("click", function() {
        document.getElementById("addWineModal").style.display = "block";
    });

    // Stäng läggatill-modalen när användaren klickar på X
    document.getElementsByClassName("close")[4].addEventListener("click", function() { // Uppdaterad index för stängningsknapp
        document.getElementById("addWineModal").style.display = "none";
    });

    // Funktion för att lägga till ett nytt vin
    document.getElementById("addWineForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        // Hämta värdena från formuläret
        const wineName = document.getElementById("wineName").value;
        const winePrice = document.getElementById("winePrice").value;

        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/protected/wine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken // Lägg till JWT-token i header
                },
                body: JSON.stringify({ wineName, winePrice }) // Konvertera till JSON-format
            });
            if (response.ok) {
                const data = await response.json();
                location.reload(); // Ladda om sidan för att visa uppdaterad lista
                // Stäng modalen efter att vinet har lagts till
                document.getElementById("addWineModal").style.display = "none";
                
            } else {
                // Visa felmeddelande om något gick fel med POST
                console.error("POST-begäran misslyckades:", response.statusText);
            }
        } catch (error) {
            console.error("Ett fel inträffade:", error);
        }
    });

    // Anropa funktionen för att visa viner när sidan har laddats
    displayWines();

});