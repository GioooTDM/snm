const { client } = require('../database/connection');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const playlistService = require('../services/playlistService');
const sharp = require('sharp');


exports.getMe = async (req, res) => {
    try {
        const user = await client.db('test').collection('users').findOne({ _id: new ObjectId(req.userId) });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato.' });
        }

        const { name, surname, email } = user;
        return res.json({ name, surname, email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

exports.getLikedSongsCount = async (req, res) => {
    try {
        const user = await client.db('test').collection('users').findOne({ _id: new ObjectId(req.userId) });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato.' });
        }

        const { likedSongs } = user;
        return res.json({ count: likedSongs.length });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await playlistService.getPlaylistsByUserId(req.userId);
        return res.json(playlists);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        let quality = 80;
        let buffer = null;

        // Riduci la qualità dell'immagine finché non raggiungi la dimensione target di 1MB o meno
        do {
            buffer = await sharp(req.file.buffer)
                .resize({
                    width: 512,
                    height: 512,
                    fit: 'inside', // Mantenere lo stesso aspect ratio
                })
                .jpeg({ quality: quality })
                .toBuffer();

            quality -= 10;

        } while (buffer.length > 2 * 1024 * 1024 && quality > 30);

        // Se la dimensione è ancora maggiore di 1MB dopo aver ridotto la qualità al minimo, restituisci un errore
        if (buffer.length > 1 * 1024 * 1024) {
            return res.status(400).json({ message: 'La dimensione dell\'immagine supera il limite di 2 MB anche dopo la compressione' });
        }

        const usersCollection = client.db("test").collection("users");

        await usersCollection.updateOne({ _id: new ObjectId(req.userId) }, {
            $set: { image: buffer },
        });

        // Converte il buffer in una stringa base64
        const base64Image = Buffer.from(buffer).toString('base64');

        res.status(200).json({ image: base64Image });

    } catch (err) {
        console.error("Errore durante il caricamento dell'immagine:", err);
        res.status(500).json({ message: "Errore durante il caricamento dell'immagine" });
    }
};

exports.updateUser = async (req, res) => {
    // Qui estraggo solo i valori che sono effettivamente forniti nel body
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.surname) updates.surname = req.body.surname;
    if (req.body.email) updates.email = req.body.email;

    // Se nessun campo valido è fornito, ritorna un errore
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Nessun campo valido fornito.' });
    }

    try {
        // Verifica dell'unicità dell'email
        if (updates.email) {
            const emailExists = await client.db('test').collection('users').findOne({ email: updates.email });
            if (emailExists && String(emailExists._id) !== req.userId) {
                return res.status(400).json({ message: 'L\'email è già associata a un altro utente.' });
            }
        }

        const result = await client.db('test').collection('users').updateOne(
            { _id: new ObjectId(req.userId) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            throw new Error('User not found');
        }

        res.json({ message: 'Informazioni aggiornate con successo.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nell\'aggiornamento delle informazioni dell\'utente.' });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Controlla se newPassword e confirmPassword coincidono
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Le nuove password non coincidono.' });
    }

    try {
        const user = await client.db('test').collection('users').findOne({ _id: new ObjectId(req.userId) });

        // Controlla se la vecchia password è corretta
        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(400).json({ message: 'Vecchia password non corretta.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await client.db('test').collection('users').updateOne({ _id: new ObjectId(req.userId) }, { $set: { password: hashedPassword } });

        res.json({ message: 'Password aggiornata con successo.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel cambiamento della password.' });
    }
};


exports.updateGenres = async (req, res) => {
    const { genres } = req.body;

    // Validate genres array
    if (!Array.isArray(genres)) {
        return res.status(400).json({ message: 'Genres should be an array.' });
    }

    try {
        const result = await client.db('test').collection('users').updateOne(
            { _id: new ObjectId(req.userId) },
            { $set: { genres: genres } }
        );

        if (result.matchedCount === 0) {
            throw new Error('User not found');
        }

        res.json({ message: 'Genres updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating genres.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await client.db('test').collection('users').deleteOne({ _id: new ObjectId(req.userId) });
        res.json({ message: 'Account eliminato con successo.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Errore nell\'eliminazione dell\'account.' });
    }
};

exports.getLikedArtists = async (req, res) => {
    try {
        const user = await client.db('test').collection('users').findOne({ _id: new ObjectId(req.userId) }, { projection: { likedArtists: 1 } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.likedArtists);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.likesHandler = (type, action) => {
    return async (req, res) => {
        const itemId = req.params.id;

        // Le playlist sono nel DB MongoDB, controllo la validità dell'ID. (Non sto controllando l'esistenza della playlist)
        if (type === 'playlist' && !ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'ID non valido.' });
        }

        const fieldToUpdate = `liked${type.charAt(0).toUpperCase() + type.slice(1)}s`;

        let updateAction;
        if (action === 'like') {
            // Se stai lavorando con playlist, usa ObjectId, altrimenti trattalo come stringa.
            const idToUse = type === 'playlist' ? new ObjectId(itemId) : itemId;
            updateAction = { $addToSet: { [fieldToUpdate]: idToUse } };
        } else if (action === 'unlike') {
            // Se stai lavorando con playlist, usa ObjectId, altrimenti trattalo come stringa.
            const idToUse = type === 'playlist' ? new ObjectId(itemId) : itemId;
            updateAction = { $pull: { [fieldToUpdate]: idToUse } };
        }

        try {
            const result = await client.db('test').collection('users').updateOne(
                { _id: new ObjectId(req.userId) },
                updateAction
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            res.json({ message: `${action.charAt(0).toUpperCase() + action.slice(1)} effettuato con successo.` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Errore nell'esecuzione dell'azione ${action} su ${type}.` });
        }
    }
};
