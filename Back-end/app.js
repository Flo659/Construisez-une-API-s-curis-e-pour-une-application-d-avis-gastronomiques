const express = require("express");
const mongoose = require("mongoose");
const user_router= require("./routes/user");
const sauces_router= require("./routes/sauces");
const path= require("path");
const rateLimit= require("express-rate-limit");
const helmet= require("helmet");
const mongosanitize= require("express-mongo-sanitize");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.mongodb,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); 

app.use(helmet());
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

app.use(mongosanitize());

const limiter=  rateLimit({
	windowMs: 2 * 60 * 1000,
	max: 140, 
	standardHeaders: true, 
	legacyHeaders: false,
})

app.use(limiter);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use("/images", express.static(path.join(__dirname, "/images")));

app.use("/api/auth",user_router);
app.use("/api/sauces",sauces_router);


module.exports = app;