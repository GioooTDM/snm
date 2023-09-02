/**
 * Salva il token di autenticazione ottenuto da Spotify.
 * @type {string|null}
 */
let token = null;

/**
 * Memorizza il timestamp di scadenza del token di autenticazione.
 * @type {number|null}
 */
let tokenExpiration = null;

/**
 * Richiede un nuovo token di autenticazione a Spotify.
 * 
 * @async
 * @function
 * @throws {FetchError} se la richiesta HTTP fallisce.
 */
async function fetchToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    token = data.access_token;
    // Imposta il tempo di scadenza del token
    tokenExpiration = Date.now() + data.expires_in * 1000;
}


/**
 * Wrapper per la funzione fetch che aggiunge automaticamente il token di autorizzazione nelle richieste a Spotify.
 * 
 * Se il token di autenticazione è scaduto o non esiste, richiede un nuovo token prima di procedere con la richiesta.
 *
 * @async
 * @function
 * @param {string} url - L'URL dell'endpoint di Spotify a cui si desidera inviare la richiesta.
 * @param {Object} [options={}] - Un oggetto opzionale contenente le opzioni della richiesta HTTP (ad es. headers, method, body, ecc.).
 * @throws {FetchError} se la richiesta HTTP fallisce.
 * @returns {Promise<Response>} Un oggetto Response che rappresenta la risposta a una richiesta.
 */
async function fetchWithToken(url, options = {}) {
    // Controlla se il token è scaduto o non esiste e, in caso affermativo, ne richiede uno nuovo
    if (!token || Date.now() > tokenExpiration) {
        await fetchToken();
    }
    // Imposta l'intestazione di autorizzazione
    options.headers = options.headers || {};
    options.headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, options);
}

module.exports = fetchWithToken;