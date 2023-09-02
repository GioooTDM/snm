document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Se il login ha avuto successo, il token sarà salvato come cookie.

            // Prova ad accedere alla route /home. Il cookie verrà inviato automaticamente.
            const homeResponse = await fetch('/home');

            // Controlla se la risposta di /home è valida
            if (homeResponse.ok) {
                window.location.href = '/home';
            } else {
                const homeData = await homeResponse.json();
                alert(homeData.message || 'Errore durante l\'accesso a /home');
            }
        } else {
            alert(data.message || 'Errore durante il login');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});