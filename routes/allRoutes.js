const express = require('express');
const router = express.Router()
const userControler = require('../controllers/userController');
const loginController = require('../controllers/loginController');

const jwt = require('jsonwebtoken');

/* --- function to check authentication ---- */
const checkAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    try {
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user; // Add the user data to the request object
        next();
    } catch (err) {
        console.log("JWT verification failed:", err);
        res.clearCookie('jwt');
        res.redirect('/signin');
    }
};

/* ---- Get request ---- */
router.get(['/', '/index'], checkAuth, userControler.user_index_get);
router.get('/add', checkAuth, userControler.user_add_get);
router.get('/search', checkAuth, userControler.user_search_get);
router.get('/user/:id', checkAuth, userControler.user_view_get);
router.get('/update/:id', checkAuth, userControler.user_edit_get);

router.get('/signup', loginController.signup_get);
router.get('/signin', loginController.signin_get);
router.get('/logout', loginController.logout);

/* ---- Post request ---- */
router.post('/add', checkAuth ,userControler.user_post);

router.post('/signup', loginController.signup_post);
router.post('/signin', loginController.signin_post)

/* ---- Update request ---- */
router.put('/update/:id', checkAuth, userControler.user_update);

/* ---- Delete request ---- */
router.delete('/update/:id', userControler.user_delete);


module.exports = router;