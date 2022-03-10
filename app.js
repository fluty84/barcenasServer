require("dotenv/config");

require("./db");

const express = require("express");

const app = express();

require("./config")(app);

const allRoutes = require("./routes/index.routes");
app.use("/api", allRoutes);

require("./error-handling")(app);

console.log('---- EL ORIGEN ES -----', process.env.ORIGIN)

module.exports = app