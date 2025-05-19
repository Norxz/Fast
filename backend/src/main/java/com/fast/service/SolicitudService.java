package com.fast.service;

import com.fast.domain.Solicitud;
import com.fast.dto.SolicitudDTO;
import com.fast.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    public Solicitud crear(SolicitudDTO dto) {
        Solicitud solicitud = new Solicitud(
                dto.getTitulo(),
                dto.getDescripcion(),
                dto.getCategoria(),
                dto.getCompradorId()
        );
        solicitud.setEstado("PENDIENTE"); // <-- importante
        return solicitudRepository.save(solicitud);
    }

    public List<Solicitud> obtenerTodas() {
        return solicitudRepository.findAll();
    }

    public List<Solicitud> obtenerDisponibles() {
        return solicitudRepository.findByEstado("PENDIENTE");
    }

    public List<Solicitud> obtenerPorComprador(Long compradorId) {
        return solicitudRepository.findByCompradorId(compradorId);
    }

    public Solicitud aceptarSolicitud(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id).orElseThrow();
        solicitud.setEstado("ASIGNADA");
        return solicitudRepository.save(solicitud);
    }
}
