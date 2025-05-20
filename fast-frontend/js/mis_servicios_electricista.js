document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const electricistaId = localStorage.getItem('userId'); // Guarda el id al hacer login
  const container = document.getElementById('misServiciosContainer');
  if (!token || !electricistaId) return window.location.href = 'login.html';

  try {
    const res = await fetch(`http://localhost:8080/solicitudes/mis-servicios/${electricistaId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const servicios = await res.json();
    container.innerHTML = servicios.length === 0
      ? '<p>No tienes servicios asignados.</p>'
      : servicios.map(s => `
        <div class="service-card">
          <h3>${s.titulo}</h3>
          <p>${s.descripcion}</p>
          <span class="badge">${s.estado}</span>
          ${s.estado === 'ASIGNADA' ? `
            <button onclick="contactarCliente('${s.compradorId}')">Contactar Cliente</button>
          ` : ''}
        </div>
      `).join('');
  } catch (e) {
    container.innerHTML = '<p>Error al cargar tus servicios.</p>';
  }
});

function contactarCliente(compradorId) {
  // Aquí puedes hacer un fetch para obtener el teléfono/email del cliente y mostrarlo con SweetAlert2
  // Ejemplo simple:
  Swal.fire({
    title: 'Contactar Cliente',
    html: `
      <p>Puedes llamar o enviar un mensaje al cliente.</p>
      <p>ID Cliente: ${compradorId}</p>
    `,
    icon: 'info'
  });
}