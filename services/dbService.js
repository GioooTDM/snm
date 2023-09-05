const { client } = require('../database/connection');

// TODO: migliorare magari con un filtraggio dei dati.
async function findPublicPlaylists(query) {
    const db = client.db('test');
    const collection = db.collection('playlists');

    const tags = query.split(" ").filter(tag => tag.startsWith("#"));

    // Cerca le playlist con un nome che corrisponde alla query E che sono pubbliche,
    // O le playlist che contengono tutti i tag forniti E che sono pubbliche.
    return await collection.find({
        $or: [
            {
                title: new RegExp(query, 'i')
            },
            {
                tags: { $all: tags }
            }
        ],
        isPublished: true
    }).toArray();
}


// TODO: migliorare
// non deve esporre dati sensibili tipo password
async function findUsersByNameSurnameMail(query) {

    const db = client.db('test');
    const collection = db.collection('users');
    
    // filter(word => word.length > 0) rimuove eventuali stringhe vuote (se l'utente inserisce spazi extra tra le parole)
    const words = query.split(' ').filter(word => word.length > 0);

    // Costruisci una query per ogni parola
    const wordQueries = words.map(word => ({
        $or: [
            { name: new RegExp(word, 'i') },
            { surname: new RegExp(word, 'i') },
            { email: new RegExp(word, 'i') }
        ]
    }));

    const searchCriteria = {
        $and: wordQueries
    };

    return await collection.find(searchCriteria).toArray();
}


module.exports = {
    findPublicPlaylists,
    findUsersByNameSurnameMail
};
