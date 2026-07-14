package com.donaton.campaign.repository;

import com.donaton.campaign.entity.Campaign;
import com.donaton.campaign.entity.CampaignStatus;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CampaignRepositoryTest {

    @Autowired
    private CampaignRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void shouldSaveCampaign() {
        Campaign campaign =
                createCampaign(
                        "Campaña de invierno"
                );

        Campaign savedCampaign =
                repository.save(campaign);

        assertNotNull(savedCampaign.getId());
        assertEquals(
                "Campaña de invierno",
                savedCampaign.getTitle()
        );
        assertEquals(
                CampaignStatus.ACTIVA,
                savedCampaign.getStatus()
        );
        assertEquals(
                0,
                savedCampaign.getCollectedAmount()
        );
    }

    @Test
    void shouldFindCampaignById() {
        Campaign savedCampaign =
                repository.save(
                        createCampaign(
                                "Campaña médica"
                        )
                );

        Optional<Campaign> result =
                repository.findById(
                        savedCampaign.getId()
                );

        assertTrue(result.isPresent());
        assertEquals(
                "Campaña médica",
                result.get().getTitle()
        );
        assertEquals(
                1500,
                result.get().getGoalAmount()
        );
    }

    @Test
    void shouldFindAllCampaigns() {
        repository.save(
                createCampaign(
                        "Campaña de alimentos"
                )
        );

        repository.save(
                createCampaign(
                        "Campaña de ropa"
                )
        );

        List<Campaign> campaigns =
                repository.findAll();

        assertEquals(2, campaigns.size());

        assertTrue(
                campaigns.stream()
                        .anyMatch(
                                campaign ->
                                        campaign.getTitle()
                                                .equals(
                                                        "Campaña de alimentos"
                                                )
                        )
        );

        assertTrue(
                campaigns.stream()
                        .anyMatch(
                                campaign ->
                                        campaign.getTitle()
                                                .equals(
                                                        "Campaña de ropa"
                                                )
                        )
        );
    }

    @Test
    void shouldDeleteCampaign() {
        Campaign savedCampaign =
                repository.save(
                        createCampaign(
                                "Campaña temporal"
                        )
                );

        Long campaignId =
                savedCampaign.getId();

        repository.delete(savedCampaign);
        repository.flush();

        assertFalse(
                repository.existsById(campaignId)
        );
    }

    private Campaign createCampaign(
            String title
    ) {
        return Campaign.builder()
                .title(title)
                .description(
                        "Descripción de campaña de prueba"
                )
                .goalAmount(1500)
                .collectedAmount(0)
                .status(CampaignStatus.ACTIVA)
                .createdAt(
                        LocalDateTime.of(
                                2026,
                                7,
                                11,
                                20,
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