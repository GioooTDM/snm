import { toggleArtistLike } from './toggleArtistLike.js';

const likeButtons = document.querySelectorAll('.like-btn-artist');

likeButtons.forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        const currentButton = event.currentTarget;
        const artistId = currentButton.getAttribute('data-artist-id');

        // Identifica l'azione in base all'immagine del cuore
        const isLiked = currentButton.querySelector('img').src.includes('heart-filled.png');

        toggleArtistLike(currentButton, artistId, isLiked);
    });
});





// TODO: - gestire il caso in cui l'utente non selezioni nessuna playlist
//       - deselezionare le playlist
//       - aggiungere la gestione likedSongs


import { addSongToPlaylists } from './utils/addSongToPlaylist.js';

let currentTrackId = null;

// Ascolta il click sui cuori delle canzoni
const likeButtonSongs = document.querySelectorAll('.like-btn-song');
likeButtonSongs.forEach(button => {
    button.addEventListener('click', function (event) {
        currentTrackId = event.currentTarget.getAttribute('data-track-id');
    })
});

const doneButton = document.querySelector('#donePlaylistBtn');
doneButton.addEventListener('click', function () {
    addSongToPlaylists(currentTrackId);
});