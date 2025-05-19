document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const compradorId = localStorage.getItem('compradorId');
  const container = document.getElementById('solicitudesContainer');
  if (!token || !compradorId) return window.location.href = 'login.html';

  try {
    const res = await fetch(`http://localhost:8080/solicitudes/mias/${compradorId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const solicitudes = await res.json();
    container.innerHTML = solicitudes.length === 0
      ? '<p>No tienes solicitudes registradas.</p>'
      : solicitudes.map(s => `
        <div class="solicitud-card">
          <h3>${s.titulo}</h3>
          <p>${s.descripcion}</p>
          <p><b>Estado:</b> ${s.estado}</p>
        </div>
      `).join('');
  } catch (e) {
    container.innerHTML = '<p>Error al cargar tus solicitudes.</p>';
  }
});