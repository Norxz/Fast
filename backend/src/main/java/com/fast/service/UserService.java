package com.fast.service;

import com.fast.domain.Rol;
import com.fast.domain.User;
import com.fast.dto.UserRegisterDTO;
import com.fast.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

        Rol rol = Rol.valueOf(dto.getRol().toUpperCase());
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User user = new User(dto.getEmail(), encodedPassword, rol);
        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setTelefono(dto.getTelefono());
        user.setActivo(false);
        String code = UUID.randomUUID().toString();
        user.setVerificationCode(code);

        emailService.enviarCorreoVerificacion(user.getEmail(), code);
        return userRepository.save(user);

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

}
