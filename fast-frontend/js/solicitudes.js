document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar información del usuario
    if (userName) {
        document.getElementById('userName').textContent = userName;
    }
    if (userRole) {
        document.getElementById('userRole').textContent = userRole === 'ELECTRICISTA' ? 'Electricista' : 'Cliente';
    }

    // Elementos del DOM
    const requestsList = document.getElementById('requestsList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noRequestsMessage = document.getElementById('noRequestsMessage');
    const filterStatus = document.getElementById('filterStatus');
    const refreshBtn = document.getElementById('refreshBtn');
    const requestTemplate = document.getElementById('requestTemplate');
    
    // Contadores
    const totalRequestsElement = document.getElementById('totalRequests');
    const activeRequestsElement = document.getElementById('activeRequests');
    const completedRequestsElement = document.getElementById('completedRequests');

    // Cargar solicitudes
    let requestsData = [];
    
    async function loadRequests() {
        try {
            requestsList.innerHTML = '';
            loadingIndicator.style.display = 'flex';
            noRequestsMessage.style.display = 'none';
            
            // Simular carga de datos (en producción sería una llamada a tu API)
            const response = await fetch('/api/solicitudes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar las solicitudes');
            }
            
            requestsData = await response.json();
            updateCounters(requestsData);
            filterRequests();
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al cargar las solicitudes');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Actualizar contadores
    function updateCounters(requests) {
        totalRequestsElement.textContent = requests.length;
        activeRequestsElement.textContent = requests.filter(r => 
            r.estado !== 'COMPLETADA' && r.estado !== 'CANCELADA').length;
        completedRequestsElement.textContent = requests.filter(r => 
            r.estado === 'COMPLETADA').length;
    }
    
    // Filtrar solicitudes según selección
    function filterRequests() {
        const status = filterStatus.value;
        let filteredRequests = requestsData;
        
        if (status !== 'TODAS') {
            filteredRequests = requestsData.filter(request => request.estado === status);
        }
        
        renderRequests(filteredRequests);
    }
    
    // Renderizar solicitudes en el DOM
    function renderRequests(requests) {
        requestsList.innerHTML = '';
        
        if (requests.length === 0) {
            noRequestsMessage.style.display = 'flex';
            return;
        }
        
        requests.forEach(request => {
            const requestElement = requestTemplate.content.cloneNode(true);
            
            // Llenar datos
            requestElement.querySelector('.request-title').textContent = request.titulo;
            requestElement.querySelector('.service-type').textContent = getServiceTypeName(request.tipoServicio);
            requestElement.querySelector('.request-date').textContent = formatDate(request.fechaCreacion);
            requestElement.querySelector('.request-budget').textContent = request.presupuesto ? `$${request.presupuesto}` : 'No especificado';
            requestElement.querySelector('.request-description').textContent = request.descripcion;
            requestElement.querySelector('.urgency-level').textContent = getUrgencyName(request.urgencia);
            
            // Estado
            const statusElement = requestElement.querySelector('.request-status');
            statusElement.textContent = getStatusName(request.estado);
            statusElement.classList.add(request.estado);
            
            // Urgencia
            const urgencyElement = requestElement.querySelector('.urgency-tag');
            urgencyElement.classList.add(request.urgencia);
            
            // Configurar botón de ver detalles
            requestElement.querySelector('.btn-view').addEventListener('click', () => {
                viewRequestDetails(request.id);
            });
            
            requestsList.appendChild(requestElement);
        });
    }
    
    // Funciones auxiliares
    function getServiceTypeName(type) {
        const types = {
            'INSTALACION': 'Instalación',
            'REPARACION': 'Reparación',
            'MANTENIMIENTO': 'Mantenimiento',
            'ILUMINACION': 'Iluminación',
            'OTRO': 'Otro'
        };
        return types[type] || type;
    }
    
    function getStatusName(status) {
        const statuses = {
            'PENDIENTE': 'Pendiente',
            'ASIGNADA': 'Asignada',
            'EN_PROCESO': 'En proceso',
            'COMPLETADA': 'Completada',
            'CANCELADA': 'Cancelada'
        };
        return statuses[status] || status;
    }
    
    function getUrgencyName(urgency) {
        const urgencies = {
            'BAJA': 'Baja',
            'MEDIA': 'Media',
            'ALTA': 'Alta'
        };
        return urgencies[urgency] || urgency;
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    function viewRequestDetails(requestId) {
        window.location.href = `detalle-solicitud.html?id=${requestId}`;
    }
    
    // Event listeners
    filterStatus.addEventListener('change', filterRequests);
    refreshBtn.addEventListener('click', loadRequests);
    
    // Cargar datos iniciales
    loadRequests();
});