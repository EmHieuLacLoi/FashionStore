package com.emhieulacloi.fashionstore.api.base.entity;

import com.emhieulacloi.fashionstore.api.auth.AuthUtils;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Timestamp;
import java.time.Instant;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity <T, TRepository>  implements Serializable {

    @Serial
    private static final long serialVersionUID = 4047063564010044088L;

    @Column(name = "created_by", updatable = false)
    private Long createdBy;

    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @PrePersist
    public void prePersist() {
        this.createOrUpdateUser(true);
    }

    @PreUpdate
    public void preUpdate() {
        this.createOrUpdateUser(false);
    }

    public void createOrUpdateUser(boolean isCreate) {
        var userId = AuthUtils.getCurrentUserId();
        var now = Timestamp.from(Instant.now());
        this.updatedAt = now;
        if (userId != null) {
            this.updatedBy = userId;
        }
        if (isCreate) {
            this.createdAt = now;
            if (userId != null) {
                this.createdBy = userId;
            }
        }
    }
}
