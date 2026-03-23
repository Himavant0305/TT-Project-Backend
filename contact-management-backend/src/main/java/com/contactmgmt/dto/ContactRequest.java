package com.contactmgmt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(max = 32)
    private String phone;

    @Size(max = 500)
    private String address;
}
