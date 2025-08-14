package com.emhieulacloi.fashionstore.api.common.component;

import com.emhieulacloi.fashionstore.api.common.contanst.ResponseStatusConst;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import java.io.Serializable;
import java.lang.reflect.UndeclaredThrowableException;

@Slf4j
public class ResponseDataConfiguration implements Serializable {
    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <T> ResponseEntity<T> success(T body) {
        ResponseData<T> responseData = new ResponseData<>(ResponseStatusConst.SUCCESS, body);
        return new ResponseEntity(responseData, HttpStatus.OK);
    }

    public static ResponseEntity<ResponseData<Void>> success() {
        ResponseData<Void> responseData = new ResponseData<>(ResponseStatusConst.SUCCESS, null);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }



    public static <T> ResponseEntity<T> handleResponseException(Exception exception) {
        if (exception instanceof CommonException) {
            CommonException commonEx = (CommonException) exception;
            return ResponseDataConfiguration.error(ResponseStatusConst.ERROR, commonEx.getMessage(), commonEx.getErrorCode(), commonEx.getStatusCode());
        } else if (exception instanceof UndeclaredThrowableException) {
            UndeclaredThrowableException ex = (UndeclaredThrowableException) exception;
            CommonException commonEx = (CommonException) ex.getUndeclaredThrowable();
            return ResponseDataConfiguration.error(ResponseStatusConst.ERROR, commonEx.getMessage(), commonEx.getErrorCode(), commonEx.getStatusCode());
        } else if (exception instanceof BadCredentialsException) {
            CommonException commonEx = new CommonException();
            commonEx.setMessage("Invalid username or password");
            return ResponseDataConfiguration.error(ResponseStatusConst.ERROR, commonEx.getMessage(), null, HttpStatus.UNAUTHORIZED);
        } else {
            log.error("=== An exception occurred", exception);
            return ResponseDataConfiguration.error(ResponseStatusConst.ERROR, exception.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <T> ResponseEntity<T> error(int status, String massage, String error, HttpStatus httpStatus) {
        ResponseData<T> responseData = new ResponseData<>(status, massage, error);
        return new ResponseEntity(responseData, httpStatus);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <T> ResponseEntity<T> error(ResponseData data, HttpStatus status) {
        return new ResponseEntity(data, status);
    }
}
