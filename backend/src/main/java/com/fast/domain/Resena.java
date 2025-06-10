package com.fast.domain;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "resenas")
public class Resena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "solicitud_id", nullable = false)
    private Solicitud solicitud;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private User cliente;

    @ManyToOne
    @JoinColumn(name = "electricista_id", nullable = false)
    private User electricista;

    @Column(nullable = false)
    private int estrellas; // 1 a 5

    @Column(length = 1000)
    private String comentario;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha = new Date();

    public Resena() {
    }

    public Resena(Solicitud solicitud, User cliente, User electricista, int estrellas, String comentario) {
        this.solicitud = solicitud;
        this.cliente = cliente;
        this.electricista = electricista;
        this.estrellas = estrellas;
        this.comentario = comentario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Solicitud getSolicitud() {
        return solicitud;
    }

    public User getCliente() {
        return cliente;
    }

    public User getElectricista() {
        return electricista;
    }

    public int getEstrellas() {
        return estrellas;
    }

    public String getComentario() {
        return comentario;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setSolicitud(Solicitud solicitud) {
        this.solicitud = solicitud;
    }

    public void setCliente(User cliente) {
        this.cliente = cliente;
    }

    public void setElectricista(User electricista) {
        this.electricista = electricista;
    }

    public void setEstrellas(int estrellas) {
        this.estrellas = estrellas;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    
}
