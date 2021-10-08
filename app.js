const express = require("express");
const session = require("cookie-session");
const mongoose = require("mongoose");
const compression = require("compression");
const esbuild = require("esbuild");
const cssmerger = require("cssmerger");
const https = require("https");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/views`));

let mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    dbName: "budgeteer"
};

let esbuildOptions = {
    entryPoints: ["./views/js/index.js"],
    bundle: true,
    minify: false,
    outfile: "./views/bundle.js"
};

let cssmergerOptions = {
    recursive: true,
    minimize: true
};

let httpsServer = {};
if(process.env.NODE_ENV === "production"){
    httpsServer = https.createServer({
        key: fs.readFileSync("/etc/letsencrypt/live/budgeteer.money/privkey.pem", "utf8"),
        cert: fs.readFileSync("/etc/letsencrypt/live/budgeteer.money/fullchain.pem", "utf8")
    }, app);

    app.use((req, res, next)=>{
        if(req.secure === true){
            next();
        }else{
            res.redirect(`https://${req.headers.host}${req.url}`);
        }
    });

    
    mongooseOptions.auth = {authSource: "admin"};
    mongooseOptions.user = "website";
    mongooseOptions.pass = process.env.MONGODB_PASS;
    esbuildOptions.minify = true;
    cssmergerOptions.minimize = true;
}

mongoose.connect("mongodb://127.0.0.1:27017/", mongooseOptions);
esbuild.buildSync(esbuildOptions);
cssmerger(["./views/css/"], "./views/bundle.css", cssmergerOptions);

app.use(compression());
app.use(session({
    secret: "Balancing budgets believably by beligerantly brow-beating buyers",
    cookie: {secure: true},
    saveUninitialized: true,
    resave: false
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

require("./routes")(app);

if(process.env.NODE_ENV === "production"){
    httpsServer.listen(process.env.HTTPS_PORT, ()=>{});
}
app.listen(process.env.PORT, ()=>{});