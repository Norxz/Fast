package com.fast.exception;

import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Excepción personalizada para manejar errores de autenticación.
 * Esta excepción se lanza cuando hay problemas durante el proceso de autenticación del usuario.
 */
@Tag(name = "Excepciones", description = "Manejo de excepciones personalizadas en la plataforma")
public class AuthenticationException extends RuntimeException{
    public AuthenticationException(String message) {
        super(message);
    }
}
