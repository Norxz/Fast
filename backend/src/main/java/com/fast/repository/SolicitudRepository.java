package com.fast.repository;

import com.fast.domain.Solicitud;
import com.fast.domain.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByEstado(String estado);
    List<Solicitud> findByCliente(User cliente);
    List<Solicitud> findByElectricistaAndEstadoIn(User electricista, List<String> estados);
}
