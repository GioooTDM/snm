import { currentSearchType, likedArtists } from './globalVariables.js';
import { typeToTabPanel, originalContents } from './constantVariables.js';
import { createCard } from './domManipulation.js';
import { debounce } from './utils.js';
import { toggleArtistLike } from '../toggleArtistLike.js';


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', debounce(handleSearch, 350));

function handleSearch() {
    const query = searchInput.value;
    const type = currentSearchType;

    console.log(type + " - " + query);

    // Se la barra di ricerca è vuota, ripristina il contenuto originale
    if (!query) {
        for (let type in typeToTabPanel) {
            typeToTabPanel[type].innerHTML = originalContents[type];
        }
        return;  // Esce dalla funzione
    }

    // Codifica la query per utilizzarla nell'URL
    const encodedQuery = encodeURIComponent(query);

    fetch(`/api/search/${type}?query=${encodedQuery}`)
        .then(res => res.json())
        .then(data => {
            const currentTabPanel = typeToTabPanel[type];
            currentTabPanel.innerHTML = '';  // Pulisci i risultati precedenti
            data.forEach(item => {
                const card = createCard(item);
                currentTabPanel.appendChild(card);
            });
        });
}



// TODO: - gestire il caso in cui l'utente non selezioni nessuna playlist
//       - deselezionare le playlist
//       - aggiungere la gestione likedSongs


/* Aggiungi canzoni alla playlist */
import { addSongToPlaylists } from '../utils/addSongToPlaylist.js';

let currentTrackId = null;

// Seleziona un elemento antenato che esiste già quando la pagina viene caricata
const songsContainer = document.getElementById('song-boxes-container');

// Aggiungi un event listener all'elemento antenato
songsContainer.addEventListener('click', function (event) {
    // Utilizza l'oggetto event per determinare se il click è avvenuto su un bottone con la classe .like-btn-song
    if (event.target.closest('.like-btn-song')) {
        currentTrackId = event.target.closest('.like-btn-song').getAttribute('data-track-id');
    }
});

const doneButton = document.querySelector('#donePlaylistBtn');
doneButton.addEventListener('click', function () {
    addSongToPlaylists(currentTrackId);
});




/* Like / Unlike Artists */

// Seleziona un elemento antenato che esiste già quando la pagina viene caricata
const artistsContainer = document.getElementById('artist-boxes-container');

// Aggiungi un event listener all'elemento antenato
artistsContainer.addEventListener('click', function (event) {
    // Utilizza l'oggetto event per determinare se il click è avvenuto su un bottone con la classe .like-btn-song
    if (event.target.closest('.like-btn-artist')) {
        const currentButton = event.target.closest('.like-btn-artist');
        const artistId = currentButton.getAttribute('data-artist-id');

        // Identifica l'azione in base all'immagine del cuore
        const isLiked = currentButton.querySelector('img').src.includes('heart-filled.png');

        toggleArtistLike(currentButton, artistId, isLiked, likedArtists);
    }
});