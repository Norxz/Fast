package com.fast.service;

import com.fast.domain.Rol;
import com.fast.domain.User;
import com.fast.dto.UserRegisterDTO;
import com.fast.repository.UserRepository;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Tag(name = "Usuarios", description = "Servicio para manejar usuarios del sistema")
@Service
public class UserService {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(EmailService emailService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(UserRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("El correo ya está en uso.");
        }
        try {
            Rol rol = Rol.valueOf(dto.getRol().toUpperCase());
            String encodedPassword = passwordEncoder.encode(dto.getPassword());

            User user = new User(dto.getEmail(), encodedPassword, rol);
            user.setNombre(dto.getNombre());
            user.setApellido(dto.getApellido());
            user.setTelefono(dto.getTelefono());
            user.setActivo(false);

            // Generar código de verificación y expiración
            String code = UUID.randomUUID().toString();
            user.setVerificationCode(code);
            user.setVerificationCodeExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000)); // 10 minutos

            // Guardar usuario
            userRepository.save(user);

            // Enviar correo de verificación
            emailService.enviarCorreoVerificacion(user.getEmail(), code);
            return user;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido: " + dto.getRol());
        } catch (Exception e) {
            throw new RuntimeException("Error inesperado en el registro: " + e.getMessage());
        }
    }

    public List<User> obtenerTodosLosUsuarios() {
        return userRepository.findAll();
    }

    public User saveAndReturn(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRol() == null) user.setRol(Rol.CLIENTE);
        user.setActivo(true);
        return userRepository.save(user);
    }

    public User editarUsuario(Long id, User datos) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setNombre(datos.getNombre());
        user.setEmail(datos.getEmail());
        user.setTelefono(datos.getTelefono());
        user.setRol(datos.getRol());
        return userRepository.save(user);
    }

    public User cambiarActivo(Long id, boolean activo) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setActivo(activo);
        return userRepository.save(user);
    }

    public void eliminarUsuario(Long id) {
        if (!userRepository.existsById(id)) throw new RuntimeException("Usuario no encontrado");
        userRepository.deleteById(id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public void sendPasswordResetEmail(User user) {
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        // Expira en 15 minutos (puedes ajustar el tiempo)
        user.setResetTokenExpiresAt(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
        userRepository.save(user);

        String resetLink = "https://serviexpress.vercel.app/reset-password.html?token=" + resetToken;
        emailService.enviarCorreoRecuperacion(user.getEmail(), user.getNombre(), resetLink);
    }

    public User findByResetToken(String token) {
        return userRepository.findByResetToken(token).orElse(null);
    }

    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null); // Limpia el token
        userRepository.save(user);
    }

    public void verificarCuenta(String email, String code) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.getVerificationCode() == null || user.getVerificationCodeExpiresAt() == null) {
            throw new RuntimeException("No hay código de verificación pendiente.");
        }

        if (!user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Código de verificación incorrecto.");
        }

        if (user.getVerificationCodeExpiresAt().before(new Date())) {
            throw new RuntimeException("El código de verificación ha expirado.");
        }

        // Si todo está bien, activa el usuario y limpia el código
        user.setActivo(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        userRepository.save(user);
    }

    public void reenviarCodigoVerificacion(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.isActivo()) {
            throw new RuntimeException("La cuenta ya está verificada.");
        }

        // Generar nuevo código y expiración
        String code = UUID.randomUUID().toString();
        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000)); // 10 minutos
        userRepository.save(user);

        // Enviar correo de verificación
        emailService.enviarCorreoVerificacion(user.getEmail(), code);
    }
}
