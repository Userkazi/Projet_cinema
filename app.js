require("dotenv").config();
const express = require("express");
const app = express();
const swaggerUi = require(`swagger-ui-express`);
const swaggerJsdoc = require("swagger-jsdoc");
const port = process.env.PORT||3000;

const seances = require("./routes/seancesRoutes");
const reserver = require("./routes/reserverRoutes");
const catalogue = require("./routes/catalogueRoutes");
const compte = require("./routes/compteRoutes");
const reservations = require("./routes/reservationsRoutes");

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
app.use("/seances", seances);
app.use("/reserver", reserver);
app.use("/catalogue", catalogue);
app.use("/compte", compte);
app.use("/reservations", reservations);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode||500;
    res.status(statusCode).json({message: err.message});
});

app.listen(port);