function mostrarRegistro() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
  }
  
  function mostrarLogin() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  }
  
  // Login
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      if (!data.jwTtoken) {
        alert("Login fallido. Token no recibido.");
        return;
      }
  
      localStorage.setItem("jwt", data.jwTtoken);
      const payload = JSON.parse(atob(data.jwTtoken.split('.')[1]));
  
      if (payload.rol === "COMPRADOR") {
        window.location.href = "solicitud.html";
      } else if (payload.rol === "PROVEEDOR") {
        window.location.href = "verSolicitud.html";
      } else if (payload.rol === "ADMIN") {
        window.location.href = "admin.html";
      } else {
        alert("Rol no reconocido.");
      }
  
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error al iniciar sesión.");
    }
  });
  
  // Registro
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const rol = document.getElementById("registerRol").value;
  
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rol })
      });
  
      if (response.ok) {
        const msg = await response.text();
        alert("Registro exitoso: " + msg);
        mostrarLogin(); 
      } else {
        const error = await response.text();
        alert("Error al registrarse: " + error);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red o servidor.");
    }
  });
  