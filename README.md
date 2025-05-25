# ServiExpress - Servicios en Tiempo Real 🚀



---

## ⚙️ Tecnologías Usadas

### Backend
- Java 21
- Spring Boot
- Spring Security (JWT)
- MySQL
- JPA / Hibernate

### Frontend
- HTML
- CSS
- JavaScript

### Infraestructura
- Postman (para pruebas de API)

---

## 🔐 Seguridad

- Autenticación JWT
- Roles: `ADMIN`, `ELECTRICISTA`, `CLIENTE`
- Filtros personalizados
- Cifrado de contraseñas con BCrypt

---

## 🧠 Arquitectura

```bash
backend/
│
├── src/main/java/com/fast/
│   ├── domain/
│   │   ├── Solicitud.java 
|   |   ├── Rol.java 
|   |   └── User.java       
│   ├── dto/
│   │   ├── SolicitudDTO.java   
│   │   ├── UserRegisterDTO.java
|   |   ├── UserLoginDTO.java
|   |   └── LoginRequest.java
│   ├── repository/
│   │   ├── SolicitudRepository.java 
│   │   └── UserRepository.java 
│   ├── service/
│   │   ├── SolicitudService.java    
│   │   ├── EmailService.java   
│   │   └── UserService.java     
│   ├── controller/
│   │   ├── SolicitudController.java
│   │   ├── AdminController.java
│   │   └── AuthController.java
│   │
│   ├── exception/
│   │   ├── AuthenticationException.java
│   │   ├── EmailAlreadyExistException.java
│   │   └── GlobalExceptionHandler.java
│   │
│   │
│   ├── security/
│   │   ├── config/
│   │   │       └── WebSecurityConfig.java
│   │   │
│   │   ├── AutenticacionService.java
│   │   ├── DatosJWTToken.java
│   │   ├── SecurityFilter.java
│   │   └── TokenService.java
├── resources/
│   └── application.properties  
│
└── pom.xml


fast-frontend/
│
├── html/
│   ├── menu.html               
│   ├── login.html             
│   ├── register.html           
│   ├── solicitud.html          
│   ├── solicitudes.html        
│   ├── servicios.html          
│   ├── mis-servicios.html      
│   ├── admin.html              
│   └── verificar.html 
│ 
├── css/
│   ├── menu.css
│   ├── login.css
│   ├── register.css
│   ├── solicitud.css
│   ├── solicitudes.css
│   ├── servicios.css
│   ├── admin.css
│   └── solicitudesactivas.css
│
├── js/
│   ├── menu.js                 
│   ├── login.js                
│   ├── register.js             
│   ├── solicitud.js            
│   ├── solicitudes_cliente.js  
│   ├── solicitudes_electricista.js 
│   ├── mis_servicios_electricista.js 
│   └── admin.js   
│   └── verificar.js                
```

---

👨‍💻 Autor

- **Norxz**  
  GitHub: [@Norxz](https://github.com/Norxz)
