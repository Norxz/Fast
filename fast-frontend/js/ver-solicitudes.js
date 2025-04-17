document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("solicitudes-container");
    const token = localStorage.getItem("jwt");
  
    try {
      const response = await fetch("http://localhost:8080/solicitudes", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
  
      if (!response.ok) {
        container.innerHTML = "<p>Error al cargar las solicitudes.</p>";
        return;
      }
  
      const solicitudes = await response.json();
  
      if (solicitudes.length === 0) {
        container.innerHTML = "<p>No hay solicitudes disponibles por ahora.</p>";
        return;
      }
  
      solicitudes.forEach(solicitud => {
        const card = document.createElement("div");
        card.className = "solicitud-card";
        card.innerHTML = `
          <h3>${solicitud.titulo}</h3>
          <p>${solicitud.descripcion}</p>
          <p><strong>Presupuesto:</strong> ${solicitud.presupuesto ?? "No especificado"}</p>
          <button onclick="hacerOferta(${solicitud.id})">Ofertar</button>
        `;
        container.appendChild(card);
      });
  
    } catch (error) {
      console.error(error);
      container.innerHTML = "<p>Ocurrió un error al cargar las solicitudes.</p>";
    }
  });
  
  function hacerOferta(solicitudId) {
    alert("Aquí iría el formulario para ofertar en la solicitud #" + solicitudId);
    // Aquí luego puedes redirigir a otra página o abrir un modal
  }
  