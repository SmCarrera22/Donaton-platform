package com.donaton.gateway;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.io.IOException;
import java.io.OutputStream;

import java.net.InetSocketAddress;
import java.net.URI;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.nio.charset.StandardCharsets;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
class ApiGatewayRoutingTest {

    private static final HttpServer DOWNSTREAM_SERVER =
            createAndStartDownstreamServer();

    @LocalServerPort
    private int gatewayPort;

    @DynamicPropertySource
    static void overrideGatewayProperties(
            DynamicPropertyRegistry registry
    ) {
        registry.add(
                "spring.cloud.gateway.server.webmvc.routes[0].id",
                () -> "bff-test"
        );
        registry.add(
                "spring.cloud.gateway.server.webmvc.routes[0].uri",
                () -> "http://127.0.0.1:"
                        + DOWNSTREAM_SERVER.getAddress().getPort()
        );
        registry.add(
                "spring.cloud.gateway.server.webmvc.routes[0].predicates[0]",
                () -> "Path=/api/**"
        );
    }

    @AfterAll
    static void stopDownstreamServer() {
        DOWNSTREAM_SERVER.stop(0);
    }

    @Test
    void shouldRouteApiRequestToBff() throws Exception {
        HttpResponse<String> response = sendRequest(
                "/api/test",
                "GET"
        );

        assertThat(response.statusCode())
                .isEqualTo(200);

        assertThat(response.body())
                .contains("\"service\": \"bff-mock\"")
                .contains("\"status\": \"UP\"");

        assertThat(
                response.headers()
                        .firstValue("X-Downstream-Service")
        ).contains("bff");
    }

    @Test
    void shouldPropagateNotFoundStatusFromBff() throws Exception {
        HttpResponse<String> response = sendRequest(
                "/api/not-found",
                "GET"
        );

        assertThat(response.statusCode())
                .isEqualTo(404);

        assertThat(response.body())
                .contains("\"message\": \"Resource not found\"");
    }

    @Test
    void shouldApplyCorsForFrontendPreflight() throws Exception {
        HttpClient client = createHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(
                        URI.create(
                                gatewayBaseUrl() + "/api/test"
                        )
                )
                .timeout(Duration.ofSeconds(10))
                .header(
                        "Origin",
                        "http://localhost:3000"
                )
                .header(
                        "Access-Control-Request-Method",
                        "GET"
                )
                .method(
                        "OPTIONS",
                        HttpRequest.BodyPublishers.noBody()
                )
                .build();

        HttpResponse<String> response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );

        assertThat(response.statusCode())
                .isBetween(200, 299);

        assertThat(
                response.headers()
                        .firstValue("Access-Control-Allow-Origin")
        ).contains("http://localhost:3000");

        assertThat(
                response.headers()
                        .firstValue("Access-Control-Allow-Methods")
        ).hasValueSatisfying(
                allowedMethods ->
                        assertThat(allowedMethods).contains("GET")
        );
    }

    private HttpResponse<String> sendRequest(
            String path,
            String method
    ) throws Exception {
        HttpClient client = createHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(
                        URI.create(
                                gatewayBaseUrl() + path
                        )
                )
                .timeout(Duration.ofSeconds(10))
                .method(
                        method,
                        HttpRequest.BodyPublishers.noBody()
                )
                .build();

        return client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
        );
    }

    private HttpClient createHttpClient() {
        return HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    private String gatewayBaseUrl() {
        return "http://127.0.0.1:" + gatewayPort;
    }

    private static HttpServer createAndStartDownstreamServer() {
        try {
            HttpServer server = HttpServer.create(
                    new InetSocketAddress(
                            "127.0.0.1",
                            0
                    ),
                    0
            );

            server.createContext(
                    "/api/test",
                    ApiGatewayRoutingTest::handleSuccessfulResponse
            );

            server.createContext(
                    "/api/not-found",
                    ApiGatewayRoutingTest::handleNotFoundResponse
            );

            server.start();

            return server;

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "No fue posible iniciar el BFF simulado",
                    exception
            );
        }
    }

    private static void handleSuccessfulResponse(
            HttpExchange exchange
    ) throws IOException {
        String body = """
                {
                  "service": "bff-mock",
                  "status": "UP"
                }
                """;

        writeResponse(
                exchange,
                200,
                body,
                true
        );
    }

    private static void handleNotFoundResponse(
            HttpExchange exchange
    ) throws IOException {
        String body = """
                {
                  "service": "bff-mock",
                  "message": "Resource not found",
                  "status": 404
                }
                """;

        writeResponse(
                exchange,
                404,
                body,
                false
        );
    }

    private static void writeResponse(
            HttpExchange exchange,
            int status,
            String body,
            boolean includeDownstreamHeader
    ) throws IOException {
        byte[] responseBytes =
                body.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().add(
                "Content-Type",
                "application/json"
        );

        if (includeDownstreamHeader) {
            exchange.getResponseHeaders().add(
                    "X-Downstream-Service",
                    "bff"
            );
        }

        exchange.sendResponseHeaders(
                status,
                responseBytes.length
        );

        try (
                OutputStream outputStream =
                        exchange.getResponseBody()
        ) {
            outputStream.write(responseBytes);
        }
    }
}