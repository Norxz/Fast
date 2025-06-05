document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName") || "Usuario";

  const cardServicios = document.getElementById("cardServicios");
  const cardSolicitar = document.getElementById("cardSolicitar");
  const cardMisSolicitudes = document.getElementById("cardMisSolicitudes");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar información del usuario
  if (userName) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Bienvenido, ${userName}`;
    document.getElementById("userName").textContent = userName;
  }

  if (userRole === "CLIENTE") {
    cardServicios.style.display = "none";
    cardSolicitar.style.display = "block";
    cardMisSolicitudes.style.display = "block";
    document.getElementById("electricistaActions").style.display = "none";
  } else if (userRole === "ELECTRICISTA") {
    cardServicios.style.display = "block";
    cardSolicitar.style.display = "none";
    cardMisSolicitudes.style.display = "none";
    document.getElementById("electricistaActions").style.display = "block";
  } else if (userRole === "ADMIN") {
    cardServicios.style.display = "none";
    cardSolicitar.style.display = "none";
    cardMisSolicitudes.style.display = "none";
    window.location.href = "admin.html"; // Redirigir a admin
  } else {
    cardServicios.style.display = "none";
    cardSolicitar.style.display = "none";
    cardMisSolicitudes.style.display = "none";
    document.getElementById("electricistaActions").style.display = "none";
  }

  // Configurar botón de logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });

  // Configurar cards clickeables
  const actionCards = document.querySelectorAll(".action-card");
  actionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const button = this.querySelector(".action-btn");
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 150);
    });
  });
});

function navigateTo(page) {
  window.location.href = page;
}

// Verificar estado de autenticación periódicamente
setInterval(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
}, 300000); // 5 minutos
