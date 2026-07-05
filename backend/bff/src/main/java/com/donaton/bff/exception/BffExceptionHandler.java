package com.donaton.bff.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class BffExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ApiError> handleClientError(HttpClientErrorException ex) {

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(new ApiError(
                        "bff",
                        "Error en microservicio downstream",
                        ex.getStatusCode().value(),
                        LocalDateTime.now()
                ));
    }

    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<ApiError> handleServerError(HttpServerErrorException ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(
                        "bff",
                        "Error interno en comunicación con microservicio",
                        500,
                        LocalDateTime.now()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(
                        "bff",
                        ex.getMessage(),
                        500,
                        LocalDateTime.now()
                ));
    }
}