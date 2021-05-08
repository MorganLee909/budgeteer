const express = require("express");
const session = require("cookie-session");
const mongoose = require("mongoose");
const compression = require("compression");
const esbuild = require("esbuild");
const https = require("https");
const fs = require("fs");

const app = express();

mongoose.connect(`${process.env.DB}/budgeteer`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

let esbuildOptions = {
    entryPoints: ["./views/js/index.js"],
    bundle: true,
    minify: false,
    outfile: "./views/bundle.js"
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

    esbuildOptions.minify = true;
}

esbuild.buildSync(esbuildOptions);

app.use(compression());
app.use(session({
    secret: "Balancing budgets believably by beligerently berating badgers",
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