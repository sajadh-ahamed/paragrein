-- Security note: demo accounts share Password@123 for local Stage 03 authentication testing only.
UPDATE users
SET password_hash = '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K',
    updated_at = NOW()
WHERE username IN ('admin', 'finance', 'pickup.agent', 'warehouse.staff', 'driver.demo', 'customer.demo');
