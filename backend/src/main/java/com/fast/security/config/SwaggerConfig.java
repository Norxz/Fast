package com.fast.security.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Fast API - Plataforma de Servicios en Tiempo Real")
                        .version("1.0.0")
                        .description("Documentación de la API para la plataforma Fast. Gestiona usuarios, solicitudes de servicios, y flujos de trabajo entre clientes y proveedores."));
    }
}