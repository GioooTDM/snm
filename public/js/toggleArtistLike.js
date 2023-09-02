// Funzione per eseguire la chiamata "like/unlike"
export function toggleArtistLike(currentButton, artistId, isLiked, arrayToUpdate = null) {
    const url = `/api/user/like/artist/${artistId}`;
    const method = isLiked ? 'DELETE' : 'POST';
    
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Aggiorna l'immagine del cuore in base all'azione
            if (isLiked) {
                currentButton.querySelector('img').src = 'image/icon/heart-blank.png';
            } else {
                currentButton.querySelector('img').src = 'image/icon/heart-filled.png';
            }


            // Se è fornito un array, modificalo
            if (arrayToUpdate !== null) {
                if (isLiked) {
                    const index = arrayToUpdate.indexOf(artistId);
                    if (index > -1) {
                        arrayToUpdate.splice(index, 1);
                    }
                } else {
                    arrayToUpdate.push(artistId);
                }
            }
        } else {
            // Gestisci errori
            console.error('Errore nel cambiare lo stato del like per l\'artista.');
        }
    })
    .catch(error => {
        console.error('Si è verificato un errore:', error);
    });
}
