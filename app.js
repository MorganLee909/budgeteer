const express = require("express");
const session = require("cookie-session");
const mongoose = require("mongoose");
const compression = require("compression");
const esbuild = require("esbuild");
const cssmerger = require("cssmerger");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/views`));

let mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "budgeteer"
};

let esbuildOptions = {
    entryPoints: [`${__dirname}/views/js/index.js`],
    bundle: true,
    minify: false,
    keepNames: true,
    outfile: `${__dirname}/views/bundle.js`,
};

let cssmergerOptions = {
    recursive: true,
    minimize: true
};

if(process.env.NODE_ENV === "production"){
    mongooseOptions.auth = {authSource: "admin"};
    mongooseOptions.user = "budgeteer";
    mongooseOptions.pass = process.env.MONGODB_PASS_BUDGETEER;
    
    esbuildOptions.minify = true;
    esbuildOptions.keepNames = true;

    cssmergerOptions.minimize = true;
}

mongoose.connect("mongodb://127.0.0.1:27017/", mongooseOptions);
esbuild.buildSync(esbuildOptions);
cssmerger([`${__dirname}/views/css/`], `${__dirname}/views/bundle.css`, cssmergerOptions);

app.use(compression());
app.use(session({
    secret: "Balancing budgets believably by beligerantly brow-beating buyers",
    sameSite: "lax",
    cookie: {secure: true},
    saveUninitialized: true,
    resave: false
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

require(`${__dirname}/routes`)(app);

if(process.env.NODE_ENV === "production"){
    module.exports = app;
}else{
    app.listen(process.env.PORT);
}
