async function fetchLikedSongsCount() {
    const response = await fetch('/api/user/liked-songs-count');
    if (response.ok) {
        const data = await response.json();
        return data.count;
    } else {
        console.error('Failed to fetch liked songs count');
    }
}


async function fetchUserPlaylists() {
    const response = await fetch('/api/user/playlists');
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Failed to fetch playlists');
    }
}


export async function updateYourPlaylists() {
    const likedSongsCount = await fetchLikedSongsCount(); 
    const playlists = await fetchUserPlaylists();

        // Aggiorna il conteggio delle "Liked Songs"
        let likedSongsElement = document.querySelector('#yourPlaylists .playlist:first-child p');
        likedSongsElement.textContent = `${likedSongsCount} Songs`;
    
        let playlistContainer = document.querySelector('#yourPlaylists');
    
        // Rimuovi le vecchie playlist
        let oldPlaylists = document.querySelectorAll('#yourPlaylists .playlist:not(:first-child):not(:last-child)');
        oldPlaylists.forEach(el => el.remove());
    
        // Crea e aggiungi nuove playlist
        let newPlaylistsFragment = document.createDocumentFragment();
        for (const playlist of playlists) {
            let newPlaylist = document.createElement('div');
            newPlaylist.className = 'playlist';
            newPlaylist.innerHTML = `
                <a href="/playlist/${playlist._id}">
                    <div class="play__box">
                        <img class="w-100" src="/image/section/playlist1.png" alt="icon">
                    </div>
                    <div class="paly__content">
                        <h5>${playlist.title}</h5>
                        <p>${playlist.songs.length} Songs</p>
                    </div>
                </a>
            `;
            newPlaylistsFragment.appendChild(newPlaylist);
        }
    
        // Inserisci le nuove playlist prima dell'elemento "Create Playlist"
        let createPlaylistElement = document.querySelector('#yourPlaylists .playlist:last-child');
        playlistContainer.insertBefore(newPlaylistsFragment, createPlaylistElement);
    
}
