ALTER TABLE delivery_confirmations
    MODIFY recipient_name VARCHAR(150) NULL,
    MODIFY balance_collected_amount DECIMAL(10,2) NULL;
