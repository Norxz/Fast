package com.fast.controller;

import com.fast.domain.Solicitud;
import com.fast.domain.User;
import com.fast.dto.SolicitudDTO;
import com.fast.service.SolicitudService;
import com.fast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Solicitud> crearSolicitud(@RequestBody SolicitudDTO dto) {
        Solicitud solicitud = solicitudService.crear(dto);
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping
    public ResponseEntity<List<Solicitud>> obtenerSolicitudes() {
        List<Solicitud> lista = solicitudService.obtenerTodas();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<Solicitud>> obtenerSolicitudesDisponibles() {
        List<Solicitud> lista = solicitudService.obtenerDisponibles();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/mias/{compradorId}")
    public ResponseEntity<List<Solicitud>> obtenerSolicitudesCliente(@PathVariable Long compradorId) {
        List<Solicitud> lista = solicitudService.obtenerPorComprador(compradorId);
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/{id}/aceptar")
    public ResponseEntity<Solicitud> aceptarSolicitud(@PathVariable Long id, @RequestParam Long electricistaId) {
        Solicitud solicitud = solicitudService.aceptarSolicitud(id, electricistaId);
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping("/mis-servicios/{electricistaId}")
    public ResponseEntity<List<Solicitud>> obtenerServiciosElectricista(@PathVariable Long electricistaId) {
        List<Solicitud> lista = solicitudService.obtenerPorElectricista(electricistaId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/mis-solicitudes/{compradorId}")
    public ResponseEntity<List<Solicitud>> obtenerSolicitudesComprador(@PathVariable Long compradorId) {
        List<Solicitud> lista = solicitudService.obtenerPorComprador(compradorId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/usuarios/{id}/contacto")
    public ResponseEntity<Map<String, String>> obtenerContactoUsuario(@PathVariable Long id) {
        User user = userService.findById(id);
        Map<String, String> contacto = new HashMap<>();
        contacto.put("email", user.getEmail());
        contacto.put("telefono", user.getTelefono());
        return ResponseEntity.ok(contacto);
    }

}
