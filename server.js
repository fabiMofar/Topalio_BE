const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
global.config = require("./modules/config");
const apiRouter = require("./modules/routes/api/index");
const gate = require("./modules/middlewares/gate");
const passport = require("passport");
const cors = require("cors");

//connect to DB
mongoose.connect();
mongoose.Promise = global.Promise;

require("./modules/passport/passport-local");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));
app.use("/public", express.static("public"));

app.use(gate.middleware());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);

app.listen(config.port, () => {
  console.log("server running at port 3000 ");
});
