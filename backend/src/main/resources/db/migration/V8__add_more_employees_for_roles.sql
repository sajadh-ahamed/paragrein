-- Add more employees for each role:
-- 3 Drivers, 3 Pickup Agents, 3 Finance Officers, 3 Warehouse Staff.
-- Default password: Password@123 (demohash: $2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K)

-- 1. Insert new users
INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Finance Officer Two', 'finance2', 'finance2@paragrein.local', '0700000017', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'FINANCE_OFFICER';

INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Finance Officer Three', 'finance3', 'finance3@paragrein.local', '0700000018', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'FINANCE_OFFICER';

INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Pickup Agent Two', 'pickup2', 'pickup2@paragrein.local', '0700000019', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'PICKUP_AGENT';

INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Pickup Agent Three', 'pickup3', 'pickup3@paragrein.local', '0700000020', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'PICKUP_AGENT';

INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Warehouse Staff Two', 'warehouse2', 'warehouse2@paragrein.local', '0700000021', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'WAREHOUSE_STAFF';

INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Warehouse Staff Three', 'warehouse3', 'warehouse3@paragrein.local', '0700000022', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'WAREHOUSE_STAFF';

INSERT INTO users (full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
SELECT 'Driver Two', 'driver2', 'driver2@paragrein.local', '0700000023', '$2a$10$g6KUPMAxnM4iVvOuRnDuaehTRkdp3I1Uu9wWZuGhRYbdy2.fkDg7K', r.id, 'ACTIVE', NULL, NOW(), NOW()
FROM roles r WHERE r.code = 'DRIVER';


-- 2. Insert corresponding employee profiles mapping to the newly created users
INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-FIN-002', 'AVAILABLE', 'Finance Officer', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'finance2';

INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-FIN-003', 'AVAILABLE', 'Finance Officer', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'finance3';

INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-PIC-002', 'AVAILABLE', 'Pickup Agent', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'pickup2';

INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-PIC-003', 'AVAILABLE', 'Pickup Agent', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'pickup3';

INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-WHS-002', 'AVAILABLE', 'Warehouse Staff', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'warehouse2';

INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-WHS-003', 'AVAILABLE', 'Warehouse Staff', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'warehouse3';

INSERT INTO employee_profiles (user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
SELECT u.id, 'EMP-DRV-002', 'AVAILABLE', 'Delivery Driver', '2026-02-01', NOW(), NOW()
FROM users u WHERE u.username = 'driver2';
