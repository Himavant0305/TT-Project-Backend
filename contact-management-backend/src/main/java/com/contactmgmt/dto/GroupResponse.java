package com.contactmgmt.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupResponse {

    private String id;
    private String ownerId;
    private String name;
    private String description;
    private List<String> contactIds;
    private List<ContactResponse> contacts;
    private Instant createdAt;
}
