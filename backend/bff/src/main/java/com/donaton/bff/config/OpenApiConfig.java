package com.donaton.bff.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI bffOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Donaton - Backend for Frontend")
                        .description(
                                "API principal consumida por el frontend. Centraliza la comunicación con los microservicios de usuarios, autenticación, campañas y donaciones."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo Donaton")
                        )
                )
                .addSecurityItem(
                        new SecurityRequirement().addList(SECURITY_SCHEME)
                )
                .components(
                        new Components().addSecuritySchemes(
                                SECURITY_SCHEME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        )
                );
    }
}