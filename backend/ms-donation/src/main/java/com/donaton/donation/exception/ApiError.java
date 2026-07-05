package com.donaton.donation.exception;

import java.time.LocalDateTime;

public record ApiError(
        String service,
        String message,
        int status,
        LocalDateTime timestamp
) {
}
