document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar submenú al hacer clic en "Tablas"
    document.querySelectorAll('.sidebar-item.has-submenu').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            // Alternar clase active para mostrar/ocultar submenú
            this.classList.toggle('active');
            // Cerrar otros submenús si hay más de uno
            document.querySelectorAll('.sidebar-item.has-submenu').forEach(other => {
                if (other !== this) other.classList.remove('active');
            });
        });
    });

    // Navegación entre secciones
    document.querySelectorAll('.sidebar-item[data-section], .sidebar-subitem[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            // Quitar active de todos
            document.querySelectorAll('.sidebar-item, .sidebar-subitem').forEach(i => i.classList.remove('active'));
            // Si es subitem, marca también el padre como active
            if (this.classList.contains('sidebar-subitem')) {
                this.classList.add('active');
                this.closest('.sidebar-item').classList.add('active');
            } else {
                this.classList.add('active');
            }
            // Mostrar sección correspondiente
            const section = this.getAttribute('data-section');
            document.getElementById('main-title').textContent =
                section === 'dashboard' ? 'Dashboard'
                : section === 'usuarios' ? 'Usuarios'
                : section === 'solicitudes' ? 'Solicitudes'
                : '';
            document.getElementById('dashboard-section').style.display = section === 'dashboard' ? '' : 'none';
            document.getElementById('usuarios-section').style.display = section === 'usuarios' ? '' : 'none';
            document.getElementById('solicitudes-section').style.display = section === 'solicitudes' ? '' : 'none';
        });
    });
});