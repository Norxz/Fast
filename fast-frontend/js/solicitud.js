document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Configurar fecha mínima como hoy
    const fechaInput = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;

    // Manejar selección de archivos
    const fileInput = document.getElementById('fotos');
    const fileNames = document.getElementById('fileNames');

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const names = Array.from(e.target.files).map(file => file.name);
            fileNames.textContent = `${e.target.files.length} archivo(s) seleccionado(s): ${names.join(', ')}`;
        } else {
            fileNames.textContent = 'No se han seleccionado archivos';
        }
    });

    // Manejar envío del formulario
    const serviceForm = document.getElementById('serviceForm');

    serviceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mostrar estado de carga
        const submitBtn = serviceForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // Obtener datos del formulario
        const formData = {
            titulo: document.getElementById('titulo').value,
            categoria: document.getElementById('tipoServicio').value,
            descripcion: document.getElementById('descripcion').value,
            presupuesto: parseFloat(document.getElementById('presupuesto').value) || 0,
            urgencia: document.getElementById('urgencia').value,
            fechaServicio: document.getElementById('fecha').value || null,
            ubicacion: document.getElementById('ubicacion').value,
            compradorId: parseInt(localStorage.getItem('userId')),
            fotos: [] // Aquí irían los archivos procesados
        };

        try {
            // Enviar datos al backend
            const response = await fetch('https://fast-production-c604.up.railway.app/solicitudes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar la solicitud');
            }

            // Éxito - redirigir
            alert('¡Solicitud enviada con éxito! Los electricistas podrán hacer sus propuestas.');
            window.location.href = 'menu.html';
            
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al enviar la solicitud');
            
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitud';
        }
    });

    // Validación en tiempo real
    const presupuestoInput = document.getElementById('presupuesto');
    presupuestoInput.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = 0;
        }
    });
});