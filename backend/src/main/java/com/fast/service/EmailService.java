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

    public void enviarCorreoVerificacion(String toEmail, String code) {
        String link = "http://localhost:5500/html/verificar.html?email=" + toEmail + "&code=" + code;
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(toEmail);
        mensaje.setSubject("Verifica tu cuenta");
        mensaje.setText("Haz clic en el siguiente enlace para verificar tu cuenta:\n" + link +
                "\n\nO ingresa este código en la página de verificación: " + code);
        mensaje.setFrom("andresespinosa156@gmail.com");
        mailSender.send(mensaje);
    }

}
