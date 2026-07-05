package com.donaton.user.service;

import com.donaton.user.dto.*;
import com.donaton.user.entity.User;
import com.donaton.user.exception.DuplicateResourceException;
import com.donaton.user.exception.ResourceNotFoundException;
import com.donaton.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService service;

    // ================= CREATE =================

    @Test
    void shouldCreateUserSuccessfully() {
        UserCreateRequest request = new UserCreateRequest(
                "John",
                "john@test.com",
                "1234",
                "999",
                "street 1",
                "region",
                "comuna"
        );

        when(repository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("ENCODED");

        User savedUser = User.builder()
                .id(1L)
                .name(request.name())
                .email(request.email())
                .password("ENCODED")
                .role("USER")
                .phone(request.phone())
                .address(request.address())
                .region(request.region())
                .comuna(request.comuna())
                .build();

        when(repository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = service.create(request);

        assertNotNull(response);
        assertEquals("john@test.com", response.email());
    }

    @Test
    void shouldThrowDuplicateEmail() {
        UserCreateRequest request = new UserCreateRequest(
                "John",
                "john@test.com",
                "1234",
                "999",
                "street",
                "region",
                "comuna"
        );

        when(repository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(DuplicateResourceException.class,
                () -> service.create(request));
    }

    // ================= FIND BY ID =================

    @Test
    void shouldFindById() {
        User user = User.builder()
                .id(1L)
                .name("John")
                .email("john@test.com")
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = service.findById(1L);

        assertEquals(1L, response.id());
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.findById(1L));
    }

    // ================= FIND ALL =================

    @Test
    void shouldReturnUsers() {
        User user = User.builder()
                .id(1L)
                .name("John")
                .email("john@test.com")
                .build();

        when(repository.findAll()).thenReturn(List.of(user));

        List<UserResponse> result = service.findAll();

        assertEquals(1, result.size());
    }

    // ================= UPDATE =================

    @Test
    void shouldUpdateUser() {
        User user = User.builder()
                .id(1L)
                .name("Old")
                .email("old@test.com")
                .build();

        UserUpdateRequest request = new UserUpdateRequest(
                "New",
                "999",
                "street",
                "region",
                "comuna"
        );

        when(repository.findById(1L)).thenReturn(Optional.of(user));
        when(repository.save(any(User.class))).thenReturn(user);

        UserResponse response = service.update(1L, request);

        assertEquals("Old", response.name()); // mapped result
    }

    // ================= DELETE =================

    @Test
    void shouldDeleteUser() {
        User user = User.builder()
                .id(1L)
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(user));

        service.delete(1L);

        verify(repository, times(1)).delete(user);
    }

    // ================= AUTH =================

    @Test
    void shouldFindAuthByEmail() {
        User user = User.builder()
                .email("test@test.com")
                .password("pass")
                .role("USER")
                .build();

        when(repository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        UserAuthResponse response = service.findAuthByEmail("test@test.com");

        assertEquals("test@test.com", response.email());
    }
}