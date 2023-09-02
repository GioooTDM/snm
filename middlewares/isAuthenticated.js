const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Estrai il token dal cookie
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: "Nessun token di autenticazione, autorizzazione negata." });
        }

        // Verifica il token. Se il token è scaduto, jwt.verify lancerà un errore.
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Se il token è valido, imposta il campo user nel req
        req.userId = verified.id;

        // Vai al prossimo middleware o route handler
        next();

    } catch (err) {
        // Gestisci specificamente l'errore TokenExpiredError
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token scaduto." });
        }
        // Gestisci l'errore JsonWebTokenError (come token non valido, malformato, ecc.)
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Token non valido." });
        }
        // Se non è uno dei due errori sopra, è un errore inaspettato.
        return res.status(500).json({ error: "Errore interno del server." });
    }
};
