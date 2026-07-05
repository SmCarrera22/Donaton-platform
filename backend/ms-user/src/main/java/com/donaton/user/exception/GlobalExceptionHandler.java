package com.donaton.user.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(
            ResourceNotFoundException ex
    ) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                404,
                "NOT_FOUND",
                ex.getMessage()
        );
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiError> handleRunTime(
            RuntimeException ex
    ) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                400,
                "BAD_REQUEST",
                ex.getMessage()
        );
        return ResponseEntity
                .badRequest()
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneral(
            Exception ex
    ) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                500,
                "INTERNAL_ERROR",
                "Error interno del servidor"
        );
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicate(
            DuplicateResourceException ex
    ) {
        ApiError error = new ApiError(
                LocalDateTime.now(),
                409,
                "CONFLICT",
                ex.getMessage()
        );
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error);
    }
}
