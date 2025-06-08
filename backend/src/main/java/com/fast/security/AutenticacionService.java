package com.fast.security;

import com.fast.domain.Rol;
import com.fast.dto.UserLoginDTO;
import com.fast.dto.UserRegisterDTO;
import com.fast.exception.EmailAlreadyExistsException;
import com.fast.repository.UserRepository;
import com.fast.domain.User;
import com.fast.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Tag(name = "Autenticación", description = "Servicio para manejar autenticación de usuarios")
@Service
public class AutenticacionService implements UserDetailsService {

    private UserService userService;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AutenticacionService(
            AuthenticationConfiguration authenticationConfiguration,
            UserRepository userRepository,
            TokenService tokenService,
            PasswordEncoder passwordEncoder,
            UserService userService) throws Exception {
        this.authenticationConfiguration = authenticationConfiguration;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    public User registrarUsuario(UserRegisterDTO dto) {
        return userService.register(dto);
    }

    public String login(UserLoginDTO dto) {
        try {
            AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();
            Authentication auth = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword());
            authenticationManager.authenticate(auth);

            User user = userRepository.findByEmail(dto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                    //Bloquea el login hasta que loa aprobemos ////////////////////////
            if (user.getRol() == Rol.ELECTRICISTA && !user.isAprobado()) {
                throw new RuntimeException("Tu cuenta de electricista aún no ha sido aprobada por un administrador.");
            }

            return tokenService.getToken(user);
        } catch (Exception e) {
            throw new RuntimeException("Error durante autenticación", e);
        }
    }

}