package com.emhieulacloi.fashionstore.api.enums;

import lombok.Getter;

@Getter
public enum PaymentStatusEnum {
    PENDING(0, "đang chờ"),
    COMPLETED(1, "đã hoàn thành"),
    FAILED(2, "thất bại");

    private final Integer value;
    private final String text;

    PaymentStatusEnum(Integer value, String text) {
        this.value = value;
        this.text = text;
    }
}
