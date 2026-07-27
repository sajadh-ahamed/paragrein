-- Security note: demo driver account uses Password@123 for offline viva testing only.
INSERT INTO users
(full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Driver Stage 11 Demo', 'driver', 'driver.stage11@paragrein.local', '0700010011',
       '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K',
       r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r
WHERE r.code = 'DRIVER'
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.username = 'driver' OR u.email = 'driver.stage11@paragrein.local');

INSERT INTO employee_profiles
(user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-DRV-STAGE11', 'AVAILABLE', 'Delivery Driver', '2026-06-15', NOW(), NOW()
FROM users u
WHERE u.username = 'driver'
  AND NOT EXISTS (SELECT 1 FROM employee_profiles ep WHERE ep.employee_number = 'EMP-DRV-STAGE11');
