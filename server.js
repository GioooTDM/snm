const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./database/connection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const playlistRoutes = require('./routes/playlists');
const searchRoutes = require('./routes/search');
const pagesRoutes = require('./routes/pages');
const spotifyHomeService = require('./services/spotifyHomeService');

const app = express();

connectToDatabase();

// Configurazione di EJS
app.set('view engine', 'ejs');

// Utilizza il middleware di Express
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);

app.use('/', pagesRoutes);

// TEST
app.get('/toptracks', async (req, res) => {
    const topTracks = await spotifyHomeService.getGlobalTopTracks();
    res.send(topTracks);
});

app.get('/topartists', async (req, res) => {
    const topTracks = await spotifyHomeService.getGlobalTopArtists();
    res.send(topTracks);
});

app.get('/newrelases', async (req, res) => {
    const newRelases = await spotifyHomeService.getNewReleases();
    res.send(newRelases);
});


// Avvia l'app
app.listen(3000, () => {
    console.log("App in ascolto sulla porta 3000");
});