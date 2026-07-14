package com.donaton.donation.controller;

import com.donaton.donation.dto.DonationRequest;
import com.donaton.donation.dto.DonationResponse;
import com.donaton.donation.entity.DonationStatus;
import com.donaton.donation.entity.DonorType;
import com.donaton.donation.entity.ResourceType;
import com.donaton.donation.service.DonationService;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DonationController.class)
class DonationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private DonationService service;

    private DonationRequest request;
    private DonationResponse response;

    @BeforeEach
    void setUp() {
        request = new DonationRequest();
        request.setDonorId(10L);
        request.setDonorType("PERSONA");
        request.setResourceType("ROPA");
        request.setQuantity(5);
        request.setResourceName("Abrigos de invierno");

        response = DonationResponse.builder()
                .id(1L)
                .donorId(10L)
                .donorType(DonorType.PERSONA)
                .resourceType(ResourceType.ROPA)
                .quantity(5)
                .description("Abrigos de invierno")
                .status(DonationStatus.PENDIENTE)
                .createdAt(LocalDateTime.of(2026, 7, 11, 12, 0))
                .build();
    }

    @Test
    @DisplayName("POST /donations debería crear una donación")
    void shouldCreateDonation() throws Exception {
        when(service.create(any(DonationRequest.class)))
                .thenReturn(response);

        mockMvc.perform(
                        post("/donations")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.donorId").value(10))
                .andExpect(jsonPath("$.donorType").value("PERSONA"))
                .andExpect(jsonPath("$.resourceType").value("ROPA"))
                .andExpect(jsonPath("$.quantity").value(5))
                .andExpect(jsonPath("$.description").value("Abrigos de invierno"))
                .andExpect(jsonPath("$.status").value("PENDIENTE"));

        verify(service).create(any(DonationRequest.class));
    }

    @Test
    @DisplayName("GET /donations debería listar las donaciones")
    void shouldFindAllDonations() throws Exception {
        when(service.findAll())
                .thenReturn(List.of(response));

        mockMvc.perform(
                        get("/donations")
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].donorId").value(10))
                .andExpect(jsonPath("$[0].description").value("Abrigos de invierno"));

        verify(service).findAll();
    }

    @Test
    @DisplayName("GET /donations/{id} debería buscar una donación")
    void shouldFindDonationById() throws Exception {
        when(service.findById(1L))
                .thenReturn(response);

        mockMvc.perform(
                        get("/donations/{id}", 1L)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.donorType").value("PERSONA"))
                .andExpect(jsonPath("$.resourceType").value("ROPA"));

        verify(service).findById(1L);
    }

    @Test
    @DisplayName("PUT /donations/{id} debería actualizar una donación")
    void shouldUpdateDonation() throws Exception {
        DonationResponse updatedResponse = DonationResponse.builder()
                .id(1L)
                .donorId(10L)
                .donorType(DonorType.EMPRESA)
                .resourceType(ResourceType.ALIMENTOS)
                .quantity(25)
                .description("Cajas de alimentos")
                .status(DonationStatus.PENDIENTE)
                .createdAt(LocalDateTime.of(2026, 7, 11, 12, 0))
                .build();

        request.setDonorType("EMPRESA");
        request.setResourceType("ALIMENTOS");
        request.setQuantity(25);
        request.setResourceName("Cajas de alimentos");

        when(service.update(eq(1L), any(DonationRequest.class)))
                .thenReturn(updatedResponse);

        mockMvc.perform(
                        put("/donations/{id}", 1L)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.donorType").value("EMPRESA"))
                .andExpect(jsonPath("$.resourceType").value("ALIMENTOS"))
                .andExpect(jsonPath("$.quantity").value(25))
                .andExpect(jsonPath("$.description").value("Cajas de alimentos"));

        verify(service).update(eq(1L), any(DonationRequest.class));
    }

    @Test
    @DisplayName("DELETE /donations/{id} debería eliminar una donación")
    void shouldDeleteDonation() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(
                        delete("/donations/{id}", 1L)
                )
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        verify(service).delete(1L);
    }
}