import { showNotification } from './showNotification.js';
import { updateYourPlaylists } from './updateYourPlaylists.js';

function addSongToPlaylists(currentTrackId) {
    // Prendi gli ID delle playlist selezionate
    const selectedPlaylists = document.querySelectorAll('.playlist__sel.selected');
    const playlistIds = Array.from(selectedPlaylists).map(playlist => playlist.getAttribute('data-playlist-id'));

    // Esegui una chiamata API per ogni playlist selezionata
    Promise.all(playlistIds.map(playlistId => {

        let url, reqBody;

        if (playlistId === 'likedSongs') {
            url = `/api/user/like/song/${currentTrackId}`;
            reqBody = {};
        } else {
            url = `/api/playlists/${playlistId}/tracks`;
            reqBody = {
                trackId: currentTrackId
            };
        }

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to add track to playlist with ID ${playlistId}`);
            }
            return response.json();
        });

    }))
        .then(() => {
            // Dato che tutte le chiamate hanno restituito un codice di stato 200, possiamo mostrare l'alert di successo
            showNotification('Brano aggiunto alle playlist con successo!', 'success');

            updateYourPlaylists();

            // Rimuovi la classe "selected" dagli elementi selezionati
            selectedPlaylists.forEach(element => {
                element.classList.remove('selected');
            });
        })
        .catch(error => {
            console.error('Si è verificato un errore:', error);
            showNotification('Si è verificato un errore durante l\'aggiunta del brano.', 'error');
        });
}


export { addSongToPlaylists };
