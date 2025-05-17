document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar información del usuario
    if (userName) {
        document.getElementById('userName').textContent = userName;
        document.getElementById('welcomeMessage').textContent = `Bienvenido, ${userName}`;
    }

    // Mostrar opciones de electricista si corresponde
    if (userRole === 'ELECTRICISTA') {
        document.getElementById('electricistaActions').style.display = 'block';
    }

    // Configurar botón de logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Configurar cards clickeables
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const button = this.querySelector('.action-btn');
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

function navigateTo(page) {
    window.location.href = page;
}

// Verificar estado de autenticación periódicamente
setInterval(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}, 300000); // 5 minutos