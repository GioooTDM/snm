import { genresChekboxes } from './domElements.js';

let debounceTimer;

function updateGenres() {
    const selectedGenres = [];

    genresChekboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const genre = checkbox.parentElement.querySelector('.labeltxt').innerText;
            selectedGenres.push(genre);
        }
    });

    fetch('/api/user/genres', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genres: selectedGenres }),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

export function updateGenresDebounced() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateGenres, 500);
}