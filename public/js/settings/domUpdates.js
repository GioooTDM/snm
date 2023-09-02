import { modal, modalTitle, modalButton, defaultInput, oldPasswordInput, newPasswordInput, confirmPasswordInput } from './domElements.js';
import { titlesMap, placeholdersMap, buttonTextMap } from './mapData.js';

export function updateModalUI(event) {
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
}

export function eraseInputValueModalUI() {
    [defaultInput, oldPasswordInput, newPasswordInput, confirmPasswordInput].forEach(input => input.value = '');
}
