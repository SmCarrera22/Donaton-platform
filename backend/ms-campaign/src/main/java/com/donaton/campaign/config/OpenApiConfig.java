package com.donaton.campaign.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI campaignOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Donaton - Microservicio de Campañas")
                        .description(
                                "API REST responsable de la publicación, consulta y administración de campañas solidarias."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo Donaton")
                        )
                );
    }
}