INSERT IGNORE INTO roles (id, code, name, description) VALUES
(1, 'CUSTOMER', 'Customer', 'Places parcel delivery orders.'),
(2, 'ADMIN', 'Administrator', 'Manages system setup and administrative controls.'),
(3, 'FINANCE_OFFICER', 'Finance Officer', 'Verifies advance and balance payments.'),
(4, 'PICKUP_AGENT', 'Pickup Agent', 'Handles assigned parcel pickups.'),
(5, 'WAREHOUSE_STAFF', 'Warehouse Staff', 'Processes parcels at the warehouse.'),
(6, 'DRIVER', 'Driver', 'Handles delivery assignments.');

-- Security note: Stage 02 uses a placeholder hash only. Replace with BCrypt hashes during Stage 03 authentication.
INSERT IGNORE INTO users
(id, full_name, username, email, phone_number, password_hash, role_id, account_status, profile_image_path, created_at, updated_at)
VALUES
(1, 'System Administrator', 'admin', 'admin@paragrein.local', '0700000001', '$2a$10$stage02DemoPasswordHashPlaceholder', 2, 'ACTIVE', NULL, NOW(), NOW()),
(2, 'Finance Officer Demo', 'finance', 'finance@paragrein.local', '0700000002', '$2a$10$stage02DemoPasswordHashPlaceholder', 3, 'ACTIVE', NULL, NOW(), NOW()),
(3, 'Pickup Agent Demo', 'pickup.agent', 'pickup.agent@paragrein.local', '0700000003', '$2a$10$stage02DemoPasswordHashPlaceholder', 4, 'ACTIVE', NULL, NOW(), NOW()),
(4, 'Warehouse Staff Demo', 'warehouse.staff', 'warehouse.staff@paragrein.local', '0700000004', '$2a$10$stage02DemoPasswordHashPlaceholder', 5, 'ACTIVE', NULL, NOW(), NOW()),
(5, 'Driver Demo', 'driver.demo', 'driver@paragrein.local', '0700000005', '$2a$10$stage02DemoPasswordHashPlaceholder', 6, 'ACTIVE', NULL, NOW(), NOW()),
(6, 'Customer Demo', 'customer.demo', 'customer@paragrein.local', '0700000006', '$2a$10$stage02DemoPasswordHashPlaceholder', 1, 'ACTIVE', NULL, NOW(), NOW());

INSERT IGNORE INTO employee_profiles
(id, user_id, employee_number, availability_status, designation, joined_date, created_at, updated_at)
VALUES
(1, 2, 'EMP-FIN-001', 'AVAILABLE', 'Finance Officer', '2026-01-05', NOW(), NOW()),
(2, 3, 'EMP-PIC-001', 'AVAILABLE', 'Pickup Agent', '2026-01-05', NOW(), NOW()),
(3, 4, 'EMP-WHS-001', 'AVAILABLE', 'Warehouse Staff', '2026-01-05', NOW(), NOW()),
(4, 5, 'EMP-DRV-001', 'AVAILABLE', 'Delivery Driver', '2026-01-05', NOW(), NOW());

INSERT IGNORE INTO service_areas
(id, name, district, distance_to_hub_km, active, created_at, updated_at)
VALUES
(1, 'Colombo Fort', 'Colombo', 2.50, TRUE, NOW(), NOW()),
(2, 'Dehiwala', 'Colombo', 11.00, TRUE, NOW(), NOW()),
(3, 'Negombo', 'Gampaha', 38.00, TRUE, NOW(), NOW()),
(4, 'Kandy City', 'Kandy', 115.00, TRUE, NOW(), NOW()),
(5, 'Galle City', 'Galle', 126.00, TRUE, NOW(), NOW());

-- Business rule: one active pricing row is used as the default pricing baseline for Stage 02 demos.
INSERT IGNORE INTO service_settings
(id, base_rate, per_km_rate, advance_percentage, active, created_at, updated_at)
VALUES
(1, 500.00, 75.00, 30.00, TRUE, NOW(), NOW());

INSERT IGNORE INTO orders
(id, tracking_number, customer_id, sender_name, sender_phone, sender_address, receiver_name, receiver_phone, receiver_address,
 pickup_area_id, dropoff_area_id, parcel_description, parcel_weight_kg, route_distance_km, base_rate, per_km_rate,
 total_amount, advance_amount, balance_amount, order_status, financial_status, created_at, updated_at)
VALUES
(1, 'PGL-2026-0001', 6, 'Customer Demo', '0700000006', '12 Market Street, Colombo',
 'Receiver One', '0710000001', '45 Beach Road, Dehiwala', 1, 2, 'Documents parcel', 1.20, 11.00, 500.00, 75.00,
 1325.00, 397.50, 927.50, 'PENDING_ADVANCE_VERIFICATION', 'ADVANCE_SUBMITTED', NOW(), NOW()),
(2, 'PGL-2026-0002', 6, 'Customer Demo', '0700000006', '12 Market Street, Colombo',
 'Receiver Two', '0710000002', '88 Main Street, Negombo', 1, 3, 'Small electronics parcel', 2.80, 38.00, 500.00, 75.00,
 3350.00, 1005.00, 2345.00, 'ASSIGNED_TO_PICKUP', 'ADVANCE_VERIFIED', NOW(), NOW()),
(3, 'PGL-2026-0003', 6, 'Customer Demo', '0700000006', '12 Market Street, Colombo',
 'Receiver Three', '0710000003', '10 Temple Road, Kandy', 1, 4, 'Clothing parcel', 3.50, 115.00, 500.00, 75.00,
 9125.00, 2737.50, 6387.50, 'READY_FOR_DISPATCH', 'BALANCE_DUE', NOW(), NOW());

INSERT IGNORE INTO payments
(id, order_id, payment_type, amount, payment_reference, receipt_path, payment_status, verified_by_user_id, verified_at, rejection_reason, created_at, updated_at)
VALUES
(1, 1, 'ADVANCE', 397.50, 'ADV-DEMO-0001', 'uploads/receipts/demo-advance-0001.png', 'SUBMITTED', NULL, NULL, NULL, NOW(), NOW()),
(2, 2, 'ADVANCE', 1005.00, 'ADV-DEMO-0002', 'uploads/receipts/demo-advance-0002.png', 'VERIFIED', 2, NOW(), NULL, NOW(), NOW());

INSERT IGNORE INTO assignments
(id, order_id, assignment_type, assigned_to_user_id, assigned_by_user_id, assignment_status, assigned_at, accepted_at, completed_at)
VALUES
(1, 2, 'PICKUP', 3, 1, 'ASSIGNED', NOW(), NULL, NULL),
(2, 3, 'DELIVERY', 5, 1, 'ASSIGNED', NOW(), NULL, NULL);
