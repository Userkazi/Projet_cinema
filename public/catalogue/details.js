function creerBouton(id) {
    const bouton = document.createElement("button");
    bouton.textContent = "Réserver mes places";
    bouton.value = id;
    bouton.className = "reserver gros";
    return bouton;
}
const divInfos = document.getElementById("infosFilm");
const pageTitre = document.querySelector(`title`);
const uris = location.pathname.split("/");
const filmId = parseInt(uris[uris.length -1]);
document.addEventListener("DOMContentLoaded", async () => {
    const msg = document.getElementById(`msg`);
    msg.textContent = `Chargement des détails`;
    const response = await fetch(`/catalogue/films/details/${filmId}`);
    const data = await response.json();
    if (data.message) {
        msg.textContent = data.message;
        return;
    }
    const film = data[0];
    const div = document.createElement("div");
    const poster = document.createElement(`img`); poster.src = film.url; poster.alt = "Affiche du film" + film.titre; poster.id = "poster";
    const titre = document.createElement("h1"); titre.textContent = film.titre;
    pageTitre.textContent = film.titre;
    const categorie = document.createElement("span"); categorie.textContent = film.categorie;
    const classification = document.createElement("span"); classification.textContent = film.classification;
    const duree = document.createElement("span"); duree.textContent = film.duree;
    const resume = document.createElement("p"); resume.textContent = film.resume;
    const boutonReserver = creerBouton(film.id);
    const infos = document.createElement("p"); infos.append(categorie, " • ", classification, " • ", duree, " min");
    div.append(poster, titre, infos, resume, boutonReserver);
    divInfos.append(poster, div);
    msg.textContent = ``;
})
divInfos.addEventListener("click", async (event) => {
    if (event.target.classList.contains("reserver")) {
        location.href = `/reserver/${event.target.value}`;
    }
});