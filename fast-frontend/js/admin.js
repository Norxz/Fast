document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    // 1. Obtener usuarios
    let usuarios = [];
    try {
        const res = await fetch('https://fast-production-c604.up.railway.app/admin/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        usuarios = await res.json();
        // Filtrar para no contar admins
        const usuariosSinAdmin = usuarios.filter(u => u.rol !== 'ADMIN');
        document.getElementById('usuarios-count').textContent = usuariosSinAdmin.length;

        // Graficar usuarios por rol
        const clientes = usuariosSinAdmin.filter(u => u.rol === 'CLIENTE').length;
        const electricistas = usuariosSinAdmin.filter(u => u.rol === 'ELECTRICISTA').length;
        const ctxUsuarios = document.getElementById('usuariosChart').getContext('2d');
        new Chart(ctxUsuarios, {
            type: 'doughnut',
            data: {
                labels: ['Clientes', 'Electricistas'],
                datasets: [{
                    data: [clientes, electricistas],
                    backgroundColor: ['#0984e3', '#fdcb6e']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    } catch (e) {
        document.getElementById('usuarios-count').textContent = '0';
    }

    // 2. Obtener solicitudes
    try {
        const res = await fetch('https://fast-production-c604.up.railway.app/solicitudes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const solicitudes = await res.json();
        document.getElementById('solicitudes-count').textContent = solicitudes.length;

        // Graficar solicitudes por estado
        const estados = ['PENDIENTE', 'ASIGNADA', 'FINALIZADA', 'CANCELADA'];
        const counts = estados.map(estado =>
            solicitudes.filter(s => s.estado === estado).length
        );
        const ctxSolicitudes = document.getElementById('solicitudesChart').getContext('2d');
        new Chart(ctxSolicitudes, {
            type: 'bar',
            data: {
                labels: estados,
                datasets: [{
                    label: 'Solicitudes',
                    data: counts,
                    backgroundColor: ['#00b894', '#0984e3', '#fdcb6e', '#d63031']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (e) {
        document.getElementById('solicitudes-count').textContent = '0';
    }

    cargarUsuarios();
    cargarSolicitudes();

    document.getElementById('agregarUsuarioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            password: document.getElementById('password').value,
            rol: document.getElementById('rol').value
        };
        await fetch('https://fast-production-c604.up.railway.app/admin/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        });
        ocultarFormularioAgregar();
        cargarUsuarios();
    });

    document.getElementById('editarUsuarioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const user = {
            nombre: document.getElementById('editNombre').value,
            email: document.getElementById('editEmail').value,
            telefono: document.getElementById('editTelefono').value,
            rol: document.getElementById('editRol').value
        };
        await fetch(`https://fast-production-c604.up.railway.app/admin/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        });
        ocultarFormularioEditar();
        cargarUsuarios();
    });
});

async function cargarUsuarios() {
    const token = localStorage.getItem('token');
    const res = await fetch('https://fast-production-c604.up.railway.app/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    let usuarios = await res.json();

    // Obtener valores de los filtros
    const rol = document.getElementById('filterRol').value;
    const activo = document.getElementById('filterActivo').value;
    const aprobado = document.getElementById('filterAprobado').value;

    // Filtrar por rol
    if (rol) {
        usuarios = usuarios.filter(u => u.rol === rol);
    }
    // Filtrar por estado activo
    if (activo) {
        usuarios = usuarios.filter(u => String(u.activo) === activo);
    }
    // Filtrar por aprobado (solo para electricistas)
    if (aprobado) {
        usuarios = usuarios.filter(u => u.rol === "ELECTRICISTA" && String(u.aprobado) === aprobado);
    }

    const tbody = document.getElementById('usuariosTableBody');
    tbody.innerHTML = usuarios.map(u => {
        // Estado badge
        const estadoBadge = u.activo
            ? '<span class="status-badge status-activo">Activo</span>'
            : '<span class="status-badge status-suspendido">Suspendido</span>';

        // Aprobado badge o botón
        let aprobadoCell = '';
        if (u.rol === 'ELECTRICISTA') {
            aprobadoCell = u.aprobado
                ? '<span class="status-badge status-aprobado">Aprobado</span>'
                : `<button class="btn-action btn-edit" onclick="aprobarElectricista(${u.id})">Aprobar</button>`;
        }

        // Acciones
        const acciones = `
            <button class="btn-action btn-edit" data-id="${u.id}">Editar</button>
            <button class="btn-action ${u.activo ? 'btn-suspend' : 'btn-activate'}" onclick="toggleActivo(${u.id}, ${u.activo})">${u.activo ? 'Suspender' : 'Activar'}</button>
            <button class="btn-action btn-delete" onclick="eliminarUsuario(${u.id})">Eliminar</button>
        `;

        return `
            <tr>
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.telefono || ''}</td>
                <td>${u.rol}</td>
                <td>${estadoBadge}</td>
                <td>${aprobadoCell}</td>
                <td>${acciones}</td>
            </tr>
        `;
    }).join('');

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const user = usuarios.find(u => u.id == id);
            mostrarFormularioEditar(user);
        });
    });
}

async function cargarSolicitudes() {
    const token = localStorage.getItem('token');
    const res = await fetch('https://fast-production-c604.up.railway.app/solicitudes', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const solicitudes = await res.json();

    const tbody = document.getElementById('solicitudesTableBody');
    tbody.innerHTML = solicitudes.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.categoria}</td>
            <td>${s.descripcion}</td>
            <td>${s.estado}</td>
            <td>${s.fecha_creacion ? s.fecha_creacion.substring(0, 10) : ''}</td>
            <td>${s.presupuesto ?? ''}</td>
            <td>${s.titulo ?? ''}</td>
            <td>${s.ubicacion ?? ''}</td>
            <td>${s.comprador_id ?? ''}</td>
            <td>${s.electricista_id ?? ''}</td>
        </tr>
    `).join('');
}

function mostrarFormularioAgregar() {
    document.getElementById('formAgregar').style.display = 'block';
}
function ocultarFormularioAgregar() {
    document.getElementById('formAgregar').style.display = 'none';
}
function mostrarFormularioEditar(user) {
    document.getElementById('editId').value = user.id;
    document.getElementById('editNombre').value = user.nombre;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editTelefono').value = user.telefono || '';
    document.getElementById('editRol').value = user.rol;
    document.getElementById('formEditar').style.display = 'block';
}
function ocultarFormularioEditar() {
    document.getElementById('formEditar').style.display = 'none';
}

async function toggleActivo(id, activo) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8080/admin/usuarios/${id}/activo`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !activo })
    });
    cargarUsuarios();
}

async function eliminarUsuario(id) {
    const token = localStorage.getItem('token');
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    await fetch(`https://fast-production-c604.up.railway.app/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    cargarUsuarios();
}

// Agrega el evento para el botón de filtrar
document.getElementById('btnFiltrar').addEventListener('click', cargarUsuarios);

// Opcional: recargar automáticamente al cambiar un filtro
['filterRol', 'filterActivo', 'filterAprobado'].forEach(id => {
    document.getElementById(id).addEventListener('change', cargarUsuarios);
});

document.getElementById('filterRol').addEventListener('change', function() {
    const rol = this.value;
    const aprobadoContainer = document.getElementById('aprobadoFilterContainer');
    if (rol === 'ELECTRICISTA') {
        aprobadoContainer.style.display = '';
    } else {
        aprobadoContainer.style.display = 'none';
        document.getElementById('filterAprobado').value = '';
    }
    cargarUsuarios();
});

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

async function aprobarElectricista(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`https://fast-production-c604.up.railway.app/admin/aprobar-electricista?userId=${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        cargarUsuarios();
    } else {
        alert('No se pudo aprobar al electricista.');
    }
}