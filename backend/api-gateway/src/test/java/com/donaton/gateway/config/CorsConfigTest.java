package com.donaton.gateway.config;

import jakarta.servlet.FilterChain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.filter.CorsFilter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class CorsConfigTest {

    private CorsFilter corsFilter;
    private FilterChain filterChain;

    @BeforeEach
    void setUp() {
        CorsConfig corsConfig = new CorsConfig();

        corsFilter = corsConfig.corsFilter();
        filterChain = mock(FilterChain.class);
    }

    @Test
    void shouldCreateCorsFilter() {
        assertThat(corsFilter).isNotNull();
    }

    @Test
    void shouldAllowConfiguredFrontendOrigin() throws Exception {
        MockHttpServletRequest request =
                new MockHttpServletRequest("OPTIONS", "/api/campaigns");

        request.addHeader(
                "Origin",
                "http://localhost:3000"
        );

        request.addHeader(
                "Access-Control-Request-Method",
                "GET"
        );

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        corsFilter.doFilter(
                request,
                response,
                filterChain
        );

        assertThat(response.getStatus()).isEqualTo(200);

        assertThat(
                response.getHeader("Access-Control-Allow-Origin")
        ).isEqualTo("http://localhost:3000");

        assertThat(
                response.getHeader("Access-Control-Allow-Methods")
        ).contains("GET");
    }

    @Test
    void shouldAllowPostRequestsFromFrontend() throws Exception {
        MockHttpServletRequest request =
                new MockHttpServletRequest("OPTIONS", "/api/donations");

        request.addHeader(
                "Origin",
                "http://localhost:3000"
        );

        request.addHeader(
                "Access-Control-Request-Method",
                "POST"
        );

        request.addHeader(
                "Access-Control-Request-Headers",
                "Authorization, Content-Type"
        );

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        corsFilter.doFilter(
                request,
                response,
                filterChain
        );

        assertThat(response.getStatus()).isEqualTo(200);

        assertThat(
                response.getHeader("Access-Control-Allow-Origin")
        ).isEqualTo("http://localhost:3000");

        assertThat(
                response.getHeader("Access-Control-Allow-Methods")
        ).contains("POST");

        assertThat(
                response.getHeader("Access-Control-Allow-Headers")
        ).containsIgnoringCase("Authorization");

        assertThat(
                response.getHeader("Access-Control-Allow-Headers")
        ).containsIgnoringCase("Content-Type");
    }

    @Test
    void shouldRejectUnknownOrigin() throws Exception {
        MockHttpServletRequest request =
                new MockHttpServletRequest("OPTIONS", "/api/campaigns");

        request.addHeader(
                "Origin",
                "http://malicious.example.com"
        );

        request.addHeader(
                "Access-Control-Request-Method",
                "GET"
        );

        MockHttpServletResponse response =
                new MockHttpServletResponse();

        corsFilter.doFilter(
                request,
                response,
                filterChain
        );

        assertThat(response.getStatus()).isEqualTo(403);

        assertThat(
                response.getHeader("Access-Control-Allow-Origin")
        ).isNull();
    }
}