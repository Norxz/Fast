document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('email')) document.getElementById('email').value = params.get('email');
    if (params.has('code')) document.getElementById('code').value = params.get('code');

    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const code = document.getElementById('code').value;
        const res = await fetch('https://fast-production-c604.up.railway.app/auth/verify?email=' + encodeURIComponent(email) + '&code=' + encodeURIComponent(code), {
            method: 'POST'
        });
        const text = await res.text();
        document.getElementById('result').textContent = text;
        if (res.ok) {
            setTimeout(() => window.location.href = 'index.html', 2000);
        }
    });

    document.getElementById('resendVerificationBtn').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        document.getElementById('resendVerificationBtn').disabled = true;
        try {
            const res = await fetch('https://fast-production-c604.up.railway.app/auth/resend-verification', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${encodeURIComponent(email)}`
            });
            const text = await res.text();
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Listo!",
                    text: "Se ha enviado un nuevo código de verificación a tu correo con expiracion de 10 min.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: text || "No se pudo reenviar el código.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al reenviar el código.",
            });
        }
        document.getElementById('resendVerificationBtn').disabled = false;
    });
});