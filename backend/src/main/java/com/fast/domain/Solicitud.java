package com.fast.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Solicitudes", description = "Entidad que representa una solicitud de servicio realizada por un cliente a un electricista")
@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private String categoria;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comprador_id")
    private User cliente;

    private String estado;

    private String ubicacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "electricista_id")
    private User electricista;

    @Column(name = "fecha_creacion")
    private LocalDate fechaServicio;

    private BigDecimal precioCobrador;

    private BigDecimal presupuesto;

    public Solicitud() {
    }

    public Solicitud(String titulo, String descripcion, String categoria, User cliente) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.cliente = cliente;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }


    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
    public User getCliente() {
        return cliente;
    }
    public void setCliente(User cliente) {
        this.cliente = cliente;
    }
    public User getElectricista() {
        return electricista;
    }
    public void setElectricista(User electricista) {
        this.electricista = electricista;
    }


    public LocalDate getFechaServicio() {
        return fechaServicio;
    }

    public BigDecimal getPrecioCobrador() {
        return precioCobrador;
    }

    public void setFechaServicio(LocalDate fechaServicio) {
        this.fechaServicio = fechaServicio;
    }

    public void setPrecioCobrador(BigDecimal precioCobrador) {
        this.precioCobrador = precioCobrador;
    }

    public BigDecimal getPresupuesto() {
        return presupuesto;
    }

    public void setPresupuesto(BigDecimal presupuesto) {
        this.presupuesto = presupuesto;
    }

}
