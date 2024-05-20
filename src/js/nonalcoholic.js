const jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta alkoholfria drycker
    async function fetchNonAlcoholicDrinks() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/nonalcoholic");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av alkoholfria drycker");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid hämtning av alkoholfria drycker:", error);
        }
    }

    // Funktion för att uppdatera en alkoholfri dryck
    async function updateNonAlcoholicDrink(drinkId, newName, newPrice) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/nonalcoholic/${drinkId}`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nonAlcoholicName: newName,
                    nonAlcoholicPrice: newPrice
                })
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid uppdatering av alkoholfri dryck");
            }
            const updatedDrink = await response.json();
            return updatedDrink;
        } catch (error) {
            console.error("Fel vid uppdatering av alkoholfri dryck:", error);
        }
    }

    // Funktion för att radera en alkoholfri dryck
    async function deleteNonAlcoholicDrink(id) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/nonalcoholic/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid radering av alkoholfri dryck");
            }
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
        } catch (error) {
            console.error("Fel vid radering av alkoholfri dryck:", error);
        }
    }

    // Funktion för att visa alkoholfria drycker på sidan
    async function displayNonAlcoholicDrinks() {
        const drinks = await fetchNonAlcoholicDrinks();
        const drinkList = document.getElementById("drink-list");
        drinks.forEach(drink => {
            const listItem = document.createElement("li");
            listItem.textContent = `${drink.nonAlcoholicName} - ${drink.nonAlcoholicPrice} kr`;

            // Skapa knapp för att radera dryck
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add("delete-button"); // Lägg till klassen "delete-button"
            deleteButton.addEventListener("click", async () => {
                await deleteNonAlcoholicDrink(drink._id); // Anropa deleteNonAlcoholicDrink med dryckens id
            });

            // Skapa knapp för att ändra dryck
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; 
            editButton.classList.add("edit-button"); // Lägg till klassen "edit-button"
            editButton.addEventListener("click", () => {
                const modal = document.getElementById("updateDrinkModal");
                modal.style.display = "block";

                const span = document.getElementsByClassName("close2")[0]; // Uppdaterad index för stängningsknapp
                span.onclick = function () {
                    modal.style.display = "none";
                };

                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };

                // Fyll modalen med befintliga värden
                document.getElementById("newDrinkName").value = drink.nonAlcoholicName;
                document.getElementById("newDrinkPrice").value = drink.nonAlcoholicPrice;

                const updateBtn = document.getElementById("updateDrinkBtn");
                updateBtn.onclick = async () => {
                    const newName = document.getElementById("newDrinkName").value;
                    const newPrice = document.getElementById("newDrinkPrice").value;
                    if (newName && newPrice) {
                        const updatedDrink = await updateNonAlcoholicDrink(drink._id, newName, newPrice);
                        location.reload(); // Ladda om sidan för att visa uppdaterad lista
                        modal.style.display = "none";
                    }
                };
            });

            // Lägg till knapparna bredvid drycken
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            // Lägg till drycken och knapparna i listan
            drinkList.appendChild(listItem);
        });
    }

    // Visa läggatill-modal när användaren klickar på knappen för att lägga till dryck
    document.getElementById("addDrinkBtn").addEventListener("click", function() {
        document.getElementById("addDrinkModal").style.display = "block";
    });

    // Stäng läggatill-modalen när användaren klickar på X
    document.getElementsByClassName("close")[5].addEventListener("click", function() {
        document.getElementById("addDrinkModal").style.display = "none";
    });

    // Funktion för att lägga till en ny alkoholfri dryck
    document.getElementById("addDrinkForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        // Hämta värdena från formuläret
        const nonAlcoholicName = document.getElementById("drinkName").value;
        const nonAlcoholicPrice = document.getElementById("drinkPrice").value;

        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/protected/nonalcoholic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken // Lägg till JWT-token i header
                },
                body: JSON.stringify({ nonAlcoholicName, nonAlcoholicPrice }) // Konvertera till JSON-format
            });
            if (response.ok) {
                const data = await response.json();
                location.reload(); // Ladda om sidan för att visa uppdaterad lista
                // Stäng modalen efter att drycken har lagts till
                document.getElementById("addDrinkModal").style.display = "none";
                
            } else {
                // Visa felmeddelande om något gick fel med POST
                console.error("POST-begäran misslyckades:", response.statusText);
            }
        } catch (error) {
            console.error("Ett fel inträffade:", error);
        }
    });

    // Anropa funktionen för att visa alkoholfria drycker när sidan har laddats
    displayNonAlcoholicDrinks();

});
