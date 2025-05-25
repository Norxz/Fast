package com.fast.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import jakarta.mail.internet.MimeMessage;

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

    public void enviarCorreoConFactura(String toEmail, String asunto, String cuerpo, String infoFactura)
            throws Exception {
        // Generar PDF en memoria
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);
        document.add(new Paragraph("Factura ServiExpress"));
        document.add(new Paragraph(infoFactura));
        document.close();

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true);
        helper.setTo(toEmail);
        helper.setSubject(asunto);
        helper.setText(cuerpo);
        helper.setFrom("andresespinosa156@gmail.com");
        helper.addAttachment("factura.pdf", new ByteArrayResource(baos.toByteArray()));

        mailSender.send(mensaje);
    }

    public void enviarCorreoRecuperacion(String toEmail, String subject, String body) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(toEmail);
        mensaje.setSubject(subject);
        mensaje.setText(body);
        mensaje.setFrom("andresespinosa156@gmail.com");
        mailSender.send(mensaje);
    }

}
