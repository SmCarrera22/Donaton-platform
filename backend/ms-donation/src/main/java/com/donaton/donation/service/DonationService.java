package com.donaton.donation.service;

import com.donaton.donation.dto.DonationRequest;
import com.donaton.donation.dto.DonationResponse;
import com.donaton.donation.entity.*;
import com.donaton.donation.exception.ResourceNotFoundException;
import com.donaton.donation.repository.DonationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository repository;

    public DonationResponse create(DonationRequest request){
        Donation donation = Donation.builder()
                        .donorId(request.getDonorId())
                        .donorType(DonorType.valueOf(request.getDonorType()))
                        .resourceType(ResourceType.valueOf(request.getResourceType()))
                        .quantity(request.getQuantity())
                        .description(request.getResourceName())
                        .status(DonationStatus.PENDIENTE)
                        .createdAt(LocalDateTime.now())
                        .build();
        return map(repository.save(donation));
    }

    public List<DonationResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public DonationResponse findById(Long id) {
        Donation donation = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Donación no encontrada")
                );
        return map(donation);
    }

    public DonationResponse update(Long id, DonationRequest request) {
        Donation donation = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Donación no encontrada")
                );
        donation.setDonorType(DonorType.valueOf(request.getDonorType()));
        donation.setResourceType(ResourceType.valueOf(request.getResourceType()));
        donation.setQuantity(request.getQuantity());
        donation.setDescription(request.getResourceName());

        return map(repository.save(donation));
    }

    public void delete(Long id) {
        Donation donation = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Donación no encontrada")
                );
        repository.delete(donation);
    }

    private DonationResponse map(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .donorId(donation.getDonorId())
                .donorType(donation.getDonorType())
                .resourceType(donation.getResourceType())
                .quantity(donation.getQuantity())
                .description(donation.getDescription())
                .status(donation.getStatus())
                .createdAt(donation.getCreatedAt())
                .build();
    }
}
