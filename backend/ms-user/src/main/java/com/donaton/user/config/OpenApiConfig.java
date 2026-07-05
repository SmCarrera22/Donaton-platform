package com.donaton.user.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI userApi() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("Donaton - User Service API")
                                .description(
                                        "Microservicio encargado de gestionar usuarios del sistema Donaton"
                                )
                                .version("1.0.0")
                );
    }
}
