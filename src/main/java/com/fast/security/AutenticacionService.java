package com.fast.security;

import com.fast.dto.UserRegisterDTO;
import com.fast.exception.EmailAlreadyExistsException;
import com.fast.repository.UserRepository;
import com.fast.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AutenticacionService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return user;
    }

    public User registrarUsuario(UserRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("El correo ya está en uso.");
        }

        User newUser = new User();
        newUser.setEmail(dto.getEmail());
        newUser.setPassword(dto.getPassword());
        newUser.setRol(dto.getRol());

        return userRepository.save(newUser);
    }

}