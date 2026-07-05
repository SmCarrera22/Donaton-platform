package com.donaton.campaign.controller;

import com.donaton.campaign.dto.CampaignRequest;
import com.donaton.campaign.dto.CampaignResponse;
import com.donaton.campaign.service.CampaignService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/campaigns")
@RequiredArgsConstructor
public class CampaignController {
    private final CampaignService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CampaignResponse create(
            @Valid
            @RequestBody CampaignRequest request
    ){
        return service.create(request);
    }
    @GetMapping
    public List<CampaignResponse> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CampaignResponse findById(
            @PathVariable Long id
    ){
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public CampaignResponse update(
            @PathVariable Long id,
            @Valid
            @RequestBody CampaignRequest request
    ){
        return service.update(id, request);
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ){
        service.delete(id);
    }
}
