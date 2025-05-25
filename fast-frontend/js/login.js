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
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';

            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              data = await response.json();
            } else {
              data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Guardar token y redirigir
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.rol);
            localStorage.setItem('userName', data.nombre);
            localStorage.setItem('compradorId', data.id);
            localStorage.setItem('userId', data.id);  

            // Redirigir según el rol
            window.location.href = '/html/menu.html';
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al iniciar sesión');
            
            // Restaurar botón
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });


});