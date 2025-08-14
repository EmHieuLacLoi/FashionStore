package com.emhieulacloi.fashionstore.api.domains.entity;

import com.emhieulacloi.fashionstore.api.base.entity.BaseEntity;
import com.emhieulacloi.fashionstore.api.repository.UserOauthProviderRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_oauth_providers")
public class UserOauthProvider extends BaseEntity<Long, UserOauthProviderRepository> {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "provider")
    private String provider;
    
    @Column(name = "provider_user_id")
    private String providerUserId;
    
    @Column(name = "provider_email")
    private String providerEmail;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
}
