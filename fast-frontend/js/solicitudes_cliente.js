document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId'); // Usar userId
  const requestsList = document.getElementById('requestsList');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const noRequestsMessage = document.getElementById('noRequestsMessage');
  const totalRequests = document.getElementById('totalRequests');
  const activeRequests = document.getElementById('activeRequests');
  const completedRequests = document.getElementById('completedRequests');
  const filterStatus = document.getElementById('filterStatus');
  const refreshBtn = document.getElementById('refreshBtn');

  const userName = localStorage.getItem('userName') || 'Usuario';
  const userRole = localStorage.getItem('userRole') || 'Cliente';
  document.getElementById('userName').textContent = userName;
  document.getElementById('userRole').textContent = userRole.charAt(0) + userRole.slice(1).toLowerCase();

  if (!token || !userId) return window.location.href = 'login.html';

  async function cargarSolicitudes() {
    loadingIndicator.style.display = 'block';
    requestsList.innerHTML = '';
    noRequestsMessage.style.display = 'none';

    try {
      const res = await fetch(`http://localhost:8080/solicitudes/mis-solicitudes/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const solicitudes = await res.json();

      // Estadísticas
      totalRequests.textContent = solicitudes.length;
      activeRequests.textContent = solicitudes.filter(s => s.estado === 'PENDIENTE' || s.estado === 'ASIGNADA' || s.estado === 'EN_PROCESO').length;
      completedRequests.textContent = solicitudes.filter(s => s.estado === 'FINALIZADA' || s.estado === 'COMPLETADA').length;

      // Filtrado
      let filtro = filterStatus.value;
      let filtradas = solicitudes;
      if (filtro && filtro !== 'TODAS') {
        filtradas = solicitudes.filter(s => s.estado === filtro);
      }

      if (filtradas.length === 0) {
        noRequestsMessage.style.display = 'block';
        loadingIndicator.style.display = 'none';
        return;
      }

      // Renderizar solicitudes
      requestsList.innerHTML = filtradas.map(s => {
        let badge = '';
        let extra = '';
        if (s.estado === 'PENDIENTE') {
          badge = '<span class="request-status badge badge-warning">Pendiente</span>';
        } else if (s.estado === 'ASIGNADA') {
          badge = '<span class="request-status badge badge-info">Asignada</span>';
          extra = `<div><b>Electricista:</b> <button class="btn btn-sm" onclick="verElectricista(${s.electricista_id})">Ver info</button></div>`;
        } else if (s.estado === 'FINALIZADA' || s.estado === 'COMPLETADA') {
          badge = '<span class="request-status badge badge-success">Finalizada</span>';
          extra = `<div><b>Electricista:</b> <button class="btn btn-sm" onclick="verElectricista(${s.electricista_id})">Ver info</button></div>
                   <div><b>Precio cobrado:</b> $${s.precioCobrador || 'N/A'}</div>`;
        } else if (s.estado === 'CANCELADA') {
          badge = '<span class="request-status badge badge-danger">Cancelada</span>';
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
                <span class="meta-item"><i class="fas fa-bolt"></i> ${s.categoria || ''}</span>
                <span class="meta-item"><i class="fas fa-calendar-alt"></i> ${s.fechaServicio || 'No definida'}</span>
                <sp class="meta-item"><i class="fas fa-dollar-sign"></i> ${s.presupuesto || ''}</sp>
              </div>
              <p class="request-description">${s.descripcion}</p>
              ${extra}
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      requestsList.innerHTML = '<p>Error al cargar tus solicitudes.</p>';
    } finally {
      loadingIndicator.style.display = 'none';
    }
  }

  // Mostrar info del electricista
  window.verElectricista = async function(electricistaId) {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:8080/solicitudes/usuarios/${electricistaId}/contacto`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      Swal.fire({
        title: 'Información del Electricista',
        html: `
          <p><strong>Teléfono:</strong> ${data.telefono || 'No disponible'}</p>
          <p><strong>Email:</strong> ${data.email || 'No disponible'}</p>
        `,
        icon: 'info',
        confirmButtonText: 'Cerrar'
      });
    } catch (e) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener la información del electricista.',
        icon: 'error'
      });
    }
  };

  // Filtros y recarga
  filterStatus.addEventListener('change', cargarSolicitudes);
  refreshBtn.addEventListener('click', cargarSolicitudes);

  // Inicial
  cargarSolicitudes();
});