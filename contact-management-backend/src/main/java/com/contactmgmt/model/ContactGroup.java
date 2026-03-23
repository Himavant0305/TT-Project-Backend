package com.contactmgmt.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "groups")
public class ContactGroup {

    @Id
    private String id;

    @Indexed
    private String ownerId;

    @Indexed
    private String name;

    private String description;

    @Builder.Default
    private List<String> contactIds = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;
}
