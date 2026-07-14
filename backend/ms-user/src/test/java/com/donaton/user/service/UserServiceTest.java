package com.donaton.user.service;

import com.donaton.user.dto.UserAuthResponse;
import com.donaton.user.dto.UserCreateRequest;
import com.donaton.user.dto.UserResponse;
import com.donaton.user.dto.UserUpdateRequest;
import com.donaton.user.entity.User;
import com.donaton.user.exception.DuplicateResourceException;
import com.donaton.user.exception.ResourceNotFoundException;
import com.donaton.user.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService service;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = User.builder()
                .id(1L)
                .name("Sebastián Carrera")
                .email("sebastian@donaton.cl")
                .password("encoded-password")
                .role("USER")
                .phone("+56912345678")
                .address("Av. Principal 123")
                .region("Metropolitana")
                .comuna("Santiago")
                .build();
    }

    @Test
    @DisplayName("Debe crear un usuario y cifrar su contraseña")
    void shouldCreateUser() {
        UserCreateRequest request = new UserCreateRequest(
                "Sebastián Carrera",
                "sebastian@donaton.cl",
                "password123",
                "+56912345678",
                "Av. Principal 123",
                "Metropolitana",
                "Santiago"
        );

        when(repository.existsByEmail(request.email()))
                .thenReturn(false);

        when(passwordEncoder.encode(request.password()))
                .thenReturn("encoded-password");

        when(repository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User user = invocation.getArgument(0);
                    user.setId(1L);
                    return user;
                });

        UserResponse response = service.create(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Sebastián Carrera");
        assertThat(response.email()).isEqualTo("sebastian@donaton.cl");
        assertThat(response.phone()).isEqualTo("+56912345678");
        assertThat(response.address()).isEqualTo("Av. Principal 123");
        assertThat(response.region()).isEqualTo("Metropolitana");
        assertThat(response.comuna()).isEqualTo("Santiago");
        assertThat(response.role()).isEqualTo("USER");

        verify(repository).existsByEmail("sebastian@donaton.cl");
        verify(passwordEncoder).encode("password123");
        verify(repository).save(any(User.class));
    }

    @Test
    @DisplayName("Debe rechazar la creación cuando el email ya existe")
    void shouldRejectDuplicateEmail() {
        UserCreateRequest request = new UserCreateRequest(
                "Sebastián Carrera",
                "sebastian@donaton.cl",
                "password123",
                null,
                null,
                null,
                null
        );

        when(repository.existsByEmail(request.email()))
                .thenReturn(true);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessage("Email ya registrado");

        verify(repository).existsByEmail("sebastian@donaton.cl");
        verify(passwordEncoder, never()).encode(any());
        verify(repository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Debe listar todos los usuarios")
    void shouldFindAllUsers() {
        User secondUser = User.builder()
                .id(2L)
                .name("María González")
                .email("maria@donaton.cl")
                .password("another-encoded-password")
                .role("USER")
                .phone("+56987654321")
                .address("Calle Secundaria 456")
                .region("Valparaíso")
                .comuna("Viña del Mar")
                .build();

        when(repository.findAll())
                .thenReturn(List.of(existingUser, secondUser));

        List<UserResponse> responses = service.findAll();

        assertThat(responses).hasSize(2);

        assertThat(responses.get(0).id()).isEqualTo(1L);
        assertThat(responses.get(0).email())
                .isEqualTo("sebastian@donaton.cl");

        assertThat(responses.get(1).id()).isEqualTo(2L);
        assertThat(responses.get(1).email())
                .isEqualTo("maria@donaton.cl");

        verify(repository).findAll();
    }

    @Test
    @DisplayName("Debe buscar un usuario mediante su ID")
    void shouldFindUserById() {
        when(repository.findById(1L))
                .thenReturn(Optional.of(existingUser));

        UserResponse response = service.findById(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Sebastián Carrera");
        assertThat(response.email()).isEqualTo("sebastian@donaton.cl");
        assertThat(response.role()).isEqualTo("USER");

        verify(repository).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar una excepción cuando el ID no existe")
    void shouldThrowWhenUserIdDoesNotExist() {
        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuario no encontrado");

        verify(repository).findById(99L);
    }

    @Test
    @DisplayName("Debe buscar un usuario mediante su email")
    void shouldFindUserByEmail() {
        when(repository.findByEmail("sebastian@donaton.cl"))
                .thenReturn(Optional.of(existingUser));

        UserResponse response =
                service.findByEmail("sebastian@donaton.cl");

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Sebastián Carrera");
        assertThat(response.email()).isEqualTo("sebastian@donaton.cl");

        verify(repository).findByEmail("sebastian@donaton.cl");
    }

    @Test
    @DisplayName("Debe lanzar una excepción cuando el email no existe")
    void shouldThrowWhenEmailDoesNotExist() {
        when(repository.findByEmail("inexistente@donaton.cl"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(
                () -> service.findByEmail("inexistente@donaton.cl")
        )
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuario no encontrado");

        verify(repository)
                .findByEmail("inexistente@donaton.cl");
    }

    @Test
    @DisplayName("Debe actualizar los datos editables del usuario")
    void shouldUpdateUser() {
        UserUpdateRequest request = new UserUpdateRequest(
                "Sebastián Actualizado",
                "+56911112222",
                "Nueva dirección 789",
                "Biobío",
                "Concepción"
        );

        when(repository.findById(1L))
                .thenReturn(Optional.of(existingUser));

        when(repository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = service.update(1L, request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name())
                .isEqualTo("Sebastián Actualizado");
        assertThat(response.email())
                .isEqualTo("sebastian@donaton.cl");
        assertThat(response.phone())
                .isEqualTo("+56911112222");
        assertThat(response.address())
                .isEqualTo("Nueva dirección 789");
        assertThat(response.region())
                .isEqualTo("Biobío");
        assertThat(response.comuna())
                .isEqualTo("Concepción");
        assertThat(response.role())
                .isEqualTo("USER");

        verify(repository).findById(1L);
        verify(repository).save(existingUser);
    }

    @Test
    @DisplayName("Debe lanzar una excepción al actualizar un usuario inexistente")
    void shouldThrowWhenUpdatingMissingUser() {
        UserUpdateRequest request = new UserUpdateRequest(
                "Nombre",
                "Teléfono",
                "Dirección",
                "Región",
                "Comuna"
        );

        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuario no encontrado");

        verify(repository).findById(99L);
        verify(repository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Debe eliminar un usuario existente")
    void shouldDeleteUser() {
        when(repository.findById(1L))
                .thenReturn(Optional.of(existingUser));

        service.delete(1L);

        verify(repository).findById(1L);
        verify(repository).delete(existingUser);
    }

    @Test
    @DisplayName("Debe lanzar una excepción al eliminar un usuario inexistente")
    void shouldThrowWhenDeletingMissingUser() {
        when(repository.findById(99L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuario no encontrado");

        verify(repository).findById(99L);
        verify(repository, never()).delete(any(User.class));
    }

    @Test
    @DisplayName("Debe devolver los datos necesarios para autenticación")
    void shouldFindAuthenticationDataByEmail() {
        when(repository.findByEmail("sebastian@donaton.cl"))
                .thenReturn(Optional.of(existingUser));

        UserAuthResponse response =
                service.findAuthByEmail("sebastian@donaton.cl");

        assertThat(response.email())
                .isEqualTo("sebastian@donaton.cl");
        assertThat(response.passwordHash())
                .isEqualTo("encoded-password");
        assertThat(response.role())
                .isEqualTo("USER");

        verify(repository).findByEmail("sebastian@donaton.cl");
    }

    @Test
    @DisplayName("Debe lanzar una excepción cuando no existen datos de autenticación")
    void shouldThrowWhenAuthenticationUserDoesNotExist() {
        when(repository.findByEmail("inexistente@donaton.cl"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(
                () -> service.findAuthByEmail("inexistente@donaton.cl")
        )
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Usuario no encontrado");

        verify(repository)
                .findByEmail("inexistente@donaton.cl");
    }
}