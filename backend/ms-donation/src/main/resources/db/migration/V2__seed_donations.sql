INSERT INTO donations (
    donor_id,
    donor_type,
    resource_type,
    quantity,
    description,
    status,
    created_at
)
VALUES
    (
        1,
        'PERSONA',
        'ROPA',
        10,
        'Abrigo de invierno',
        'PENDIENTE',
        CURRENT_TIMESTAMP
    ),
    (
        2,
        'EMPRESA',
        'ALIMENTOS',
        50,
        'Canastas básicas',
        'VALIDADO',
        CURRENT_TIMESTAMP
    );