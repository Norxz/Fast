document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  // Detecta el contenedor según la página
  let container =
    document.getElementById("misServiciosContainer") ||
    document.getElementById("servicesList");

  if (!token) return (window.location.href = "login.html");

  try {
    // Si estás en mis-servicios.html, muestra los servicios ASIGNADOS
    if (container.id === "misServiciosContainer") {
      const userId = localStorage.getItem("userId");
      const res = await fetch(
        `https://fast-production-c604.up.railway.app/solicitudes/mis-servicios/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const servicios = await res.json();
      container.innerHTML =
        servicios.length === 0
          ? "<p>No tienes servicios asignados.</p>"
          : servicios
              .map(
                (s) => `
          <div class="service-card">
            <h3>${s.titulo}</h3>
            <p>${s.descripcion}</p>
            <span class="badge">${s.estado}</span>
          </div>
        `
              )
              .join("");
    } else {
      // Si estás en servicios.html, muestra los servicios DISPONIBLES
      const res = await fetch(
        `https://fast-production-c604.up.railway.app/solicitudes/disponibles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const servicios = await res.json();
      container.innerHTML =
        servicios.length === 0
          ? "<p>No hay servicios disponibles.</p>"
          : servicios
              .map(
                (s) => `
          <div class="service-card">
            <h3>${s.titulo}</h3>
            <p>${s.descripcion}</p>
            <span class="badge">${s.estado}</span>
            <button onclick="aceptarServicio('${s.id}')">Aceptar Servicio</button>
          </div>
        `
              )
              .join("");
    }
  } catch (e) {
    container.innerHTML = "<p>Error al cargar los servicios.</p>";
  }
});

async function aceptarServicio(solicitudId) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  try {
    const res = await fetch(
      `https://fast-production-c604.up.railway.app/solicitudes/${solicitudId}/aceptar?electricistaId=${userId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("No se pudo aceptar el servicio");
    Swal.fire("¡Servicio aceptado!", "", "success").then(() =>
      location.reload()
    );
  } catch (e) {
    Swal.fire("Error", "No se pudo aceptar el servicio.", "error");
  }
}
