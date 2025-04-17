document.getElementById("solicitudForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const presupuesto = document.getElementById("presupuesto").value;
  
    const token = localStorage.getItem("jwt"); // Asegúrate de guardar el token después del login
  
    const data = {
      titulo,
      descripcion,
      presupuesto: presupuesto ? parseFloat(presupuesto) : null
    };
  
    try {
      const response = await fetch("http://localhost:8080/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        document.getElementById("mensaje").innerText = "Solicitud creada con éxito";
        document.getElementById("solicitudForm").reset();
      } else {
        const error = await response.text();
        document.getElementById("mensaje").innerText = "Error: " + error;
      }
    } catch (err) {
      console.error(err);
      document.getElementById("mensaje").innerText = "Error de red o del servidor";
    }
  });
  