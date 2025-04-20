document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("jwt");
  
    if (!token) {
      alert("No tienes acceso");
      window.location.href = "login.html";
      return;
    }
  
    fetch("http://localhost:8080/admin/usuarios", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => mostrarUsuarios(data))
      .catch(err => {
        alert("Acceso denegado");
        console.error(err);
        window.location.href = "login.html";
      });
  });
  
  function mostrarUsuarios(usuarios) {
    const tbody = document.querySelector("#tabla-usuarios tbody");
    tbody.innerHTML = ""; // Limpia antes de mostrar
  
    usuarios.forEach(user => {
      const fila = document.createElement("tr");
  
      fila.innerHTML = `
        <td>${user.id}</td>
        <td>${user.email}</td>
        <td>${user.rol}</td>
        <td>${user.activo ? "✅" : "🚫"}</td>
        <td>
          <button onclick="toggleActivo(${user.id})">Suspender/Activar</button>
          <button onclick="eliminarUsuario(${user.id})">Eliminar</button>
        </td>
      `;
  
      tbody.appendChild(fila);
    });
  }
  
  function toggleActivo(userId) {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:8080/admin/usuarios/${userId}/suspender`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.text())
      .then(() => location.reload());
  }
  
  function eliminarUsuario(userId) {
    const confirmar = confirm("¿Estás seguro de eliminar este usuario?");
    if (!confirmar) return;
  
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:8080/admin/usuarios/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.text())
      .then(() => location.reload());
  }
  