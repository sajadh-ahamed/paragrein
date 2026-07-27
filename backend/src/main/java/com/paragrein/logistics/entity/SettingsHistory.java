package com.paragrein.logistics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "settings_history")
@Data
@EqualsAndHashCode(callSuper = true)
public class SettingsHistory extends BaseEntity {

    @Column(name = "setting_name", nullable = false, length = 100)
    private String settingName;

    @Column(name = "old_value", length = 255)
    private String oldValue;

    @Column(name = "new_value", nullable = false, length = 255)
    private String newValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id")
    private User changedByUser;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;
}
