package com.fast.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "solicitudes")
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private String categoria;

    private Long compradorId;

    private String estado;

    private String ubicacion;

    private Long electricistaId;

    @Column(name = "fecha_creacion")
    private LocalDate fechaServicio;

    private BigDecimal precioCobrador;

    public Solicitud() {
    }

    public Solicitud(String titulo, String descripcion, String categoria, Long compradorId) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.compradorId = compradorId;
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

    public Long getCompradorId() {
        return compradorId;
    }

    public void setCompradorId(Long compradorId) {
        this.compradorId = compradorId;
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

    public Long getElectricistaId() {
        return electricistaId;
    }

    public void setElectricistaId(Long electricistaId) {
        this.electricistaId = electricistaId;
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
    
    

}
