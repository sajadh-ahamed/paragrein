UPDATE users
SET username = 'customer'
WHERE username = 'customer.demo'
  AND NOT EXISTS (
      SELECT 1
      FROM (SELECT id FROM users WHERE username = 'customer') existing_customer
  );
