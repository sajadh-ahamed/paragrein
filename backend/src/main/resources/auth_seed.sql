-- Seed roles (idempotent)
INSERT INTO role (name)
SELECT 'ADMIN' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ADMIN');

INSERT INTO role (name)
SELECT 'CUSTOMER' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'CUSTOMER');

INSERT INTO role (name)
SELECT 'DRIVER' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'DRIVER');

INSERT INTO role (name)
SELECT 'WAREHOUSE' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'WAREHOUSE');

INSERT INTO role (name)
SELECT 'FINANCE' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'FINANCE');

INSERT INTO role (name)
SELECT 'OPERATIONS' FROM dual
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'OPERATIONS');

-- Seed one ADMIN user manually (email: admin@gmail.com, password: admin1234)
-- BCrypt hash value for admin1234:
-- $2b$12$bL/rwDGAV/.vZ4LTQpZ0h.97kO0n3aESSniklFzlJ7HaK1ggLixm.
INSERT INTO users (created_at, email, password, phone, status, username, nic)
SELECT NOW(), 'admin@gmail.com', '$2b$12$bL/rwDGAV/.vZ4LTQpZ0h.97kO0n3aESSniklFzlJ7HaK1ggLixm.', '0000000000', 'ACTIVE', 'System Admin', 'ADMIN0001'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gmail.com');

-- Map ADMIN role to admin user (idempotent)
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN role r ON r.name = 'ADMIN'
WHERE u.email = 'admin@gmail.com'
  AND NOT EXISTS (
      SELECT 1
      FROM user_roles ur
      WHERE ur.user_id = u.id
        AND ur.role_id = r.id
  );
