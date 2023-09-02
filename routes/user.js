const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

const multer = require('multer');

const userController = require('../controllers/userController');

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite massimo di 10MB
  }
});

// Recupera name, surname e email
router.get('/me', isAuthenticated, userController.getMe);

router.get('/liked-songs-count', isAuthenticated, userController.getLikedSongsCount);

router.get('/playlists', isAuthenticated, userController.getPlaylists);

router.post('/upload-image', isAuthenticated, upload.single('image'), userController.uploadImage);

// Endpoint per aggiornare le informazioni dell'utente
// TODO: validazioni dati in utente (controllare che la mail sia verametne una mail, che il nome non sia vuoto, ecc ecc)
router.put('/update', isAuthenticated, userController.updateUser);

router.put('/change-password', isAuthenticated, userController.changePassword);

router.post('/genres', isAuthenticated, userController.updateGenres);

//Endpoint per eliminare l'account dell'utente
// TODO: gestire le conseguenze dell'eliminazione di un utente. Probabilmente è meglio fare una cancellazione logica.
router.delete('/delete', isAuthenticated, userController.deleteUser);

/*
  Like / Unlike
*/

router.get('/liked-artists', isAuthenticated, userController.getLikedArtists);


// TODO: se arriva una richiesta con un :id di un artista null viene inserito nel db comunque. Questo crea problemi.
router.post('/like/song/:id', isAuthenticated, userController.likesHandler('song', 'like'));
router.post('/like/album/:id', isAuthenticated, userController.likesHandler('album', 'like'));
router.post('/like/artist/:id', isAuthenticated, userController.likesHandler('artist', 'like'));
router.post('/like/playlist/:id', isAuthenticated, userController.likesHandler('playlist', 'like'));

router.delete('/like/song/:id', isAuthenticated, userController.likesHandler('song', 'unlike'));
router.delete('/like/album/:id', isAuthenticated, userController.likesHandler('album', 'unlike'));
router.delete('/like/artist/:id', isAuthenticated, userController.likesHandler('artist', 'unlike'));
router.delete('/like/playlist/:id', isAuthenticated, userController.likesHandler('playlist', 'unlike'));


module.exports = router;