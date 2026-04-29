const uris = location.pathname.split("/");
const seanceId = uris[uris.length -1];
const tableau = document.getElementById("sieges");
const form = document.getElementById("selectionSieges");

document.addEventListener("DOMContentLoaded", async (event) => {
    const response = await fetch(`/reserver/sieges/${seanceId}`);
    const sieges = await response.json();
    if (sieges.message) {
        const td = document.createElement("td");
        const tr = document.createElement("tr");
        td.textContent = sieges.message;
        tr.append(td);
        tableau.append(tr);
        return
    }
    for (let i = 0; i<sieges.length; i++) {
        const rangee = sieges[i];
        const trRangee = document.createElement("tr");
        for (let j = 0; j<rangee.length; j++) {
            const siege = document.createElement("input"); siege.type = "checkbox";
            if (rangee[j].reserve) {
                siege.disabled = true;
                siege.style.opacity = "0.3";
            }
            siege.value = rangee[j].id;
            siege.title = rangee[j].rangee + "-" + rangee[j].numero;
            siege.name = "siege";
            const tdSiege = document.createElement("td");
            tdSiege.append(siege);
            trRangee.append(tdSiege);
        }
        tableau.append(trRangee);
    }
});

//Confirmation de la sélection
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selectionSieges = document.getElementsByName("siege");
    const listeSieges = [];
    let sieges = "";
    for (let i = 0; i<selectionSieges.length; i++) {
        if (selectionSieges[i].checked) {
            listeSieges.push(selectionSieges[i].value);
            if (i === 0) {
                sieges += selectionSieges[i].title;
                continue;
            }
            sieges += ", " + selectionSieges[i].title;
        }
    }
    const response = await fetch(`/reserver/infos-seance/${seanceId}`);
    const infos = await response.json();
    const film = infos.film;
    const quand = infos.quand;
    const divConfirmation = document.createElement("div");
    divConfirmation.innerHTML = `
    <h1>Veuillez confirmer votre sélection</h1>
    <p><strong>Titre du film : </strong>${film}</p>
    <p><strong>Date et heure : </strong>${new Date(quand).toLocaleString("fr-ca")}</p>
    <p><strong>Sièges : </strong>${sieges}</p>
    <button type="button" id="retour">Retour au catalogue</button>
    <button type="button" id="confirmer">confirmer</button>`;
    document.body.innerHTML = "";
    document.body.append(divConfirmation);
    const confirmer = document.getElementById("confirmer");
    const retour = document.getElementById("retour");
    confirmer.addEventListener("click", async (event) => {
        const response = await fetch("/reserver", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                seance: seanceId,
                sieges: listeSieges
            })
        });
        const data = await response.json();
        if (data.message) {
            const messageErreur = document.createElement("p");
            messageErreur.textContent = data.message;
            messageErreur.style.color = "red";
            document.body.append(messageErreur);
        }else {
            const reservationId = data.reservationId;
            location.href = `/payer/${reservationId}`;
        }
    });
    retour.addEventListener("click", (event) => {
        location.href = "/catalogue";
    });
});
