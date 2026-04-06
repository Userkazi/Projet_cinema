document.addEventListener("DOMContentLoaded", async () => {
    const tableau = document.getElementById("seances");
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
        tr.append(tdId, tdQuand, tdPrix, tdFilm, tdSalle, tdDuree, tdLibre, tdReserve);
        tableau.append(tr);
    }
    msg.textContent = "";
})