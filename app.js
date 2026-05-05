require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const session= require('express-session');
const swaggerUi = require(`swagger-ui-express`);
const swaggerJsdoc = require("swagger-jsdoc");
const port = process.env.PORT||3000;

const seances = require("./routes/seancesRoutes");
const reserver = require("./routes/reserverRoutes");
const catalogue = require("./routes/catalogueRoutes");
const compte = require("./routes/compteRoutes");
const reservations = require("./routes/reservationsRoutes");
const billets = require("./routes/billetsRoutes");
const authRoutes= require('./routes/authRoutes');
const authAdmin= require('./routes/adminRoutes');
const paiements = require('./routes/paiementsRoutes');
const agent = require("./routes/agentRoutes");
const films = require("./routes/filmsRoutes");
const salles = require("./routes/sallesRoutes");

//Configuration de la documentation swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API application cinéma",
            version: "1.0.0",
            description: "Documentation interactive de notre API."
        }
    },
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET || 'ma_cle_super_secrete', 
    resave: false,                                                
    saveUninitialized: false                                     
}));
app.get("/", (req, res, next) => res.redirect("/auth/login"));
app.use("/seances", seances);
app.use("/reserver", reserver);
app.use("/catalogue", catalogue);
app.use("/compte", compte);
app.use("/reservations", reservations);
app.use("/billets", billets);
app.use('/auth',authRoutes);
app.use('/admin', authAdmin);
app.use('/paiements', paiements);
app.use("/agent", agent);
app.use("/films", films);
app.use("/salles", salles);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode||500;
    res.status(statusCode).json({message: err.message});
});

app.listen(port, () => console.log(`Serveur lancé sur http://localhost:${port}`));