import { showNotification } from './utils/showNotification.js';

// Tree Dots & Like / Unlike

const threeDot = document.querySelector('.three__dot')
const likeUnlikeBtn = document.querySelector('.likeUnlike__play')

threeDot.addEventListener('click', () => {
    likeUnlikeBtn.classList.toggle('show__dlt')
})



// Close elements

window.addEventListener('click', (event) => {

    // Like / Unlike
    if (!threeDot.contains(event.target)) {
        likeUnlikeBtn.classList.remove('show__dlt')
    }
});



// API call to like / unlike

let isLiked = likeUnlikeBtn.textContent.trim() === 'Unlike Playlist';

likeUnlikeBtn.addEventListener('click', () => {
    // Determina il metodo in base allo stato corrente del "mi piace"
    const method = isLiked ? 'DELETE' : 'POST';

    fetch(`/api/user/like/playlist/${playlistId}`, {
        method: method,
    })
        .then(response => {
            if (response.status === 200) {
                // Aggiorna lo stato del "mi piace"
                isLiked = !isLiked;

                // Aggiorna il testo del pulsante
                likeUnlikeBtn.textContent = isLiked ? 'Unlike Playlist' : 'Like Playlist';

                showNotification(isLiked ? "Playlist aggiunta ai preferiti!" : "Playlist rimossa dai preferiti!", "neutral");
            } else {
                throw new Error('Si è verificato un errore durante l\'aggiornamento del "mi piace" della playlist.');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});
