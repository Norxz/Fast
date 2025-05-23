package com.fast.service;

import com.fast.domain.Solicitud;
import com.fast.domain.User;
import com.fast.dto.SolicitudDTO;
import com.fast.repository.SolicitudRepository;
import com.fast.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class SolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private UserRepository userRepository; 

    public Solicitud crear(SolicitudDTO dto) {
        User cliente = userRepository.findById(dto.getCompradorId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Solicitud solicitud = new Solicitud(
                dto.getTitulo(),
                dto.getDescripcion(),
                dto.getCategoria(),
                cliente);
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
        User cliente = userRepository.findById(compradorId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return solicitudRepository.findByCliente(cliente);
    }

    public Solicitud aceptarSolicitud(Long id, Long electricistaId) {
        Solicitud solicitud = solicitudRepository.findById(id).orElseThrow();
        User electricista = userRepository.findById(electricistaId)
                .orElseThrow(() -> new RuntimeException("Electricista no encontrado"));
        solicitud.setEstado("ASIGNADA");
        solicitud.setElectricista(electricista);
        return solicitudRepository.save(solicitud);
    }

    public List<Solicitud> obtenerPorElectricista(Long electricistaId) {
        User electricista = userRepository.findById(electricistaId)
                .orElseThrow(() -> new RuntimeException("Electricista no encontrado"));
        return solicitudRepository.findByElectricistaAndEstadoIn(
                electricista, List.of("ASIGNADA", "TERMINADA"));
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
