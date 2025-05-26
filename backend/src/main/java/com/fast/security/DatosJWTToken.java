package com.fast.security;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Seguridad", description = "Datos del token JWT para autenticación y autorización")
public class DatosJWTToken {

    private String jwTtoken;

    public DatosJWTToken(String jwTtoken) {
        this.jwTtoken = jwTtoken;
    }

    public String getJwTtoken() {
        return jwTtoken;
    }

    public void setJwTtoken(String jwTtoken) {
        this.jwTtoken = jwTtoken;
    }

}
