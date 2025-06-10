package com.fast.repository;

import com.fast.domain.Resena;
import com.fast.domain.User;
import com.fast.domain.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByElectricista(User electricista);
    List<Resena> findByCliente(User cliente);
    List<Resena> findBySolicitud(Solicitud solicitud);
}
