const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const verifyPlaylistOwnership = require('../middlewares/ownershipVerifier');
const playlistController = require('../controllers/playlistController');


// Crea una playlist
router.post('/', isAuthenticated, playlistController.createPlaylist);

// Aggiorna il titolo della playlist
router.put('/:id/title', isAuthenticated, verifyPlaylistOwnership, playlistController.updateTitle);

// Aggiorna la descrizione della playlist
router.put('/:id/description', isAuthenticated, verifyPlaylistOwnership, playlistController.updateDescription);

// Aggiorna i tags della playlist
router.put('/:id/tags', isAuthenticated, verifyPlaylistOwnership, playlistController.updateTags);

// TODO: gestire problemi dovuti all'eliminazione della playlist
// Elimina la playlist
router.delete('/:id', isAuthenticated, verifyPlaylistOwnership, playlistController.deletePlaylist);

// Pubblica una playlist
router.put('/:id/publish', isAuthenticated, verifyPlaylistOwnership, playlistController.publishPlaylist);

// Rimuove la pubblicazione di una playlist
router.put('/:id/unpublish', isAuthenticated, verifyPlaylistOwnership, playlistController.unpublishPlaylist);

// Recupera i dettagli della playlist
router.get('/:id', (req, res) => {
  // TODO: implementare recupero dettagli playlist
});

// Recupera tutte le tracce di una playlist
router.get('/:id/tracks', (req, res) => {
  // TODO: implementare recupero tracce playlist
});

// Aggiunge una nuova traccia a una playlist (è possibile inserire due volte la stessa traccia)
router.post('/:id/tracks', isAuthenticated, verifyPlaylistOwnership, playlistController.addTrack);

// Rimuove una traccia da una playlist (se ci sono più tracks uguali ne rimuove solo una)
router.delete('/:id/tracks/:trackId', isAuthenticated, verifyPlaylistOwnership, playlistController.removeTrack);


module.exports = router;