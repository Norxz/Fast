document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    // 1. Obtener usuarios
    let usuarios = [];
    try {
        const res = await fetch('https://fast-production-c604.up.railway.app/admin/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        usuarios = await res.json();
        // Mostrar el total de usuarios (incluyendo admins)
        document.getElementById('usuarios-count').textContent = usuarios.length;

        // Graficar usuarios por rol
        const clientes = usuarios.filter(u => u.rol === 'CLIENTE').length;
        const electricistas = usuarios.filter(u => u.rol === 'ELECTRICISTA').length;
        const admins = usuarios.filter(u => u.rol === 'ADMIN').length;
        const ctxUsuarios = document.getElementById('usuariosChart').getContext('2d');
        new Chart(ctxUsuarios, {
            type: 'doughnut',
            data: {
                labels: ['Clientes', 'Electricistas', 'Administradores'],
                datasets: [{
                    data: [clientes, electricistas, admins],
                    backgroundColor: ['#0984e3', '#fdcb6e', '#636e72']
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
        // Mostrar el total de solicitudes
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

    // --- Gráfica de solicitudes por mes ---
    try {
        const res = await fetch('https://fast-production-c604.up.railway.app/solicitudes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const solicitudes = await res.json();

        // Contar solicitudes por mes
        const meses = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];
        const solicitudesPorMes = Array(12).fill(0);
        solicitudes.forEach(s => {
            if (s.fecha_creacion) {
                const mes = new Date(s.fecha_creacion).getMonth();
                solicitudesPorMes[mes]++;
            }
        });

        const ctxMes = document.getElementById('solicitudesMesChart').getContext('2d');
        new Chart(ctxMes, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Solicitudes',
                    data: solicitudesPorMes,
                    backgroundColor: '#1abc9c',
                    borderRadius: 8,
                    barThickness: 24
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (e) {
        // Si hay error, no mostrar la gráfica
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
    let solicitudes = await res.json();

    // Obtener valores de los filtros
    const estadoFiltro = document.getElementById('filterEstadoSolicitud')?.value || '';
    const categoriaFiltro = document.getElementById('filterCategoriaSolicitud')?.value || '';

    // Filtrar solicitudes
    if (estadoFiltro) {
        solicitudes = solicitudes.filter(s => s.estado === estadoFiltro);
    }
    if (categoriaFiltro) {
        solicitudes = solicitudes.filter(s => s.categoria === categoriaFiltro);
    }

    const tbody = document.getElementById('solicitudesTableBody');
    tbody.innerHTML = solicitudes.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.categoria}</td>
            <td>${s.descripcion}</td>
            <td>
                <span class="status-badge status-${s.estado ? s.estado.toLowerCase() : ''}">
                    ${s.estado}
                </span>
            </td>
            <td>${s.fecha_creacion ? new Date(s.fecha_creacion).toLocaleDateString() : ''}</td>
            <td>${s.presupuesto ?? ''}</td>
            <td>${s.titulo ?? ''}</td>
            <td>${s.ubicacion ?? ''}</td>
            <td>${s.comprador?.nombre ?? (s.comprador_id ?? '')}</td>
            <td>${s.electricista?.nombre ?? (s.electricista_id ?? '')}</td>
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
document.getElementById('btnFiltrarSolicitudes').addEventListener('click', cargarSolicitudes);
document.getElementById('filterEstadoSolicitud').addEventListener('change', cargarSolicitudes);
document.getElementById('filterCategoriaSolicitud').addEventListener('change', cargarSolicitudes);

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

let chartGanancias = null;

async function cargarGraficaGanancias(filtro = 'semana') {
    const token = localStorage.getItem('token');
    const res = await fetch('https://fast-production-c604.up.railway.app/solicitudes', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const solicitudes = await res.json();

    // Solo solicitudes finalizadas y con precioCobrador
    const finalizadas = solicitudes.filter(s =>
        (s.estado === 'FINALIZADA' || s.estado === 'TERMINADA') &&
        (s.precioCobrador != null || s.precio_cobrador != null)
    );

    const hoy = new Date();
    let labels = [];
    let data = [];

    if (filtro === 'semana') {
        labels = [];
        data = [];
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() - i);
            const label = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
            labels.push(label);

            const total = finalizadas
                .filter(s => {
                    const fechaServicio = s.fechaServicio || s.fecha_servicio || s.fecha_creacion;
                    if (!fechaServicio) return false;
                    const f = new Date(fechaServicio);
                    return f.toDateString() === fecha.toDateString();
                })
                .reduce((sum, s) => sum + (s.precioCobrador ?? s.precio_cobrador ?? 0), 0);
            data.push(total);
        }
    } else if (filtro === 'mes') {
        const diasEnMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
        labels = [];
        data = [];
        for (let d = 1; d <= diasEnMes; d++) {
            labels.push(d.toString());
            const total = finalizadas
                .filter(s => {
                    const fechaServicio = s.fechaServicio || s.fecha_servicio || s.fecha_creacion;
                    if (!fechaServicio) return false;
                    const f = new Date(fechaServicio);
                    return f.getFullYear() === hoy.getFullYear() &&
                        f.getMonth() === hoy.getMonth() &&
                        f.getDate() === d;
                })
                .reduce((sum, s) => sum + (s.precioCobrador ?? s.precio_cobrador ?? 0), 0);
            data.push(total);
        }
    } else if (filtro === 'anio') {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        data = Array(12).fill(0);
        finalizadas.forEach(s => {
            const fechaServicio = s.fechaServicio || s.fecha_servicio || s.fecha_creacion;
            if (!fechaServicio) return;
            const f = new Date(fechaServicio);
            if (f.getFullYear() === hoy.getFullYear()) {
                data[f.getMonth()] += s.precioCobrador ?? s.precio_cobrador ?? 0;
            }
        });
    }

    if (chartGanancias) chartGanancias.destroy();

    const ctx = document.getElementById('gananciasChart').getContext('2d');
    chartGanancias = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Ganancias',
                data,
                backgroundColor: '#1abc9c',
                borderRadius: 8,
                barThickness: 24
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => '$' + value
                    }
                }
            }
        }
    });
}

// Listeners para los filtros
document.querySelectorAll('.filtro-ganancias').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filtro-ganancias').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        cargarGraficaGanancias(this.dataset.filtro);
    });
});

// Cargar por defecto la gráfica de la semana
cargarGraficaGanancias('semana');

document.getElementById('btnDescargarInforme').addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    // Obtener datos
    const [usuariosRes, solicitudesRes] = await Promise.all([
        fetch('https://fast-production-c604.up.railway.app/admin/usuarios', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://fast-production-c604.up.railway.app/solicitudes', { headers: { 'Authorization': `Bearer ${token}` } })
    ]);
    const usuarios = await usuariosRes.json();
    const solicitudes = await solicitudesRes.json();

    // Ganancias totales (solo solicitudes finalizadas)
    const ganancias = solicitudes
        .filter(s => (s.estado === 'FINALIZADA' || s.estado === 'TERMINADA') && (s.precioCobrador != null || s.precio_cobrador != null))
        .reduce((sum, s) => sum + (s.precioCobrador ?? s.precio_cobrador ?? 0), 0);

    // Usuarios resumen
    const usuariosResumen = [
        ['Total usuarios', usuarios.length],
        ['Clientes', usuarios.filter(u => u.rol === 'CLIENTE').length],
        ['Electricistas', usuarios.filter(u => u.rol === 'ELECTRICISTA').length],
        ['Administradores', usuarios.filter(u => u.rol === 'ADMIN').length]
    ];

    // Solicitudes resumen
    const estados = ['PENDIENTE', 'ASIGNADA', 'FINALIZADA', 'CANCELADA'];
    const solicitudesResumen = [
        ['Total solicitudes', solicitudes.length],
        ...estados.map(e => [e, solicitudes.filter(s => s.estado === e).length])
    ];

    // Hoja de usuarios (detallada)
    const usuariosSheet = [
        ['ID', 'Nombre', 'Email', 'Teléfono', 'Rol', 'Activo', 'Aprobado'],
        ...usuarios.map(u => [
            u.id, u.nombre, u.email, u.telefono, u.rol, u.activo ? 'Sí' : 'No', u.aprobado ? 'Sí' : (u.rol === 'ELECTRICISTA' ? 'No' : '')
        ])
    ];

    // Hoja de solicitudes (detallada)
    const solicitudesSheet = [
        ['ID', 'Categoría', 'Descripción', 'Estado', 'Fecha', 'Presupuesto', 'Precio Cobrado', 'Título', 'Ubicación'],
        ...solicitudes.map(s => [
            s.id, s.categoria, s.descripcion, s.estado,
            s.fecha_creacion ? new Date(s.fecha_creacion).toLocaleDateString() : '',
            s.presupuesto ?? '', s.precioCobrador ?? s.precio_cobrador ?? '',
            s.titulo ?? '', s.ubicacion ?? ''
        ])
    ];

    // Crear libro Excel
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Ganancias totales', ganancias]]), 'Ganancias');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(usuariosResumen), 'Resumen Usuarios');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(solicitudesResumen), 'Resumen Solicitudes');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(usuariosSheet), 'Usuarios');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(solicitudesSheet), 'Solicitudes');

    // Descargar
    XLSX.writeFile(wb, 'informe-fastadmin.xlsx');
});