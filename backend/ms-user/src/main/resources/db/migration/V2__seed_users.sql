INSERT INTO users (
    name, email, password, role, phone, address, region, comuna
)
VALUES (
        'Administrador',
        'admin@donaton.cl',
        '$2a$10$7EqJtq98hPqEX7fNZaFWoO4Y2M0oG4kXjP2o4VJ3zX4Zk3Yz7fM5a',
        'ADMIN',
        '+56911111111',
        'Direccion Demo',
        'Metropolitana',
        'Santiago'
       );
INSERT INTO users
(
    name, email, password, role, phone, address, region, comuna
)
VALUES
    (
        'Usuario Demo',
        'user@donaton.cl',
        '$2a$10$7EqJtq98hPqEX7fNZaFWoO4Y2M0oG4kXjP2o4VJ3zX4Zk3Yz7fM5a',
        'USER',
        '+56922222222',
        'Direccion Demo',
        'Metropolitana',
        'Santiago'
    );