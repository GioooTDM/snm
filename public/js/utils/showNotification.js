let timeoutId;  

export function showNotification(message, type = 'neutral') {
    const validTypes = ['success', 'neutral', 'error'];

    if (!validTypes.includes(type)) {
        console.error('Tipo di notifica non valido.');
        return;
    }

    const notification = document.querySelector('.alert__toast');
    notification.querySelector('span').textContent = message;

    // Pulisci eventuali classi di tipo precedenti
    ['success', 'neutral', 'error'].forEach((oldClass) => {
        notification.classList.remove(oldClass);
    });

    notification.classList.add(type);

    notification.classList.remove('d-none');
    notification.classList.add('show');

    // Cancella il timeout precedente, se esiste
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Imposta un nuovo timeout
    timeoutId = setTimeout(() => {
        notification.classList.add('d-none');
        notification.classList.remove('show');
    }, 4500);
}
