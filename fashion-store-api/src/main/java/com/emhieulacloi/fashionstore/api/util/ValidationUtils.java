package com.emhieulacloi.fashionstore.api.util;

import com.emhieulacloi.fashionstore.api.common.component.MessageResource;
import com.emhieulacloi.fashionstore.api.common.exception.CommonException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ValidationUtils {

    private static Object existing;
    private static Object replacement;

    public static <T> Map<String, T> validCodeList(List<T> list, Function<T, String> getCodeFunction, String code, MessageResource messageResource) {
        return list.stream()
                .filter(Objects::nonNull)
                .filter(item -> getCodeFunction.apply(item) != null && !getCodeFunction.apply(item).trim().isEmpty())
                .collect(Collectors.toMap(
                        getCodeFunction,
                        item -> item,
                        (existing, replacement) -> handleDuplicateCode(existing, replacement, code, messageResource)
                ));
    }

    private static <T> T handleDuplicateCode(T existing, T replacement, String code, MessageResource messageResource) {
        ValidationUtils.existing = existing;
        ValidationUtils.replacement = replacement;
        throw new CommonException()
                .setErrorCode(code, messageResource)
                .setStatusCode(HttpStatus.BAD_REQUEST);
    }

    public static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp",
            "image/heic",
            "image/heif",
            "image/tiff",
            "image/svg+xml",

            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain"
    );


    public static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "bmp", "webp", "heic", "heif", "tiff", "tif", "svg",
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"
    );

    public static boolean isValidPassword(String password) {
        if (password == null || password.trim().isEmpty()) return true;
        if (!password.matches("^\\S{8,}$")) return false;
        if (!password.matches(".*[A-Z].*")) return false;
        if (!password.matches(".*[a-z].*")) return false;
        if (!password.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) return false;
        if (!password.matches(".*\\d.*")) return false;
        return true;
    }

}