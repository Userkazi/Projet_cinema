const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cinema_db"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connecté à MySQL");
    }
});

app.get("/films", (req, res) => {
    db.query("SELECT * FROM films", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

app.post("/films", (req, res) => {
    const { titre, resume, duree } = req.body;

    db.query(
        "INSERT INTO films (titre, resume, duree) VALUES (?, ?, ?)",
        [titre, resume, duree],
        (err) => {
            if (err) return res.send(err);
            res.send("Film ajouté");
        }
    );
});

app.delete("/films/:id", (req, res) => {
    db.query("DELETE FROM films WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.send(err);
        res.send("Film supprimé");
    });
});

app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});