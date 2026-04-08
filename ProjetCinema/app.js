 require('dotenv').config();
 const express= require('express');
 const app=express();

 app.use (express.json());

 const authRoles= require('./routes/auth');
 app.use('/api/auth',authRoles);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));