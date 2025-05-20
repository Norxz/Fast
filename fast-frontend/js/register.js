document.addEventListener("DOMContentLoaded", () => {
  // Configurar fecha mínima como hoy
  const fechaInput = document.getElementById("fecha");
  const today = new Date().toISOString().split("T")[0];
  if (fechaInput) {
    fechaInput.min = today;
  }

  // Mostrar/ocultar campos de electricista
  const electricistaFields = document.getElementById("electricistaFields");
  const roleRadios = document.querySelectorAll('input[name="role"]');
  roleRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "ELECTRICISTA" && radio.checked) {
        electricistaFields.style.display = "block";
      } else if (radio.value === "CLIENTE" && radio.checked) {
        electricistaFields.style.display = "none";
      }
    });
  });

  // Mostrar nombres de archivos seleccionados
  const fileInput = document.getElementById("fotos");
  const fileNames = document.getElementById("fileNames");
  if (fileInput && fileNames) {
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        const names = Array.from(e.target.files).map((file) => file.name);
        fileNames.textContent = `${e.target.files.length} archivo(s): ${names.join(", ")}`;
      } else {
        fileNames.textContent = "";
      }
    });
  }

  // Envío del formulario de registro
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const role = document.querySelector('input[name="role"]:checked').value;
    const userData = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value,
      password: password,
      rol: role,
    };

    if (role === "ELECTRICISTA") {
      userData.especialidad = document.getElementById("especialidad").value;
      userData.aniosExperiencia = document.getElementById("aniosExperiencia").value;
      const fotosInput = document.getElementById("fotos");
      userData.fotos = fotosInput && fotosInput.files ? Array.from(fotosInput.files).map(f => f.name) : [];
    }

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) throw new Error(data.message || data || "Error en el registro");
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message || "Error en el registro");
    }
  });
});