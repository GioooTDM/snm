const path = require('path');
const spotifyHomeService = require('../services/spotifyHomeService');
const defaultSearchService = require('../services/defaultSearchService');
const playlistService = require('../services/playlistService');
const userService = require('../services/userService');
const { ObjectId } = require('mongodb');
const { client } = require('../database/connection');

exports.login = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
};

exports.register = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
};

exports.logout = (req, res) => {
    res.cookie('auth_token', '', { expires: new Date(0) });
    res.redirect('/login');
};

exports.home = async (req, res) => {
    try {
        const tracks = await spotifyHomeService.getGlobalTopTracks();
        const artists = await spotifyHomeService.getGlobalTopArtists();
        const newReleases = await spotifyHomeService.getNewReleases();
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const likedArtists = await userService.getLikedArtistsByUserId(req.userId);
        res.render('home', { tracks, artists, newReleases, userPlaylists, likedArtists, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni da Spotify');
    }
};

exports.search = async (req, res) => {
    try {
        // TODO: migliorare defaultTracks
        const defaultTracks = await spotifyHomeService.getGlobalTopTracks();
        const defaultArtists = await spotifyHomeService.getGlobalTopArtists();
        const defaultAlbums = await spotifyHomeService.getNewReleases();
        const defaultPlaylists = await defaultSearchService.getDefaultPlaylists();
        const defaultUsers = await defaultSearchService.getDefaultUsers();

        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const likedArtists = await userService.getLikedArtistsByUserId(req.userId);
        res.render('search', { defaultTracks, defaultArtists, defaultAlbums, defaultPlaylists, defaultUsers, userPlaylists, likedArtists, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni');
    }
};

exports.profile = async (req, res) => {
    try {
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const likedArtists = await userService.getLikedArtistsByUserId(req.userId);
        const likedPlaylists = await userService.getLikedPlaylistsByUserId(req.userId);
        const isMe = true;
        res.render('profile', { title: "User Page", isMe, user: req.user, userPlaylists, likedArtists, profileUser: req.user, profilePlaylists: userPlaylists, likedPlaylists });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.settings = async (req, res) => {
    const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
    const likedArtists = await userService.getLikedArtistsByUserId(req.userId);
    res.render('settings', { title: "Settings", user: req.user, userPlaylists, likedArtists });
};

exports.likedSongs = async (req, res) => {
    try {
        const likedSongs = await userService.getLikedSongsByUserId(req.userId);
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const likedArtists = await userService.getLikedArtistsByUserId(req.userId);

        res.render('likedSongs', { title: "Liked Songs", user: req.user, likedSongs, userPlaylists, likedArtists });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


exports.playlist = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;

        const playlistDetails = await playlistService.getPlaylistById(playlistId);
        const playlistTracksDetails = await playlistService.getTracksDetailsByPlaylistId(playlistId);
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const likedArtists = await userService.getLikedArtistsByUserId(req.userId);

        if (!playlistDetails) {
            return res.status(404).send('Playlist not found');
        }

        const isOwner = req.userId === playlistDetails.createdBy.toString();
        const isLiked = req.user.likedPlaylists.map(id => id.toString()).includes(playlistId);
        res.render('playlist', { title: "Playlist", user: req.user, userPlaylists, likedArtists, playlistDetails, playlistTracksDetails, isOwner, isLiked });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// TODO
exports.singleArtist = (req, res) => {
    res.render('singleArtist');
};

// TODO: finire
// probabilmente mi serve una variabile booleana chiamata isMe
// fare il render della view 'profile'
exports.user = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Se l'ID non ha un formato valido, invia un errore
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send("ID utente non valido");
        }

        // Trova l'utente nel database
        const profileUser = await client.db("test").collection("users").findOne({ _id: new ObjectId(userId) });
        
        // Se non viene trovato alcun utente con quell'ID, invia un errore
        if (!profileUser) {
            return res.status(404).send("Utente non trovato");
        }
        
        //res.json(user); // TODO: non restituire la password

        
        const likedArtists = await userService.getLikedArtistsByUserId(req.userId);
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);

        const profilePublicPlaylists = await playlistService.getPublicPlaylistsByUserId(profileUser._id);

        const likedPlaylists = await userService.getLikedPlaylistsByUserId(profileUser._id);

        const isMe = false;

        res.render("profile", { title: "User Page", isMe, user: req.user, userPlaylists, likedArtists, profileUser, profilePlaylists: profilePublicPlaylists, likedPlaylists });
    } catch (error) {
        res.status(500).send("Errore interno del server");
    }
};