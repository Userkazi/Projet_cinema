// Fichier : creerUsers.js
require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

async function creerUtilisateursDeTest() {
    try {
        // On crypte le mot de passe "1234"
        const motDePasseHache = await bcrypt.hash('1234', 10);

        // 1. Création de l'Administrateur (id_role = 1)
        await pool.execute(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?)',
            ['Le Boss', 'admin@cinema.com', motDePasseHache, 1]
        );

        // 2. Création de l'Agent (id_role = 2)
        //await pool.execute(
            //'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?)',
            //['Agent Smith', 'agent@cinema.com', motDePasseHache, 2]
       // );

        // 3. Création du Client (id_role = 3)
        //await pool.execute(
            //'INSERT INTO utilisateurs (nom, email, mot_de_passe, id_role) VALUES (?, ?, ?, ?)',
            //['Client Fidele', 'client@cinema.com', motDePasseHache, 3]
        //);

        console.log(" Succès : Les 3 utilisateurs de test ont été créés !");
        console.log("Mot de passe pour tous : 1234");
        process.exit(); // Arrête le script

    } catch (erreur) {
        console.error("Erreur lors de la création :", erreur);
        process.exit(1);
    
    }
}


creerUtilisateursDeTest();