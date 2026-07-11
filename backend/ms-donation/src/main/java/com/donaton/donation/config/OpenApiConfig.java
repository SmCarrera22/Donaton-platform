package com.donaton.donation.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI donationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Donaton - Microservicio de Donaciones")
                        .description(
                                "API REST responsable del registro, consulta y gestión de las donaciones."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo Donaton")
                        )
                );
    }
}