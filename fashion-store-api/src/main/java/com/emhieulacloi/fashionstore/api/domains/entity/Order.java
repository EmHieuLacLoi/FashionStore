package com.emhieulacloi.fashionstore.api.domains.entity;

import com.emhieulacloi.fashionstore.api.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order extends BaseEntity<Long, Order> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "status")
    private Integer status;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;
}
