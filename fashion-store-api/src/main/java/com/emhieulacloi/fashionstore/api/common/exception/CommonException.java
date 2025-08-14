package com.emhieulacloi.fashionstore.api.common.exception;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.io.Serial;

@Getter
public class CommonException extends RuntimeException {
  @Serial
  private static final long serialVersionUID = -3258098393078013278L;
  private String message;
  private String errorCode;
  private HttpStatus statusCode = HttpStatus.BAD_REQUEST;
  private transient Object errorDetailCustom;

  public CommonException() {
    super();
  }

  public CommonException(String message) {
    super(message);
    this.message = message;
  }

  @Override
  public String getMessage() {
    return message;
  }

  public CommonException setMessage(String message) {
    this.message = message;
    return this;
  }

  public CommonException setErrorCode(String errorCode, MessageResource messageResource) {
    this.errorCode = errorCode;
    this.message = messageResource.getMessage(errorCode);
    return this;
  }

  public CommonException setErrorCode(String errorCode, MessageResource messageResource, Object[] args) {
    this.errorCode = errorCode;
    this.message = messageResource.getMessage(errorCode, args);
    return this;
  }

  public CommonException setStatusCode(HttpStatus statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  public CommonException setErrorDetailCustom(Object errorDetailCustom) {
    this.errorDetailCustom = errorDetailCustom;
    return this;
  }
}