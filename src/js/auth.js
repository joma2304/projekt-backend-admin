window.onload = init;
//KOllar så att token finns för protected.html annars skickas man till login.html
async function init() {

    const jwtToken = localStorage.getItem("jwtToken");
    if(!jwtToken) { //IFall inte token finns
        window.location.href="login.html" //Omdirigera till login sida
    }

};