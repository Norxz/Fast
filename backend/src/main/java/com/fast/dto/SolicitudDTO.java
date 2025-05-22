package com.fast.dto;

import java.time.LocalDate;

public class SolicitudDTO {

    private String titulo;
    private String descripcion;
    private String categoria;
    private Long compradorId;
    private String ubicacion;
    private LocalDate fechaServicio;
    

    public SolicitudDTO() {
    }

    public SolicitudDTO(String titulo, String descripcion, String categoria, Long compradorId) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.compradorId = compradorId;
    }

    // Getters y Setters
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

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public LocalDate getFechaServicio() {
        return fechaServicio;
    }

    public void setFechaServicio(LocalDate fechaServicio) {
        this.fechaServicio = fechaServicio;
    }

}
