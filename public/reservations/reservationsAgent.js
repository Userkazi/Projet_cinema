function creerBouton(id) {
    const bouton = document.createElement("button");
    bouton.textContent = "Annuler la réservation";
    bouton.className = `supprimer`;
    bouton.value = id;
    return bouton;
}
const tableau = document.getElementById("reservations");
const retour = document.getElementById(`retour`);
document.addEventListener("DOMContentLoaded", async () => {
    const msg = document.getElementById(`msg`);
    msg.textContent = `Chargement des réservations`;
    const response = await fetch("/reservations/liste");
    const data = await response.json();
    if (data.message) {
        msg.textContent = data.message;
        return;
    }
    for (let i=0; i<data.length; i++) {
        const row = data[i];
        const tr = document.createElement("tr");
        const tdId = document.createElement(`td`); tdId.textContent = row.id;
        const tdQuand = document.createElement("td"); tdQuand.textContent = new Date(row.date).toLocaleString("fr-ca");
        const tdStatut = document.createElement("td"); tdStatut.textContent = row.statut;
        const tdFilm = document.createElement("td"); tdFilm.textContent = row.titre;
        const tdAction = document.createElement("td");
        if (row.statut === `payé` || row.statut === "en attente") {
            tdAction.append(creerBouton(row.id));
        }
        tr.append(tdId, tdQuand, tdStatut, tdFilm, tdAction);
        tableau.append(tr);
    }
    msg.textContent = ``;
})
tableau.addEventListener("click", async (event) => {
    if (event.target.classList.contains("annuler")) {
        const response = await fetch(`/reservations/annuler/${event.target.value}`, {
            method: "PATCH"
        });
        if (response.status === 200) {
            location.reload();
        }else {
            alert("L'annulation' n'a pas pu être effectuée.");
        }
    }
});
retour.addEventListener("click", () => location.href = "/agent");