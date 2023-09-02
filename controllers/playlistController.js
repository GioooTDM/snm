const { client } = require('../database/connection');
const { ObjectId } = require('mongodb');
const { verifyTrackId } = require('../services/spotifyService');


exports.createPlaylist = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Controlla se il titolo è presente
        if (!title) {
            return res.status(400).json({ message: "Per favore, fornisci un titolo per la playlist." });
        }

        // Crea un nuovo oggetto playlist
        const newPlaylist = {
            title,
            description: description || "",  // Descrizione opzionale
            songs: [],  // Inizializza con un array vuoto di canzoni
            createdBy: new ObjectId(req.userId),  // Assumendo che 'req.userId' contenga l'ID dell'utente autenticato
            createdAt: new Date(),
            isPublished: false,
            tags: []
        };

        // Inserisci la nuova playlist nel database
        const result = await client.db("test").collection("playlists").insertOne(newPlaylist);

        // Restituisci una risposta al client
        if (result.insertedId) {
            res.json({ message: "Playlist creata con successo!", playlistId: result.insertedId });
        } else {
            throw new Error("Errore durante la creazione della playlist");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore interno del server" });
    }
};

exports.updateTitle = async (req, res) => {
    try {
        // Assicuriamoci che l'ID fornito sia valido
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("ID della playlist non valido.");
        }

        // Validazione manuale del titolo
        const title = req.body.title;
        if (!title || typeof title !== 'string' || title.length < 3 || title.length > 128) {
            return res.status(400).send("Il titolo deve essere una stringa tra 3 e 128 caratteri.");
        }

        const collection = await client.db("test").collection("playlists");

        // Aggiorna solo il titolo della playlist basandosi sull'ID fornito
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { title: title } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send("Playlist non trovata.");
        }

        res.status(200).send("Titolo della playlist aggiornato con successo!");

    } catch (error) {
        console.error("Errore nell'aggiornamento del titolo della playlist:", error);
        res.status(500).send("Si è verificato un errore durante l'aggiornamento del titolo della playlist.");
    }
};

exports.updateDescription = async (req, res) => {
    try {
        // Assicuriamoci che l'ID fornito sia valido
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("ID della playlist non valido.");
        }

        // Validazione manuale della descrizione
        const description = req.body.description;
        if (typeof description !== 'string' || description.length > 1024) {
            return res.status(400).send("La descrizione deve essere una stringa con un massimo di 1024 caratteri.");
        }

        const collection = await client.db("test").collection("playlists");

        // Aggiorna solo la descrizione della playlist basandosi sull'ID fornito
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { description: description } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send("Playlist non trovata.");
        }

        res.status(200).send("Descrizione della playlist aggiornata con successo!");

    } catch (error) {
        console.error("Errore nell'aggiornamento della descrizione della playlist:", error);
        res.status(500).send("Si è verificato un errore durante l'aggiornamento della descrizione della playlist.");
    }
};

exports.updateTags = async (req, res) => {
    try {
        // Assicuriamoci che l'ID fornito sia valido
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("ID della playlist non valido.");
        }

        // // Validazione manuale dei tags
        // const tags = req.body.tags;
        // if (typeof tags !== 'string' || !tags.split(" ").every(tag => tag.startsWith("#"))) {
        //   return res.status(400).send("I tags devono essere separati da uno spazio e ogni tag deve iniziare con il simbolo '#'.");
        // }

        // Validazione manuale dei tags
        const tags = req.body.tags;
        if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string' && tag.startsWith("#"))) {
            return res.status(400).send("I tags devono essere un array di stringhe, e ogni tag deve iniziare con il simbolo '#'.");
        }

        const collection = await client.db("test").collection("playlists");

        // Aggiorna solo i tags della playlist basandosi sull'ID fornito
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { tags: tags } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send("Playlist non trovata.");
        }

        res.status(200).send("Tags della playlist aggiornati con successo!");

    } catch (error) {
        console.error("Errore nell'aggiornamento dei tags della playlist:", error);
        res.status(500).send("Si è verificato un errore durante l'aggiornamento dei tags della playlist.");
    }
};

exports.deletePlaylist = async (req, res) => {
    try {
        // Assicuriamoci che l'ID fornito sia valido
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("ID della playlist non valido.");
        }

        const collection = client.db("test").collection("playlists");

        // Cancella la playlist basandosi sull'ID fornito
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).send("Playlist non trovata.");
        }

        res.status(200).send("Playlist eliminata con successo!");

    } catch (error) {
        console.error("Errore nell'eliminazione della playlist:", error);
        res.status(500).send("Si è verificato un errore durante l'eliminazione della playlist.");
    }
};

exports.publishPlaylist = async (req, res) => {
    try {
        const collection = await client.db("test").collection("playlists");

        // Imposta il campo isPublished a true
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { isPublished: true } }
        );

        if (updateResult.matchedCount === 0) {
            return res.status(404).send("Playlist non trovata.");
        }

        res.status(200).send("Playlist pubblicata con successo!");

    } catch (error) {
        console.error("Errore nella pubblicazione della playlist:", error);
        res.status(500).send("Si è verificato un errore durante la pubblicazione della playlist.");
    }
};

exports.unpublishPlaylist = async (req, res) => {
    try {
        const collection = await client.db("test").collection("playlists");
    
        // Imposta il campo isPublished a false
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { isPublished: false } }
        );
    
        if (updateResult.matchedCount === 0) {
          return res.status(404).send("Playlist non trovata.");
        }
    
        res.status(200).send("Playlist rimossa dalla pubblicazione con successo!");
    
      } catch (error) {
        console.error("Errore nella rimozione della pubblicazione della playlist:", error);
        res.status(500).send("Si è verificato un errore durante la rimozione della pubblicazione della playlist.");
      }
};

exports.addTrack = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: "ID della playlist non valido." });
        }
    
        const { trackId } = req.body;
    
        if (!trackId) {
          return res.status(400).json({ message: "ID della traccia mancante." });
        }
    
        // Verifica la validità dell'ID della traccia usando le API di Spotify
        const isValid = await verifyTrackId(trackId);
    
        if (!isValid) {
          return res.status(400).json({ message: "ID della traccia non valido o traccia non trovata su Spotify." });
        }
    
        const collection = await client.db("test").collection("playlists");
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $push: { songs: trackId } }
        );
    
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ message: "Playlist non trovata." });
        }
    
        res.status(200).json({ message: "Traccia aggiunta con successo alla playlist!" });
    
      } catch (error) {
        console.error("Errore nell'aggiunta dell'ID della traccia alla playlist:", error);
        res.status(500).json({ message: "Si è verificato un errore durante l'aggiunta dell'ID della traccia alla playlist." });
      }
};

exports.removeTrack = async (req, res) => {
    try {
        // Verifica che l'ID della playlist sia valido
        if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).send("ID della playlist non valido.");
        }
    
        // Verifica che l'ID della traccia sia presente
        if (!req.params.trackId) {
          return res.status(400).send("ID della traccia mancante.");
        }
    
        const collection = await client.db("test").collection("playlists");
    
        const playlist = await collection.findOne({ _id: new ObjectId(req.params.id) });
    
        if (!playlist) {
          return res.status(404).send("Playlist non trovata.");
        }
    
        // Trova l'indice della prima canzone con l'ID specificato
        const trackIndex = playlist.songs.indexOf(req.params.trackId);
    
        // Se la canzone è stata trovata, rimuovila
        if (trackIndex !== -1) {
          // Copia l'array delle canzoni e rimuovi la canzone all'indice trovato
          const newSongsArray = [...playlist.songs];
          newSongsArray.splice(trackIndex, 1);
    
          // Aggiorna la playlist con il nuovo array di canzoni
          await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { songs: newSongsArray } }
          );
    
          res.status(200).send("Traccia rimossa con successo dalla playlist!");
        } else {
          return res.status(404).send("Traccia non trovata nella playlist.");
        }
      } catch (error) {
        console.error("Errore nella rimozione dell'ID della traccia dalla playlist:", error);
        res.status(500).send("Si è verificato un errore durante la rimozione dell'ID della traccia dalla playlist.");
      }
};
