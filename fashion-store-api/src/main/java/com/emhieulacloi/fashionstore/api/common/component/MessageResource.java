package com.emhieulacloi.fashionstore.api.common.component;

import com.emhieulacloi.fashionstore.api.util.Constants;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class MessageResource {
    private final MessageSource messageSource;

    public MessageResource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getMessage(String messageCode) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(messageCode, null, locale);
    }


    public String getMessage(String messageCode, Object[] args) {
        Locale locale = LocaleContextHolder.getLocale();
        return messageSource.getMessage(messageCode, args, locale);
    }

    public String getMessage(String messageCode, Object[] args, Locale locale) {
        if (locale == null) {
            locale = new Locale(Constants.DEFAULT_LANGUAGE);
        }
        return messageSource.getMessage(messageCode, args, locale);
    }
}

