function creerBouton(id) {
    const bouton = document.createElement("button");
    bouton.textContent = "Voir le plan des sièges";
    bouton.className = "affSieges";
    bouton.value = id;
    return bouton;
}
const retour = document.getElementById(`retour`);
const tableau = document.getElementById("seances");
document.addEventListener("DOMContentLoaded", async () => {
    const msg = document.getElementById(`msg`);
    msg.textContent = `Chargement des séances`;
    const response = await fetch("/seances/historique-des-seances");
    const data = await response.json();
    if (data.message) {
        msg.textContent = data.message;
        return;
    }
    for (let i=0; i<data.length; i++) {
        const row = data[i];
        const tr = document.createElement("tr");
        const tdId = document.createElement(`td`); tdId.textContent = row.id;
        const tdQuand = document.createElement("td"); tdQuand.textContent = new Date(row.quand).toLocaleString(`fr-ca`);
        const tdPrix = document.createElement("td"); tdPrix.textContent = row.prix + " $";
        const tdFilm = document.createElement("td"); tdFilm.textContent = row.film;
        const tdSalle = document.createElement("td"); tdSalle.textContent = row.salle;
        const tdDuree = document.createElement("td"); tdDuree.textContent = row.duree + " min";
        const tdLibre = document.createElement("td"); tdLibre.textContent = row.libre;
        const tdReserve = document.createElement("td"); tdReserve.textContent = row.reserve;
        const tdAction = document.createElement("td"); tdAction.append(creerBouton(row.id));
        tr.append(tdId, tdQuand, tdPrix, tdFilm, tdSalle, tdDuree, tdLibre, tdReserve, tdAction);
        tableau.append(tr);
    }
    msg.textContent = "";
});
tableau.addEventListener("click", async (event) => {
    if (event.target.classList.contains("affSieges")) {
        location.href = `/seances/plan-sieges/${event.target.value}`;
    }
});
retour.addEventListener("click", () => location.href = "/seances");