const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../database/connection');

// TODO: controllare che la mail sia veramente una mail
exports.register = async (req, res) => {
    const { name, surname, email, password, confirmPassword } = req.body;

    try {
      // Controllo che tutte le informazioni siano state fornite
      if (!name || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Per favore, completa tutti i campi' });
      }
  
      // Controllo che le password corrispondano
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Le password non corrispondono' });
      }
  
      // Controllo che l'utente non sia già registrato
      const existingUser = await client.db("test").collection("users").findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Un utente con questa email è già registrato' });
      }
  
      // Creazione dell'utente
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = {
        name,
        surname,
        email,
        password: hashedPassword,
        createdAt: new Date(),  // data e ora correnti
        likedPlaylists: [], // array di ObjectID vuoto
        likedSongs: [], // array di stringhe vuoto
        likedArtists: [] // array di stringhe vuoto
      };
  
      const result = await client.db("test").collection("users").insertOne(newUser);
  
      // Ottieni l'ID dell'utente appena inserito
      const userId = result.insertedId;
  
      // Creazione del token JWT
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '48h'  // Fai scadere il token dopo 48 ore
      });
  
      // Imposta il token come cookie
      res.cookie('auth_token', token, {
        httpOnly: true, // Sicurezza: il cookie non può essere letto dal JavaScript lato client
        // secure: true,   // Solo su HTTPS (potresti volerlo disabilitare durante lo sviluppo locale)
        maxAge: 48 * 60 * 60 * 1000, // 48 ore in millisecondi
      });
  
      res.status(201).json({ message: 'Utente registrato con successo e cookie impostato.' });
  
    } catch (err) {
      console.error("Errore durante la registrazione:", err);
      res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Controllo che tutte le informazioni siano state fornite
      if (!email || !password) {
        return res.status(400).json({ message: 'Per favore, completa tutti i campi' });
      }
  
      // Cerco l'utente nel database
      const user = await client.db("test").collection("users").findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Nessun account con questa email è stato registrato' });
      }
  
      // Confronto la password fornita con quella nel database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password non valida' });
      }
  
      // Creazione del token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '48h'  // Fai scadere il token dopo 48 ore
      });
  
      // Imposta il JWT in un cookie httpOnly
      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 48, // 48 ore
        // secure: true, // Decommenta questa riga se sei su HTTPS
        // sameSite: 'strict' // Puoi impostare anche questa opzione per ulteriore sicurezza
      });
  
      res.status(201).json({ message: 'Login effettuato con successo e cookie impostato.' });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
