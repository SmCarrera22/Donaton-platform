package com.donaton.user.repository;

import com.donaton.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository repository;

    @Test
    void shouldFindByEmail() {
        User user = User.builder()
                .name("John")
                .email("john@test.com")
                .password("1234")
                .build();

        repository.save(user);

        Optional<User> result = repository.findByEmail("john@test.com");

        assertTrue(result.isPresent());
    }

    @Test
    void shouldCheckEmailExists() {
        User user = User.builder()
                .name("John")
                .email("john@test.com")
                .password("1234")
                .build();

        repository.save(user);

        boolean exists = repository.existsByEmail("john@test.com");

        assertTrue(exists);
    }
}