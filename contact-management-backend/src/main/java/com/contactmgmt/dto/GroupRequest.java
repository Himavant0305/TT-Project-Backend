package com.contactmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class GroupRequest {

    @NotBlank
    @Size(max = 80)
    private String name;

    @Size(max = 250)
    private String description;

    private List<String> contactIds;
}
