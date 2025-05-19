document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const container = document.getElementById('solicitudesContainer');
  if (!token) return window.location.href = 'login.html';

  try {
    const res = await fetch('http://localhost:8080/solicitudes/disponibles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const solicitudes = await res.json();
    container.innerHTML = solicitudes.length === 0
      ? '<p>No hay solicitudes disponibles.</p>'
      : solicitudes.map(s => `
        <div class="solicitud-card">
          <h3>${s.titulo}</h3>
          <p>${s.descripcion}</p>
          <button onclick="aceptarSolicitud(${s.id})">Aceptar</button>
        </div>
      `).join('');
  } catch (e) {
    container.innerHTML = '<p>Error al cargar las solicitudes.</p>';
  }
});

function aceptarSolicitud(id) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:8080/solicitudes/${id}/aceptar`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.ok ? location.reload() : alert('Error al aceptar solicitud'));
}