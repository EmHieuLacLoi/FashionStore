package com.emhieulacloi.fashionstore.api.config;

import org.modelmapper.Condition;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        Condition<Object, Object> ignoreDifferentTypes = context -> context.getSource() == null ||
                context.getSourceType().equals(context.getDestinationType());
        modelMapper.getConfiguration()
                .setPropertyCondition(ignoreDifferentTypes)
                .setFieldMatchingEnabled(true) ;

        return modelMapper;
    }
}
