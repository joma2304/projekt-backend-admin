# DT207G Backend-baserad webbutveckling, webbplats för projektuppgift
Detta repo innehåller koden för min lösning av en del av projektuppgiften till kurser dt207G backend-baserad webbutveckling. Koden är till en webbplats för en restaurang som används för att konsumera data från en webbtjänst för restaurangens admingränssnitt, meny samt bokningar. Webbplatsen är uppdelad i två olika delar. En för inloggad användare för att hantera meny och bokningar, samt en för besökare för att se restaurangens meny, information om restaurangen och möjligheten att boka bord.  

## Admingränssnitt
Admingränssnittet ligger skyddat bakom ett inlogg, när en användare loggar in så skickas en JWT-token med. Denna används sedan vid anrop till webbtjänsten för att ändra, lägga till och ta bort i menyn. Samt att se information om och ta bort bokningar. 

## Webbplats för restaurang
Webbplatsen för restaurangen består till huvuddel av menyn som hämtas in från webbtjänsten med metoden GET. Utöver detta så finns där en funktion för att boka bord, detta görs via ett Post-anrop till webbtjänsten där den information som fylls i av bokaren lagras. 


