document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    cargarUsuarios();

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
    const usuarios = await res.json();
    const tbody = document.getElementById('usuariosTableBody');
    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.telefono || ''}</td>
            <td>${u.rol}</td>
            <td>${u.activo ? 'Activo' : '<span class="suspended">Suspendido</span>'}</td>
            <td>
                ${u.rol === 'ELECTRICISTA' ? (u.aprobado ? '<span class="approved">Aprobado</span>' : '<button onclick="aprobarElectricista(' + u.id + ')">Aprobar</button>') : ''}
            </td>
            <td>
                <button class="btn-action btn-edit" data-id="${u.id}">Editar</button>
                <button class="btn-action ${u.activo ? 'btn-suspend' : 'btn-activate'}" onclick="toggleActivo(${u.id}, ${u.activo})">${u.activo ? 'Suspender' : 'Activar'}</button>
                <button class="btn-action btn-delete" onclick="eliminarUsuario(${u.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const user = usuarios.find(u => u.id == id);
            mostrarFormularioEditar(user);
        });
    });
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

async function aprobarElectricista(id) {
    const token = localStorage.getItem('token');
    await fetch(`https://fast-production-c604.up.railway.app/admin/aprobar-electricista?userId=${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    cargarUsuarios();
}

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}