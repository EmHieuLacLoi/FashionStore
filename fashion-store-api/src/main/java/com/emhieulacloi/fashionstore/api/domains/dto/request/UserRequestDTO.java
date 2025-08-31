package com.emhieulacloi.fashionstore.api.domains.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @JsonProperty("old_password")
    private String oldPassword;

    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    @JsonProperty("full_name")
    private String fullName;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    @JsonProperty("phone_number")
    private String phoneNumber;

    private Integer status;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @JsonProperty("role_id")
    private Long roleId;
}
