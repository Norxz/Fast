package com.fast.controller;

import com.fast.domain.Solicitud;
import com.fast.dto.SolicitudDTO;
import com.fast.service.SolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

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
    public ResponseEntity<Solicitud> aceptarSolicitud(@PathVariable Long id) {
        Solicitud solicitud = solicitudService.aceptarSolicitud(id);
        return ResponseEntity.ok(solicitud);
    }

}
