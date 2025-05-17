document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validación simple
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        try {
            // Mostrar loader (puedes añadir un div con clase 'loader' en tu HTML)
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Guardar token y redirigir
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userName', data.name);

            // Redirigir según el rol
            window.location.href = data.role === 'ELECTRICISTA' ? 'dashboard-electricista.html' : 'dashboard-cliente.html';
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al iniciar sesión');
            
            // Restaurar botón
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });

    // Efecto hover mejorado para botones
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    });
});