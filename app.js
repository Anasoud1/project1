const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const UserLogin = require('./models/loginSchema')

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true})); // data send via 'form' is parsed to an object that can be used 
app.use(cookieParser())


/* -- ejs --*/
app.set('view engine', 'ejs'); // put all your ejs files on folder name views
app.use(express.static('public')); // put all your css file and img in folder name public

/* --- tools to use delete method --- */ 
const methodOverride = require('method-override');
app.use(methodOverride('_method')) 

/* ---- import routes ---- */
const allRoutes = require('./routes/allRoutes');
app.use(allRoutes);


// --- use env to hide your link 
mongoose.connect(process.env.MONGO_LINK)
.then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(err => {
    console.log("Failed to connect to databases", err);
});

