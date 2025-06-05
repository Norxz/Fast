document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    const formStatus = document.createElement('div');
    formStatus.id = 'formStatus';
    contactForm.appendChild(formStatus);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("¡Submit ejecutado!");

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormStatus('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            const response = await fetch('https://fast-production-c604.up.railway.app/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showFormStatus('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Error en el servidor');
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            showFormStatus('Hubo un problema al enviar el mensaje. Intenta más tarde.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
        }
    });

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = type === 'success' ? 'status-success' : 'status-error';
        formStatus.style.marginTop = '1rem';
    }
});
