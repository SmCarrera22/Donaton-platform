CREATE TABLE donations (
                           id BIGSERIAL PRIMARY KEY,
                           donor_id BIGINT NOT NULL,
                           donor_type VARCHAR(50) NOT NULL,
                           resource_type VARCHAR(50) NOT NULL,
                           quantity INT NOT NULL,
                           description VARCHAR(255),
                           status VARCHAR(50) NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);