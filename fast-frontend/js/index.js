document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Obtén los valores del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Envía la petición al backend
            try {
                const response = await fetch('https://fast-production-c604.up.railway.app/api/contacto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, subject, message })
                });

                if (response.ok) {
                    alert('¡Mensaje enviado correctamente!');
                    form.reset();
                } else {
                    alert('Error al enviar el mensaje. Intenta de nuevo.');
                }
            } catch (error) {
                alert('Error de conexión con el servidor.');
            }
        });
    }
});
