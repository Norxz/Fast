package com.fast.controller;

import com.fast.domain.User;
import com.fast.domain.Rol;
import com.fast.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@Tag(name = "Administración de Usuarios", description = "Endpoints para crear, actualizar, eliminar y listar usuarios")
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    // 1. Listar usuarios
    @GetMapping("/usuarios")
    public ResponseEntity<List<User>> listarUsuarios() {
        return ResponseEntity.ok(userService.obtenerTodosLosUsuarios());
    }

    // 2. Crear usuario
    @PostMapping("/usuarios")
    public ResponseEntity<User> crearUsuario(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveAndReturn(user));
    }

    // 3. Editar usuario
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<User> editarUsuario(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.editarUsuario(id, user));
    }

    // 4. Suspender o activar usuario
    @PatchMapping("/usuarios/{id}/activo")
    public ResponseEntity<User> cambiarActivo(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean activo = body.getOrDefault("activo", true);
        return ResponseEntity.ok(userService.cambiarActivo(id, activo));
    }

    // 5. Eliminar usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        userService.eliminarUsuario(id);
        return ResponseEntity.ok("Usuario eliminado");
    }

    // 6. Aprobar electricistas
    @PostMapping("/aprobar-electricista")
    public ResponseEntity<?> aprobarElectricista(@RequestParam Long userId) {
        User user = userService.findById(userId);
        if (user == null || user.getRol() != Rol.ELECTRICISTA) {
            return ResponseEntity.badRequest().body("Usuario no encontrado o no es electricista.");
        }
        user.setAprobado(true);
        userService.save(user);
        // (Opcional) Notificar por correo la aprobación
        return ResponseEntity.ok("Electricista aprobado correctamente.");
    }
}