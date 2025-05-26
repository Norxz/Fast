package com.fast.domain;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Roles", description = "Enumeración de roles de usuario en la plataforma")
public enum Rol {

    ADMIN,
    ELECTRICISTA,
    CLIENTE

}
