const titlesMap = {
    changeName: "Change Name",
    changeSurname: "Change Surname",
    changeEmail: "Change Email",
    changePassword: "Change Password",
    deleteAccount: "Delete Account"
};

const placeholdersMap = {
    changeName: "Enter new name...",
    changeSurname: "Enter new surname...",
    changeEmail: "Enter new email...",
    changePassword: " << Questo non mi serve >> ",
    deleteAccount: "Type \"DELETE\" to confirm"
};

const buttonTextMap = {
    changeName: "Set Name",
    changeSurname: "Set Surname",
    changeEmail: "Set Email",
    changePassword: "Set Password",
    deleteAccount: "Confirm Deletion"
};

const apiEndpointsMap = {
    changeName: { url: "/api/user/update", method: 'PUT' },
    changeSurname: { url: "/api/user/update", method: 'PUT' },
    changeEmail: { url: "/api/user/update", method: 'PUT' },
    changePassword: { url: "/api/user/change-password", method: 'PUT' },
    deleteAccount: { url: "/api/user/delete", method: 'DELETE' }
};


// Reference agli elementi nel modale
const modal = document.getElementById('settingsModal');
const modalTitle = modal.querySelector('.modal-title');
const modalButton = modal.querySelector('.modal-footer button');

const defaultInput = modal.querySelector('#defaultInput');
const oldPasswordInput = modal.querySelector('#oldPassword');
const newPasswordInput = modal.querySelector('#newPassword');
const confirmPasswordInput = modal.querySelector('#confirmPassword');

// Event listener per l'apertura del modale
modal.addEventListener('show.bs.modal', function (event) {
    // Ottieni l'elemento che ha attivato il modale
    const button = event.relatedTarget;

    const title = titlesMap[button.id];
    const placeholder = placeholdersMap[button.id];
    const buttonText = buttonTextMap[button.id];

    modalTitle.textContent = title;
    modalButton.textContent = buttonText;

    // Memorizza l'ID dell'attivatore nel modale per utilizzarlo in seguito
    modal.setAttribute('data-activator-id', button.id);

    // Nascondi tutti gli input
    [defaultInput, oldPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => input.classList.add('d-none'));

    if (button.id === 'changePassword') {
        oldPasswordInput.classList.remove('d-none');
        newPasswordInput.classList.remove('d-none');
        confirmPasswordInput.classList.remove('d-none');
    } else {
        defaultInput.classList.remove('d-none');
        defaultInput.setAttribute('placeholder', placeholder);
    }
});

// Event listener per la chiusura del modale
modal.addEventListener('hidden.bs.modal', function () {
    // Resetta il valore di ogni input
    [defaultInput, oldPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => input.value = '');
});



/* Chiamata alle API */

modalButton.addEventListener('click', function () {
    const activatorId = modal.getAttribute('data-activator-id');
    const { url, method } = apiEndpointsMap[activatorId];
    let data = {};

    switch (activatorId) {
        case 'changeName':
            data = { name: defaultInput.value };
            break;
        case 'changeSurname':
            data = { surname: defaultInput.value };
            break;
        case 'changeEmail':
            data = { email: defaultInput.value };
            break;
        case 'changePassword':
            data = { oldPassword: oldPasswordInput.value, newPassword: newPasswordInput.value, confirmPassword: confirmPasswordInput.value };
            break;
        case 'deleteAccount':
            // Qui potresti voler fare qualcosa di diverso per confermare l'eliminazione
            break;
    }

    callApi(url, data , method)
        .then(response => {
            console.log('Operazione completata con successo!', response);
            alert('Operazione completata con successo!');

            if (activatorId === 'deleteAccount') {
                window.location.href = "/register";
                return;
            }

            // Se l'utente ha cambiato nome, cognome o email, recupera i dati aggiornati
            if (['changeName', 'changeSurname', 'changeEmail'].includes(activatorId)) {
                return callApi('/api/user/me', {}, 'GET');
            }
        })
        .then(updatedUser => {
            if (updatedUser) {
                // Aggiorna la UI con i dati dell'utente recuperati
                const sideProfile = document.querySelector('.sideProfile .profile');
                const userName = sideProfile.querySelector('h5');
                const userEmail = sideProfile.querySelector('p');
                
                userName.textContent = updatedUser.name + " " + updatedUser.surname;
                userEmail.textContent = updatedUser.email;
            }
        })
        .catch(error => {
            console.error('Errore:', error);
            alert('Si è verificato un errore durante l\'operazione. Per favore, riprova.');
        });
});


/**
 * Esegue una richiesta verso un endpoint specificato.
 *
 * @param {string} endpoint - L'URL dell'endpoint al quale effettuare la richiesta.
 * @param {object|null} data - Il corpo della richiesta da inviare. Se null, non viene inviato alcun corpo.
 * @param {string} method - Il metodo HTTP da utilizzare (es. 'GET', 'PUT'). Default è 'PUT'.
 * @returns {Promise<object>} - Una promessa che risolve nel corpo della risposta in formato JSON.
 * @throws {Error} - Lancia un'eccezione se la risposta non è OK, includendo il messaggio di errore dal server.
 */
async function callApi(endpoint, data, method = 'PUT') {
    const requestOptions = {
        method: method
    };

    // Aggiungi il corpo solo se il metodo non è GET e i dati sono forniti
    if (method !== 'GET' && data) {
        requestOptions.headers = {
            'Content-Type': 'application/json'
        };
        requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, requestOptions);
    const responseData = await response.json();

    if (!response.ok) {
        const errorMsg = responseData.message || 'Errore sconosciuto';
        throw new Error(errorMsg);
    }

    return responseData;
}