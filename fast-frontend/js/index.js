document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado"); // <-- Agrega esto
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.log("No se encontró el formulario");
        return;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("¡Submit ejecutado!"); // <-- Agrega esto

        // Obtener valores
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validación básica
        if (!name || !email || !subject || !message) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos obligatorios.',
                showClass: { popup: 'animate__animated animate__shakeX' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
            return;
        }

        // Mostrar cargando
        Swal.showLoading();

        try {
            const response = await fetch('https://fast-production-c604.up.railway.app/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, subject, message })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Tu mensaje ha sido enviado correctamente. Pronto nos pondremos en contacto contigo.',
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                });
                contactForm.reset();
            } else {
                const errorText = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorText || 'No se pudo enviar el mensaje. Intenta más tarde.',
                    showClass: { popup: 'animate__animated animate__shakeX' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' }
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                showClass: { popup: 'animate__animated animate__shakeX' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' }
            });
        }
    });
});