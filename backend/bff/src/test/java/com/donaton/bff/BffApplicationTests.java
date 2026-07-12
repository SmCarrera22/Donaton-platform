package com.donaton.bff;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        properties = {
                "user.service.url=http://localhost:8081",
                "auth.service.url=http://localhost:8082",
                "donation.service.url=http://localhost:8083",
                "campaign.service.url=http://localhost:8084"
        }
)
class BffApplicationTests {

    @Test
    void contextLoads() {
    }
}