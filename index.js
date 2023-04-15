const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyparser = require('body-parser');


//Routes import
const carRouter = require('./routes/car-routes');




//Middleware
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.json());

//Body parser configuration
app.use(express.static(__dirname + "/public"));
app.use("/upload", express.static("upload"));

//for corss origin permission
app.use(cors());
app.options('*', cors());

//for testing prupose
app.get(`/`, (req, res) => {
    res.send("Hii from api server");
})


//Using Routers
app.use(`/api/v1/cars`, carRouter);


//connecting to database
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((data) => {
    console.log("Database is ready......");
}).catch((err) => {
    console.log(err);
})

app.listen(`3000`, () => {
    console.log("Server Is Working");
})