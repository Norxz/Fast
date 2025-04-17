document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Guarda el token para futuras peticiones
            localStorage.setItem("token", data.token);

            // Redirige a otra página o muestra mensaje
            alert("¡Login exitoso!");
            window.location.href = "solicitud.html"; // Puedes cambiar esto
        } else {
            const errorData = await response.json();
            document.getElementById("mensaje-error").textContent = errorData.message || "Error al iniciar sesión.";
        }
    } catch (error) {
        document.getElementById("mensaje-error").textContent = "Error de red o del servidor.";
    }
});
