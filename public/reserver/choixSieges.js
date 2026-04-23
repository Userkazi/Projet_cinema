const uris = location.pathname.split("/");
const seanceId = uris[uris.length -1];
const tableau = document.getElementById("sieges");

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