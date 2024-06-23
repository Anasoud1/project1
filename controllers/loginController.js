const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');


const UserLogin = require('../models/loginSchema');  // folder for the structure of db


const signin_get = (req, res) => {
    console.log("/login Get request")

    if (req.cookies.jwt){
        res.redirect('/')
    }
    res.render("signin", {err_email: false})
}
const signup_get = (req, res) => {
    if (req.cookies.jwt){
        res.redirect('/')
    }
    res.render("signup", {err_email: false})
}

const signup_post =  async (req, res) => {
    console.log("enter register post request ...")
    try{
        const {fullName, email, password } = req.body;
        console.log("req.body: ", req.body)
       
        const user = await UserLogin.findOne({email: email});
        console.log(user);
        if(user) {
            return res.status(400).render('signup', {err_email: true});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({email, fullName}, process.env.SECRET)

        res.cookie('jwt', token, {
            maxAge:600000 * 60000,
            httpOnly:true
        })

        await UserLogin.create({fullName, email, password: hashPassword, token})
        .then(() => console.log("user create successfully"))
        .catch(err => console.log("failed to create user ", err));
        // allUsers.push({email, password: hashPassword});
        return res.status(201).redirect('/');

    } catch (error) {
        console.log("failed to register in ...: ", error)
        return res.status(500).send({message: error.message})
        
    } 
}

const signin_post = async (req, res) => {
    try {
        console.log("login Post request")
        const {email, password} = req.body;
        const user = await UserLogin.findOne({email: email});

        // console.log('user: ', user);
        // console.log("req.body: ", req.body)
        
        if (!user){
            return res.status(400).render('signin', {err_email: true})
        } 
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).render('signin', {err_email: true})
        }
        
        res.cookie('jwt', user.token, {
            maxAge:600000 * 600000,
            httpOnly:true
        })

        return res.status(200).redirect('/');

    } catch (error) {
        console.log("failed to post request ", error);
        return res.status(500).send({ message: error.message });
    }
}

const logout =  (req, res) => {
    // res.cookie('jwt', '', {maxAge: 1});
    res.clearCookie('jwt')
    res.redirect('/')
}
module.exports = {signin_get, signup_get, signup_post, signin_post, logout};