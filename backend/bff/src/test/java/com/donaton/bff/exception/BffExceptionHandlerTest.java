package com.donaton.bff.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import static org.junit.jupiter.api.Assertions.*;

class BffExceptionHandlerTest {

    private BffExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new BffExceptionHandler();
    }

    @Test
    void shouldHandleClientError() {
        HttpClientErrorException exception =
                HttpClientErrorException.create(
                        HttpStatus.NOT_FOUND,
                        "Not Found",
                        null,
                        null,
                        null
                );

        ResponseEntity<ApiError> response =
                handler.handleClientError(exception);

        assertEquals(
                HttpStatus.NOT_FOUND,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                "bff",
                response.getBody().service()
        );

        assertEquals(
                "Error en microservicio downstream",
                response.getBody().message()
        );

        assertEquals(
                404,
                response.getBody().status()
        );

        assertNotNull(
                response.getBody().timestamp()
        );
    }

    @Test
    void shouldHandleServerError() {
        HttpServerErrorException exception =
                HttpServerErrorException.create(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Service Unavailable",
                        null,
                        null,
                        null
                );

        ResponseEntity<ApiError> response =
                handler.handleServerError(exception);

        assertEquals(
                HttpStatus.INTERNAL_SERVER_ERROR,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                "Error interno en comunicación con microservicio",
                response.getBody().message()
        );

        assertEquals(
                500,
                response.getBody().status()
        );
    }

    @Test
    void shouldHandleGenericError() {
        RuntimeException exception =
                new RuntimeException(
                        "Error inesperado"
                );

        ResponseEntity<ApiError> response =
                handler.handleGeneric(exception);

        assertEquals(
                HttpStatus.INTERNAL_SERVER_ERROR,
                response.getStatusCode()
        );

        assertNotNull(response.getBody());

        assertEquals(
                "Error inesperado",
                response.getBody().message()
        );

        assertEquals(
                "bff",
                response.getBody().service()
        );

        assertEquals(
                500,
                response.getBody().status()
        );
    }
}