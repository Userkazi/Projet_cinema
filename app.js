require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT||3000;

const seances = require("./routes/seancesRoutes");
const reserver = require("./routes/reserverRoutes");
const catalogue = require("./routes/catalogueRoutes");



app.use(express.json());
app.use(express.static("public"));
app.use("/seances", seances);
app.use("/reserver", reserver);
app.use("/catalogue", catalogue);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode||500;
    res.status(statusCode).json({message: err.message});
});

app.listen(port);