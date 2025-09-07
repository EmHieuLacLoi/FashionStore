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
@Table(name = "product_variants")
@Getter
@Setter
public class ProductVariant extends BaseEntity<Long, ProductVariant> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "color")
    private String color;

    @Column(name = "size")
    private String size;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;
}
