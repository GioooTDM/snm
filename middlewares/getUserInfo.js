const userService = require('../services/userService'); 

async function getUserInfo(req, res, next) {
    try {
        // Verifica se c'è un userId nel req (impostato da isAuthenticated)
        if (!req.userId) {
            return res.status(401).send('Utente non autenticato.');
        }

        console.log(req.userId)

        // Recupera le informazioni dell'utente dal database
        const user = await userService.getUserById(req.userId);
        if (!user) {
            return res.status(404).send('Utente non trovato.');
        }

        // Imposta le informazioni dell'utente nel req per un uso successivo
        req.user = user;

        // Procedi al prossimo middleware o route handler
        next();

    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni dell\'utente.');
    }
}

module.exports = getUserInfo;