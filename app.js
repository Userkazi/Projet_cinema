 require('dotenv').config();
 const express= require('express');
 const session= require('express-session');
 const app=express();

 app.use (express.json());
 app.use(express.static('public'));


 app.use(session({
    secret: process.env.SESSION_SECRET || 'ma_cle_super_secrete', 
    resave: false,                                                
    saveUninitialized: false                                     
}));

 const authRoutes= require('./routes/auth');
 app.use('/api/auth',authRoutes);

const authAdmin= require('./routes/admin');
app.use('/api/admin', authAdmin);

const paiements = require('./routes/paiements');
app.use('/api/paiements', paiements);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));