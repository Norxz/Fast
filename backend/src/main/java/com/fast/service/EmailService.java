package com.fast.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.fast.domain.Solicitud;

import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.internet.MimeMessage;

@Tag(name = "Email Service", description = "Servicio para enviar correos electrónicos")
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
        String link = "https://serviexpress.vercel.app/verificar.html?email=" + toEmail + "&code=" + code;
        String htmlMsg = "<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>"
                + "<a href=\"" + link + "\">Haz clic aquí para verificar tu cuenta</a>"
                + "<p>O ingresa este código en la página de verificación: <b>" + code + "</b></p>";

        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Verifica tu cuenta");
            helper.setText(htmlMsg, true); // true para HTML
            helper.setFrom("andresespinosa156@gmail.com");
            mailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo de verificación: " + e.getMessage());
        }
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

    public void enviarCorreoSolicitudCreada(String toEmail, Solicitud solicitud) {
        String htmlMsg = "<p>¡Tu solicitud ha sido registrada!</p>"
            + "<p><b>Título:</b> " + solicitud.getTitulo() + "</p>"
            + "<p><b>Descripción:</b> " + solicitud.getDescripcion() + "</p>"
            + "<p>Te avisaremos cuando un electricista acepte tu solicitud.</p>";
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Solicitud registrada en ServiExpress");
            helper.setText(htmlMsg, true);
            helper.setFrom("andresespinosa156@gmail.com");
            mailSender.send(mensaje);
        } catch (Exception e) {
            // Manejo de error
        }
    }

    public void enviarCorreoElectricistaAsignado(String toEmail, String nombreElectricista, Solicitud solicitud) {
        String htmlMsg = "<p>¡Un electricista ha aceptado tu solicitud!</p>"
            + "<p><b>Electricista:</b> " + nombreElectricista + "</p>"
            + "<p><b>Servicio:</b> " + solicitud.getTitulo() + "</p>"
            + "<p>Pronto se pondrá en contacto contigo.</p>";
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("¡Un electricista ha aceptado tu solicitud!");
            helper.setText(htmlMsg, true);
            helper.setFrom("andresespinosa156@gmail.com");
            mailSender.send(mensaje);
        } catch (Exception e) {
            // Manejo de error
        }
    }

}
