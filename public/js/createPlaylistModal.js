import { showNotification } from './utils/showNotification.js';
import { updateYourPlaylists } from './utils/updateYourPlaylists.js';

// Aggiungi un listener al pulsante "Create" all'interno del modal
document.querySelector('#createPlaylistBtn').addEventListener('click', async () => {
    // Ottieni il nome della playlist dall'input
    const playlistName = document.querySelector('#playlistNameInput').value;
    const playlistDescription = document.querySelector('#playlistDescriptionInput').value;

    // Controlla se il nome della playlist è vuoto
    if (!playlistName.trim()) {
        showNotification('Please enter a playlist name.', 'error');
        return;
    }

    // Crea l'oggetto da inviare all'API
    const data = {
        title: playlistName,
        description: playlistDescription
    };

    try {
        const response = await fetch('/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Controlla se la richiesta ha avuto successo
        if (response.ok) {
            const result = await response.json();

            showNotification('Playlist created successfully!', 'success');
            updateYourPlaylists();
        } else {
            // Gestisci l'errore
            const error = await response.json();
            alert('Failed to create playlist: ' + error.message);
        }
    } catch (err) {
        // Gestisci errori di rete
        alert('An error occurred while creating the playlist: ' + err.message);
    }
});