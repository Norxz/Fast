package com.fast.exception;

import io.swagger.v3.oas.annotations.tags.Tag;
/**
 * Excepción personalizada para errores al enviar correos electrónicos.
 */
public class EmailSendingException extends RuntimeException {

    public EmailSendingException(String message) {
        super(message);
    }

    public EmailSendingException(String message, Throwable cause) {
        super(message, cause);
    }
}
