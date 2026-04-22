const form = document.getElementById("creerSalle");
const afficher = document.getElementById("afficher");
const msg = document.getElementById("msg");
const liste = document.getElementById("liste");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let data = new FormData(event.target);
    data = Object.fromEntries(data);

    if (data.nom === "" || data.rangees === "" || data.sieges === "") {
        msg.textContent = "Remplis tous les champs";
        return;
    }

    if (isNaN(data.rangees) || isNaN(data.sieges)) {
        msg.textContent = "Doit être des nombres";
        return;
    }

    data.rangees = parseInt(data.rangees);
    data.sieges = parseInt(data.sieges);

    const response = await fetch("/salles/creer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const rep = await response.json();
    msg.textContent = rep.message;

    if (response.status === 201) {
        form.reset();
        chargerSalles();
    }
});

async function chargerSalles() {
    const response = await fetch("/salles/liste");
    const salles = await response.json();

    let html = "<table border='1'>";
    html += "<tr><th>ID</th><th>Nom</th><th>Capacité</th></tr>";

    for (let i = 0; i < salles.length; i++) {
        html += `
        <tr>
            <td>${salles[i].id}</td>
            <td>${salles[i].nom}</td>
            <td>${salles[i].capacite_totale}</td>
        </tr>
        `;
    }

    html += "</table>";
    liste.innerHTML = html;
}

afficher.addEventListener("click", chargerSalles);