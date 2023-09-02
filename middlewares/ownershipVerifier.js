const { ObjectId } = require('mongodb');
const { client } = require('../database/connection');

module.exports = async (req, res, next) => {
  const collection = await client.db("test").collection("playlists");

  // Recupera la playlist basandosi sull'ID fornito per verificare il proprietario
  const playlist = await collection.findOne({ _id: new ObjectId(req.params.id) });
  if (!playlist) {
    return res.status(404).send("Playlist non trovata.");
  }

  // Supponendo che `req.userId` sia impostato da `isAuthenticated` e contenga l'ID dell'utente autenticato
  if (playlist.createdBy.toString() !== req.userId.toString()) {
    return res.status(403).send("Non hai il permesso di modificare questa playlist.");
  }

  // Passa il controllo al prossimo middleware/route handler se tutto va bene
  next();
};
