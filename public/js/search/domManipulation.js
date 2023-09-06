import { currentSearchType, likedArtists } from './globalVariables.js';
import { defaultImages } from './constantVariables.js';

export function createCard(item) {
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
    } else if (currentSearchType === 'user') {
        url = "data:image/jpeg;base64," + url.toString("base64");
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
            subtitle = capitalize(item.type);
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
    const icons = (currentSearchType !== 'album' && currentSearchType !== 'playlist' && currentSearchType !== 'user') ? createIconsDiv(item.id) : null;

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
                href: "#!",
                className: 'like-btn-artist',
                'data-artist-id': itemId
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

    // NON CANCELLARE - Crea l'icona con i tre puntini se sto cercando una track
    // if (currentSearchType === 'track') {
    //     const threeDotIcon = createElement('img', { src: 'image/icon/threedot.svg', alt: 'icon' });
    //     const threeDotLink = createElement('a', { href: "#!", className: 'inner__three' }, [threeDotIcon]);

    //     const button = createElement('button', { className: 'icon__set d-none' }, ['Add to Playlist']);

    //     iconsArray.push(threeDotLink);
    //     iconsArray.push(button);
    // }

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

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}