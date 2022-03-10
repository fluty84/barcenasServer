require("dotenv/config");

require("./db");

const express = require("express");

const app = express();

require("./config")(app);

const allRoutes = require("./routes/index.routes");
app.use("/api", allRoutes);

require("./error-handling")(app);

// const cors = require('cors')

// app.use(cors())

// // app.get('/products/:id', function (req, res, next) {
// //     res.json({ msg: 'This is CORS-enabled for all origins!' })
// // })

// app.listen(80, function () {
//     console.log('CORS-enabled web server listening on port 80')
// })


module.exports = app




