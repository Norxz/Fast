document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.createElement('div');
    formStatus.id = 'formStatus';
    contactForm.appendChild(formStatus);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validación simple
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormStatus('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Mostrar estado de carga
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        try {
            // En producción, reemplazar con tu endpoint real
            const response = await fetch('https://tu-backend.com/api/contacto', {
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
            console.error('Error:', error);
            showFormStatus('Hubo un error al enviar el mensaje. Por favor inténtalo nuevamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
        }
    });

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = type;
        
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    // Integración con Google Maps 
    if (typeof google !== 'undefined') {
        initMap();
    }
});

// Función para el mapa
function initMap() {
    const location = { lat: 6.201506, lng: -75.561901 }; 
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location
    });
    new google.maps.Marker({
        position: location,
        map: map,
        title: 'ServiExpress'
    });
}
