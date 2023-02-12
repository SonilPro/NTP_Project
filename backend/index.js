const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    connectionLimit: 100,
    password: "1234",
    database: "js_projekt",
    debug: false,
});

const secret = 'somelongstringforencription';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(helmet());

app.use(express.static(__dirname + "/public/app"));

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

const authRouter = require('./api/routes/authentication')(express, pool, jwt, secret, bcrypt);
app.use('/authentication', authRouter);

const apiRouter = require("./api/routes/routes")(express, pool, jwt, secret, bcrypt);
app.use("/api", apiRouter);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/app/index.html"));
});

app.listen(3001);
