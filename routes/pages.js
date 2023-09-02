const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const getUserInfo = require('../middlewares/getUserInfo');
const pagesController = require('../controllers/pagesController');


router.get('/login', pagesController.login);

router.get('/register', pagesController.register);

router.get('/logout', pagesController.logout);


// Following routes should be accessed only if user is authenticated


router.get('/home', isAuthenticated, getUserInfo, pagesController.home);

router.get('/search', isAuthenticated, getUserInfo, pagesController.search);

router.get('/profile', isAuthenticated, getUserInfo, pagesController.profile);

router.get('/profile/settings', isAuthenticated, getUserInfo, pagesController.settings);

router.get('/playlist/liked-songs', isAuthenticated, getUserInfo, pagesController.likedSongs);

router.get('/playlist/:playlistId', isAuthenticated, getUserInfo, pagesController.playlist);

// TODO
router.get('/artists/:artistId', isAuthenticated, pagesController.singleArtist);

// TODO: finire. Route to serve a specific user page
router.get('/users/:userId', isAuthenticated, getUserInfo, pagesController.user);

module.exports = router;