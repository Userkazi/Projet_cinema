const form = document.getElementById("creerUneSeance");
const retour = document.getElementById("retour");
const msg = document.getElementById("msg");
const quand = document.getElementById("quand");

function validationQuand(datetime) {
    const format = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}(\:\d{2})?$/;
    if (!format.test(datetime)) {
        return false;
    }
    return true;
}
function validationPrix(prix) {
    const format = /^\d{1,10}((\.\d{1,2})|(\,\d{1,2}))?$/;
    if (!format.test(prix)) {
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", async (event) => {
    const film = document.getElementById("film");
    film.innerHTML = "";
    msg.textContent = `Chargement des films...`;
    const response = await fetch(`/seances/films`);
    const films = await response.json();
    if (films.message) {
        msg.textContent = films.message;
        return;
    }
    for (let i=0; i<films.length; i++) {
        const option = document.createElement("option");
        option.textContent = films[i].titre;
        option.value = films[i].id;
        film.append(option);
    }
    film.disabled = false;
    msg.textContent = "";
});
async function updateSalle() {
    const salle = document.getElementById("salle");
    salle.innerHTML = "";
    if (form.film.value !== "" && quand.value !== "") {
        msg.textContent = `Chargement des salles disponibles...`;
        const response = await fetch(`/seances/salles-disponibles?quand=${quand.value}&film=${form.film.value}`);
        const salles = await response.json();
        if (salles.message) {
            msg.textContent = "Error backend" + salles.message;
            return;
        }
        for (let i=0; i<salles.length; i++) {
            const option = document.createElement("option");
            option.textContent = salles[i].nom;
            option.value = salles[i].id;
            salle.append(option);
        }
        salle.disabled = false;
        msg.textContent = "";
    }
}
form.film.addEventListener("change", updateSalle);
quand.addEventListener("change", updateSalle);
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    msg.textContent = `Soumission du formulaire en cours...`;
    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData);
    if (!validationQuand(formData.quand)) {
        msg.textContent = "Le format de la date/heure est incorect.";
        return;
    }
    if (!validationPrix(formData.prix)) {
        msg.textContent = "Le format du prix est incorect.";
        return;
    }
    formData.prix = formData.prix.replace(",", ".");
    const response = await fetch("/seances/creer", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
    });
    const reponse = await response.json();
    msg.textContent = reponse.message;
    if (response.status === 201) {
        form.reset();
    }
});
retour.addEventListener("click", () => location.href = "/seances");