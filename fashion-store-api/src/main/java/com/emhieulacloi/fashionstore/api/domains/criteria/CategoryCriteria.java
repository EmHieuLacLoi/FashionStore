package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryCriteria extends BaseCriteria {
    private String name;
    private String description;
    private Boolean active;
}
