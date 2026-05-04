const uris = location.pathname.split("/");
const reservationId = parseInt(uris[uris.length -1]);
const title = document.querySelector("title");
const h1 = document.querySelector("h1");
const billets = document.getElementById("billets");
const print = document.getElementById("print");

document.addEventListener("DOMContentLoaded", async (event) => {
    const heading = `Billets de la réservation ${reservationId}`;
    title.textContent = heading;
    h1.textContent = heading;
    const response = await fetch(`/billets/infos/${reservationId}`);
    const data = await response.json();
    if (data.message) {
        billets.textContent = data.message;
        return;
    }
    for (let i = 0; i<data.length; i++) {
        const row =  data[i];
        const billet = document.createElement("div");
        billet.innerHTML = `
        <p><Strong>Nº de billet : </strong>${row.no}</p>
        <p><strong>Date et heure : </strong>${new Date(row.quand).toLocaleString("fr-ca")}</p>
        <p><strong>Film : </strong>${row.titre}</p>
        <p><strong>Salle : </strong>${row.salle}</p>
        <p><strong>Siège : </strong>${row.rangee}-${row.numero}</p>`;
        billet.className = "billet";
        billets.append(billet);
    }
});

print.addEventListener("click", (event) => {
    print.hidden = true;
    window.print();
    print.hidden = false;
})