package com.emhieulacloi.fashionstore.api.domains.entity;

import com.emhieulacloi.fashionstore.api.base.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment extends BaseEntity<Long, Payment> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "payment_method")
    private Integer paymentMethod;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "payment_date")
    private Timestamp paymentDate;

    @Column(name = "status")
    private Integer status;
}
