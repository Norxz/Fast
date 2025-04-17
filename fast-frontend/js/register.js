document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;
  
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, rol })
    });
  
    const message = document.getElementById('message');
  
    if (response.ok) {
      const data = await response.text();
      message.innerText = `✅ ${data}`;
      message.style.color = 'green';
    } else {
      const errorText = await response.text();
      message.innerText = `❌ ${errorText}`;
      message.style.color = 'red';
    }
  });
  