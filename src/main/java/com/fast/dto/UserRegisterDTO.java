package com.fast.dto;

import com.fast.domain.Rol;


public class UserRegisterDTO {

    private String email;
    private String password;
    private Rol rol;

    public UserRegisterDTO() {}

    public UserRegisterDTO(String email, String password, Rol rol) {
        this.email = email;
        this.password = password;
        this.rol = rol;
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

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

}
