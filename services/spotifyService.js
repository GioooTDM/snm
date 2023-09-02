const fetchWithToken = require('../utils/fetchWrapper');
const { filterArtistFields, filterAlbumFields, filterTrackFields } = require('../utils/spotifyDataMapper');

/**
 * Funzione per la ricerca di artisti, album o brani su Spotify.
 * 
 * @param {string} query - Il termine di ricerca.
 * @param {string} type - Il tipo di elemento da cercare (artist, album o track)
 * 
 * @returns {Promise<Object>} - Restituisce una promessa che risolverà con i dati della risposta dell'API di Spotify.
 */
async function searchOnSpotify(query, type) {
  const formattedQuery = query.split(' ').join('+');

  const url = `https://api.spotify.com/v1/search?q=${formattedQuery}&type=${type}&limit=10`;

  const response = await fetchWithToken(url);

  const data = await response.json();

  switch (type) {
    case 'artist':
      return data.artists.items.map(filterArtistFields);
    case 'album':
      return data.albums.items.map(filterAlbumFields);
    case 'track':
      return data.tracks.items.map(filterTrackFields);
    default:
      throw new Error(`Unsupported search type: ${type}`);
  }
}


/**
 * Verifica se l'ID della traccia fornito è un ID valido su Spotify.
 * 
 * Questa funzione effettua una richiesta alle API di Spotify per ottenere dettagli sulla traccia con l'ID specificato.
 * Se l'ID è valido e corrisponde a una traccia su Spotify, la funzione restituirà `true`. In caso contrario, restituirà `false`.
 * 
 * @async
 * @function
 * @param {string} trackId - L'ID della traccia da verificare.
 * @returns {Promise<boolean>} Restituisce `true` se l'ID della traccia è valido, altrimenti `false`.
 */
async function verifyTrackId(trackId) {
  try {
    const response = await fetchWithToken(`https://api.spotify.com/v1/tracks/${trackId}`);

    if (response.status !== 200) {
      return false;
    }

    const data = await response.json();
    
    return data && data.id === trackId;

  } catch (error) {
    console.error("Errore durante la verifica dell'ID della traccia su Spotify:", error);
    return false;
  }
}

/**
 * Recupera le tracce da Spotify usando i loro ID.
 * 
 * @param {string[]} trackIds - Una lista degli ID delle tracce.
 * @returns {Promise<Object[]>} - Restituisce una promessa che risolverà con i dati delle tracce di Spotify.
 */
async function getTracksFromSpotify(trackIds) {
  if (!Array.isArray(trackIds)) {
    throw new Error("L'input deve essere un array di ID delle tracce.");
  }

  if (trackIds.length === 0) {
    return [];
  }

  const idsParam = trackIds.join(',');

  const url = `https://api.spotify.com/v1/tracks?ids=${idsParam}`;

  const response = await fetchWithToken(url);

  if (!response.ok) {
    throw new Error("Errore nel recupero dei dettagli delle tracce da Spotify.");
  }

  const data = await response.json();

  return data.tracks.map(filterTrackFields);
}

/**
 * Recupera gli artisti da Spotify usando i loro ID.
 * 
 * @param {string[]} artistIds - Una lista degli ID degli artisti.
 * @returns {Promise<Object[]>} - Restituisce una promessa che risolverà con i dati degli artisti di Spotify.
 */
//TODO: gestire il caso in cui si vogliano recuperare più di 50 artisti
async function getArtistsFromSpotify(artistIds) {
  if (!Array.isArray(artistIds) || artistIds.length === 0) {
    throw new Error("L'input deve essere un array non vuoto di ID di artisti.");
  }

  const idsParam = artistIds.join(',');

  const url = `https://api.spotify.com/v1/artists?ids=${idsParam}`;

  const response = await fetchWithToken(url);

  if (!response.ok) {
    throw new Error("Errore nel recupero dei dettagli degli artisti da Spotify.");
  }

  const data = await response.json();

  return data.artists.map(filterArtistFields);
}

module.exports = {
  searchOnSpotify: searchOnSpotify,
  verifyTrackId: verifyTrackId,
  getArtistsFromSpotify: getArtistsFromSpotify,
  getTracksFromSpotify: getTracksFromSpotify
};
