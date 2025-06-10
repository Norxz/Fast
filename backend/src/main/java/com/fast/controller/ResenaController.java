package com.fast.controller;

import com.fast.domain.Resena;
import com.fast.domain.Solicitud;
import com.fast.domain.User;
import com.fast.service.ResenaService;
import com.fast.service.SolicitudService;
import com.fast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;
    @Autowired
    private UserService userService;
    @Autowired
    private SolicitudService solicitudService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> dejarResena(@RequestBody Map<String, Object> body) {
        Long solicitudId = Long.valueOf(body.get("solicitudId").toString());
        Integer estrellas = (Integer) body.get("estrellas");
        String comentario = (String) body.get("comentario");

        if (estrellas == null || estrellas < 1 || estrellas > 5 || comentario == null || comentario.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Debes dejar una reseña (estrellas y comentario).");
        }

        Solicitud solicitud = solicitudService.findById(solicitudId);
        if (solicitud == null || !solicitud.getEstado().equals("FINALIZADA")) {
            return ResponseEntity.badRequest().body("La solicitud no está finalizada o no existe.");
        }

        // NUEVA VALIDACIÓN: ¿Ya existe reseña para esta solicitud?
        if (!resenaService.obtenerPorSolicitud(solicitud).isEmpty()) {
            return ResponseEntity.badRequest().body("Ya has dejado una reseña para este servicio.");
        }

        Resena resena = new Resena();
        resena.setSolicitud(solicitud);
        resena.setCliente(solicitud.getCliente());
        resena.setElectricista(solicitud.getElectricista());
        resena.setEstrellas(estrellas);
        resena.setComentario(comentario);
        resenaService.guardarResena(resena);

        return ResponseEntity.ok("Reseña guardada correctamente.");
    }

    @GetMapping("/electricista/{id}")
    public List<Resena> getPorElectricista(@PathVariable Long id) {
        User electricista = userService.findById(id);
        return resenaService.obtenerPorElectricista(electricista);
    }

    @GetMapping("/cliente/{id}")
    public List<Resena> getPorCliente(@PathVariable Long id) {
        User cliente = userService.findById(id);
        return resenaService.obtenerPorCliente(cliente);
    }
}
