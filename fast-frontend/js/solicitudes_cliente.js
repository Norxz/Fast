document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Usar userId
  const requestsList = document.getElementById("requestsList");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const noRequestsMessage = document.getElementById("noRequestsMessage");
  const totalRequests = document.getElementById("totalRequests");
  const activeRequests = document.getElementById("activeRequests");
  const completedRequests = document.getElementById("completedRequests");
  const filterStatus = document.getElementById("filterStatus");
  const refreshBtn = document.getElementById("refreshBtn");

  const userName = localStorage.getItem("userName") || "Usuario";
  const userRole = localStorage.getItem("userRole") || "Cliente";
  document.getElementById("userName").textContent = userName;
  document.getElementById("userRole").textContent =
    userRole.charAt(0) + userRole.slice(1).toLowerCase();

  if (!token || !userId) return (window.location.href = "login.html");

  async function cargarSolicitudes() {
    loadingIndicator.style.display = "block";
    requestsList.innerHTML = "";
    noRequestsMessage.style.display = "none";

    try {
      const res = await fetch(
        `https://fast-production-c604.up.railway.app/solicitudes/mis-solicitudes/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const solicitudes = await res.json();

      // Estadísticas
      totalRequests.textContent = solicitudes.length;
      activeRequests.textContent = solicitudes.filter(
        (s) =>
          s.estado === "PENDIENTE" ||
          s.estado === "ASIGNADA" ||
          s.estado === "EN_PROCESO"
      ).length;
      completedRequests.textContent = solicitudes.filter(
        (s) => s.estado === "FINALIZADA" || s.estado === "COMPLETADA"
      ).length;

      // Filtrado
      let filtro = filterStatus.value;
      let filtradas = solicitudes;
      if (filtro && filtro !== "TODAS") {
        filtradas = solicitudes.filter((s) => s.estado === filtro);
      }

      if (filtradas.length === 0) {
        noRequestsMessage.style.display = "block";
        loadingIndicator.style.display = "none";
        return;
      }

      // Renderizar solicitudes
      requestsList.innerHTML = filtradas
        .map((s) => {
          let badge = "";
          let extra = "";
          if (s.estado === "PENDIENTE") {
            badge =
              '<span class="request-status badge badge-warning">Pendiente</span>';
            extra = `<button class="btn btn-sm btn-cancel" onclick="cancelarSolicitud(${s.id})">
    <i class="fas fa-times"></i> Cancelar
  </button>`;
          } else if (s.estado === "ASIGNADA") {
            badge =
              '<span class="request-status badge badge-info">Asignada</span>';
            extra = `<div><b>Electricista:</b> <button class="btn btn-sm" onclick="verElectricista(${s.electricista.id})">Ver info</button></div>
           <button class="btn btn-sm btn-cancel" onclick="cancelarSolicitud(${s.id})">
             <i class="fas fa-times"></i> Cancelar
           </button>`;
          } else if (s.estado === "FINALIZADA" || s.estado === "COMPLETADA") {
            badge = '<span class="request-status badge badge-success">Finalizada</span>';
            extra = `<div><b>Electricista:</b> <button class="btn btn-sm" onclick="verElectricista(${
              s.electricista.id
            })">Ver info</button></div>
                   <div><b>Precio cobrado:</b> $${s.precioCobrador || "N/A"}</div>
                   <div id="calificar-btn-${s.id}"></div>`;
          } else if (s.estado === "CANCELADA") {
            badge =
              '<span class="request-status badge badge-danger">Cancelada</span>';
          } else {
            badge = `<span class="request-status">${s.estado}</span>`;
          }

          return `
          <div class="request-card">
            <div class="request-header">
              <h3 class="request-title">${s.titulo}</h3>
              ${badge}
            </div>
            <div class="request-body">
              <div class="request-meta">
                <span class="meta-item"><i class="fas fa-bolt"></i> ${
                  s.categoria || ""
                }</span>
                <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${
                  s.fechaServicio || "No definida"
                }</span>
                <sp class="meta-item"><i class="fas fa-dollar-sign"></i> ${
                  s.presupuesto || ""
                }</sp>
              </div>
              <p class="request-description">${s.descripcion}</p>
              ${extra}
            </div>
          </div>
        `;
        })
        .join("");

      // Después de renderizar las solicitudes:
      filtradas.forEach(async (s) => {
        if (s.estado === "FINALIZADA" || s.estado === "COMPLETADA") {
          const token = localStorage.getItem("token");
          const btnDiv = document.getElementById(`calificar-btn-${s.id}`);
          try {
            const res = await fetch(
              `https://fast-production-c604.up.railway.app/resenas/solicitud/${s.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (!res.ok) throw new Error("No autorizado");
            const data = await res.json();
            if (data && data.length > 0) {
              btnDiv.innerHTML = `<span class="badge badge-info">Ya calificaste este servicio</span>`;
            } else {
              btnDiv.innerHTML = `<button class="btn btn-sm btn-primary" onclick="calificarSolicitud(${s.id})">
          <i class="fa fa-star"></i> Calificar
        </button>`;
            }
          } catch (e) {
            btnDiv.innerHTML = `<span class="badge badge-danger">No se pudo verificar reseña</span>`;
          }
        }
      });
    } catch (e) {
      requestsList.innerHTML = "<p>Error al cargar tus solicitudes.</p>";
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  // Mostrar info del electricista
  window.verElectricista = async function (electricistaId) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `https://fast-production-c604.up.railway.app/solicitudes/usuarios/${electricistaId}/contacto`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      Swal.fire({
        title: "Información del Electricista",
        html: `
          <p><strong>Teléfono:</strong> ${data.telefono || "No disponible"}</p>
          <p><strong>Email:</strong> ${data.email || "No disponible"}</p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar",
      });
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la información del electricista.",
        icon: "error",
      });
    }
  };

  window.cancelarSolicitud = async function (solicitudId) {
    const token = localStorage.getItem("token");
    const confirm = await Swal.fire({
      title: "¿Cancelar solicitud?",
      text: "¿Estás seguro de que deseas cancelar este servicio? Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://fast-production-c604.up.railway.app/solicitudes/${solicitudId}/cancelar`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("No se pudo cancelar la solicitud");
      Swal.fire({
        title: "Cancelado",
        text: "La solicitud ha sido cancelada.",
        icon: "success",
      });
      cargarSolicitudes();
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message || "No se pudo cancelar la solicitud.",
        icon: "error",
      });
    }
  };

  window.calificarSolicitud = function (solicitudId) { // DOM calificar solicitudddddddd
    Swal.fire({
      title: 'Califica el servicio',
      html: `
        <div id="starRating" style="font-size:2rem; color:#FFD700; margin-bottom:1rem;">
          <i class="fa-regular fa-star" data-value="1"></i>
          <i class="fa-regular fa-star" data-value="2"></i>
          <i class="fa-regular fa-star" data-value="3"></i>
          <i class="fa-regular fa-star" data-value="4"></i>
          <i class="fa-regular fa-star" data-value="5"></i>
        </div>
        <textarea id="comentario" class="swal2-textarea" placeholder="Deja un comentario"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      preConfirm: () => {
        const estrellas = document.querySelectorAll('#starRating .fa-star.selected').length;
        const comentario = document.getElementById('comentario').value;
        if (estrellas === 0) {
          Swal.showValidationMessage('Selecciona una calificación de estrellas');
          return false;
        }
        return { estrellas, comentario };
      },
      didOpen: () => {
        const stars = document.querySelectorAll('#starRating .fa-star');
        let current = 0;
        stars.forEach((star, idx) => {
          // Al pasar el mouse, muestra las estrellas llenas hasta esa posición
          star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
              s.classList.toggle('fa-solid', i <= idx);
              s.classList.toggle('fa-regular', i > idx);
              s.classList.toggle('selected', i <= idx);
            });
          });
          // Al salir el mouse, vuelve al estado actual
          star.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
              s.classList.toggle('fa-solid', i < current);
              s.classList.toggle('fa-regular', i >= current);
              s.classList.toggle('selected', i < current);
            });
          });
          // Al hacer click, fija la cantidad de estrellas seleccionadas
          star.addEventListener('click', () => {
            current = idx + 1;
            stars.forEach((s, i) => {
              s.classList.toggle('fa-solid', i < current);
              s.classList.toggle('fa-regular', i >= current);
              s.classList.toggle('selected', i < current);
            });
          });
        });
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const { estrellas, comentario } = result.value;
        try {
          const token = localStorage.getItem("token");
          await fetch('https://fast-production-c604.up.railway.app/resenas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              solicitudId,
              estrellas,
              comentario
            })
          });
          Swal.fire('¡Gracias!', 'Tu calificación ha sido enviada.', 'success');
        } catch (e) {
          Swal.fire('Error', 'No se pudo enviar la calificación', 'error');
        }
      }
    });
  };

  // Filtros y recarga
  filterStatus.addEventListener("change", cargarSolicitudes);
  refreshBtn.addEventListener("click", cargarSolicitudes);

  // Inicial
  cargarSolicitudes();
});
