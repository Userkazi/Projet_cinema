const form = document.getElementById("creerSalle");
const afficher = document.getElementById("afficher");
const msg = document.getElementById("msg");
const liste = document.getElementById("liste");

async function chargerSalles() {
    try {
        msg.textContent = "Chargement des salles...";

        const response = await fetch("/salles/liste");
        const salles = await response.json();

        if (salles.message) {
            msg.textContent = salles.message;
            return;
        }

        let html = "<table border='1' align='center'>";
        html += "<tr><th>ID</th><th>Nom</th><th>Capacité</th><th>Action</th></tr>";

        for (let i = 0; i < salles.length; i++) {
            html += `
                <tr>
                    <td>${salles[i].id}</td>
                    <td>${salles[i].nom}</td>
                    <td>${salles[i].capacite_totale}</td>
                    <td>
                        <button onclick="supprimerSalle(${salles[i].id})">Supprimer</button>
                    </td>
                </tr>
            `;
        }

        html += "</table>";
        liste.innerHTML = html;
        msg.textContent = "";

    } catch (err) {
        msg.textContent = "Erreur lors du chargement.";
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    msg.textContent = "Soumission en cours...";

    let formData = new FormData(event.target);
    formData = Object.fromEntries(formData);

    if (!formData.nom || !formData.capacite_totale) {
        msg.textContent = "Tous les champs doivent être remplis.";
        return;
    }

    if (isNaN(formData.capacite_totale)) {
        msg.textContent = "La capacité doit être un nombre.";
        return;
    }

    formData.capacite_totale = parseInt(formData.capacite_totale);

    const response = await fetch("/salles/creer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const reponse = await response.json();
    msg.textContent = reponse.message;

    if (response.status === 201) {
        form.reset();
        chargerSalles();
    }
});

async function supprimerSalle(id) {
    const response = await fetch("/salles/supprimer", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    });

    if (response.status === 204) {
        msg.textContent = "Salle supprimée.";
        chargerSalles();
    } else {
        const reponse = await response.json();
        msg.textContent = reponse.message;
    }
}

afficher.addEventListener("click", chargerSalles);