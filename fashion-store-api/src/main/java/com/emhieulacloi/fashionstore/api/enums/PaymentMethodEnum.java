package com.emhieulacloi.fashionstore.api.enums;

import lombok.Getter;

@Getter
public enum PaymentMethodEnum {
    MOMO(0, "MoMo"),
    ZALOPAY(1, "ZaloPay"),
    COD(2, "COD"),
    BANK_TRANSFER(3, "Ngân hàng");

    private final Integer value;
    private final String text;

    PaymentMethodEnum(Integer value, String text) {
        this.value = value;
        this.text = text;
    }
}
