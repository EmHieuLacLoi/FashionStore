package com.emhieulacloi.fashionstore.api.enums;

import lombok.Getter;

@Getter
public enum ActivityStatus {
    INACTIVE(0, "không hoạt động"),
    ACTIVE(1, "hoạt động");

    private final int value;
    private final String text;

    ActivityStatus(int value, String text) {
        this.value = value;
        this.text = text;
    }
}
