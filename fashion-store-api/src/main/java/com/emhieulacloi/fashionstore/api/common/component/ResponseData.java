package com.emhieulacloi.fashionstore.api.common.component;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@NoArgsConstructor
public class ResponseData<T> implements Serializable {
    @Serial
    private static final long serialVersionUID = 8703012544712246658L;

    @JsonProperty("error_status")
    private int errorStatus;

    @JsonProperty("error_message")
    private String errorMessage;

    @JsonProperty("error_code")
    private String errorCode;

    private transient T data;

    public ResponseData(int errorStatus, T data) {
        this.errorStatus = errorStatus;
        this.errorMessage = null;
        this.errorCode = null;
        this.data = data;
    }

    public ResponseData(int errorStatus, String message , String errorCode) {
        this.errorStatus = errorStatus;
        this.errorMessage = message;
        this.errorCode = errorCode;
        this.data = null;
    }
}
