package com.fast.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoConfirmacion(String toEmail) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(toEmail);
        mensaje.setSubject("Registro Exitoso");
        mensaje.setText("¡Hola! Te confirmamos que tu registro fue exitoso. Bienvenido a FAST 😄");
        mensaje.setFrom("andresespinosa156@gmail.com");

        mailSender.send(mensaje);
    }

}
