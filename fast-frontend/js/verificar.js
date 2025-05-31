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
});