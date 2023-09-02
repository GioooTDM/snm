const fetchWithToken = require('../utils/fetchWrapper');
const { filterTrackFields, filterAlbumFields, filterArtistFields } = require('../utils/spotifyDataMapper');

/**
 * Ottiene le tracce della playlist "Top 50 global" su Spotify.
 * 
 * Per ogni traccia restituisce: nome della traccia, nome dell'artista, durata della traccia, se la traccia è esplicita, il nome dell'album e le immagini dell'album.
 * 
 * @async
 * @function
 * @returns {Promise<Object>} Un oggetto che rappresenta le tracce nella playlist "Top 50 global". Ogni traccia è un oggetto con le proprietà: `name`, `artists.name`, `duration_ms`, `explicit`, `album.name`, e `album.images`.
 * @throws {Error} Lancia un errore se non sono state trovate tracce nella playlist.
 */
async function getGlobalTopTracks() {
    const response = await fetchWithToken('https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF?fields=tracks.items.track(id,name,artists(id,name,type),duration_ms,explicit,album.name,album.images)');

    const data = await response.json();

    // Controlla se ci sono tracce nella risposta
    if (!data.tracks || !data.tracks.items) {
        throw new Error('No tracks found in playlist');
    }

    // Rimuovi il livello extra "track" e applica il filtraggio
    const tracks = data.tracks.items.map(item => filterTrackFields(item.track));

    return tracks;
}

/**
 * Ottiene gli artisti, senza duplicati, delle tracce della playlist "Top 50 global" su Spotify.
 * 
 * Per ogni artista restituisce: id, nome dell'artista e immagine.
 * 
 * @async
 * @function
 * @returns {Promise<Array<String>>} Una lista di nomi degli artisti nella playlist "Top 50 global".
 * @throws {Error} Lancia un errore se non sono state trovate tracce nella playlist.
 */
async function getGlobalTopArtists() {
    const tracks = await getGlobalTopTracks();

    // Estrai gli ID degli artisti da ogni traccia
    const artistIds = tracks.map(track => track.artists.map(artist => artist.id));

    // Unisci tutte le liste di ID degli artisti in una sola lista e rimuovi gli ID duplicati
    const uniqueArtistIds = [...new Set([].concat(...artistIds))];

    // Poiché l'endpoint di Spotify permette di recuperare al massimo 50 artisti per chiamata, 
    // potremmo aver bisogno di effettuare più chiamate se ci sono più di 50 artisti unici.
    const artistChunks = [];
    for (let i = 0; i < uniqueArtistIds.length; i += 50) {
        artistChunks.push(uniqueArtistIds.slice(i, i + 50));
    }

    // Recupera i dettagli degli artisti in blocchi
    let allArtistsDetails = [];
    for (let chunk of artistChunks) {
        const response = await fetchWithToken(`https://api.spotify.com/v1/artists?ids=${chunk.join(",")}`);
        const data = await response.json();
        allArtistsDetails.push(...data.artists);
    }

    // Estrai le informazioni desiderate (nome, id, immagine) per ogni artista
    const artistsDetails = allArtistsDetails.map(filterArtistFields);

    // Ordina gli artisti per popolarità in ordine decrescente
    artistsDetails.sort((a, b) => b.popularity - a.popularity);

    return artistsDetails;
}


/**
 * Ottiene i nuovi album e singoli rilasciati su Spotify.
 * 
 * @async
 * @function
 * @returns {Promise<Object[]>} - Restituisce una promessa che risolverà con una lista di nuovi album e singoli rilasciati.
 */
async function getNewReleases() {
    const url = `https://api.spotify.com/v1/browse/new-releases?limit=10`;
    const response = await fetchWithToken(url);
    const data = await response.json();

    // verifica che la risposta contenga effettivamente gli album
    if (!data.albums || !data.albums.items) {
        throw new Error('No new releases found on Spotify');
    }

    // Estrai solo i campi rilevanti
    return data.albums.items.map(filterAlbumFields);
}

module.exports = {
    getGlobalTopTracks: getGlobalTopTracks,
    getGlobalTopArtists: getGlobalTopArtists,
    getNewReleases: getNewReleases
};