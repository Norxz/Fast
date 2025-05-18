package com.fast.controller;


import com.fast.domain.User;
import com.fast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdmindController {

    private  final UserService userService;

    @Autowired
    public AdmindController(UserService userService) {
        this.userService = userService;
    }

    // 1. Listar usuarios
    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> listarUsuarios() {
        return ResponseEntity.ok(userService.obtenerTodosLosUsuarios());
    }

    // 2. Suspender o activar usuario
    @PutMapping("/usuarios/{id}/suspender")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> suspenderUsuario(@PathVariable Long id) {
        userService.toggleActivo(id);
        return ResponseEntity.ok("Estado cambiado");
    }

    // 3. Eliminar usuario
    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        userService.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado");
    }

}
