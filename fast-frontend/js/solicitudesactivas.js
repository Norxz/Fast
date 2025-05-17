document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación y rol
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    if (!token || userRole !== 'ELECTRICISTA') {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar información del usuario
    if (userName) {
        document.getElementById('userName').textContent = userName;
    }

    // Elementos del DOM
    const requestsList = document.getElementById('requestsList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noRequestsMessage = document.getElementById('noRequestsMessage');
    const filterServiceType = document.getElementById('filterServiceType');
    const filterUrgency = document.getElementById('filterUrgency');
    const filterBudget = document.getElementById('filterBudget');
    const budgetMax = document.getElementById('budgetMax');
    const applyFilters = document.getElementById('applyFilters');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const resetFilters = document.getElementById('resetFilters');
    const requestTemplate = document.getElementById('requestTemplate');
    const offerModal = document.getElementById('offerModal');
    const closeModal = document.querySelector('.close-modal');
    const offerForm = document.getElementById('offerForm');
    const requestIdInput = document.getElementById('requestId');

    // Variables de estado
    let allRequests = [];
    let filteredRequests = [];
    let currentFilters = {
        serviceType: 'TODOS',
        urgency: 'TODAS',
        maxBudget: 1000,
        searchQuery: ''
    };

    // Configurar rango de presupuesto
    filterBudget.addEventListener('input', (e) => {
        budgetMax.textContent = `$${e.target.value}`;
    });

    // Cargar solicitudes activas
    async function loadActiveRequests() {
        try {
            requestsList.innerHTML = '';
            loadingIndicator.style.display = 'flex';
            noRequestsMessage.style.display = 'none';
            
            // Simular carga de datos (en producción sería una llamada a tu API)
            const response = await fetch('/api/solicitudes/activas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Error al cargar las solicitudes activas');
            }
            
            allRequests = await response.json();
            applyCurrentFilters();
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al cargar las solicitudes activas');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    // Aplicar filtros actuales
    function applyCurrentFilters() {
        filteredRequests = allRequests.filter(request => {
            // Filtrar por tipo de servicio
            if (currentFilters.serviceType !== 'TODOS' && 
                request.tipoServicio !== currentFilters.serviceType) {
                return false;
            }
            
            // Filtrar por urgencia
            if (currentFilters.urgency !== 'TODAS' && 
                request.urgencia !== currentFilters.urgency) {
                return false;
            }
            
            // Filtrar por presupuesto
            if (request.presupuesto && 
                request.presupuesto > currentFilters.maxBudget) {
                return false;
            }
            
            // Filtrar por búsqueda
            if (currentFilters.searchQuery) {
                const searchTerm = currentFilters.searchQuery.toLowerCase();
                const matchesTitle = request.titulo.toLowerCase().includes(searchTerm);
                const matchesDesc = request.descripcion.toLowerCase().includes(searchTerm);
                const matchesClient = request.clienteNombre.toLowerCase().includes(searchTerm);
                
                if (!matchesTitle && !matchesDesc && !matchesClient) {
                    return false;
                }
            }
            
            return true;
        });
        
        renderRequests();
    }

    // Renderizar solicitudes filtradas
    function renderRequests() {
        requestsList.innerHTML = '';
        
        if (filteredRequests.length === 0) {
            noRequestsMessage.style.display = 'flex';
            return;
        }
        
        filteredRequests.forEach(request => {
            const requestElement = requestTemplate.content.cloneNode(true);
            
            // Llenar datos
            requestElement.querySelector('.request-title').textContent = request.titulo;
            requestElement.querySelector('.client-name').textContent = request.clienteNombre || 'Anónimo';
            requestElement.querySelector('.client-location').textContent = request.ubicacion || 'Ubicación no especificada';
            requestElement.querySelector('.service-type').textContent = getServiceTypeName(request.tipoServicio);
            requestElement.querySelector('.request-date').textContent = formatDate(request.fechaCreacion);
            requestElement.querySelector('.request-budget').textContent = request.presupuesto ? `$${request.presupuesto}` : 'No especificado';
            requestElement.querySelector('.urgency-level').textContent = getUrgencyName(request.urgencia);
            requestElement.querySelector('.request-description').textContent = request.descripcion;
            requestElement.querySelector('.offers-count').textContent = request.ofertasCount || 0;
            
            // Urgencia
            const urgencyElement = requestElement.querySelector('.urgency-tag');
            urgencyElement.classList.add(request.urgencia);
            
            // Imágenes (si existen)
            const imagesContainer = requestElement.querySelector('.request-images');
            if (request.fotos && request.fotos.length > 0) {
                request.fotos.forEach(foto => {
                    const img = document.createElement('img');
                    img.src = foto.url;
                    img.alt = `Foto de ${request.titulo}`;
                    imagesContainer.appendChild(img);
                });
            } else {
                imagesContainer.innerHTML = '<p class="no-images">No hay imágenes adjuntas</p>';
            }
            
            // Configurar botones
            requestElement.querySelector('.btn-offer').addEventListener('click', () => {
                openOfferModal(request.id);
            });
            
            requestElement.querySelector('.btn-details').addEventListener('click', () => {
                viewRequestDetails(request.id);
            });
            
            requestsList.appendChild(requestElement);
        });
    }

    // Abrir modal para hacer oferta
    function openOfferModal(requestId) {
        requestIdInput.value = requestId;
        offerModal.classList.add('show');
    }

    // Enviar oferta
    offerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const offerData = {
            solicitudId: requestIdInput.value,
            electricistaId: userId,
            precio: parseFloat(document.getElementById('offerAmount').value),
            tiempoEstimado: parseFloat(document.getElementById('offerTime').value),
            garantiaMeses: parseInt(document.getElementById('offerWarranty').value),
            descripcion: document.getElementById('offerDescription').value
        };

        try {
            const response = await fetch('/api/ofertas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(offerData)
            });

            if (!response.ok) {
                throw new Error('Error al enviar la oferta');
            }

            alert('¡Oferta enviada con éxito!');
            offerModal.classList.remove('show');
            offerForm.reset();
            loadActiveRequests();
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al enviar la oferta');
        }
    });

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
    applyFilters.addEventListener('click', () => {
        currentFilters = {
            serviceType: filterServiceType.value,
            urgency: filterUrgency.value,
            maxBudget: parseInt(filterBudget.value),
            searchQuery: currentFilters.searchQuery
        };
        applyCurrentFilters();
    });
    
    searchBtn.addEventListener('click', () => {
        currentFilters.searchQuery = searchInput.value.trim();
        applyCurrentFilters();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentFilters.searchQuery = searchInput.value.trim();
            applyCurrentFilters();
        }
    });
    
    refreshBtn.addEventListener('click', loadActiveRequests);
    
    resetFilters.addEventListener('click', () => {
        filterServiceType.value = 'TODOS';
        filterUrgency.value = 'TODAS';
        filterBudget.value = 1000;
        budgetMax.textContent = '$1000';
        searchInput.value = '';
        currentFilters = {
            serviceType: 'TODOS',
            urgency: 'TODAS',
            maxBudget: 1000,
            searchQuery: ''
        };
        applyCurrentFilters();
    });
    
    closeModal.addEventListener('click', () => {
        offerModal.classList.remove('show');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === offerModal) {
            offerModal.classList.remove('show');
        }
    });

    // Cargar datos iniciales
    loadActiveRequests();
});