require("dotenv/config");

require("./db");

const express = require("express");

const app = express();

app.use(function (req, res, next) {
    let origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", req.headers.host.indexOf("localhost") > -1 ? "http://localhost:3000" : origin);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

require("./config")(app);

const allRoutes = require("./routes/index.routes");
app.use("/api", allRoutes);

require("./error-handling")(app);

module.exports = app