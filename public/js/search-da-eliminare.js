/* Questo file si potrebbe anche eliminare.
   Tutto il suo contenuto è stato spostato nella cartella /search
*/

let likedArtists = [];

// Funzione per ottenere gli artisti a cui l'utente ha messo like
async function getLikedArtists() {
    try {
        const response = await fetch('/api/user/liked-artists');
        likedArtists = await response.json();
    } catch (error) {
        console.error('Failed to fetch liked artists:', error);
    }
}

getLikedArtists();



const searchInput = document.getElementById('searchInput');

let currentSearchType = 'track';  // valore di default

// Mappa ogni tipo al suo corrispondente tabpanel
const typeToTabPanel = {
    track: document.getElementById('song-boxes-container'),
    album: document.getElementById('album-boxes-container'),
    artist: document.getElementById('artist-boxes-container'),
    playlist: document.getElementById('playlist-boxes-container'),
    user: document.getElementById('user-boxes-container')
};

// Definisci le immagini di default per ogni tipo
const defaultImages = {
    track: 'path/to/default/track/image.jpg',   //todo
    artist: 'image/section/userDefault.png',
    album: 'path/to/default/album/image.jpg',   //todo
    playlist: 'image/section/playlistDefault.png',
    user: 'image/section/userDefault.png'  //todo
};

// Salva il contenuto originale di ogni tabpanel
const originalContents = {};
for (let type in typeToTabPanel) {
    originalContents[type] = typeToTabPanel[type].innerHTML;
}

// Aggiungi un event listener a tutti i bottoni della navbar
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function () {
        currentSearchType = this.getAttribute('data-type');
    });
});

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

    fetch(`/api/search/${type}?query=${query}`)
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

function createCard(item) {
    let boxAttributes = { className: 'box' };
    if (currentSearchType === 'playlist') {
        boxAttributes.onclick = `location.href='/playlist/${item._id}'`;
    } else if (currentSearchType === 'user') {
        boxAttributes.onclick = `location.href='/users/${item._id}'`;
    }

    const box = createElement('div', boxAttributes, [
        createBoxImage(item.image),
        createBoxContent(item)
    ]);
    return box;
}

function createBoxImage(url) {
    // Se l'URL non è presente, usa l'immagine di default appropriata
    if (!url) {
        url = defaultImages[currentSearchType];
    }

    const img = createElement('img', { className: 'w-100', src: url, alt: 'img' });

    let imageClass;
    switch (currentSearchType) {
        case 'track':
            imageClass = 'album_image';
            break;
        case 'artist':
            imageClass = 'artist_image';
            break;
        case 'album':
            imageClass = 'album_image';
            break;
        case 'user':
            imageClass = 'album_image';
            break;
        default:
            imageClass = 'album_image';
    }

    return createElement('div', { className: `box__img ${imageClass}` }, [img]);
}


function createBoxContent(item) {
    let title, subtitle;
    switch (currentSearchType) {
        case 'track':
            title = item.name;
            subtitle = item.artists[0].name;
            break;
        case 'album':
            title = item.name;
            subtitle = item.type;
            break;
        case 'artist':
            title = item.name;
            subtitle = "Artist";
            break;
        case 'playlist':
            title = item.title;
            subtitle = "Playlist";
            break;
        case 'user':
            title = item.name + " " + item.surname;
            subtitle = "User";
            break;
        default:
            title = item.name;
            subtitle = "";
    }

    const h4 = createElement('h4', {}, [title]);
    const p = createElement('p', {}, [subtitle]);

    const contentWrapper = createElement('div', {}, [h4, p]);

    // Se il tipo di ricerca corrente è "album" o "user", non crea le icone
    const icons = (currentSearchType !== 'album' && currentSearchType !== 'user') ? createIconsDiv(item.id) : null;

    const content = createElement('div', { className: 'box__content d-flex justify-content-between align-items-center' }, [contentWrapper, icons]);

    return content;
}

function createIconsDiv(itemId) {
    // queste tre righe dovrebbero essere eseguite solo se sto cercando un artista
    const isLiked = likedArtists.includes(itemId);
    const heartIconSrc = isLiked ? 'image/icon/heart-filled.png' : 'image/icon/heart-blank.png';
    const heartIcon = createElement('img', { src: heartIconSrc, alt: 'icon' });

    let heartLinkAttributes = {};

    switch (currentSearchType) {
        case 'track':
            heartLinkAttributes = {
                href: "#!",
                'data-toggle': 'modal',
                'data-target': '#exampleModal',
                className: 'like-btn-song',
                'data-track-id': itemId
            };
            break;
        case 'artist':
            heartLinkAttributes = {
                href: "#!"
            };
            break;
        default:
            heartLinkAttributes = {
                href: "#!",
                'data-toggle': 'modal',
                'data-target': '#exampleModal'
            };
    }

    const heartLink = createElement('a', heartLinkAttributes, [heartIcon]);

    let iconsArray = [heartLink];

    if (currentSearchType === 'track') {
        const threeDotIcon = createElement('img', { src: 'image/icon/threedot.svg', alt: 'icon' });
        const threeDotLink = createElement('a', { href: "#!", className: 'inner__three' }, [threeDotIcon]);

        const button = createElement('button', { className: 'icon__set d-none' }, ['Add to Playlist']);

        iconsArray.push(threeDotLink);
        iconsArray.push(button);
    }

    return createElement('div', { className: 'inner__icons' }, iconsArray);
}


function createElement(tag, attributes, children) {
    const element = document.createElement(tag);
    for (let key in attributes) {
        if (key === 'className') {
            element.className = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    (children || []).forEach(child => {
        if (child === null) return; // Ignora i figli null
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}


/**
 * Crea e restituisce una versione "debounced" della funzione fornita.
 * Una funzione debounced ritarda l'invocazione della funzione originale
 * fino a dopo che sono passati 'delay' millisecondi dall'ultima volta
 * che la funzione debounced è stata invocata.
 * 
 * @param {Function} func - La funzione da debounciare.
 * @param {number} delay - Il numero di millisecondi da aspettare prima dell'invocazione di 'func'.
 * @returns {Function} Una nuova funzione che ritarda l'invocazione di 'func' di 'delay' millisecondi.
 */
function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}




// TODO: - gestire il caso in cui l'utente non selezioni nessuna playlist
//       - deselezionare le playlist
//       - aggiungere la gestione likedSongs


/* Aggiungi canzoni alla playlist */
import { addSongToPlaylists } from './utils/addSongToPlaylist.js';

let currentTrackId = null;

// Seleziona un elemento antenato che esiste già quando la pagina viene caricata
const container = document.getElementById('song-boxes-container');

// Aggiungi un event listener all'elemento antenato
container.addEventListener('click', function (event) {
    // Utilizza l'oggetto event per determinare se il click è avvenuto su un bottone con la classe .like-btn-song
    if (event.target.closest('.like-btn-song')) {
        currentTrackId = event.target.closest('.like-btn-song').getAttribute('data-track-id');
    }
});

const doneButton = document.querySelector('#donePlaylistBtn');
doneButton.addEventListener('click', function () {
    addSongToPlaylists(currentTrackId);
});