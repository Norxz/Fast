document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    if (!form) {
        console.log('Formulario no encontrado.');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita el envío real del formulario
        console.log('¡Formulario enviado!');
    });

    const button = document.getElementById('submitButton');
    if (button) {
        button.addEventListener('click', () => {
            console.log('Botón de envío clickeado.');
        });
    } else {
        console.log('Botón de envío no encontrado.');
    }
    
});
