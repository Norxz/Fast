package com.fast.controller;

import com.fast.domain.User;
import com.fast.dto.UserRegisterDTO;
import com.fast.exception.EmailAlreadyExistsException;
import com.fast.security.AutenticacionService;
import com.fast.security.TokenService;
import com.fast.security.DatosJWTToken;
import com.fast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> register(@RequestBody UserRegisterDTO dto) {
        try {
            User user = autenticacionService.registrarUsuario(dto);
            return ResponseEntity.ok("Usuario registrado con ID: " + user.getId());
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}