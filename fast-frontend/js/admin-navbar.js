document.addEventListener('DOMContentLoaded', function() {
    // Sidebar submenu toggle
    document.querySelectorAll('.sidebar-item.has-submenu').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Sidebar navigation
    document.querySelectorAll('.sidebar-item[data-section], .sidebar-subitem[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            // Remove active from all
            document.querySelectorAll('.sidebar-item, .sidebar-subitem').forEach(i => i.classList.remove('active'));
            // Set active
            if (this.classList.contains('sidebar-subitem')) {
                this.classList.add('active');
                this.closest('.sidebar-item.has-submenu').classList.add('active');
            } else {
                this.classList.add('active');
            }
            // Show section
            const section = this.getAttribute('data-section');
            document.getElementById('dashboard-section').style.display = section === 'dashboard' ? '' : 'none';
            document.getElementById('usuarios-section').style.display = section === 'usuarios' ? '' : 'none';
            document.getElementById('solicitudes-section').style.display = section === 'solicitudes' ? '' : 'none';
        });
    });
});