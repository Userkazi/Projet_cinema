function creerBouton(id) {
    const bouton = document.createElement("button");
    bouton.textContent = "Voir les détails";
    bouton.value = id;
    bouton.className = "details";
    return bouton;
}
const liste = document.getElementById("catalogueFilms");
const modifier = document.getElementById(`modifier`);
const reservations = document.getElementById("reservations");
const logout = document.getElementById("logout");
document.addEventListener("DOMContentLoaded", async () => {
    const msg = document.getElementById(`msg`);
    msg.textContent = `Chargement des films`;
    const response = await fetch("/catalogue/films");
    const data = await response.json();
    if (data.message) {
        msg.textContent = data.message;
        return;
    }
    for (let i=0; i<data.length; i++) {
        const film = data[i];
        const div = document.createElement("div"); div.className = "film";
        const poster = document.createElement(`img`); poster.src = film.url; poster.alt = "Affiche du film" + film.titre;
        const titre = document.createElement("h2"); titre.textContent = film.titre;
        const categorie = document.createElement("span"); categorie.textContent = film.categorie;
        const classification = document.createElement("span"); classification.textContent = film.classification;
        const boutonDetails = creerBouton(film.id);
        const infos = document.createElement("p"); infos.append(categorie, " • ", classification);
        div.append(poster, titre, infos, boutonDetails);
        liste.append(div);
    }
    msg.textContent = ``;
})
liste.addEventListener("click", async (event) => {
    if (event.target.classList.contains("details")) {
        location.href = `/catalogue/details/${event.target.value}`;
    }
});
modifier.addEventListener("click", (event) => {
    location.href = "/compte/";
});
reservations.addEventListener("click", (event) => {
    location.href = "/reservations";
});
logout.addEventListener("click", async (event) => {
    location.href = "/auth/logout";
});