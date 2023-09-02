export let currentSearchType = 'track';  // valore di default

// Aggiungi un event listener a tutti i bottoni della navbar
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function () {
        currentSearchType = this.getAttribute('data-type');
    });
});




export let likedArtists = [];

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