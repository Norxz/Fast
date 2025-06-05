package com.fast.controller;

import com.fast.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final EmailService emailService;

    @Autowired
    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/contacto")
    public ResponseEntity<?> contacto(@RequestBody Map<String, String> body) {
        String nombre = body.get("name");
        String email = body.get("email");
        String telefono = body.get("phone");
        String asunto = body.get("subject");
        String mensaje = body.get("message");
        emailService.enviarCorreoContacto(nombre, email, telefono, asunto, mensaje);
        return ResponseEntity.ok("Mensaje enviado correctamente");
    }
}
