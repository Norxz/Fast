package com.fast.repository;

import com.fast.domain.Solicitud;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByEstado(String estado);
    List<Solicitud> findByCompradorId(Long compradorId);
    List<Solicitud> findByElectricistaIdAndEstadoIn(Long electricistaId, List<String> estados);
}
