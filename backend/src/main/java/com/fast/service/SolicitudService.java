package com.fast.service;

import com.fast.domain.Solicitud;
import com.fast.dto.SolicitudDTO;
import com.fast.repository.SolicitudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    public Solicitud crear(SolicitudDTO dto) {
        Solicitud solicitud = new Solicitud(
                dto.getTitulo(),
                dto.getDescripcion(),
                dto.getCategoria(),
                dto.getCompradorId());
        solicitud.setUbicacion(dto.getUbicacion());
        solicitud.setEstado("PENDIENTE");
        solicitud.setFechaServicio(dto.getFechaServicio());
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

    public Solicitud aceptarSolicitud(Long id, Long electricistaId) {
        Solicitud solicitud = solicitudRepository.findById(id).orElseThrow();
        solicitud.setEstado("ASIGNADA");
        solicitud.setElectricistaId(electricistaId);
        return solicitudRepository.save(solicitud);
    }

    public List<Solicitud> obtenerPorElectricista(Long electricistaId) {
        return solicitudRepository.findByElectricistaIdAndEstadoIn(
                electricistaId, List.of("ASIGNADA", "TERMINADA"));
    }

    public Optional<Solicitud> finalizarServicio(Long id, BigDecimal precio) {
        Optional<Solicitud> opt = solicitudRepository.findById(id);
        if (opt.isPresent()) {
            Solicitud solicitud = opt.get();
            if ("ASIGNADA".equals(solicitud.getEstado())) {
                solicitud.setEstado("FINALIZADA");
                solicitud.setPrecioCobrador(precio);
                solicitudRepository.save(solicitud);
                return Optional.of(solicitud);
            }
        }
        return Optional.empty();
    }
}
