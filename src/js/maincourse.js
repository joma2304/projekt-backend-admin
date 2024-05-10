const jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta huvudrätter
    async function fetchMainCourses() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/maincourse");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av huvudrätter");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fel vid hämtning av huvudrätter:", error);
        }
    }

    // Funktion för att uppdatera en huvudrätt
    async function updateMainCourse(mainCourseId, newName, newPrice) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/maincourse/${mainCourseId}`, {
                method: "PUT",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mainCourseName: newName,
                    mainCoursePrice: newPrice
                })
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid uppdatering av huvudrätt");
            }
            const updatedMainCourse = await response.json();
            return updatedMainCourse;
        } catch (error) {
            console.error("Fel vid uppdatering av huvudrätt:", error);
        }
    }

    // Funktion för att radera en huvudrätt
    async function deleteMainCourse(id) {
        try {
            const response = await fetch(`https://project-webbtjanst.onrender.com/protected/maincourse/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': "Bearer " + jwtToken,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Något gick fel vid radering av huvudrätt");
            }
            location.reload(); // Ladda om sidan för att visa uppdaterad lista
        } catch (error) {
            console.error("Fel vid radering av huvudrätt:", error);
        }
    }

    // Funktion för att visa huvudrätter på sidan
    async function displayMainCourses() {
        const mainCourses = await fetchMainCourses();
        const mainCourseList = document.getElementById("main-course-list");
        mainCourses.forEach(mainCourse => {
            const listItem = document.createElement("li");
            listItem.textContent = `${mainCourse.mainCourseName} - ${mainCourse.mainCoursePrice} kr`;

            // Skapa knapp för att radera huvudrätt
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.classList.add("delete-button"); // Lägg till klassen "delete-button"
            deleteButton.addEventListener("click", async () => {
                await deleteMainCourse(mainCourse._id); // Anropa deleteMainCourse med huvudrättens id
            });

            // Skapa knapp för att ändra huvudrätt
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; 
            editButton.classList.add("edit-button"); // Lägg till klassen "edit-button"
            editButton.addEventListener("click", () => {
                const modal = document.getElementById("updateMainCourseModal");
                modal.style.display = "block";

                const span = document.getElementsByClassName("close1")[1]; // Uppdaterad index för stängningsknapp
                span.onclick = function () {
                    modal.style.display = "none";
                };

                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                };

                // Fyll modalen med befintliga värden
                document.getElementById("newMainName").value = mainCourse.mainCourseName;
                document.getElementById("newMainPrice").value = mainCourse.mainCoursePrice;

                const updateBtn = document.getElementById("updateMainBtn");
                updateBtn.onclick = async () => {
                    const newName = document.getElementById("newMainName").value;
                    const newPrice = document.getElementById("newMainPrice").value;
                    if (newName && newPrice) {
                        const updatedMainCourse = await updateMainCourse(mainCourse._id, newName, newPrice);
                        location.reload(); // Ladda om sidan för att visa uppdaterad lista
                        modal.style.display = "none";
                        
                    }
                };
            });

            // Lägg till knapparna bredvid huvudrätten
            listItem.appendChild(deleteButton);
            listItem.appendChild(editButton);

            // Lägg till huvudrätten och knapparna i listan
            mainCourseList.appendChild(listItem);
        });
    }

    // Visa läggatill-modal när användaren klickar på knappen för att lägga till huvudrätt
    document.getElementById("addMainCourseBtn").addEventListener("click", function() {
        document.getElementById("addMainCourseModal").style.display = "block";
    });

    // Stäng läggatill-modalen när användaren klickar på X
    document.getElementsByClassName("close")[1].addEventListener("click", function() { // Uppdaterad index för stängningsknapp
        document.getElementById("addMainCourseModal").style.display = "none";
    });

    // Funktion för att lägga till en ny huvudrätt
    document.getElementById("addMainCourseForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        // Hämta värdena från formuläret
        const mainCourseName = document.getElementById("mainCourseName").value;
        const mainCoursePrice = document.getElementById("mainCoursePrice").value;

        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/protected/maincourse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken // Lägg till JWT-token i header
                },
                body: JSON.stringify({ mainCourseName, mainCoursePrice }) // Konvertera till JSON-format
            });
            if (response.ok) {
                const data = await response.json();
                location.reload(); // Ladda om sidan för att visa uppdaterad lista
                // Stäng modalen efter att huvudrätten har lagts till
                document.getElementById("addMainCourseModal").style.display = "none";
                
            } else {
                // Visa felmeddelande om något gick fel med POST
                console.error("POST-begäran misslyckades:", response.statusText);
            }
        } catch (error) {
            console.error("Ett fel inträffade:", error);
        }
    });

    // Anropa funktionen för att visa huvudrätter när sidan har laddats
    displayMainCourses();

});
