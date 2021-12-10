const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

// require("./routes/auth-routes")(app);

module.exports = app;
