const creer = document.getElementById("creer");
const historique = document.getElementById("historique");
const futur = document.getElementById("futur");

creer.addEventListener("click", () => {
    location.href = "/seances/creer";
});
historique.addEventListener("click", () => {
    location.href = "/seances/historique";
});
futur.addEventListener("click", () => {
    location.href = "/seances/futur";
});