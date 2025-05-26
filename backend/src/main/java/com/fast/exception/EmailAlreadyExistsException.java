package com.fast.exception;

import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Excepción personalizada para manejar errores de autenticación.
 * Esta excepción se lanza cuando hay problemas durante el proceso de
 * autenticación del usuario.
 */
@Tag(name = "Excepciones", description = "Excepción personalizada para errores de autenticación")
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String message) {
        super(message);
    }

}
