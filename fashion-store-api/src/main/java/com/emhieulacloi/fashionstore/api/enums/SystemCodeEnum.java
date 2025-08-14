package com.emhieulacloi.fashionstore.api.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
@AllArgsConstructor
public enum SystemCodeEnum {
    ERROR_001("ERROR-001","Max") ,
    ERROR_002("ERROR-002", null) ,
    ERROR_003("ERROR-003", null) ,
    ERROR_004("ERROR-004", null) ,
    ERROR_005("ERROR-005", "Entity not found"),
    ERROR_006("ERROR-006", "Code already exists"),
    ERROR_007("ERROR-007", "Missing project group ID in Project Details for duplication"),
    ERROR_008("ERROR-008", "Data is empty"),
    ERROR_009("ERROR-009", "Name is required"),
    ERROR_010("ERROR-010", "Cannot delete entity"),
    ERROR_011("ERROR-011", "The From date must be on or before the To date"),
    ERROR_012("ERROR-012", "User already exists"),
    ERROR_013("ERROR-013", "Phone number already exists"),
    ERROR_014("ERROR-014", "File not found"),
    ERROR_015("ERROR-015", "Cannot delete started project"),
    ERROR_016("ERROR-016", null),
    ERROR_017("ERROR-017", null),
    ERROR_018("ERROR-018", null),
    ERROR_019("ERROR-019", null),
    ERROR_020("ERROR-020", "Reload new version project"),
    ERROR_021("ERROR-021", "Environment of vehicle != environment of vehicle group"),

    ERROR_026("ERROR-026", "Audit does not exist"),
    ERROR_028("ERROR-028", "List items and list ids are not same size"),

    ERROR_044("ERROR-044", "Updated value does not meet the constraint conditions"),
    ;

    private final String code;
    private final String validationCode;

    private static Map<String, SystemCodeEnum> map = new HashMap<>();
    private static Map<String, SystemCodeEnum> mapValidator = new HashMap<>();

    static {
        for (SystemCodeEnum value : SystemCodeEnum.values()) {
            map.put(value.code, value);
            if (value.validationCode != null) {
                mapValidator.put(value.validationCode, value);
            }
        }
    }

    public static SystemCodeEnum valueOfByKey(String code) {
        return map.get(code);
    }

    public static SystemCodeEnum valueValidator(String validationCode) {
        return mapValidator.get(validationCode);
    }
}
