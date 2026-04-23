const uris = location.pathname.split("/");
const filmId = uris[uris.length -1];
const div = document.getElementById("seances");

document.addEventListener("DOMContentLoaded", async (event) => {
    const response = await fetch(`/reserver/seances/${filmId}`);
    const seances = await response.json();
    if (seances.message) {
        div.textContent = seances.message;
        return
    }
    for (let i = 0; i<seances.length; i++) {
        if (seances[i].libre === 0) {
            continue;
        }
        const bouton = document.createElement("button");
        const br = document.createElement("br");
        bouton.textContent = `${seances[i].libre} places libres le ${new Date(seances[i].quand).toLocaleString("fr-ca")} au co[ut de ${seances[i].prix}$]`;
        bouton.className = "seances";
        bouton.value = seances[i].id;
        div.append(bouton, br);
    }
})

div.addEventListener("click", (event) => {
    if (event.target.classList.contains("seances")) {
        const seanceId = event.target.value;
        location.href = `/reserver/seance/${seanceId}`;
    }
})