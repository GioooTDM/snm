const spotifyService = require('../services/spotifyService');
const dbService = require('../services/dbService');

exports.searchTrack = async (req, res) => {
    try {
        const query = req.query.query;
        console.log(query);
        const data = await spotifyService.searchOnSpotify(query, 'track');
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchArtist = async (req, res) => {
    try {
        const query = req.query.query;
        console.log(query);
        const data = await spotifyService.searchOnSpotify(query, 'artist');
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchAlbum = async (req, res) => {
    try {
        const query = req.query.query;
        console.log(query);
        const data = await spotifyService.searchOnSpotify(query, 'album');
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchPlaylist = async (req, res) => {
    try {
        const query = req.query.query;
        console.log(query);
        const data = await dbService.findPublicPlaylists(query);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// TODO: più coerenza con la struttura delle funzioni sopra. Modificare questa o quelle sopra.
exports.searchUser = async (req, res) => {
    try {
        const query = req.query.query;
        const data = await dbService.findUsersByNameSurnameMail(query);

        if (!data) {
            return res.status(404).send("User not found");
        }

        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
