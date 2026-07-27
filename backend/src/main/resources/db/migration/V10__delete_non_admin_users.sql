-- Clear all user-related data except for the admin user
SET FOREIGN_KEY_CHECKS=0;

-- We delete all records from child tables that reference users who are NOT the admin.
DELETE FROM audit_logs WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM delivery_confirmations WHERE driver_user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM employee_profiles WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM issue_reports WHERE reported_by_user_id IN (SELECT id FROM users WHERE username != 'admin') OR resolved_by_user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM order_status_history WHERE changed_by_user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM orders WHERE customer_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM password_reset_tokens WHERE user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM payments WHERE verified_by_user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM settings_history WHERE changed_by_user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM warehouse_records WHERE received_by_user_id IN (SELECT id FROM users WHERE username != 'admin');
DELETE FROM assignments WHERE assigned_to_user_id IN (SELECT id FROM users WHERE username != 'admin') OR assigned_by_user_id IN (SELECT id FROM users WHERE username != 'admin');

-- Now, delete all users except the admin
DELETE FROM users WHERE username != 'admin';

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;
