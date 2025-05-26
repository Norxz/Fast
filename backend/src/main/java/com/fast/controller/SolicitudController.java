package com.fast.controller;

import com.fast.domain.Solicitud;
import com.fast.domain.User;
import com.fast.dto.SolicitudDTO;
import com.fast.service.SolicitudService;
import com.fast.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import com.fast.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "Solicitudes", description = "Endpoints para crear, listar, aceptar y finalizar solicitudes de servicio")
@RestController
@RequestMapping("/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Solicitud> crearSolicitud(@RequestBody SolicitudDTO dto) {
        Solicitud solicitud = solicitudService.crear(dto);
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping
    public ResponseEntity<List<Solicitud>> obtenerSolicitudes() {
        List<Solicitud> lista = solicitudService.obtenerTodas();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('ELECTRICISTA')")
    public ResponseEntity<List<Solicitud>> obtenerSolicitudesDisponibles() {
        List<Solicitud> lista = solicitudService.obtenerDisponibles();
        return ResponseEntity.ok(lista);
    }


    @PostMapping("/{id}/aceptar")
    @PreAuthorize("hasRole('ELECTRICISTA')")
    public ResponseEntity<Solicitud> aceptarSolicitud(@PathVariable Long id, @RequestParam Long electricistaId) {
        Solicitud solicitud = solicitudService.aceptarSolicitud(id, electricistaId);
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping("/mis-servicios/{electricistaId}")
    @PreAuthorize("hasRole('ELECTRICISTA')")
    public ResponseEntity<List<Solicitud>> obtenerServiciosElectricista(@PathVariable Long electricistaId) {
        List<Solicitud> lista = solicitudService.obtenerPorElectricista(electricistaId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/mis-solicitudes/{compradorId}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<Solicitud>> obtenerSolicitudesComprador(@PathVariable Long compradorId) {
        List<Solicitud> lista = solicitudService.obtenerPorComprador(compradorId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/usuarios/{id}/contacto")
    public ResponseEntity<Map<String, String>> obtenerContactoUsuario(@PathVariable Long id) {
        User user = userService.findById(id);
        Map<String, String> contacto = new HashMap<>();
        contacto.put("email", user.getEmail());
        contacto.put("telefono", user.getTelefono());
        return ResponseEntity.ok(contacto);
    }

    @PostMapping("/{id}/finalizar")
    @PreAuthorize("hasRole('ELECTRICISTA')")
    public ResponseEntity<?> finalizarServicio(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            BigDecimal precio = new BigDecimal(body.get("precio").toString());
            // Finaliza el servicio y obtiene la solicitud actualizada
            var optionalSolicitud = solicitudService.finalizarServicio(id, precio);
            if (optionalSolicitud.isEmpty()) {
                return ResponseEntity.badRequest().body("No se pudo finalizar el servicio");
            }
            Solicitud solicitud = optionalSolicitud.get();

            // Datos para el correo
            String emailCliente = solicitud.getCliente().getEmail();
            String nombreCliente = solicitud.getCliente().getNombre();
            String emailElectricista = solicitud.getElectricista().getEmail();
            String nombreElectricista = solicitud.getElectricista().getNombre();

            String ubicacion = solicitud.getUbicacion() != null ? solicitud.getUbicacion() : "No registrada";
            String telefonoElectricista = solicitud.getElectricista().getTelefono();
            String telefonoCliente = solicitud.getCliente().getTelefono();

            // Información para el cliente (sobre el electricista)
            String datosElectricista = "Ubicación del servicio: " + ubicacion +
                    "\nTeléfono: " + telefonoElectricista +
                    "\nValor cobrado: $" + precio;

            // Información para el electricista (sobre el cliente)
            String datosCliente = "Ubicación del servicio: " + ubicacion +
                    "\nTeléfono: " + telefonoCliente +
                    "\nValor cobrado: $" + precio;

            // Correo para el cliente (info del electricista)
            emailService.enviarCorreoConFactura(
                    emailCliente,
                    "¡Servicio completado! Gracias por usar ServiExpress",
                    "Adjuntamos la factura de tu servicio. Gracias por confiar en nosotros.",
                    "Electricista: " + nombreElectricista + "\n" + datosElectricista
            );
            // Correo para el electricista (info del cliente)
            emailService.enviarCorreoConFactura(
                    emailElectricista,
                    "¡Servicio completado! Gracias por usar ServiExpress",
                    "Adjuntamos la factura de tu servicio. Gracias por tu trabajo.",
                    "Cliente: " + nombreCliente + "\n" + datosCliente
            );

            return ResponseEntity.ok(solicitud);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al finalizar el servicio");
        }
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<?> cancelarSolicitud(@PathVariable Long id) {
        try {
            boolean exito = solicitudService.cancelarSolicitud(id);
            if (!exito) {
                return ResponseEntity.badRequest().body("No se pudo cancelar la solicitud");
            }
            return ResponseEntity.ok().body("Solicitud cancelada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cancelar la solicitud");
        }
    }
}
