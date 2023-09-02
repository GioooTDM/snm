document.addEventListener("DOMContentLoaded", function() {
    const userImg = document.getElementById('user-img');
    const fileInput = document.getElementById('file-input');
    const profilePic = document.getElementById('profile-pic');
    const profilePicYou = document.getElementById('profile-pic-you');

    // Quando l'utente clicca sull'immagine, apre il selettore di file
    userImg.addEventListener('click', function() {
        fileInput.click();
    });

    // Quando l'utente seleziona un file, invia una chiamata all'API
    fileInput.addEventListener('change', async function() {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/api/user/upload-image', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    // Aggiorna l'immagine del profilo con la nuova immagine caricata
                    if (result.image) {
                        profilePic.src = 'data:image/jpeg;base64,' + result.image;
                        profilePicYou.src = 'data:image/jpeg;base64,' + result.image;
                    } else {
                        console.error('Nessuna immagine ricevuta dal server');
                    }
                } else {
                    console.error('Errore durante il caricamento dell\'immagine');
                }
            } catch (err) {
                console.error('Errore:', err);
            }
        }
    });
});
