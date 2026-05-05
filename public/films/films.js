const form = document.getElementById("creerFilm");
const afficher = document.getElementById("afficher");
const msg = document.getElementById("msg");
const liste = document.getElementById("liste");
const categorie = document.getElementById("id_categorie");

// Charger les categories (DYNAMIQUE)
document.addEventListener("DOMContentLoaded", async () => {
    categorie.innerHTML = "";
    msg.textContent = "Chargement des cat gories...";
    const response = await fetch("/films/categories");
    const categories = await response.json();
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.textContent = categories[i].nom;
        option.value = categories[i].id;
        categorie.append(option);
    }
    msg.textContent = "";
});

// Creer film
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let data = new FormData(event.target);
    data = Object.fromEntries(data);
    if (
        data.titre === "" ||
        data.resume === "" ||
        data.duree === "" ||
        data.affiche_url === "" ||
        data.id_categorie === "" ||
        data.classification === ""
    ) {
        msg.textContent = "Remplis tous les champs.";
        return;
    }
    if (isNaN(data.duree)) {
        msg.textContent = "Durée doit  tre un nombre.";
        return;
    }
    data.duree = parseInt(data.duree);
    data.id_categorie = parseInt(data.id_categorie);
    
    const response = await fetch("/films/creer", {
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
        chargerFilms();
    }
});

// Afficher films
async function chargerFilms() {
    const response = await fetch("/films/liste");
    const films = await response.json();
    let html = "<table>";
    html += "<tr><th>ID</th><th>Titre</th><th>Durée</th></tr>";
    
    for (let i = 0; i < films.length; i++) {
        html += `
        <tr>
            <td>${films[i].id}</td>
            <td>${films[i].titre}</td>
            <td>${films[i].duree}</td>
            <!--<td><button onclick="supprimerFilm(${films[i].id})">Supprimer</button></td>-->
        </tr>`;
    }
    html += "</table>";
    liste.innerHTML = html;
} 

// Supprimer film
/*async function supprimerFilm(id) {
    await fetch("/films/supprimer", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id })
    });
    chargerFilms();
}*/

afficher.addEventListener("click", chargerFilms);