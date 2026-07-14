package com.donaton.bff.service;

import com.donaton.bff.dto.CampaignRequest;
import com.donaton.bff.dto.DonationRequest;
import com.donaton.bff.dto.LoginRequest;
import com.donaton.bff.dto.RegisterRequest;
import com.donaton.bff.dto.UserAuthData;
import com.donaton.bff.dto.UserUpdateRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BackendGatewayServiceTest {

    private static final String USER_SERVICE_URL =
            "http://ms-user:8081";

    private static final String AUTH_SERVICE_URL =
            "http://ms-auth:8082";

    private static final String DONATION_SERVICE_URL =
            "http://ms-donation:8083";

    private static final String CAMPAIGN_SERVICE_URL =
            "http://ms-campaign:8084";

    @Mock
    private RestTemplate restTemplate;

    private BackendGatewayService service;

    @BeforeEach
    void setUp() {
        service = spy(
                new BackendGatewayService(
                        restTemplate,
                        USER_SERVICE_URL,
                        AUTH_SERVICE_URL,
                        DONATION_SERVICE_URL,
                        CAMPAIGN_SERVICE_URL
                )
        );
    }

    @Test
    void shouldRegisterUser() {
        RegisterRequest request = createRegisterRequest();

        ResponseEntity<Object> downstreamResponse =
                response(
                        HttpStatus.CREATED,
                        Map.of(
                                "id", 1,
                                "name", "Sebastián Carrera",
                                "email", "sebastian@donaton.cl"
                        )
                );

        when(restTemplate.exchange(
                eq(USER_SERVICE_URL + "/users"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(downstreamResponse);

        ResponseEntity<Object> result =
                service.registerUser(request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());
        assertNotNull(result.getBody());

        ArgumentCaptor<HttpEntity<Object>> entityCaptor =
                httpEntityCaptor();

        verify(restTemplate).exchange(
                eq(USER_SERVICE_URL + "/users"),
                eq(HttpMethod.POST),
                entityCaptor.capture(),
                eq(Object.class)
        );

        assertEquals(
                "application/json",
                entityCaptor
                        .getValue()
                        .getHeaders()
                        .getContentType()
                        .toString()
        );

        assertInstanceOf(
                Map.class,
                entityCaptor.getValue().getBody()
        );

        Map<?, ?> payload =
                (Map<?, ?>) entityCaptor.getValue().getBody();

        assertEquals(
                "Sebastián Carrera",
                payload.get("name")
        );

        assertEquals(
                "sebastian@donaton.cl",
                payload.get("email")
        );

        assertEquals(
                "Password123",
                payload.get("password")
        );
    }

    @Test
    void shouldLoginUser() {
        LoginRequest request = new LoginRequest();

        request.setEmail("sebastian@donaton.cl");
        request.setPassword("Password123");

        UserAuthData userAuthData =
                new UserAuthData(
                        "sebastian@donaton.cl",
                        "$2a$10$passwordHash",
                        "USER"
                );

        when(restTemplate.exchange(
                eq(
                        USER_SERVICE_URL
                                + "/users/auth/sebastian@donaton.cl"
                ),
                eq(HttpMethod.GET),
                isNull(),
                eq(UserAuthData.class)
        )).thenReturn(
                ResponseEntity.ok(userAuthData)
        );

        when(restTemplate.exchange(
                eq(AUTH_SERVICE_URL + "/auth/login"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of("token", "jwt-token")
                )
        );

        ResponseEntity<Object> result =
                service.loginUser(request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(
                Map.of("token", "jwt-token"),
                result.getBody()
        );

        ArgumentCaptor<HttpEntity<Object>> entityCaptor =
                httpEntityCaptor();

        verify(restTemplate).exchange(
                eq(AUTH_SERVICE_URL + "/auth/login"),
                eq(HttpMethod.POST),
                entityCaptor.capture(),
                eq(Object.class)
        );

        assertNotNull(entityCaptor.getValue().getBody());
    }

    @Test
    void shouldFailLoginWhenUserServiceReturnsNullBody() {
        LoginRequest request = new LoginRequest();

        request.setEmail("inexistente@donaton.cl");
        request.setPassword("Password123");

        when(restTemplate.exchange(
                eq(
                        USER_SERVICE_URL
                                + "/users/auth/inexistente@donaton.cl"
                ),
                eq(HttpMethod.GET),
                isNull(),
                eq(UserAuthData.class)
        )).thenReturn(
                ResponseEntity.ok(null)
        );

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> service.loginUser(request)
                );

        assertEquals(
                "Usuario no encontrado o respuesta inválida del MS-USER",
                exception.getMessage()
        );

        verify(restTemplate, never()).exchange(
                eq(AUTH_SERVICE_URL + "/auth/login"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        );
    }

    @Test
    void shouldGetUserById() {
        when(restTemplate.exchange(
                eq(USER_SERVICE_URL + "/users/10"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 10,
                                "name", "Usuario Donaton"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.getUserById(10L);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        verify(restTemplate).exchange(
                eq(USER_SERVICE_URL + "/users/10"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        );
    }

    @Test
    void shouldUpdateUser() {
        UserUpdateRequest request =
                new UserUpdateRequest(
                        "Sebastián Actualizado",
                        "+56912345678",
                        "Av. Principal 123",
                        "Metropolitana",
                        "Santiago"
                );

        when(restTemplate.exchange(
                eq(USER_SERVICE_URL + "/users/5"),
                eq(HttpMethod.PUT),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 5,
                                "name", "Sebastián Actualizado"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.updateUser(5L, request);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        ArgumentCaptor<HttpEntity<Object>> entityCaptor =
                httpEntityCaptor();

        verify(restTemplate).exchange(
                eq(USER_SERVICE_URL + "/users/5"),
                eq(HttpMethod.PUT),
                entityCaptor.capture(),
                eq(Object.class)
        );

        assertSame(
                request,
                entityCaptor.getValue().getBody()
        );
    }

    @Test
    void shouldValidateToken() {
        String authorization = "Bearer jwt-token";

        when(restTemplate.exchange(
                eq(AUTH_SERVICE_URL + "/auth/validate"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "valid", true,
                                "email", "sebastian@donaton.cl",
                                "role", "USER"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.validateToken(authorization);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        ArgumentCaptor<HttpEntity<Object>> entityCaptor =
                httpEntityCaptor();

        verify(restTemplate).exchange(
                eq(AUTH_SERVICE_URL + "/auth/validate"),
                eq(HttpMethod.POST),
                entityCaptor.capture(),
                eq(Object.class)
        );

        assertEquals(
                authorization,
                entityCaptor
                        .getValue()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION)
        );
    }

    @Test
    void shouldGetCurrentUser() {
        String authorization = "Bearer jwt-token";

        when(restTemplate.exchange(
                eq(AUTH_SERVICE_URL + "/auth/validate"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "valid", true,
                                "email", "sebastian@donaton.cl",
                                "role", "USER"
                        )
                )
        );

        when(restTemplate.exchange(
                eq(
                        USER_SERVICE_URL
                                + "/users/email/sebastian@donaton.cl"
                ),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 1,
                                "email", "sebastian@donaton.cl"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.getCurrentUser(authorization);

        assertEquals(HttpStatus.OK, result.getStatusCode());

        assertEquals(
                1,
                ((Map<?, ?>) result.getBody()).get("id")
        );
    }

    @Test
    void shouldRejectInvalidAuthenticationResponseType() {
        doReturn(
                ResponseEntity.ok("respuesta inválida")
        ).when(service).validateToken(anyString());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getCurrentUser(
                                "Bearer invalid"
                        )
                );

        assertEquals(
                "Respuesta inválida del servicio de autenticación",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectInvalidToken() {
        doReturn(
                ResponseEntity.ok(
                        Map.of(
                                "valid", false,
                                "email", "sebastian@donaton.cl"
                        )
                )
        ).when(service).validateToken(anyString());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getCurrentUser(
                                "Bearer invalid"
                        )
                );

        assertEquals(
                "Token inválido o usuario no autenticado",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectTokenWithoutEmail() {
        Map<String, Object> responseBody =
                new java.util.HashMap<>();

        responseBody.put("valid", true);
        responseBody.put("email", null);

        doReturn(
                ResponseEntity.ok(responseBody)
        ).when(service).validateToken(anyString());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getCurrentUser(
                                "Bearer token-without-email"
                        )
                );

        assertEquals(
                "Token inválido o usuario no autenticado",
                exception.getMessage()
        );
    }

    @Test
    void shouldCreateDonationForAuthenticatedUser() {
        DonationRequest request = createDonationRequest();

        doReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 25,
                                "email", "sebastian@donaton.cl"
                        )
                )
        ).when(service).getCurrentUser(
                "Bearer jwt-token"
        );

        when(restTemplate.exchange(
                eq(DONATION_SERVICE_URL + "/donations"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                response(
                        HttpStatus.CREATED,
                        Map.of(
                                "id", 100,
                                "donorId", 25,
                                "status", "PENDIENTE"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.createDonation(
                        request,
                        "Bearer jwt-token"
                );

        assertEquals(HttpStatus.CREATED, result.getStatusCode());

        ArgumentCaptor<HttpEntity<Object>> entityCaptor =
                httpEntityCaptor();

        verify(restTemplate).exchange(
                eq(DONATION_SERVICE_URL + "/donations"),
                eq(HttpMethod.POST),
                entityCaptor.capture(),
                eq(Object.class)
        );

        Map<?, ?> payload =
                (Map<?, ?>) entityCaptor.getValue().getBody();

        assertEquals(25L, payload.get("donorId"));
        assertEquals("PERSONA", payload.get("donorType"));
        assertEquals("ROPA", payload.get("resourceType"));
        assertEquals(5, payload.get("quantity"));
        assertEquals("Chaquetas", payload.get("resourceName"));
    }

    @Test
    void shouldRejectDonationWhenCurrentUserBodyIsInvalid() {
        DonationRequest request = createDonationRequest();

        doReturn(
                ResponseEntity.ok("usuario inválido")
        ).when(service).getCurrentUser(anyString());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> service.createDonation(
                                request,
                                "Bearer token"
                        )
                );

        assertEquals(
                "No se pudo obtener el usuario autenticado",
                exception.getMessage()
        );
    }

    @Test
    void shouldRejectDonationWhenUserIdIsMissing() {
        DonationRequest request = createDonationRequest();

        doReturn(
                ResponseEntity.ok(
                        Map.of(
                                "email",
                                "sebastian@donaton.cl"
                        )
                )
        ).when(service).getCurrentUser(anyString());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> service.createDonation(
                                request,
                                "Bearer token"
                        )
                );

        assertEquals(
                "El usuario autenticado no tiene ID válido",
                exception.getMessage()
        );
    }

    @Test
    void shouldGetAllDonations() {
        List<Map<String, Object>> donations =
                List.of(
                        Map.of(
                                "id", 1,
                                "resourceType", "ROPA"
                        ),
                        Map.of(
                                "id", 2,
                                "resourceType", "ALIMENTOS"
                        )
                );

        when(restTemplate.exchange(
                eq(DONATION_SERVICE_URL + "/donations"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(donations)
        );

        ResponseEntity<Object> result =
                service.getAllDonations();

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(donations, result.getBody());
    }

    @Test
    void shouldGetDonationById() {
        when(restTemplate.exchange(
                eq(DONATION_SERVICE_URL + "/donations/7"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 7,
                                "status", "PENDIENTE"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.getDonationById(7L);

        assertEquals(HttpStatus.OK, result.getStatusCode());
    }

    @Test
    void shouldCreateCampaign() {
        CampaignRequest request = createCampaignRequest();

        when(restTemplate.exchange(
                eq(CAMPAIGN_SERVICE_URL + "/campaigns"),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                response(
                        HttpStatus.CREATED,
                        Map.of(
                                "id", 1,
                                "title", "Campaña invierno"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.createCampaign(request);

        assertEquals(HttpStatus.CREATED, result.getStatusCode());

        ArgumentCaptor<HttpEntity<Object>> entityCaptor =
                httpEntityCaptor();

        verify(restTemplate).exchange(
                eq(CAMPAIGN_SERVICE_URL + "/campaigns"),
                eq(HttpMethod.POST),
                entityCaptor.capture(),
                eq(Object.class)
        );

        assertSame(
                request,
                entityCaptor.getValue().getBody()
        );
    }

    @Test
    void shouldGetCampaigns() {
        when(restTemplate.exchange(
                eq(CAMPAIGN_SERVICE_URL + "/campaigns"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        List.of(
                                Map.of(
                                        "id", 1,
                                        "title", "Campaña invierno"
                                )
                        )
                )
        );

        ResponseEntity<Object> result =
                service.getCampaigns();

        assertEquals(HttpStatus.OK, result.getStatusCode());
    }

    @Test
    void shouldGetCampaignById() {
        when(restTemplate.exchange(
                eq(CAMPAIGN_SERVICE_URL + "/campaigns/3"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 3,
                                "title", "Campaña alimentos"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.getCampaignById(3L);

        assertEquals(HttpStatus.OK, result.getStatusCode());
    }

    @Test
    void shouldUpdateCampaign() {
        CampaignRequest request = createCampaignRequest();

        when(restTemplate.exchange(
                eq(CAMPAIGN_SERVICE_URL + "/campaigns/4"),
                eq(HttpMethod.PUT),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 4,
                                "title", "Campaña actualizada"
                        )
                )
        );

        ResponseEntity<Object> result =
                service.updateCampaign(4L, request);

        assertEquals(HttpStatus.OK, result.getStatusCode());
    }

    @Test
    void shouldDeleteCampaign() {
        when(restTemplate.exchange(
                eq(CAMPAIGN_SERVICE_URL + "/campaigns/9"),
                eq(HttpMethod.DELETE),
                any(HttpEntity.class),
                eq(Object.class)
        )).thenReturn(
                ResponseEntity.noContent().build()
        );

        ResponseEntity<Object> result =
                service.deleteCampaign(9L);

        assertEquals(
                HttpStatus.NO_CONTENT,
                result.getStatusCode()
        );
    }

    private RegisterRequest createRegisterRequest() {
        RegisterRequest request = new RegisterRequest();

        request.setFullName("Sebastián Carrera");
        request.setEmail("sebastian@donaton.cl");
        request.setPassword("Password123");
        request.setPhone("+56912345678");
        request.setAddress("Av. Principal 123");
        request.setRegion("Metropolitana");
        request.setComuna("Santiago");

        return request;
    }

    private DonationRequest createDonationRequest() {
        DonationRequest request = new DonationRequest();

        request.setDonorType("PERSONA");
        request.setResourceType("ROPA");
        request.setQuantity(5);
        request.setResourceName("Chaquetas");

        return request;
    }

    private CampaignRequest createCampaignRequest() {
        CampaignRequest request = new CampaignRequest();

        request.setTitle("Campaña invierno");
        request.setDescription(
                "Recolección de ropa de invierno"
        );
        request.setGoalAmount(1000);
        request.setEndDate(
                LocalDateTime.of(
                        2026,
                        8,
                        31,
                        23,
                        59
                )
        );

        return request;
    }

    private ResponseEntity<Object> response(
            HttpStatus status,
            Object body
    ) {
        return ResponseEntity
                .status(status)
                .body(body);
    }

    @SuppressWarnings("unchecked")
    private ArgumentCaptor<HttpEntity<Object>>
    httpEntityCaptor() {
        return ArgumentCaptor.forClass(
                (Class<HttpEntity<Object>>) (Class<?>)
                        HttpEntity.class
        );
    }
}