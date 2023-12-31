exports.filterArtistFields = (item) => {
    return {
        name: item.name,
        id: item.id,
        genres: item.genres,
        popularity: item.popularity,
        image: item.images[0] ? item.images[0].url : null // prendi la prima immagine, se disponibile
    };
}

exports.filterAlbumFields = (item) => {
    return {
        name: item.name,
        id: item.id,
        release_date: item.release_date,
        total_tracks: item.total_tracks,
        type: item.album_type, // aggiungiamo anche il tipo dell'album
        image: item.images[0].url,
        artists: item.artists.map(artist => ({ name: artist.name, id: artist.id }))
    };
}

exports.filterTrackFields = (item) => {
    return {
        name: item.name,
        id: item.id,
        duration_ms: item.duration_ms,
        explicit: item.explicit,
        artists: item.artists.map(artist => ({ name: artist.name, id: artist.id })),
        album: { name: item.album.name, id: item.album.id },
        image: item.album.images[0].url
    };
}
