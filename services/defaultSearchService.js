const { client } = require('../database/connection');

function getDefaultSongs() {
    // TODO
}

function getDefaultAlbums() {
    // TODO
}

function getDefaultArtists() {
    // TODO
}

async function getDefaultPlaylists() {
    try {
        const db = client.db("test");
        const playlistsCollection = db.collection('playlists');

        // Ottieni le playlist pubbliche più recenti ordinandole per la loro data di creazione in ordine decrescente e limitando i risultati a 20 playlist
        const playlists = await playlistsCollection.find({isPublished: true}).sort({ createdAt: -1 }).limit(20).toArray();

        return playlists;
    } catch (error) {
        console.error("Errore nel recupero delle playlist:", error);
        throw error;
    }
}

async function getDefaultUsers() {
    try {
        const db = client.db("test");
        const usersCollection = db.collection('users');

        // Ottieni gli utenti più recenti ordinandoli per la loro data di creazione in ordine decrescente e limitando i risultati a 20 utenti
        const users = await usersCollection.find().sort({ createdAt: -1 }).limit(20).toArray();

        return users;
    } catch (error) {
        console.error("Errore nel recupero degli utenti:", error);
        throw error;
    }
}


module.exports = {
    getDefaultPlaylists: getDefaultPlaylists,
    getDefaultUsers: getDefaultUsers
};