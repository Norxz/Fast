package com.fast.controller;

import com.fast.domain.Resena;
import com.fast.domain.User;
import com.fast.service.ResenaService;
import com.fast.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;
    @Autowired
    private UserService userService;

    @PostMapping
    public Resena crearResena(@RequestBody Resena resena) {
        // (Opcional: validar que la solicitud esté finalizada y que el cliente sea el correcto)
        return resenaService.guardarResena(resena);
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
