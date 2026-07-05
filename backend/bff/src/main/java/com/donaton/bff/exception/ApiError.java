package com.donaton.bff.exception;

import java.time.LocalDateTime;

public record ApiError(
        String service,
        String message,
        int status,
        LocalDateTime timestamp
) {
}
