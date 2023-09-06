import { apiEndpointsMap } from './mapData.js';
import { modal, defaultInput, oldPasswordInput, newPasswordInput, confirmPasswordInput, modalButton, genresChekboxes } from './domElements.js';
import { callApi } from './callApi.js';
import { updateModalUI, eraseInputValueModalUI } from './domUpdates.js';
import { updateGenresDebounced } from './genreUpdates.js';


// Event listener per l'apertura del modale
modal.addEventListener('show.bs.modal', function (event) {
    updateModalUI(event);
});

// Event listener per la chiusura del modale
modal.addEventListener('hidden.bs.modal', function () {
    // Resetta il valore di ogni input
    eraseInputValueModalUI();
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
            const deleteConfirmation = defaultInput.value;
            if (deleteConfirmation.toLowerCase() !== 'delete') {
                alert('Per confermare l\'eliminazione, inserisci la parola "delete" nel campo di input.');
                return;
            }
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



/* Genres */

genresChekboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateGenresDebounced);
});
