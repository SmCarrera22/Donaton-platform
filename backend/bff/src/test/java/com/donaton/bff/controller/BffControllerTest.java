package com.donaton.bff.controller;

import com.donaton.bff.service.BackendGatewayService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class BffControllerTest {

    @Mock
    private BackendGatewayService service;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        BffController controller =
                new BffController(service);

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .build();
    }

    @Test
    void shouldRegisterUser() throws Exception {
        when(service.registerUser(any()))
                .thenReturn(
                        response(
                                HttpStatus.CREATED,
                                Map.of(
                                        "id", 1,
                                        "email",
                                        "sebastian@donaton.cl"
                                )
                        )
                );

        mockMvc.perform(
                        post("/api/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "fullName": "Sebastián Carrera",
                                          "email": "sebastian@donaton.cl",
                                          "password": "Password123",
                                          "phone": "+56912345678",
                                          "address": "Av. Principal 123",
                                          "region": "Metropolitana",
                                          "comuna": "Santiago"
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(
                        jsonPath("$.id").value(1)
                )
                .andExpect(
                        jsonPath("$.email")
                                .value(
                                        "sebastian@donaton.cl"
                                )
                );

        verify(service).registerUser(any());
    }

    @Test
    void shouldRejectInvalidRegistration() throws Exception {
        mockMvc.perform(
                        post("/api/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "fullName": "",
                                          "email": "correo-invalido",
                                          "password": "123"
                                        }
                                        """)
                )
                .andExpect(status().isBadRequest());

        verify(service, never())
                .registerUser(any());
    }

    @Test
    void shouldLogin() throws Exception {
        when(service.loginUser(any()))
                .thenReturn(
                        ResponseEntity.ok(
                                Map.of(
                                        "token",
                                        "jwt-token"
                                )
                        )
                );

        mockMvc.perform(
                        post("/api/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "email": "sebastian@donaton.cl",
                                          "password": "Password123"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.token")
                                .value("jwt-token")
                );
    }

    @Test
    void shouldGetUserById() throws Exception {
        when(service.getUserById(10L))
                .thenReturn(
                        ResponseEntity.ok(
                                Map.of(
                                        "id", 10,
                                        "name", "Usuario Donaton"
                                )
                        )
                );

        mockMvc.perform(
                        get("/api/users/10")
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.id").value(10)
                );
    }

    @Test
    void shouldGetCurrentUser() throws Exception {
        when(service.getCurrentUser(
                "Bearer jwt-token"
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 1,
                                "email",
                                "sebastian@donaton.cl"
                        )
                )
        );

        mockMvc.perform(
                        get("/api/users/me")
                                .header(
                                        "Authorization",
                                        "Bearer jwt-token"
                                )
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.id").value(1)
                );
    }

    @Test
    void shouldUpdateUser() throws Exception {
        when(service.updateUser(
                eq(4L),
                any()
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 4,
                                "name",
                                "Sebastián Actualizado"
                        )
                )
        );

        mockMvc.perform(
                        put("/api/users/4")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "name": "Sebastián Actualizado",
                                          "phone": "+56912345678",
                                          "address": "Av. Principal 123",
                                          "region": "Metropolitana",
                                          "comuna": "Santiago"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.name")
                                .value(
                                        "Sebastián Actualizado"
                                )
                );
    }

    @Test
    void shouldValidateToken() throws Exception {
        when(service.validateToken(
                "Bearer jwt-token"
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "valid", true,
                                "email",
                                "sebastian@donaton.cl"
                        )
                )
        );

        mockMvc.perform(
                        post("/api/validate")
                                .header(
                                        "Authorization",
                                        "Bearer jwt-token"
                                )
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.valid").value(true)
                );
    }

    @Test
    void shouldCreateDonation() throws Exception {
        when(service.createDonation(
                any(),
                eq("Bearer jwt-token")
        )).thenReturn(
                response(
                        HttpStatus.CREATED,
                        Map.of(
                                "id", 7,
                                "status", "PENDIENTE"
                        )
                )
        );

        mockMvc.perform(
                        post("/api/donations")
                                .header(
                                        "Authorization",
                                        "Bearer jwt-token"
                                )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "resourceName": "Chaquetas",
                                          "resourceType": "ROPA",
                                          "donorType": "PERSONA",
                                          "quantity": 5
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(
                        jsonPath("$.id").value(7)
                );
    }

    @Test
    void shouldGetAllDonations() throws Exception {
        when(service.getAllDonations())
                .thenReturn(
                        ResponseEntity.ok(
                                List.of(
                                        Map.of(
                                                "id", 1,
                                                "resourceType",
                                                "ROPA"
                                        )
                                )
                        )
                );

        mockMvc.perform(
                        get("/api/donations")
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$[0].id").value(1)
                );
    }

    @Test
    void shouldGetDonationById() throws Exception {
        when(service.getDonationById(8L))
                .thenReturn(
                        ResponseEntity.ok(
                                Map.of(
                                        "id", 8,
                                        "status", "PENDIENTE"
                                )
                        )
                );

        mockMvc.perform(
                        get("/api/donations/8")
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.id").value(8)
                );
    }

    @Test
    void shouldCreateCampaign() throws Exception {
        when(service.createCampaign(any()))
                .thenReturn(
                        response(
                                HttpStatus.CREATED,
                                Map.of(
                                        "id", 1,
                                        "title",
                                        "Campaña invierno"
                                )
                        )
                );

        mockMvc.perform(
                        post("/api/campaigns")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "title": "Campaña invierno",
                                          "description": "Recolección de ropa",
                                          "goalAmount": 1000,
                                          "endDate": "2026-08-31T23:59:00"
                                        }
                                        """)
                )
                .andExpect(status().isCreated())
                .andExpect(
                        jsonPath("$.id").value(1)
                );
    }

    @Test
    void shouldGetCampaigns() throws Exception {
        when(service.getCampaigns())
                .thenReturn(
                        ResponseEntity.ok(
                                List.of(
                                        Map.of(
                                                "id", 1,
                                                "title",
                                                "Campaña invierno"
                                        )
                                )
                        )
                );

        mockMvc.perform(
                        get("/api/campaigns")
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$[0].id").value(1)
                );
    }

    @Test
    void shouldGetCampaignById() throws Exception {
        when(service.getCampaignById(3L))
                .thenReturn(
                        ResponseEntity.ok(
                                Map.of(
                                        "id", 3,
                                        "title",
                                        "Campaña alimentos"
                                )
                        )
                );

        mockMvc.perform(
                        get("/api/campaigns/3")
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.id").value(3)
                );
    }

    @Test
    void shouldUpdateCampaign() throws Exception {
        when(service.updateCampaign(
                eq(3L),
                any()
        )).thenReturn(
                ResponseEntity.ok(
                        Map.of(
                                "id", 3,
                                "title",
                                "Campaña actualizada"
                        )
                )
        );

        mockMvc.perform(
                        put("/api/campaigns/3")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content("""
                                        {
                                          "title": "Campaña actualizada",
                                          "description": "Descripción actualizada",
                                          "goalAmount": 2000,
                                          "endDate": "2026-09-30T23:59:00"
                                        }
                                        """)
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.title")
                                .value(
                                        "Campaña actualizada"
                                )
                );
    }

    @Test
    void shouldDeleteCampaign() throws Exception {
        when(service.deleteCampaign(5L))
                .thenReturn(
                        ResponseEntity
                                .noContent()
                                .build()
                );

        mockMvc.perform(
                        delete("/api/campaigns/5")
                )
                .andExpect(status().isNoContent());

        verify(service).deleteCampaign(5L);
    }

    private ResponseEntity<Object> response(
            HttpStatus status,
            Object body
    ) {
        return ResponseEntity
                .status(status)
                .body(body);
    }
}