const form = document.getElementById("creerFilm");
const afficher = document.getElementById("afficher");
const msg = document.getElementById("msg");
const liste = document.getElementById("liste");

async function chargerFilms() {
    try {
        msg.textContent = "Chargement des films...";

        const response = await fetch("/films/liste");
        const films = await response.json();

        if (films.message) {
            msg.textContent = films.message;
            return;
        }

        let html = "<table border='1' align='center'>";
        html += "<tr><th>ID</th><th>Titre</th><th>Résumé</th><th>Durée</th><th>Affiche</th><th>Catégorie</th><th>Classification</th><th>Action</th></tr>";

        for (let i = 0; i < films.length; i++) {
            html += `
                <tr>
                    <td>${films[i].id}</td>
                    <td>${films[i].titre}</td>
                    <td>${films[i].resume}</td>
                    <td>${films[i].duree}</td>
                    <td>${films[i].affiche_url}</td>
                    <td>${films[i].id_categorie}</td>
                    <td>${films[i].classification}</td>
                    <td><button onclick="supprimerFilm(${films[i].id})">Supprimer</button></td>
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

    if (
        !formData.titre ||
        !formData.resume ||
        !formData.duree ||
        !formData.affiche_url ||
        !formData.id_categorie ||
        !formData.classification
    ) {
        msg.textContent = "Tous les champs doivent être remplis.";
        return;
    }

    if (isNaN(formData.duree)) {
        msg.textContent = "La durée doit être un nombre.";
        return;
    }

    formData.duree = parseInt(formData.duree);
    formData.id_categorie = parseInt(formData.id_categorie);

    const response = await fetch("/films/creer", {
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
        chargerFilms();
    }
});

async function supprimerFilm(id) {
    const response = await fetch("/films/supprimer", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    });

    if (response.status === 204) {
        msg.textContent = "Film supprimé.";
        chargerFilms();
    } else {
        const reponse = await response.json();
        msg.textContent = reponse.message;
    }
}

afficher.addEventListener("click", chargerFilms);