package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryCriteria {
    private String name;
    private String description;

    public String getName() {
        return name == null || name.isEmpty() ? null : "%" + name.trim() + "%";
    }
}
