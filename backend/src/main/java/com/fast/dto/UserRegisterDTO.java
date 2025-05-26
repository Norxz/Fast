package com.fast.dto;

import com.fast.domain.Rol;
import jakarta.validation.constraints.*;

import io.swagger.v3.oas.annotations.tags.Tag;
/**
 * DTO para el registro de un nuevo usuario en la plataforma.
 * Incluye validaciones para los campos requeridos.
 */
@Tag(name = "Registro", description = "Solicitud de registro de un nuevo usuario en la plataforma")
public class UserRegisterDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @NotBlank(message = "El rol es obligatorio")
    private String rol;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    public UserRegisterDTO() {
    }

    public UserRegisterDTO(String email, String password, String rol, String nombre, String apellido, String telefono) {
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

}
