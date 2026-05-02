const uris = location.pathname.split("/");
const seanceId = parseInt(uris[uris.length -1]);
const tableau = document.getElementById("sieges");
const retour = document.getElementById("retour");

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
            const tdSiege = document.createElement("td");
            tdSiege.style.backgroundColor = "green";
            tdSiege.ariaLabel = "Disponible";
            if (rangee[j].reserve) {
                tdSiege.style.backgroundColor = "red";
                tdSiege.ariaLabel = "Occupée";
            }
            tdSiege.style.padding = "10px";
            tdSiege.textContent = rangee[j].rangee + "-" + rangee[j].numero;
            trRangee.append(tdSiege);
        }
        tableau.append(trRangee);
    }
});

retour.addEventListener("click", (event) => {
    location.href = "/seances/";
});
