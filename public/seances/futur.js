function creerBouton(id) {
    const bouton = document.createElement("button");
    bouton.textContent = "Supprimer la séance";
    bouton.value = id;
    bouton.className = "supprimer";
    return bouton;
}
const tableau = document.getElementById("seances");
const retour = document.getElementById(`retour`);
document.addEventListener("DOMContentLoaded", async () => {
    const msg = document.getElementById(`msg`);
    msg.textContent = `Chargement des séances`;
    const response = await fetch("/seances/futur-des-seances");
    const data = await response.json();
    if (data.message) {
        msg.textContent = data.message;
        return;
    }
    for (let i=0; i<data.length; i++) {
        const row = data[i];
        const tr = document.createElement("tr");
        const tdId = document.createElement(`td`); tdId.textContent = row.id;
        const tdQuand = document.createElement("td"); tdQuand.textContent = new Date(row.quand).toLocaleString("fr-ca");
        const tdPrix = document.createElement("td"); tdPrix.textContent = row.prix + " $";
        const tdFilm = document.createElement("td"); tdFilm.textContent = row.film;
        const tdSalle = document.createElement("td"); tdSalle.textContent = row.salle;
        const tdDuree = document.createElement("td"); tdDuree.textContent = row.duree + " min";
        const tdLibre = document.createElement("td"); tdLibre.textContent = row.libre;
        const tdReserve = document.createElement("td"); tdReserve.textContent = row.reserve;
        const tdSup = document.createElement("td"); tdSup.append(creerBouton(row.id));
        tr.append(tdId, tdQuand, tdPrix, tdFilm, tdSalle, tdDuree, tdLibre, tdReserve, tdSup);
        tableau.append(tr);
    }
    msg.textContent = ``;
})
tableau.addEventListener("click", async (event) => {
    if (event.target.classList.contains("supprimer")) {
        const response = await fetch("/seances/supprimer", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({id: event.target.value})
        });
        if (response.status === 204) {
            location.reload();
        }else {
            alert("La suppression n'a pas pu être effectuée.");
        }
    }
});
retour.addEventListener("click", () => location.href = "/seances");