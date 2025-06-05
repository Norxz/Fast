document.addEventListener('DOMContentLoaded', () => {


    const button = document.getElementById('submitButton');
    if (button) {
        button.addEventListener('click', () => {
            console.log('Botón de envío clickeado.');
        });
    } else {
        console.log('Botón de envío no encontrado.');
    }
    
});
