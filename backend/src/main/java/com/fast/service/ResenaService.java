package com.fast.service;

import com.fast.domain.Resena;
import com.fast.domain.User;
import com.fast.domain.Solicitud;
import com.fast.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResenaService {
    @Autowired
    private ResenaRepository resenaRepository;

    public Resena guardarResena(Resena resena) {
        return resenaRepository.save(resena);
    }

    public List<Resena> obtenerPorElectricista(User electricista) {
        return resenaRepository.findByElectricista(electricista);
    }

    public List<Resena> obtenerPorCliente(User cliente) {
        return resenaRepository.findByCliente(cliente);
    }

    public List<Resena> obtenerPorSolicitud(Solicitud solicitud) {
        return resenaRepository.findBySolicitud(solicitud);
    }
}