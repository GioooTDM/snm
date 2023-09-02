// Mappa ogni tipo al suo corrispondente tabpanel
export const typeToTabPanel = {
    track: document.getElementById('song-boxes-container'),
    album: document.getElementById('album-boxes-container'),
    artist: document.getElementById('artist-boxes-container'),
    playlist: document.getElementById('playlist-boxes-container'),
    user: document.getElementById('user-boxes-container')
};

// Definisci le immagini di default per ogni tipo
export const defaultImages = {
    track: 'path/to/default/track/image.jpg',   //todo
    artist: 'image/section/userDefault.png',
    album: 'path/to/default/album/image.jpg',   //todo
    playlist: 'image/section/playlistDefault.png',
    user: 'image/section/userDefault.png'  //todo
};


// Salva il contenuto originale di ogni tabpanel
export const originalContents = {};
for (let type in typeToTabPanel) {
    originalContents[type] = typeToTabPanel[type].innerHTML;
}

