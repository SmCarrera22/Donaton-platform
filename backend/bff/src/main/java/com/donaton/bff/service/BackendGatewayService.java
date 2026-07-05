package com.donaton.bff.service;

import com.donaton.bff.dto.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class BackendGatewayService {

    private final RestTemplate restTemplate;

    private final String userServiceUrl;
    private final String authServiceUrl;
    private final String donationServiceUrl;
    private final String campaignServiceUrl;

    public BackendGatewayService(
            RestTemplate restTemplate,
            @Value("${user.service.url}")
            String userServiceUrl,
            @Value("${auth.service.url}")
            String authServiceUrl,
            @Value("${donation.service.url}")
            String donationServiceUrl,
            @Value("${campaign.service.url}")
            String campaignServiceUrl
    ){
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
        this.authServiceUrl = authServiceUrl;
        this.donationServiceUrl = donationServiceUrl;
        this.campaignServiceUrl = campaignServiceUrl;
    }

    public ResponseEntity<Object> registerUser(
            RegisterRequest request
    ){
        String url =
                UriComponentsBuilder
                        .fromUriString(userServiceUrl)
                        .path("/users")
                        .toUriString();
        Map<String,Object> payload =
                new HashMap<>();
        payload.put(
                "name",
                request.getFullName()
        );
        payload.put(
                "email",
                request.getEmail()
        );
        payload.put(
                "password",
                request.getPassword()
        );
        return exchange(
                url,
                HttpMethod.POST,
                payload
        );
    }

    public ResponseEntity<Object> loginUser(LoginRequest request) {

        String userUrl = UriComponentsBuilder
                .fromUriString(userServiceUrl)
                .path("/users/auth/{email}")
                .buildAndExpand(request.getEmail())
                .toUriString();

        ResponseEntity<UserAuthData> response =
                restTemplate.exchange(
                        userUrl,
                        HttpMethod.GET,
                        null,
                        UserAuthData.class
                );

        UserAuthData userData = response.getBody();

        if (userData == null) {
            throw new RuntimeException("Usuario no encontrado o respuesta inválida del MS-USER");
        }

        AuthLoginRequest authRequest = new AuthLoginRequest(
                userData.email(),
                request.getPassword(),
                userData.password(),
                userData.role()
        );

        String authUrl = UriComponentsBuilder
                .fromUriString(authServiceUrl)
                .path("/auth/login")
                .toUriString();

        return exchange(authUrl, HttpMethod.POST, authRequest);
    }

    public ResponseEntity<Object> getUserById(
            Long id
    ){
        String url =
                UriComponentsBuilder
                        .fromUriString(userServiceUrl)
                        .path("/users/{id}")
                        .buildAndExpand(id)
                        .toUriString();
        return exchange(
                url,
                HttpMethod.GET,
                null
        );
    }

    private ResponseEntity<Object> exchange(
            String url,
            HttpMethod method,
            Object body
    ){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        HttpEntity<Object> entity = new HttpEntity<>(
                        body,
                        headers
                );

        return restTemplate.exchange(
                url,
                method,
                entity,
                Object.class
        );
    }

    public ResponseEntity<Object> validateToken(
            String authorization
    ){
        String url = UriComponentsBuilder
                        .fromUriString(authServiceUrl)
                        .path("/auth/validate")
                        .toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.set(
                "Authorization",
                authorization
        );
        HttpEntity<Object> entity = new HttpEntity<>(
                        null,
                        headers
                );
        return restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Object.class
        );
    }

    public ResponseEntity<Object> createDonation(
            DonationRequest request
    ){
        String url = UriComponentsBuilder
                .fromUriString(donationServiceUrl)
                .path("/donations")
                .toUriString();
        return exchange(
                url,
                HttpMethod.POST,
                request
        );
    }

    public ResponseEntity<Object> getAllDonations() {
        String url = UriComponentsBuilder
                .fromUriString(donationServiceUrl)
                .path("/donations")
                .toUriString();
        return exchange(
                url,
                HttpMethod.GET,
                null
        );
    }

    public ResponseEntity<Object> getDonationById(Long id) {
        String url = UriComponentsBuilder
                .fromUriString(donationServiceUrl)
                .path("/donations/{id}")
                .buildAndExpand(id)
                .toUriString();
        return exchange(
                url,
                HttpMethod.GET,
                null
        );
    }

    public ResponseEntity<Object> createCampaign(CampaignRequest request){
        String url = UriComponentsBuilder
                        .fromUriString(campaignServiceUrl)
                        .path("/campaigns")
                        .toUriString();
        return exchange(
                url,
                HttpMethod.POST,
                request
        );
    }

    public ResponseEntity<Object> getCampaigns(){
        String url = campaignServiceUrl + "/campaigns";
        return exchange(
                url,
                HttpMethod.GET,
                null
        );
    }

    public ResponseEntity<Object> getCampaignById(Long id){
        String url = campaignServiceUrl + "/campaigns/" + id;
        return exchange(
                url,
                HttpMethod.GET,
                null
        );
    }

    public ResponseEntity<Object> updateCampaign(Long id, CampaignRequest request){
        String url = campaignServiceUrl + "/campaigns/" + id;
        return exchange(
                url,
                HttpMethod.PUT,
                request
        );
    }

    public ResponseEntity<Object> deleteCampaign(Long id){
        String url = campaignServiceUrl + "/campaigns/" + id;
        return exchange(
                url,
                HttpMethod.DELETE,
                null
        );
    }

}