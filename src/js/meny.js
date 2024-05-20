document.addEventListener('DOMContentLoaded', function () {

    // Funktion för att hämta öl
    async function fetchBeers() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/beer");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av öl");
            }
            const data = await response.json();
            displayMenuItems("beer", data);
        } catch (error) {
            console.error("Fel vid hämtning av öl:", error);
        }
    }

    // Funktion för att hämta desserter
    async function fetchDesserts() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/dessert");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av desserter");
            }
            const data = await response.json();
            displayMenuItems("dessert", data);
        } catch (error) {
            console.error("Fel vid hämtning av desserter:", error);
        }
    }

    // Funktion för att hämta huvudrätter
    async function fetchMainCourses() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/maincourse");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av huvudrätter");
            }
            const data = await response.json();
            displayMenuItems("maincourse", data);
        } catch (error) {
            console.error("Fel vid hämtning av huvudrätter:", error);
        }
    }

    // Funktion för att hämta alkoholfria drycker
    async function fetchNonAlcoholicDrinks() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/nonalcoholic");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av alkoholfria drycker");
            }
            const data = await response.json();
            displayMenuItems("nonalcoholic", data);
        } catch (error) {
            console.error("Fel vid hämtning av alkoholfria drycker:", error);
        }
    }

    // Funktion för att hämta förrätter
    async function fetchStarters() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/starter");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av förrätter");
            }
            const data = await response.json();
            displayMenuItems("starter", data);
        } catch (error) {
            console.error("Fel vid hämtning av förrätter:", error);
        }
    }

    // Funktion för att hämta viner
    async function fetchWines() {
        try {
            const response = await fetch("https://project-webbtjanst.onrender.com/public/wine");
            if (!response.ok) {
                throw new Error("Något gick fel vid hämtning av viner");
            }
            const data = await response.json();
            displayMenuItems("wine", data);
        } catch (error) {
            console.error("Fel vid hämtning av viner:", error);
        }
    }

    // Funktion för att visa menyobjekt på sidan
    function displayMenuItems(category, items) {
        try {
            const menuDiv = document.getElementById(`${category}-list`);
            items.forEach(item => {
                // Anpassa detta beroende på attributen för varje kategori
                const listItem = document.createElement("li");
                if (category === "beer") {
                    listItem.textContent = `${item.beerName} - ${item.beerPrice} kr`;
                } else if (category === "dessert") {
                    listItem.textContent = `${item.dessertName} - ${item.dessertPrice} kr`;
                } else if (category === "maincourse") {
                    listItem.textContent = `${item.mainCourseName} - ${item.mainCoursePrice} kr`;
                } else if (category === "nonalcoholic") {
                    listItem.textContent = `${item.nonAlcoholicName} - ${item.nonAlcoholicPrice} kr`;
                } else if (category === "starter") {
                    listItem.textContent = `${item.starterName} - ${item.starterPrice} kr`;
                } else if (category === "wine") {
                    listItem.textContent = `${item.wineName} - ${item.winePrice} kr`;
                }
                menuDiv.appendChild(listItem);
            });
        } catch (error) {
            console.error(`Ett fel inträffade vid visning av ${category}:`, error);
        }
    }

    // Anropa funktioner för att hämta data när sidan har laddats
    fetchBeers();
    fetchDesserts();
    fetchMainCourses();
    fetchNonAlcoholicDrinks();
    fetchStarters();
    fetchWines();

});

