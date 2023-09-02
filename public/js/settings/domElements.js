// Reference agli elementi del modale

export const modal = document.getElementById('settingsModal');
export const modalTitle = modal.querySelector('.modal-title');
export const modalButton = modal.querySelector('.modal-footer button');

export const defaultInput = modal.querySelector('#defaultInput');
export const oldPasswordInput = modal.querySelector('#oldPassword');
export const newPasswordInput = modal.querySelector('#newPassword');
export const confirmPasswordInput = modal.querySelector('#confirmPassword');

// Reference alle checkbox dei generi

export const genresChekboxes = document.querySelectorAll('.genre .form-group input[type="checkbox"]')
