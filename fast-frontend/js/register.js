document.addEventListener("DOMContentLoaded", () => {
  // Configurar fecha mínima como hoy
  const fechaInput = document.getElementById("fecha");
  const today = new Date().toISOString().split("T")[0];

  const copyBtn = document.querySelector(".password-copy");
  const passwordInput = document.querySelector("#password");

  copyBtn.addEventListener("click", () => {
    if (passwordInput.value.length > 0) {
      navigator.clipboard
        .writeText(passwordInput.value)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "¡Contraseña copiada!",
            text: "La contraseña ha sido copiada al portapapeles.",
            timer: 1000,
            showConfirmButton: false,
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo copiar la contraseña.",
          });
        });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Primero debes escribir una contraseña.",
      });
    }
  });

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
        fileNames.textContent = `${
          e.target.files.length
        } archivo(s): ${names.join(", ")}`;
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
      Swal.fire({
        title: "Error",
        text: "Las contraseñas no coinciden.",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
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
      userData.aniosExperiencia =
        document.getElementById("aniosExperiencia").value;
      const fotosInput = document.getElementById("fotos");
      userData.fotos =
        fotosInput && fotosInput.files
          ? Array.from(fotosInput.files).map((f) => f.name)
          : [];
    }

    try {
      const response = await fetch(
        "https://fast-production-c604.up.railway.app/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const text = await response.text();
      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: text || "Error en el registro",
          icon: "error",
          confirmButtonText: "Cerrar",
        });

        // Mostrar el botón solo si el error es de código expirado o cuenta no verificada
        if (
          text &&
          (text.toLowerCase().includes("expirado") ||
           text.toLowerCase().includes("verificación") ||
           text.toLowerCase().includes("no está verificada"))
        ) {
          resendBtn.style.display = "block";
        } else {
          resendBtn.style.display = "none";
        }
        return;
      } else {
        resendBtn.style.display = "none";
      }

      Swal.fire({
        title: "Revisa tu correo",
        text: "Se ha enviado un correo de confirmación. Por favor, verifica tu bandeja de entrada. Si no lo ves, revisa la carpeta de spam.",
        icon: "success",
        confirmButtonText: "Ir a login",
      }).then(() => {
        window.location.href = "index.html";
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Error en el registro",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  });

  const resendBtn = document.getElementById("resendVerificationBtn");
  const emailInput = document.getElementById("email");

  // Función para reenviar el código
  if (resendBtn) {
    resendBtn.addEventListener("click", async () => {
      const email = emailInput.value;
      if (!email) {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Por favor, ingresa tu correo electrónico.",
        });
        return;
      }
      resendBtn.disabled = true;
      try {
        const response = await fetch(
          "https://fast-production-c604.up.railway.app/auth/resend-verification",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${encodeURIComponent(email)}`,
          }
        );
        const text = await response.text();
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: text || "No se pudo reenviar el código.",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "¡Listo!",
            text: "Se ha enviado un nuevo código de verificación a tu correo.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "No se pudo reenviar el código.",
        });
      }
      resendBtn.disabled = false;
    });
  }

  if (text && text.toLowerCase().includes("expirado")) {
    resendBtn.style.display = "block";
  } else {
    resendBtn.style.display = "none";
  }
});
