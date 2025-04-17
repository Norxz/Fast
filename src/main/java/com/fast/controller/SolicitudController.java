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

}
