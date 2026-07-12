package com.donaton.user.repository;

import com.donaton.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository repository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        repository.deleteAll();

        User user = User.builder()
                .name("Sebastián Carrera")
                .email("sebastian@donaton.cl")
                .password("encoded-password")
                .role("USER")
                .phone("+56912345678")
                .address("Av. Principal 123")
                .region("Metropolitana")
                .comuna("Santiago")
                .build();

        savedUser = repository.saveAndFlush(user);
    }

    @Test
    void shouldFindByEmail() {
        Optional<User> result =
                repository.findByEmail("sebastian@donaton.cl");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(savedUser.getId());
        assertThat(result.get().getName()).isEqualTo("Sebastián Carrera");
        assertThat(result.get().getEmail()).isEqualTo("sebastian@donaton.cl");
        assertThat(result.get().getRole()).isEqualTo("USER");
    }

    @Test
    void shouldCheckEmailExists() {
        boolean existingEmail =
                repository.existsByEmail("sebastian@donaton.cl");

        boolean missingEmail =
                repository.existsByEmail("inexistente@donaton.cl");

        assertThat(existingEmail).isTrue();
        assertThat(missingEmail).isFalse();
    }
}