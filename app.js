 require('dotenv').config();
 const express= require('express');
 const path= require('path');
 const session= require('express-session');
 const app=express();

 app.use (express.json());
 app.use(express.static('public', { extensions: ['html'] })); //Pour lancer les routes,
 //  Cet objet dit au serveur : 
 // "Si l'URL n'a pas d'extension, essaie d'ajouter 
 // .html en cachette pour voir si le fichier existe sans l'afficher dans sur L'URL."


 app.use(session({
    secret: process.env.SESSION_SECRET || 'ma_cle_super_secrete', 
    resave: false,                                                
    saveUninitialized: false                                     
}));

 const authRoutes= require('./routes/auth');
 app.use('/auth',authRoutes);

const authAdmin= require('./routes/admin');
app.use('/admin', authAdmin);

const paiements = require('./routes/paiements');
app.use('/paiements', paiements);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));