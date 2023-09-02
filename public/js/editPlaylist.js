import { showNotification } from './utils/showNotification.js';
import { updateYourPlaylists } from './utils/updateYourPlaylists.js';



// Show Editor: Playlist Title

const playlistTitle = document.querySelector('.playlistTitle')
const playlistTitlePencil = document.querySelector('.inputH1Edit')
const playlistTitleEditor = document.querySelector('.inputH1Editor')

playlistTitlePencil.addEventListener("click", () => {
    playlistTitleEditor.classList.remove('d-none')
    playlistTitle.classList.add('d-none')
    playlistTitleEditor.classList.add("d-block")
})



// Show Editor: Playlist Description

const playlistDescription = document.querySelector('.playlistDescription')
const descriptionPencil = document.querySelector('.descriptionPencil')
const descriptionEditor = document.querySelector('.descriptionEditor')

descriptionPencil.addEventListener('click', () => {
    descriptionEditor.classList.remove("d-none")
    playlistDescription.classList.add("d-none")
    descriptionEditor.classList.add("d-block")
})




// Show Editor: Playlist Tags

const tagsPencil = document.querySelector('.tagsPencil')
const tagsEditor = document.querySelector('.tagsEditor')
const playlistTags = document.querySelector('.playlistTags')
tagsPencil.addEventListener('click', () => {
    tagsEditor.classList.remove("d-none")
    playlistTags.classList.add("d-none")
    tagsEditor.classList.add("d-block")
})



// Playlist Status: show Button (Public or Private)

const playlistStatus = document.querySelector('.playlist_status')
const playlistStatusBtn = document.querySelector('.playlist_status_btn')

playlistStatus.addEventListener('click', () => {
    playlistStatusBtn.classList.toggle('d-none')
})



// Tree Dots & Delete

const threeDot = document.querySelector('.three__dot')
const deleteBtn = document.querySelector('.delete__play')

threeDot.addEventListener('click', () => {
    deleteBtn.classList.toggle('show__dlt')
})



// Close elements

window.addEventListener('click', (event) => {
    // Playlist Title
    if (!playlistTitlePencil.contains(event.target) && !playlistTitleEditor.contains(event.target)) {
        playlistTitleEditor.classList.remove('d-block')
        playlistTitleEditor.classList.add('d-none')
        playlistTitle.classList.remove('d-none')
    }

    // Playlist Description
    if (!descriptionPencil.contains(event.target) && !descriptionEditor.contains(event.target)) {
        playlistDescription.classList.remove('d-none')
        descriptionEditor.classList.remove('d-block')
        descriptionEditor.classList.add('d-none')
    }

    // Playlist Tags
    if (!tagsPencil.contains(event.target) && !tagsEditor.contains(event.target)) {
        tagsEditor.classList.add('d-none')
        playlistTags.classList.remove('d-none')
    }

    // Playlist Status
    if (!playlistStatus.contains(event.target)) {
        playlistStatusBtn.classList.add('d-none')
    }

    // Three Dots & Delete
    if (!threeDot.contains(event.target)) {
        deleteBtn.classList.remove('show__dlt')
    }
});



// API call to edit title

playlistTitleEditor.addEventListener('blur', () => {
    const newTitle = playlistTitleEditor.value;

    // playlistId viene preso da playlist.ejs
    fetch(`/api/playlists/${playlistId}/title`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
    })
        .then(response => {
            if (response.status === 200) {
                // Trova il nodo di testo all'interno dell'elemento <h1> e aggiorna il suo valore
                playlistTitle.childNodes[0].nodeValue = newTitle + " ";
                showNotification("Titolo della playlist aggiornato con successo!", 'success');

                updateYourPlaylists();
            } else {
                showNotification("Si è verificato un errore durante l'aggiornamento del titolo della playlist.", 'error');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});



// API call to edit description

descriptionEditor.addEventListener('blur', () => {
    const newDescription = descriptionEditor.value.trim();

    fetch(`/api/playlists/${playlistId}/description`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newDescription })
    })
        .then(response => {
            if (response.status === 200) {
                // Se la nuova descrizione è vuota, mostra "No Description", altrimenti mostra la descrizione inserita
                const descriptionText = newDescription === '' ? 'No Description' : newDescription;

                // Trova il nodo di testo all'interno dell'elemento <a> e aggiorna il suo valore
                playlistDescription.childNodes[0].nodeValue = descriptionText;
                showNotification("Descrizione della playlist aggiornata con successo!", 'success');
            } else {
                showNotification("Si è verificato un errore durante l'aggiornamento della descrizione della playlist.", 'error');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});



// API call to edit tags

tagsEditor.addEventListener('blur', () => {
    const newTagsString = tagsEditor.value;
    const newTagsArray = newTagsString.split(' ').filter(tag => tag.length > 0);;

    // Verifica che ogni tag inizi con '#' e abbia almeno tre lettere
    if (newTagsArray.length !== 0) {
        for (const tag of newTagsArray) {
            if (!tag.startsWith('#') || tag.length < 4) {
                alert("Ogni tag deve iniziare con il simbolo '#', avere almeno tre lettere ed essere separato da uno spazio.");
                return;
            }
        }
    }


    fetch(`/api/playlists/${playlistId}/tags`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tags: newTagsArray })
    })
        .then(response => {
            if (response.status === 200) {
                // Rimuovi tutti i figli tranne l'ultimo (la matita)
                while (playlistTags.children.length > 1) {
                    playlistTags.removeChild(playlistTags.firstChild);
                }

                if (newTagsArray.length === 0) {
                    // Inserisci il messaggio "Nessun Tag" se non ci sono tag
                    playlistTags.insertAdjacentHTML('afterbegin', `<a href="#!">Nessun Tag</a>`);
                } else {
                    // Aggiungi i nuovi tag prima dell'elemento della matita
                    const newTagsHtml = newTagsArray.map(tag => `<a href="#!">${tag}</a>`).join(' ');
                    playlistTags.insertAdjacentHTML('afterbegin', newTagsHtml);
                }

                showNotification("Tags aggiornati con successo!", 'success');
            } else {
                showNotification("Si è verificato un errore durante l'aggiornamento dei tags della playlist.", 'error');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});



// API call to publish / unpublish

playlistStatusBtn.addEventListener('click', () => {
    const isCurrentlyPublished = playlistStatus.textContent.includes('Public');
    const endpoint = isCurrentlyPublished
        ? `/api/playlists/${playlistId}/unpublish`
        : `/api/playlists/${playlistId}/publish`;

    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 200) {
                // Aggiorna il testo del link per riflettere il nuovo stato
                playlistStatus.childNodes[0].nodeValue = isCurrentlyPublished ? 'Private Playlist' : 'Public Playlist';
                // Aggiorna il testo del pulsante
                playlistStatusBtn.textContent = `Switch To ${isCurrentlyPublished ? 'Public' : 'Private'}`;
                showNotification("Stato della playlist aggiornato con successo!", 'success');
            } else {
                showNotification("Si è verificato un errore durante l'aggiornamento dello stato della playlist.", 'error');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});



// API call to delete

deleteBtn.addEventListener('click', () => {
    // Chiedi conferma all'utente prima di procedere con l'eliminazione
    if (!confirm('Sei sicuro di voler eliminare questa playlist? Questa azione non può essere annullata.')) {
        return; // Esci dalla funzione se l'utente annulla
    }

    // Effettua la richiesta DELETE all'endpoint appropriato
    fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.status === 200) {
                showNotification("Playlist eliminata con successo!", 'error');
                // Utilizza setTimeout per ritardare il reindirizzamento di 2 secondi
                setTimeout(() => {
                    window.location.href = '/home';
                }, 2000);
            } else {
                throw new Error('Si è verificato un errore durante l\'eliminazione della playlist.');
            }
        })
        .catch(error => console.error('Si è verificato un errore:', error));
});
