package com.donaton.campaign.service;

import com.donaton.campaign.dto.CampaignRequest;
import com.donaton.campaign.dto.CampaignResponse;
import com.donaton.campaign.entity.Campaign;
import com.donaton.campaign.entity.CampaignStatus;
import com.donaton.campaign.exception.ResourceNotFoundException;
import com.donaton.campaign.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository repository;

    public CampaignResponse create(CampaignRequest request) {
        Campaign campaign = Campaign.builder()
                .title(request.title())
                .description(request.description())
                .goalAmount(request.goalAmount())
                .collectedAmount(0)
                .status(CampaignStatus.ACTIVA)
                .createdAt(LocalDateTime.now())
                .endDate(request.endDate())
                .build();
        return map(repository.save(campaign));
    }

    public List<CampaignResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public CampaignResponse findById(Long id) {
        Campaign campaign = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Campaña no creada")
                );
        return map(campaign);
    }

    public CampaignResponse update(
            Long id,
            CampaignRequest request
    ) {
        Campaign campaign = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Campaña no encontrada")
                );
        campaign.setTitle(request.title());
        campaign.setDescription(request.description());
        campaign.setGoalAmount(request.goalAmount());
        campaign.setEndDate(request.endDate());

        return map(repository.save(campaign));
    }

    public void delete(Long id) {
        Campaign campaign = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Campaña no encontrada")
                );
        repository.delete(campaign);
    }

    private CampaignResponse map(Campaign campaign) {
        return new CampaignResponse(
                campaign.getId(),
                campaign.getTitle(),
                campaign.getDescription(),
                campaign.getGoalAmount(),
                campaign.getCollectedAmount(),
                campaign.getStatus(),
                campaign.getCreatedAt(),
                campaign.getEndDate()
        );
    }
}
