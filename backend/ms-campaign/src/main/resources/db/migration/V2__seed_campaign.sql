INSERT INTO campaign
(
    title,
    description,
    goal_amount,
    collected_amount,
    status,
    created_at,
    end_date
)
VALUES
    (
        'Campaña invierno 2026',
        'Recolección de ropa para personas afectadas por bajas temperaturas',
        1000,
        250,
        'ACTIVA',
        NOW(),
        '2026-08-01'
    );


INSERT INTO campaign
(
    title,
    description,
    goal_amount,
    collected_amount,
    status,
    created_at,
    end_date
)
VALUES
    (
        'Ayuda alimentos',
        'Campaña de alimentos no perecibles',
        500,
        100,
        'ACTIVA',
        NOW(),
        '2026-09-01'
    );