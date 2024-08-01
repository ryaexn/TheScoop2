// Script for Pop-up search window
document.querySelector("#search").addEventListener("click", function(){
    document.querySelector("#search-popup").classList.add("active");
    document.querySelector("#login-area").classList.remove("active");
});

document.querySelector("#search-popup .close-btn").addEventListener("click", function(){
    document.querySelector("#search-popup").classList.remove("active");
});
