document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                surname: surname,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Se la registrazione ha avuto successo, il token sarà salvato come cookie.

            // Reindirizza l'utente alla pagina home
            window.location.href = '/home';
        } else {
            alert(data.message || 'Errore durante la registrazione');
        }
    } catch (error) {
        alert('Errore: ' + error.message);
    }
});
