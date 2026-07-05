package com.donaton.bff.controller;

import com.donaton.bff.dto.CampaignRequest;
import com.donaton.bff.dto.DonationRequest;
import com.donaton.bff.dto.LoginRequest;
import com.donaton.bff.dto.RegisterRequest;
import com.donaton.bff.service.BackendGatewayService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class BffController {

    private final BackendGatewayService backendGatewayService;

    public BffController(BackendGatewayService backendGatewayService) {
        this.backendGatewayService = backendGatewayService;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest request) {
        return backendGatewayService.registerUser(request);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody LoginRequest request) {
        return backendGatewayService.loginUser(request);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable Long id) {
        return backendGatewayService.getUserById(id);
    }

    @PostMapping("/validate")
    public ResponseEntity<Object> validate(
            @RequestHeader("Authorization")
            String authorization
    ){
        return backendGatewayService.validateToken(
                authorization
        );
    }

    @PostMapping("/donations")
    public ResponseEntity<Object> createDonation(@Valid @RequestBody DonationRequest request) {
        return backendGatewayService.createDonation(request);
    }

    @GetMapping("/donations")
    public ResponseEntity<Object> getAllDonations() {
        return backendGatewayService.getAllDonations();
    }

    @GetMapping("/donations/{id}")
    public ResponseEntity<Object> getDonationById(@PathVariable Long id) {
        return backendGatewayService.getDonationById(id);
    }

    @PostMapping("/campaigns")
    public ResponseEntity<Object> createCampaign(
            @Valid
            @RequestBody CampaignRequest request
            ) {
        return backendGatewayService.createCampaign(request);
    }

    @GetMapping("/campaigns")
    public ResponseEntity<Object> getCampaing() {
        return backendGatewayService.getCampaigns();
    }

    @GetMapping("/campaigns/{id}")
    public ResponseEntity<Object> getCampaignById(@PathVariable Long id) {
        return backendGatewayService.getCampaignById(id);
    }

    @PutMapping("/campaigns/{id}")
    public ResponseEntity<Object> updateCampaign(
            @PathVariable Long id,
            @Valid @RequestBody CampaignRequest request
    ) {
        return backendGatewayService.updateCampaign(id, request);
    }

    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<Object> deleteCampaign(@PathVariable Long id){
        return backendGatewayService.deleteCampaign(id);
    }

}
