package com.fast.security;

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
