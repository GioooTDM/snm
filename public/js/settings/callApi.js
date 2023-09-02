/**
 * Esegue una richiesta verso un endpoint specificato.
 *
 * @param {string} endpoint - L'URL dell'endpoint al quale effettuare la richiesta.
 * @param {object|null} data - Il corpo della richiesta da inviare. Se null, non viene inviato alcun corpo.
 * @param {string} method - Il metodo HTTP da utilizzare (es. 'GET', 'PUT'). Default è 'PUT'.
 * @returns {Promise<object>} - Una promessa che risolve nel corpo della risposta in formato JSON.
 * @throws {Error} - Lancia un'eccezione se la risposta non è OK, includendo il messaggio di errore dal server.
 */
export async function callApi(endpoint, data, method = 'PUT') {
    const requestOptions = {
        method: method
    };

    // Aggiungi il corpo solo se il metodo non è GET e i dati sono forniti
    if (method !== 'GET' && data) {
        requestOptions.headers = {
            'Content-Type': 'application/json'
        };
        requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, requestOptions);
    const responseData = await response.json();

    if (!response.ok) {
        const errorMsg = responseData.message || 'Errore sconosciuto';
        throw new Error(errorMsg);
    }

    return responseData;
}