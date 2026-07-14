package com.donaton.campaign.controller;

import com.donaton.campaign.dto.CampaignRequest;
import com.donaton.campaign.dto.CampaignResponse;
import com.donaton.campaign.entity.CampaignStatus;
import com.donaton.campaign.service.CampaignService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CampaignControllerTest {

    @Mock
    private CampaignService campaignService;

    private CampaignController controller;

    @BeforeEach
    void setUp() {
        controller =
                new CampaignController(campaignService);
    }

    @Test
    void shouldCreateCampaign() {
        CampaignRequest request =
                createRequest();

        CampaignResponse expectedResponse =
                createResponse();

        when(campaignService.create(request))
                .thenReturn(expectedResponse);

        CampaignResponse response =
                controller.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(
                "Campaña de invierno",
                response.title()
        );
        assertEquals(
                CampaignStatus.ACTIVA,
                response.status()
        );

        verify(campaignService).create(request);
    }

    @Test
    void shouldFindAllCampaigns() {
        CampaignResponse campaign =
                createResponse();

        when(campaignService.findAll())
                .thenReturn(List.of(campaign));

        List<CampaignResponse> response =
                controller.findAll();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(
                "Campaña de invierno",
                response.getFirst().title()
        );

        verify(campaignService).findAll();
    }

    @Test
    void shouldFindCampaignById() {
        CampaignResponse expectedResponse =
                createResponse();

        when(campaignService.findById(1L))
                .thenReturn(expectedResponse);

        CampaignResponse response =
                controller.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(
                1000,
                response.goalAmount()
        );

        verify(campaignService).findById(1L);
    }

    @Test
    void shouldUpdateCampaign() {
        CampaignRequest request =
                createRequest();

        CampaignResponse expectedResponse =
                new CampaignResponse(
                        1L,
                        "Campaña actualizada",
                        "Descripción actualizada",
                        2000,
                        250,
                        CampaignStatus.ACTIVA,
                        LocalDateTime.of(
                                2026,
                                7,
                                1,
                                10,
                                0
                        ),
                        LocalDateTime.of(
                                2026,
                                12,
                                31,
                                23,
                                59
                        )
                );

        when(campaignService.update(
                1L,
                request
        )).thenReturn(expectedResponse);

        CampaignResponse response =
                controller.update(
                        1L,
                        request
                );

        assertNotNull(response);
        assertEquals(
                "Campaña actualizada",
                response.title()
        );
        assertEquals(
                2000,
                response.goalAmount()
        );

        verify(campaignService).update(
                1L,
                request
        );
    }

    @Test
    void shouldDeleteCampaign() {
        doNothing()
                .when(campaignService)
                .delete(1L);

        controller.delete(1L);

        verify(campaignService).delete(1L);
    }

    private CampaignRequest createRequest() {
        return new CampaignRequest(
                "Campaña de invierno",
                "Recolección de ropa y frazadas",
                1000,
                LocalDateTime.of(
                        2026,
                        12,
                        31,
                        23,
                        59
                )
        );
    }

    private CampaignResponse createResponse() {
        return new CampaignResponse(
                1L,
                "Campaña de invierno",
                "Recolección de ropa y frazadas",
                1000,
                0,
                CampaignStatus.ACTIVA,
                LocalDateTime.of(
                        2026,
                        7,
                        1,
                        10,
                        0
                ),
                LocalDateTime.of(
                        2026,
                        12,
                        31,
                        23,
                        59
                )
        );
    }
}