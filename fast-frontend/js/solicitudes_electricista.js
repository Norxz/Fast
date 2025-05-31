document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const container = document.getElementById('servicesList'); // <-- usa el contenedor correcto
  if (!token) return window.location.href = 'index.html';

  try {
    const res = await fetch('https://fast-production-c604.up.railway.app/solicitudes/disponibles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const solicitudes = await res.json();
    container.innerHTML = solicitudes.length === 0
      ? '<p>No hay solicitudes disponibles.</p>'
      : solicitudes.map(s => `
        <div class="service-card">
          <div class="service-header">
            <h3>${s.titulo}</h3>
            <span class="status-badge">${s.estado}</span>
          </div>
          <div class="service-details">
            <p>${s.descripcion}</p>
          </div>
          <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.ubicacion)}" target="_blank">
            VER DIRECCIÓN
          </a>
          <button onclick="aceptarSolicitud(${s.id})">Aceptar</button>
        </div>
      `).join('');
  } catch (e) {
    container.innerHTML = '<p>Error al cargar las solicitudes.</p>';
  }
});

function aceptarSolicitud(id) {
  const token = localStorage.getItem('token');
  const electricistaId = localStorage.getItem('userId');
  if (!electricistaId || electricistaId === "null" || electricistaId === "undefined") {
    Swal.fire({
      title: "Error",
      text: "No se pudo identificar al electricista. Por favor, vuelve a iniciar sesión.",
      icon: "error"
    });
    return;
  }
  fetch(`https://fast-production-c604.up.railway.app/solicitudes/${id}/aceptar?electricistaId=${electricistaId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => {
    if (res.ok) {
      Swal.fire({
        title: "¡Solicitud aceptada!",
        text: "Podrás encontrar este servicio en la sección 'Mis Servicios'.",
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        location.reload();
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Error al aceptar solicitud",
        icon: "error"
      });
    }
  });
}