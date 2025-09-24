package com.emhieulacloi.fashionstore.api.domains.entity;

import com.emhieulacloi.fashionstore.api.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "designs")
@Getter
@Setter
public class Design extends BaseEntity<Long, Category> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "front_image_url")
    private String frontImageUrl;

    @Column(name = "back_image_url")
    private String backImageUrl;
}
