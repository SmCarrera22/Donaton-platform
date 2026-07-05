package com.donaton.user.service;

import java.util.List;

import com.donaton.user.exception.DuplicateResourceException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.donaton.user.dto.*;
import com.donaton.user.entity.User;
import com.donaton.user.exception.ResourceNotFoundException;
import com.donaton.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse create(UserCreateRequest request) {
        if(repository.existsByEmail(request.email())) {
            throw new DuplicateResourceException(
                    "Email ya registrado"
            );
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )
                .role("USER")
                .phone(request.phone())
                .address(request.address())
                .region(request.region())
                .comuna(request.comuna())
                .build();
        return map(
                repository.save(user)
        );
    }

    public List<UserResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public UserResponse findById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Usuario no encontrado"
                        )
                );
        return map(user);
    }

    public UserResponse update(
            Long id,
            UserUpdateRequest request
    ) {
        User user = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Usuario no encontrado"
                        )
                );
        user.setName(request.name());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setRegion(request.region());
        user.setComuna(request.comuna());

        return map(
                repository.save(user)
        );
    }

    public void delete(Long id) {
        User user = repository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Usuario no encontrado"
                        )
                );
        repository.delete(user);
    }

    private UserResponse map(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRegion(),
                user.getComuna(),
                user.getRole()
        );
    }

    public UserAuthResponse findAuthByEmail(
            String email
    ) {
        User user = repository.findByEmail(email)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Usuario no encontrado"
                        )
                );
        return new UserAuthResponse(
                user.getEmail(),
                user.getPassword(),
                user.getRole()
        );
    }

}
