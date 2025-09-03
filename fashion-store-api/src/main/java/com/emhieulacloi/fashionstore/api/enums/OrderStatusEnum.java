package com.emhieulacloi.fashionstore.api.enums;

import lombok.Getter;

@Getter
public enum OrderStatusEnum {
    PENDING(0, "đang chờ"),
    PROCESSING(1, "đang xử lí"),
    SHIPPED(2, "đã giao"),
    COMPLETED(3, "đã hoàn thành"),
    CANCELLED(4, "đã hủy");

    private final Integer value;
    private final String text;

    OrderStatusEnum(Integer value, String text) {
        this.value = value;
        this.text = text;
    }
}
