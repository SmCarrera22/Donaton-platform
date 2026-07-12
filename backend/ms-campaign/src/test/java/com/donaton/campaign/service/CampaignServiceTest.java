package com.donaton.campaign.service;

import com.donaton.campaign.dto.CampaignRequest;
import com.donaton.campaign.dto.CampaignResponse;
import com.donaton.campaign.entity.Campaign;
import com.donaton.campaign.entity.CampaignStatus;
import com.donaton.campaign.exception.ResourceNotFoundException;
import com.donaton.campaign.repository.CampaignRepository;

import org.junit.jupiter.api.BeforeEach;
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
class CampaignServiceTest {

    @Mock
    private CampaignRepository repository;

    private CampaignService campaignService;

    @BeforeEach
    void setUp() {
        campaignService = new CampaignService(repository);
    }

    @Test
    void shouldCreateCampaign() {
        LocalDateTime endDate =
                LocalDateTime.of(2026, 12, 31, 23, 59);

        CampaignRequest request = new CampaignRequest(
                "Campaña de invierno",
                "Recolección de ropa y frazadas",
                1000,
                endDate
        );

        when(repository.save(any(Campaign.class)))
                .thenAnswer(invocation -> {
                    Campaign campaign = invocation.getArgument(0);
                    campaign.setId(1L);
                    return campaign;
                });

        CampaignResponse response =
                campaignService.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(
                "Campaña de invierno",
                response.title()
        );
        assertEquals(
                "Recolección de ropa y frazadas",
                response.description()
        );
        assertEquals(1000, response.goalAmount());
        assertEquals(0, response.collectedAmount());
        assertEquals(
                CampaignStatus.ACTIVA,
                response.status()
        );
        assertNotNull(response.createdAt());
        assertEquals(endDate, response.endDate());

        ArgumentCaptor<Campaign> captor =
                ArgumentCaptor.forClass(Campaign.class);

        verify(repository).save(captor.capture());

        Campaign savedCampaign =
                captor.getValue();

        assertEquals(
                CampaignStatus.ACTIVA,
                savedCampaign.getStatus()
        );
        assertEquals(
                0,
                savedCampaign.getCollectedAmount()
        );
        assertNotNull(savedCampaign.getCreatedAt());
    }

    @Test
    void shouldFindAllCampaigns() {
        Campaign firstCampaign = createCampaign(
                1L,
                "Campaña de invierno",
                CampaignStatus.ACTIVA
        );

        Campaign secondCampaign = createCampaign(
                2L,
                "Ayuda alimentos",
                CampaignStatus.FINALIZADA
        );

        when(repository.findAll())
                .thenReturn(
                        List.of(
                                firstCampaign,
                                secondCampaign
                        )
                );

        List<CampaignResponse> responses =
                campaignService.findAll();

        assertEquals(2, responses.size());

        assertEquals(
                "Campaña de invierno",
                responses.get(0).title()
        );

        assertEquals(
                CampaignStatus.FINALIZADA,
                responses.get(1).status()
        );

        verify(repository).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoCampaignsExist() {
        when(repository.findAll())
                .thenReturn(List.of());

        List<CampaignResponse> responses =
                campaignService.findAll();

        assertNotNull(responses);
        assertTrue(responses.isEmpty());

        verify(repository).findAll();
    }

    @Test
    void shouldFindCampaignById() {
        Campaign campaign = createCampaign(
                1L,
                "Campaña médica",
                CampaignStatus.ACTIVA
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(campaign));

        CampaignResponse response =
                campaignService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(
                "Campaña médica",
                response.title()
        );
        assertEquals(
                CampaignStatus.ACTIVA,
                response.status()
        );

        verify(repository).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenCampaignByIdDoesNotExist() {
        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> campaignService.findById(99L)
                );

        assertEquals(
                "Campaña no creada",
                exception.getMessage()
        );

        verify(repository).findById(99L);
    }

    @Test
    void shouldUpdateCampaign() {
        LocalDateTime originalEndDate =
                LocalDateTime.of(2026, 8, 1, 0, 0);

        Campaign existingCampaign = Campaign.builder()
                .id(1L)
                .title("Título original")
                .description("Descripción original")
                .goalAmount(500)
                .collectedAmount(100)
                .status(CampaignStatus.ACTIVA)
                .createdAt(
                        LocalDateTime.of(
                                2026,
                                7,
                                1,
                                10,
                                0
                        )
                )
                .endDate(originalEndDate)
                .build();

        LocalDateTime updatedEndDate =
                LocalDateTime.of(2026, 10, 31, 23, 59);

        CampaignRequest request = new CampaignRequest(
                "Título actualizado",
                "Descripción actualizada",
                2500,
                updatedEndDate
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(existingCampaign));

        when(repository.save(existingCampaign))
                .thenReturn(existingCampaign);

        CampaignResponse response =
                campaignService.update(
                        1L,
                        request
                );

        assertEquals(
                "Título actualizado",
                response.title()
        );
        assertEquals(
                "Descripción actualizada",
                response.description()
        );
        assertEquals(
                2500,
                response.goalAmount()
        );
        assertEquals(
                updatedEndDate,
                response.endDate()
        );

        // Estos valores no deben modificarse
        assertEquals(
                100,
                response.collectedAmount()
        );
        assertEquals(
                CampaignStatus.ACTIVA,
                response.status()
        );

        verify(repository).findById(1L);
        verify(repository).save(existingCampaign);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingMissingCampaign() {
        CampaignRequest request = new CampaignRequest(
                "Campaña inexistente",
                "No debe actualizarse",
                500,
                null
        );

        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> campaignService.update(
                                99L,
                                request
                        )
                );

        assertEquals(
                "Campaña no encontrada",
                exception.getMessage()
        );

        verify(repository).findById(99L);
        verify(repository, never())
                .save(any(Campaign.class));
    }

    @Test
    void shouldDeleteCampaign() {
        Campaign campaign = createCampaign(
                1L,
                "Campaña a eliminar",
                CampaignStatus.ACTIVA
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(campaign));

        campaignService.delete(1L);

        verify(repository).findById(1L);
        verify(repository).delete(campaign);
    }

    @Test
    void shouldThrowExceptionWhenDeletingMissingCampaign() {
        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> campaignService.delete(99L)
                );

        assertEquals(
                "Campaña no encontrada",
                exception.getMessage()
        );

        verify(repository).findById(99L);
        verify(repository, never())
                .delete(any(Campaign.class));
    }

    private Campaign createCampaign(
            Long id,
            String title,
            CampaignStatus status
    ) {
        return Campaign.builder()
                .id(id)
                .title(title)
                .description(
                        "Descripción de prueba"
                )
                .goalAmount(1000)
                .collectedAmount(250)
                .status(status)
                .createdAt(
                        LocalDateTime.of(
                                2026,
                                7,
                                1,
                                10,
                                0
                        )
                )
                .endDate(
                        LocalDateTime.of(
                                2026,
                                12,
                                31,
                                23,
                                59
                        )
                )
                .build();
    }
}