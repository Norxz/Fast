document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const form = document.getElementById('resetForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
            return;
        }
        if (!token) {
            Swal.fire('Error', 'Token inválido o faltante.', 'error');
            return;
        }

        try {
            const res = await fetch('https://fast-production-c604.up.railway.app/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            if (!res.ok) throw new Error(await res.text());
            Swal.fire('¡Listo!', 'Tu contraseña ha sido restablecida.', 'success')
                .then(() => window.location.href = 'index.html');
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    });
});