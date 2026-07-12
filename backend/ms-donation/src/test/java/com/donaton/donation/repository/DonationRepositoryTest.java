package com.donaton.donation.repository;

import com.donaton.donation.entity.Donation;
import com.donaton.donation.entity.DonationStatus;
import com.donaton.donation.entity.DonorType;
import com.donaton.donation.entity.ResourceType;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class DonationRepositoryTest {

    @Autowired
    private DonationRepository repository;

    @Test
    @DisplayName("Debería guardar una donación")
    void shouldSaveDonation() {
        Donation donation = createDonation(
                1L,
                DonorType.PERSONA,
                ResourceType.ROPA,
                10,
                "Abrigos de invierno",
                DonationStatus.PENDIENTE
        );

        Donation savedDonation = repository.saveAndFlush(donation);

        assertNotNull(savedDonation);
        assertNotNull(savedDonation.getId());
        assertEquals(1L, savedDonation.getDonorId());
        assertEquals(DonorType.PERSONA, savedDonation.getDonorType());
        assertEquals(ResourceType.ROPA, savedDonation.getResourceType());
        assertEquals(10, savedDonation.getQuantity());
        assertEquals("Abrigos de invierno", savedDonation.getDescription());
        assertEquals(DonationStatus.PENDIENTE, savedDonation.getStatus());
        assertNotNull(savedDonation.getCreatedAt());
    }

    @Test
    @DisplayName("Debería encontrar una donación por ID")
    void shouldFindDonationById() {
        Donation savedDonation = repository.saveAndFlush(
                createDonation(
                        2L,
                        DonorType.EMPRESA,
                        ResourceType.ALIMENTOS,
                        50,
                        "Canastas básicas",
                        DonationStatus.VALIDADO
                )
        );

        Optional<Donation> result =
                repository.findById(savedDonation.getId());

        assertTrue(result.isPresent());
        assertEquals(2L, result.get().getDonorId());
        assertEquals(DonorType.EMPRESA, result.get().getDonorType());
        assertEquals(ResourceType.ALIMENTOS, result.get().getResourceType());
        assertEquals(50, result.get().getQuantity());
        assertEquals("Canastas básicas", result.get().getDescription());
        assertEquals(DonationStatus.VALIDADO, result.get().getStatus());
    }

    @Test
    @DisplayName("Debería listar todas las donaciones")
    void shouldFindAllDonations() {
        repository.save(
                createDonation(
                        1L,
                        DonorType.PERSONA,
                        ResourceType.ROPA,
                        10,
                        "Abrigos",
                        DonationStatus.PENDIENTE
                )
        );

        repository.save(
                createDonation(
                        2L,
                        DonorType.EMPRESA,
                        ResourceType.ALIMENTOS,
                        50,
                        "Canastas básicas",
                        DonationStatus.VALIDADO
                )
        );

        repository.flush();

        List<Donation> donations = repository.findAll();

        assertEquals(2, donations.size());
    }

    @Test
    @DisplayName("Debería eliminar una donación")
    void shouldDeleteDonation() {
        Donation savedDonation = repository.saveAndFlush(
                createDonation(
                        3L,
                        DonorType.PERSONA,
                        ResourceType.INSUMOS_MEDICOS,
                        15,
                        "Botiquines",
                        DonationStatus.PENDIENTE
                )
        );

        Long id = savedDonation.getId();

        repository.delete(savedDonation);
        repository.flush();

        assertFalse(repository.findById(id).isPresent());
    }

    private Donation createDonation(
            Long donorId,
            DonorType donorType,
            ResourceType resourceType,
            Integer quantity,
            String description,
            DonationStatus status
    ) {
        return Donation.builder()
                .donorId(donorId)
                .donorType(donorType)
                .resourceType(resourceType)
                .quantity(quantity)
                .description(description)
                .status(status)
                .createdAt(LocalDateTime.now())
                .build();
    }
}