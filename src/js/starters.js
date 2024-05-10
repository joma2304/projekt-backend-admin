const jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta förrätter
    async function fetchStarters() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/starter");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av förrätter");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid hämtning av förrätter:", error);
        }
    }

    // Funktion för att uppdatera en rätt
    async function updateStarter(starterId, newName, newPrice) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/starter/${starterId}`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    starterName: newName,
                    starterPrice: newPrice
                })
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid uppdatering av rätt");
            }
            const updatedStarter = await response.json();
            return updatedStarter;
        } catch (error) {
            console.error("Fel vid uppdatering av rätt:", error);
        }
    }

    // Funktion för att radera en rätt
    async function deleteStarter(id) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/starter/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid radering av rätt");
            }
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
        } catch (error) {
            console.error("Fel vid radering av rätt:", error);
        }
    }

    // Funktion för att visa förrätter på sidan
    async function displayStarters() {
        const starters = await fetchStarters();
        const starterList = document.getElementById("starter-list");
        starters.forEach(starter => {
            const listItem = document.createElement("li");
            listItem.textContent = `${starter.starterName} - ${starter.starterPrice} kr`;

            // Skapa knapp för att radera rätt
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add("delete-button"); // Lägg till klassen "delete-button"
            deleteButton.addEventListener("click", async () => {
                await deleteStarter(starter._id); // Anropa deleteStarter med rättens id
            });

            // Skapa knapp för att ändra rätt
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
                document.getElementById("newName").value = starter.starterName;
                document.getElementById("newPrice").value = starter.starterPrice;

                const updateBtn = document.getElementById("updateBtn");
                updateBtn.onclick = async () => {
                    const newName = document.getElementById("newName").value;
                    const newPrice = document.getElementById("newPrice").value;
                    if (newName && newPrice) {
                        const updatedStarter = await updateStarter(starter._id, newName, newPrice);
                       location.reload(); // Ladda om sidan för att visa uppdaterad lista
                        modal.style.display = "none";
                        
                    }
                };
            });

            // Lägg till knapparna bredvid rätten
            listItem.appendChild(deleteButton);
            listItem.appendChild(editButton);

            // Lägg till rätten och knapparna i listan
            starterList.appendChild(listItem);
        });
    }

    // Visa läggatill-modal när användaren klickar på knappen för att lägga till förrätt
document.getElementById("addStarterBtn").addEventListener("click", function() {
    document.getElementById("addStarterModal").style.display = "block";
});

// Stäng läggatill-modalen när användaren klickar på X
document.getElementsByClassName("close")[0].addEventListener("click", function() {
    document.getElementById("addStarterModal").style.display = "none";
});

// Funktion för att lägga till en ny förrätt
document.getElementById("addStarterForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // Hämta värdena från formuläret
    const starterName = document.getElementById("starterName").value;
    const starterPrice = document.getElementById("starterPrice").value;

    try {
        const response = await fetch("https://project-webbtjanst.onrender.com/protected/starter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken // Lägg till JWT-token i header
            },
            body: JSON.stringify({ starterName, starterPrice }) // Konvertera till JSON-format
        });
        if (response.ok) {
            const data = await response.json();
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
            // Stäng modalen efter att förrätten har lagts till
            document.getElementById("addStarterModal").style.display = "none";
            
        } else {
            // Visa felmeddelande om något gick fel med POST
            console.error("POST-begäran misslyckades:", response.statusText);
        }
    } catch (error) {
        console.error("Ett fel inträffade:", error);
    }
});

    // Anropa funktionen för att visa förrätter när sidan har laddats
    displayStarters();

});


