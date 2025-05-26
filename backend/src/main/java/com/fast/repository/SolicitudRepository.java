package com.fast.repository;

import com.fast.domain.Solicitud;
import com.fast.domain.User;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Tag(name = "Solicitudes", description = "Repositorio para manejar solicitudes de servicio")
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByEstado(String estado);
    List<Solicitud> findByCliente(User cliente);
    List<Solicitud> findByElectricistaAndEstadoIn(User electricista, List<String> estados);
}
