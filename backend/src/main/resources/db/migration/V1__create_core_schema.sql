CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    account_status VARCHAR(30) NOT NULL,
    profile_image_path VARCHAR(255),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS employee_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    employee_number VARCHAR(40) NOT NULL UNIQUE,
    availability_status VARCHAR(30) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    joined_date DATE NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_employee_profiles_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_areas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    district VARCHAR(120) NOT NULL,
    distance_to_hub_km DECIMAL(10,2) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    base_rate DECIMAL(10,2) NOT NULL,
    per_km_rate DECIMAL(10,2) NOT NULL,
    advance_percentage DECIMAL(5,2) NOT NULL,
    active BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    setting_name VARCHAR(100) NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255) NOT NULL,
    changed_by_user_id BIGINT,
    changed_at DATETIME NOT NULL,
    CONSTRAINT fk_settings_history_changed_by FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tracking_number VARCHAR(40) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_phone VARCHAR(30) NOT NULL,
    sender_address VARCHAR(500) NOT NULL,
    receiver_name VARCHAR(150) NOT NULL,
    receiver_phone VARCHAR(30) NOT NULL,
    receiver_address VARCHAR(500) NOT NULL,    
    pickup_address VARCHAR(500) NOT NULL,
    dropoff_address VARCHAR(500) NOT NULL,
    parcel_description VARCHAR(500) NOT NULL,
    parcel_weight_kg DECIMAL(10,2) NOT NULL,
    route_distance_km DECIMAL(10,2) NOT NULL,
    base_rate DECIMAL(10,2) NOT NULL,
    per_km_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    advance_amount DECIMAL(10,2) NOT NULL,
    balance_amount DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(60) NOT NULL,
    financial_status VARCHAR(60) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    previous_status VARCHAR(60),
    new_status VARCHAR(60) NOT NULL,
    changed_by_user_id BIGINT,
    note VARCHAR(500),
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_order_status_history_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_status_history_changed_by FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    payment_type VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_reference VARCHAR(120),
    receipt_path VARCHAR(255),
    payment_status VARCHAR(30) NOT NULL,
    verified_by_user_id BIGINT,
    verified_at DATETIME,
    rejection_reason VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_payments_verified_by FOREIGN KEY (verified_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    assignment_type VARCHAR(30) NOT NULL,
    assigned_to_user_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT,
    assignment_status VARCHAR(30) NOT NULL,
    assigned_at DATETIME NOT NULL,
    accepted_at DATETIME,
    completed_at DATETIME,
    CONSTRAINT fk_assignments_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_assignments_assigned_to FOREIGN KEY (assigned_to_user_id) REFERENCES users(id),
    CONSTRAINT fk_assignments_assigned_by FOREIGN KEY (assigned_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS warehouse_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL UNIQUE,
    received_by_user_id BIGINT,
    parcel_condition VARCHAR(120) NOT NULL,
    storage_zone VARCHAR(60),
    storage_rack VARCHAR(60),
    notes VARCHAR(500),
    received_at DATETIME NOT NULL,
    ready_for_dispatch_at DATETIME,
    CONSTRAINT fk_warehouse_records_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_warehouse_records_received_by FOREIGN KEY (received_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS delivery_confirmations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL UNIQUE,
    driver_user_id BIGINT NOT NULL,
    recipient_name VARCHAR(150) NOT NULL,
    balance_collected_amount DECIMAL(10,2) NOT NULL,
    proof_image_path VARCHAR(255),
    delivery_notes VARCHAR(500),
    reached_destination_at DATETIME,
    delivered_at DATETIME,
    CONSTRAINT fk_delivery_confirmations_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_delivery_confirmations_driver FOREIGN KEY (driver_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    notification_type VARCHAR(30) NOT NULL,
    read_status VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(120) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS issue_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reported_by_user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    
    -- VIVA MODIFICATION: Added a new column to categorize the issue.
    -- This helps in routing the issue to the correct team (e.g., developers for bugs, designers for UI).
    issue_category VARCHAR(50) NOT NULL,

    severity VARCHAR(20) NOT NULL,
    issue_status VARCHAR(30) NOT NULL,
    admin_response VARCHAR(1000),
    resolved_by_user_id BIGINT,
    created_at DATETIME NOT NULL,
    resolved_at DATETIME,
    CONSTRAINT fk_issue_reports_reported_by FOREIGN KEY (reported_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_issue_reports_resolved_by FOREIGN KEY (resolved_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id BIGINT,
    description VARCHAR(1000) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_assignments_order_id ON assignments(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
