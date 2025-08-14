package com.emhieulacloi.fashionstore.api.enums;

import lombok.Getter;

@Getter
public enum RoleEnum {

    ADMIN(1, "admin"),
    USER(2, "user");

    private final Integer value;

    private final String text;

    RoleEnum(Integer value, String text) {
        this.value = value;
        this.text = text;
    }
}
