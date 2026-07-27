-- Update Admin user's email to admin@gmail.com and password to Admin@123
UPDATE users
SET email = 'admin@gmail.com',
    password_hash = '$2a$10$MTuAvUQFCgHt32zm3NWXO.LuYh2MOoGHDzO7Jk/BZUMzZD5BM6NQm',
    updated_at = NOW()
WHERE username = 'admin';
