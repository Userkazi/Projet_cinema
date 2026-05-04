require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const films = require("./routes/routefilm");

app.use(express.json());
app.use(express.static("public"));

app.use("/films", films);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
});

app.listen(port, () => {
    console.log("Serveur lancé sur http://localhost:" + port);
});