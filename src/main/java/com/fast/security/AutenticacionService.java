package com.fast.security;

import com.fast.domain.Rol;
import com.fast.dto.UserLoginDTO;
import com.fast.dto.UserRegisterDTO;
import com.fast.exception.EmailAlreadyExistsException;
import com.fast.repository.UserRepository;
import com.fast.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacionService implements UserDetailsService {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AutenticacionService(
            AuthenticationConfiguration authenticationConfiguration,
            UserRepository userRepository,
            TokenService tokenService,
            PasswordEncoder passwordEncoder
    ) throws Exception {
        this.authenticationConfiguration = authenticationConfiguration;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    public User registrarUsuario(UserRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El correo ya está en uso.");
        }

        User newUser = new User();
        newUser.setEmail(dto.getEmail());
        newUser.setPassword(passwordEncoder.encode(dto.getPassword()));

        try {
            newUser.setRol(Rol.valueOf(dto.getRol()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido proporcionado");
        }

        return userRepository.save(newUser);
    }

    public String login(UserLoginDTO dto) {
        try {
            AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();
            Authentication auth = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
            authenticationManager.authenticate(auth);

            User user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            return tokenService.getToken(user);
        } catch (Exception e) {
            throw new RuntimeException("Error durante autenticación", e);
        }
    }

}