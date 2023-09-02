import { showNotification } from './utils/showNotification.js';
import { updateYourPlaylists } from './utils/updateYourPlaylists.js';

// Seleziona tutti gli elementi con la classe "delete-icon"
const removeIcons = document.querySelectorAll('.remove-icon');

removeIcons.forEach(icon => {
    icon.addEventListener('click', function (event) {
        event.preventDefault();

        const trackId = this.getAttribute('data-track-id');

        const url = `/api/playlists/${playlistId}/tracks/${trackId}`;

        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    // Trova l'elemento contenitore più vicino con la classe "box"
                    const boxElement = event.target.closest('.box');

                    // Rimuovi l'elemento contenitore dalla UI
                    if (boxElement) {
                        boxElement.remove();
                    }

                    showNotification("Traccia rimossa con successo!", 'neutral');

                    updateYourPlaylists();
                } else {
                    console.error('Errore nella rimozione della traccia:', response.statusText);
                }
            })
            .catch(error => {
                // Gestisci eventuali errori di rete qui
                console.error('Errore:', error);
            });
    });
});



