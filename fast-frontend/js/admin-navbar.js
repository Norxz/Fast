document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar-item, .sidebar-subitem').forEach(item => {
        item.addEventListener('click', function() {
            // Quitar active de todos
            document.querySelectorAll('.sidebar-item, .sidebar-subitem').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
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
    // Ejemplo de gráfica
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
            datasets: [{
                label: 'Solicitudes',
                data: [12, 19, 3, 5],
                backgroundColor: '#0984e3'
            }]
        }
    });
});