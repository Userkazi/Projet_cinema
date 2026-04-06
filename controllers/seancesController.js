const path = require("path");
const HttpError = require("./httpError");
const validation = require("../services/seancesValidationService");
const pool = require("../db");
//Gestion des pages html
const pageIntrouvable = ((err, next) => {
    if (err) {
        next(new HttpError(404, "Page introuvable"));
    }
});
const chemin = path.join(__dirname, "/../public/seances");
function pageCreer(req, res, next) {
    try {
        res.sendFile(path.join(chemin,  "creer.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}
function pageGestion(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "/gestion.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}
function pageHistorique(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "/historique.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}
function pageFutur(req, res, next) {
    try {
        res.sendFile(path.join(chemin, "/futur.html"), (err) => pageIntrouvable(err, next));
    }catch (err) {
        next(err);
    }
}
//Lister les films pour créé une séance
async function listeFilms(req, res, next) {
    try {
        const [rows] = await pool.query("SELECT id, titre FROM films");
        if (rows.length === 0) {
            throw new HttpError(404, "Aucun film n'est disponible.");
        }
        res.json(rows);
    }catch (err) {
        next(err);
    }
}
//Lister les salles
async function sallesDisponibles(req, res, next) {
    try {
        let {quand, film} = req.query;
        quand = quand.replace("T", " ");
        validation.validationQuand(quand); await validation.validationFilm(film);
        const [seances] = await pool.query(`
            SELECT seances.id, seances.date_heure as quand, seances.id_salle as id_salle, films.duree as duree, DATE_ADD(seances.date_heure, INTERVAL films.duree MINUTE) as fin
            FROM seances INNER JOIN films ON seances.id_film = films.id
            WHERE DATE_ADD(seances.date_heure, INTERVAL films.duree MINUTE) > ?;`, [quand]);
            const [duree] = await pool.query("SELECT duree FROM films WHERE id = ?", [parseInt(film)]);
            if (duree.length === 0) {
                throw new HttpError(404, "Le film sélectionné n'existe pas.");
            }
            const debut = new Date(quand);
            const termine = new Date(debut.getTime() + (duree[0].duree*60000));
        const sallesOccupees = [];
        for (let i=0; i<seances.length; i++) {
            const row = seances[i];
            if (debut < row.fin && termine > row.quand) {
                sallesOccupees.push(row.id_salle);
            }
        }
        let salles;
        if (sallesOccupees.length !== 0) {
            const [rows] = await pool.query(`SELECT id, nom FROM salles WHERE id NOT IN (?)`, [sallesOccupees]);
            salles = rows;
        }else {
            const [rows] = await pool.query(`SELECT id, nom FROM salles`);
            salles = rows;
        }
        res.json(salles);
    }catch (err) {
        next(err);
    }
}
//Création d'une séance
async function creer(req, res, next) {
    try {
        let {quand, prix, film, salle} = req.body;
        if (!quand||!prix||!film||!salle) {
            throw new HttpError(400, "Tous les champs doivent être remplis.");
        }
        quand = quand.replace("T", " ");
        validation.validationQuand(quand); validation.validationPrix(prix); await validation.validationFilm(film); await validation.validationSalle(salle);
        prix = parseFloat(prix);
        film = parseInt(film);
        salle = parseInt(salle);
        await pool.query("INSERT INTO seances (date_heure, prix, id_film, id_salle) VALUES (?,?,?,?)", [quand, prix, film, salle]);
        res.status(201).json({message: "Séance créée avec succès."});
    }catch (err) {
        next(err);
    }
}

//Liste des séances passé
async function listeHistorique(req, res, next) {
    try {
        const [rows] = await pool.query(`
            SELECT seances.id as id, seances.date_heure as quand, seances.prix as prix, films.titre as film, salles.nom as salle, films.duree as duree, salles.capacite_totale - count(reservation_sieges.id_siege) as libre, count(reservation_sieges.id_siege) as reserve
            FROM seances
            INNER JOIN films ON seances.id_film = films.id
            INNER JOIN salles ON seances.id_salle = salles.id
            LEFT JOIN reservations ON reservations.id_seance = seances.id AND reservations.statut != 'annulé'
            LEFT JOIN reservation_sieges ON reservation_sieges.id_reservation = reservations.id
            WHERE seances.date_heure <= now()
            GROUP BY seances.id, seances.date_heure, seances.prix, films.titre, salles.nom, films.duree, salles.capacite_totale
            Order by seances.date_heure desc;
        `);
        if (rows.length === 0) {
            throw new HttpError(404, "Aucune séance");
        }
        res.json(rows);
    }catch (err) {
        next(err);
    }
}

//Liste des séances futurs
async function listeFutur(req, res, next) {
    try {
        const [rows] = await pool.query(`
            SELECT seances.id as id, seances.date_heure as quand, seances.prix as prix, films.titre as film, salles.nom as salle, films.duree as duree, salles.capacite_totale - count(reservation_sieges.id_siege) as libre, count(reservation_sieges.id_siege) as reserve
            FROM seances
            INNER JOIN films ON seances.id_film = films.id
            INNER JOIN salles ON seances.id_salle = salles.id
            LEFT JOIN reservations ON reservations.id_seance = seances.id AND reservations.statut != 'annulé'
            LEFT JOIN reservation_sieges ON reservation_sieges.id_reservation = reservations.id
            WHERE seances.date_heure > now()
            GROUP BY seances.id, seances.date_heure, seances.prix, films.titre, salles.nom, films.duree, salles.capacite_totale
            Order by seances.date_heure ASC;
        `);
        if (rows.length === 0) {
            throw new HttpError(404, "Aucune séance");
        }
        res.json(rows);
    }catch (err) {
        next(err);
    }
}

//Suppression de séances
async function supprimer(req, res, next) {
    try {
        const id = parseInt(req.body.id);
        const supprimer = await pool.query(`
            DELETE FROM seances
            WHERE id = ?`,
        [id]);
        res.status(204).end();
    }catch (err) {
        next(err);
    }
}

module.exports = {pageGestion, pageCreer, pageFutur, pageHistorique, creer, listeFilms, sallesDisponibles, listeHistorique, listeFutur, supprimer};