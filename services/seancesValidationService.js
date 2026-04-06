const HttpError = require("../controllers/httpError");
const pool = require("../db");
function validationQuand(datetime) {
    const format = /^\d{4}\-\d{2}\-\d{2}\s\d{2}\:\d{2}(\:\d{2})?$/;
    if (!format.test(datetime)) {
        throw new HttpError(400, "Le format de la date/heure est incorect."+datetime);
    }
}
function validationPrix(prix) {
    const format = /^\d{1,10}(\.\d{1,2})?$/;
    if (!format.test(prix)) {
        throw new HttpError(400, "Le format du prix est incorect.");
    }
}
async function validationFilm(id) {
    const [rows] = await pool.query("SELECT id FROM films WHERE id = ?", [id]);
    if (rows.length === 0) {
        throw new HttpError(404, "Ce film n'exist pas dans la base de données.");
    }
}
async function validationSalle(id) {
    const [rows] = await pool.query("SELECT id FROM salles WHERE id = ?", [id]);
    if (rows.length === 0) {
        throw new HttpError(404, "Cette salle n'exist pas dans la base de données.");
    }
}
module.exports = {validationQuand, validationPrix, validationFilm, validationSalle};