const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  connectionLimit: 100,
  password: "1234",
  database: "js_projekt",
  debug: false,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());

app.use(express.static(__dirname + "/public/app"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,  Authorization");
  next();
});

const apiRouter = require("./api/routes/routes")(express, pool);
app.use("/api", apiRouter);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/app/index.html"));
});

app.listen(3001);
