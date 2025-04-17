import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
    
        const res = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          alert('Login fallido: ' + data.message);
        }
      };
    
      return (
        <form onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit">Entrar</button>
        </form>
      );
}

export default Login;