package com.emhieulacloi.fashionstore.api.common.exception;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.component.ResponseData;
import com.emhieulacloi.fashionstore.api.common.contanst.ResponseStatusConst;
import com.emhieulacloi.fashionstore.api.enums.SystemCodeEnum;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageResource messageResource;

    public GlobalExceptionHandler(MessageResource messageResource) {
        this.messageResource = messageResource;
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ResponseData<Object>> handleGeneralException(UsernameNotFoundException ex) {
        String message = messageResource.getMessage(SystemCodeEnum.ERROR_002.getCode());
        ResponseData<Object> data = new ResponseData<>(
                ResponseStatusConst.ERROR,
                message,
                null
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(data);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData<Object>> handleAnyException(Exception ex) {
        Map.Entry<String, HttpStatus> statusEntry = resolveHttpStatus(ex);
        ResponseData<Object> responseData = new ResponseData<>(ResponseStatusConst.ERROR, ex.toString(), statusEntry.getKey());
        return ResponseEntity.status(statusEntry.getValue().value()).body(responseData);
    }

    protected Map.Entry<String, HttpStatus> resolveHttpStatus(Exception ex) {
        if (ex instanceof MaxUploadSizeExceededException) {
            return Map.entry("PAYLOAD_TOO_LARGE", HttpStatus.PAYLOAD_TOO_LARGE);
        } else if (ex instanceof MethodArgumentNotValidException) {
            return Map.entry("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        } else if (ex instanceof HttpMessageNotReadableException) {
            return Map.entry("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        } else if (ex instanceof MissingServletRequestParameterException) {
            return Map.entry("BAD_REQUEST", HttpStatus.BAD_REQUEST);
        } else if (ex instanceof HttpRequestMethodNotSupportedException) {
            return Map.entry("METHOD_NOT_ALLOWED", HttpStatus.METHOD_NOT_ALLOWED);
        }
        return Map.entry("INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
