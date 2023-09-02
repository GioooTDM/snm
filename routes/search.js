const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/track', searchController.searchTrack);

router.get('/artist', searchController.searchArtist);

router.get('/album', searchController.searchAlbum);

router.get('/playlist', searchController.searchPlaylist);

router.get('/user', searchController.searchUser);


module.exports = router;
