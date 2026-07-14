package com.donaton.donation.service;

import com.donaton.donation.dto.DonationRequest;
import com.donaton.donation.dto.DonationResponse;
import com.donaton.donation.entity.Donation;
import com.donaton.donation.entity.DonationStatus;
import com.donaton.donation.entity.DonorType;
import com.donaton.donation.entity.ResourceType;
import com.donaton.donation.exception.ResourceNotFoundException;
import com.donaton.donation.repository.DonationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    @Mock
    private DonationRepository repository;

    private DonationService service;

    private Donation donation;

    @BeforeEach
    void setUp() {
        service = new DonationService(repository);

        donation = Donation.builder()
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
    @DisplayName("Debería crear una donación correctamente")
    void shouldCreateDonation() {
        DonationRequest request = createRequest(
                10L,
                "PERSONA",
                "ROPA",
                5,
                "Abrigos de invierno"
        );

        when(repository.save(any(Donation.class)))
                .thenAnswer(invocation -> {
                    Donation savedDonation = invocation.getArgument(0);
                    savedDonation.setId(1L);
                    return savedDonation;
                });

        DonationResponse response = service.create(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(10L, response.getDonorId());
        assertEquals(DonorType.PERSONA, response.getDonorType());
        assertEquals(ResourceType.ROPA, response.getResourceType());
        assertEquals(5, response.getQuantity());
        assertEquals("Abrigos de invierno", response.getDescription());
        assertEquals(DonationStatus.PENDIENTE, response.getStatus());
        assertNotNull(response.getCreatedAt());

        ArgumentCaptor<Donation> captor =
                ArgumentCaptor.forClass(Donation.class);

        verify(repository).save(captor.capture());

        Donation capturedDonation = captor.getValue();

        assertEquals(10L, capturedDonation.getDonorId());
        assertEquals(DonorType.PERSONA, capturedDonation.getDonorType());
        assertEquals(ResourceType.ROPA, capturedDonation.getResourceType());
        assertEquals(5, capturedDonation.getQuantity());
        assertEquals("Abrigos de invierno", capturedDonation.getDescription());
        assertEquals(DonationStatus.PENDIENTE, capturedDonation.getStatus());
        assertNotNull(capturedDonation.getCreatedAt());
    }

    @Test
    @DisplayName("Debería listar todas las donaciones")
    void shouldFindAllDonations() {
        Donation secondDonation = Donation.builder()
                .id(2L)
                .donorId(20L)
                .donorType(DonorType.EMPRESA)
                .resourceType(ResourceType.ALIMENTOS)
                .quantity(50)
                .description("Canastas básicas")
                .status(DonationStatus.VALIDADO)
                .createdAt(LocalDateTime.of(2026, 7, 11, 13, 0))
                .build();

        when(repository.findAll())
                .thenReturn(List.of(donation, secondDonation));

        List<DonationResponse> responses = service.findAll();

        assertNotNull(responses);
        assertEquals(2, responses.size());

        assertEquals(1L, responses.get(0).getId());
        assertEquals("Abrigos de invierno", responses.get(0).getDescription());

        assertEquals(2L, responses.get(1).getId());
        assertEquals(DonorType.EMPRESA, responses.get(1).getDonorType());
        assertEquals(ResourceType.ALIMENTOS, responses.get(1).getResourceType());

        verify(repository).findAll();
    }

    @Test
    @DisplayName("Debería retornar una lista vacía cuando no existan donaciones")
    void shouldReturnEmptyListWhenNoDonationsExist() {
        when(repository.findAll()).thenReturn(List.of());

        List<DonationResponse> responses = service.findAll();

        assertNotNull(responses);
        assertTrue(responses.isEmpty());

        verify(repository).findAll();
    }

    @Test
    @DisplayName("Debería encontrar una donación por ID")
    void shouldFindDonationById() {
        when(repository.findById(1L))
                .thenReturn(Optional.of(donation));

        DonationResponse response = service.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(10L, response.getDonorId());
        assertEquals(DonorType.PERSONA, response.getDonorType());
        assertEquals(ResourceType.ROPA, response.getResourceType());
        assertEquals(5, response.getQuantity());
        assertEquals("Abrigos de invierno", response.getDescription());
        assertEquals(DonationStatus.PENDIENTE, response.getStatus());
        assertEquals(donation.getCreatedAt(), response.getCreatedAt());

        verify(repository).findById(1L);
    }

    @Test
    @DisplayName("Debería lanzar excepción cuando la donación no exista")
    void shouldThrowExceptionWhenDonationDoesNotExist() {
        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.findById(99L)
        );

        assertEquals("Donación no encontrada", exception.getMessage());

        verify(repository).findById(99L);
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Debería actualizar una donación correctamente")
    void shouldUpdateDonation() {
        DonationRequest request = createRequest(
                10L,
                "EMPRESA",
                "ALIMENTOS",
                25,
                "Cajas de alimentos"
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(donation));

        when(repository.save(any(Donation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DonationResponse response = service.update(1L, request);

        assertNotNull(response);
        assertEquals(1L, response.getId());

        // El servicio actual no cambia donorId durante la actualización.
        assertEquals(10L, response.getDonorId());

        assertEquals(DonorType.EMPRESA, response.getDonorType());
        assertEquals(ResourceType.ALIMENTOS, response.getResourceType());
        assertEquals(25, response.getQuantity());
        assertEquals("Cajas de alimentos", response.getDescription());

        // El estado y la fecha original deben conservarse.
        assertEquals(DonationStatus.PENDIENTE, response.getStatus());
        assertEquals(donation.getCreatedAt(), response.getCreatedAt());

        verify(repository).findById(1L);
        verify(repository).save(donation);
    }

    @Test
    @DisplayName("Debería lanzar excepción al actualizar una donación inexistente")
    void shouldThrowExceptionWhenUpdatingMissingDonation() {
        DonationRequest request = createRequest(
                10L,
                "EMPRESA",
                "ALIMENTOS",
                25,
                "Cajas de alimentos"
        );

        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.update(99L, request)
        );

        assertEquals("Donación no encontrada", exception.getMessage());

        verify(repository).findById(99L);
        verify(repository, never()).save(any());
    }

    @Test
    @DisplayName("Debería eliminar una donación existente")
    void shouldDeleteDonation() {
        when(repository.findById(1L))
                .thenReturn(Optional.of(donation));

        service.delete(1L);

        verify(repository).findById(1L);
        verify(repository).delete(donation);
    }

    @Test
    @DisplayName("Debería lanzar excepción al eliminar una donación inexistente")
    void shouldThrowExceptionWhenDeletingMissingDonation() {
        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.delete(99L)
        );

        assertEquals("Donación no encontrada", exception.getMessage());

        verify(repository).findById(99L);
        verify(repository, never()).delete(any());
    }

    private DonationRequest createRequest(
            Long donorId,
            String donorType,
            String resourceType,
            Integer quantity,
            String resourceName
    ) {
        DonationRequest request = new DonationRequest();

        request.setDonorId(donorId);
        request.setDonorType(donorType);
        request.setResourceType(resourceType);
        request.setQuantity(quantity);
        request.setResourceName(resourceName);

        return request;
    }
}