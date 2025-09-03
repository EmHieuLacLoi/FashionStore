package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BaseCriteria {
    private Long id;
    private Long createdById;
    private Long updatedById;
    private LocalDateTime createdAtFrom;
    private LocalDateTime createdAtTo;
    private LocalDateTime updatedAtFrom;
    private LocalDateTime updatedAtTo;
}
