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

            const response = await fetch('https://fast-production-c604.up.railway.app/auth/login', {
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
                throw new Error(data.message || 'Usuario no validado');
            }

            // Guardar token y redirigir
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.rol);
            localStorage.setItem('userName', data.nombre);
            localStorage.setItem('compradorId', data.id);
            localStorage.setItem('userId', data.id);  

            // Redirigir según el rol
            window.location.href = 'menu.html';
            
        } catch (error) {
            console.error('Error:', error);

            // Mensaje especial si es cuenta pendiente de aprobación
            if (
                error.message &&
                (
                  error.message.toLowerCase().includes('aprobada') ||
                  error.message.toLowerCase().includes('aprobación') ||
                  error.message.toLowerCase().includes('no ha sido aprobada') ||
                  error.message.toLowerCase().includes('aún no ha sido aprobada')
                )
            ) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cuenta pendiente',
                    text: 'Tu cuenta aún no ha sido verificada por un administrador. Por favor espera la aprobación.',
                });
            } else {
                Swal.fire('Error', error.message || 'Usuario no validado', 'error');
            }

            // Restaurar botón
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });

    document.querySelector('.forgot-password a').addEventListener('click', async function(e) {
        e.preventDefault();
        const { value: email } = await Swal.fire({
            title: 'Recuperar contraseña',
            input: 'email',
            inputLabel: 'Ingresa tu correo electrónico',
            inputPlaceholder: 'correo@ejemplo.com',
            confirmButtonText: 'Enviar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        });
        if (email) {
            try {
                // Recuperar contraseña
                const res = await fetch('https://fast-production-c604.up.railway.app/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (!res.ok) throw new Error('No se pudo enviar el correo de recuperación');
                Swal.fire('¡Listo!', 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.', 'success');
            } catch (err) {
                Swal.fire('Error', err.message, 'error');
            }
        }
    });
});