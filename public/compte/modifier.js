const form = document.getElementById("modifierUnCompte");
const retour = document.getElementById("retour");
const msg = document.getElementById("msg");

function validationNom(nom) {
    const format = /^[A-Z][a-zA-Z\s\-]+[a-z]$/;
    if (!format.test(nom)) {
        return false;
    }
    return true;
}
function validationEmail(email) {
    const format = /^[^@\s]+@[^@\s]+\.[a-z]+$/i;
    if (!format.test(email)) {
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", async (event) => {
    const nom = document.getElementById("nom");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    msg.textContent = `Chargement des infos du compte`;
    const response = await fetch(`/compte/infos`);
    const infos = await response.json();
    if (infos.message) {
        msg.textContent = infos.message;
        return;
    }
    nom.value = infos[0].nom; nom.disabled = false;
    email.value = infos[0].email; email.disabled = false;
    password.disabled = false;
    msg.textContent = "";
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    msg.textContent = `Soumission du formulaire en cours...`;
    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData);
    if (!validationNom(formData.nom)) {
        msg.textContent = "Le format du nom est incorect. Il peut uniquement contenir des lettres, des espaces et des traits d'union.";
        return;
    }
    if (!validationEmail(formData.email)) {
        msg.textContent = "Le format de l'adresse courriel est incorrect.";
        return;
    }
    const response = await fetch("/compte/modifier", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
    });
    const reponse = await response.json();
    msg.textContent = reponse.message;
    if (response.status === 201) {
        location.reload();
    }
});
retour.addEventListener("click", () => location.href = "/catalogue");