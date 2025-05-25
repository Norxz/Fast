package com.fast.controller;

import com.fast.domain.User;
import com.fast.dto.UserLoginDTO;
import com.fast.dto.UserRegisterDTO;
import com.fast.exception.EmailAlreadyExistsException;
import com.fast.security.AutenticacionService;
import com.fast.security.TokenService;
import com.fast.security.DatosJWTToken;
import com.fast.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AutenticacionService autenticacionService;
    private final UserService userService;

    @Autowired
    public AuthController(UserService userService, AutenticacionService autenticacionService) {
        this.autenticacionService = autenticacionService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid UserRegisterDTO dto) {
        try {
            User user = autenticacionService.registrarUsuario(dto);
            return ResponseEntity.ok("Usuario registrado con ID: " + user.getId());
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String email, @RequestParam String code) {
        User user = userService.findByEmail(email);
        if (user != null && code.equals(user.getVerificationCode())) {
            user.setActivo(true);
            user.setVerificationCode(null);
            userService.save(user); 
            return ResponseEntity.ok("Cuenta verificada correctamente");
        }
        return ResponseEntity.badRequest().body("Código de verificación inválido");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginDTO dto) {
        try {
            String token = autenticacionService.login(dto);
            // Buscar el usuario por email
            User user = userService.findByEmail(dto.getEmail());
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "rol", user.getRol(),
                            "nombre", user.getNombre(),
                            "id", user.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userService.findByEmail(email);
        if (user == null) {
            // Por seguridad, responde igual aunque el usuario no exista
            return ResponseEntity.ok("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
        }
        // Aquí deberías generar un token/código y enviarlo por email
        userService.sendPasswordResetEmail(user);
        return ResponseEntity.ok("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        User user = userService.findByResetToken(token);
        if (user == null) {
            return ResponseEntity.badRequest().body("Token inválido o expirado.");
        }
        userService.updatePassword(user, newPassword);
        return ResponseEntity.ok("Contraseña actualizada correctamente.");
    }

}