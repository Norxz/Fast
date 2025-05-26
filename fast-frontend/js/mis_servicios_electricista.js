document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const electricistaId = localStorage.getItem("userId");
  const container = document.getElementById("misServiciosContainer");
  if (!token || !electricistaId) return (window.location.href = "login.html");

  try {
    const res = await fetch(
      `https://fast-production-c604.up.railway.app/solicitudes/mis-servicios/${electricistaId}`,
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
          <p><strong>Fecha del servicio:</strong> ${
            s.fechaServicio ? s.fechaServicio : "No definida"
          }</p>
          ${
            s.estado === "ASIGNADA" && esHoy(s.fechaServicio)
              ? `<button onclick="concluirServicio('${s.id}')">Concluir Servicio</button>`
              : ""
          }
          ${
            s.estado === "ASIGNADA"
              ? `
            <button onclick="contactarCliente('${s.cliente.id}')">Contactar Cliente</button>
          `
              : ""
          }
          ${
            s.estado === "FINALIZADA"
              ? `<span class="badge badge-success">Finalizado</span>`
              : ""
          }
        </div>
      `
            )
            .join("");
  } catch (e) {
    container.innerHTML = "<p>Error al cargar tus servicios.</p>";
  }
});

async function contactarCliente(compradorId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `https://fast-production-c604.up.railway.app/solicitudes/usuarios/${compradorId}/contacto`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("No se pudo obtener el teléfono");
    const contacto = await res.json();
    Swal.fire({
      title: "Contactar Cliente",
      html: `
        <p>Puedes llamar o enviar un mensaje al cliente.</p>
        <p><strong>Teléfono:</strong> ${
          contacto.telefono ? contacto.telefono : "No disponible"
        }</p>
        <p><strong>Email:</strong> ${
          contacto.email ? contacto.email : "No disponible"
        }</p>
      `,
      icon: "info",
    });
  } catch (e) {
    Swal.fire({
      title: "Error",
      text: "No se pudo obtener el teléfono del cliente.",
      icon: "error",
    });
  }
}

async function concluirServicio(solicitudId) {
  const { value: precio } = await Swal.fire({
    title: "Finalizar Servicio",
    input: "number",
    inputLabel: "Precio cobrado",
    inputPlaceholder: "Ingrese el valor cobrado",
    showCancelButton: true,
    confirmButtonText: "Finalizar",
  });
  if (precio) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://fast-production-c604.up.railway.app/solicitudes/${solicitudId}/finalizar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ precio }),
        }
      );
      if (!res.ok) throw new Error("No se pudo finalizar el servicio");
      Swal.fire("¡Servicio finalizado!", "", "success").then(() =>
        location.reload()
      );
    } catch (e) {
      Swal.fire("Error", "No se pudo finalizar el servicio.", "error");
    }
  }
}

function esHoy(fecha) {
  if (!fecha) return false;
  const hoy = new Date().toISOString().slice(0, 10);
  return fecha === hoy;
}
