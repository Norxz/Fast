# FAST - Subastas de Servicios en Tiempo Real 🚀

**FAST** es una plataforma de subastas en tiempo real donde los **clientes publican necesidades** y los **proveedores compiten** ofreciendo sus servicios al instante.

---

## ⚙️ Tecnologías Usadas

### Backend
- Java 21
- Spring Boot
- Spring Security (JWT)
- MySQL
- JPA / Hibernate

### Frontend
- React.js

### Infraestructura
- WebSockets (Socket.io)
- Redis
- HTTPS / SSH
- Postman (para pruebas de API)
- Vercel (Frontend) 

---

## 🔐 Seguridad

- Autenticación JWT
- Roles: `ADMIN`, `PROVEEDOR`, `CLIENTE`
- Filtros personalizados
- Cifrado de contraseñas con BCrypt

---

## 🧠 Arquitectura

```bash
📦 fast
├── controller
├── domain
├── dto
├── exception
├── repository
├── security
│   └── config
├── service
├── util
└── websocket
```

---

👨‍💻 Autor

- **Norxz**  
  GitHub: [@Norxz](https://github.com/Norxz)
