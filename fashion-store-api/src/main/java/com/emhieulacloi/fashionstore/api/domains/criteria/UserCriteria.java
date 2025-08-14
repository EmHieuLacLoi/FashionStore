package com.emhieulacloi.fashionstore.api.domains.criteria;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCriteria {
    String code;
    String name;
    Integer status;
}
