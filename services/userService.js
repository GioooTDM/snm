const { client } = require('../database/connection');
const { getArtistsFromSpotify, getTracksFromSpotify } = require('./spotifyService');
const { getPlaylistById } = require('./playlistService');
const { ObjectId } = require('mongodb');

async function getUserById(userId) {
    const db = client.db('test');
    const collection = db.collection('users');
    return await collection.findOne({ _id: new ObjectId(userId) });
}

async function getLikedSongsByUserId(userId) {
    const user = await getUserById(userId);
    
    if (!user || !Array.isArray(user.likedSongs) || user.likedSongs.length === 0) {
        // L'utente non esiste o non ha canzoni a cui ha messo "mi piace"
        return [];
    }

    return await getTracksFromSpotify(user.likedSongs);
}

async function getLikedArtistsByUserId(userId) {
    const user = await getUserById(userId);
    
    if (!user || !Array.isArray(user.likedArtists) || user.likedArtists.length === 0) {
        // L'utente non esiste o non ha artisti a cui ha messo "mi piace"
        return [];
    }

    // Recupera i dettagli degli artisti da Spotify
    const artistsDetails = await getArtistsFromSpotify(user.likedArtists);
    return artistsDetails;
}

async function getLikedPlaylistsByUserId(userId) {
    const user = await getUserById(userId);

    if (!user || !Array.isArray(user.likedPlaylists) || user.likedPlaylists.length === 0) {
        // L'utente non esiste o non ha playlist a cui ha messo "mi piace"
        return [];
    }

    // Recupera le informazioni dettagliate per ciascuna playlist utilizzando la funzione getPlaylistById
    const likedPlaylistsDetails = [];
    for (const playlistId of user.likedPlaylists) {
        const playlistDetails = await getPlaylistById(playlistId.toString());
        if (playlistDetails) { // Controlla se la playlist esiste
            likedPlaylistsDetails.push(playlistDetails);
        }
    }

    return likedPlaylistsDetails;
}

module.exports = {
    getUserById,
    getLikedSongsByUserId,
    getLikedArtistsByUserId,
    getLikedPlaylistsByUserId
};