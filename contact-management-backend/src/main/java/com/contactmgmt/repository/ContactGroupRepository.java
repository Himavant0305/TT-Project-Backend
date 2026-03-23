package com.contactmgmt.repository;

import com.contactmgmt.model.ContactGroup;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ContactGroupRepository extends MongoRepository<ContactGroup, String> {

    List<ContactGroup> findByOwnerId(String ownerId);

    Optional<ContactGroup> findByIdAndOwnerId(String id, String ownerId);

    boolean existsByOwnerIdAndNameIgnoreCase(String ownerId, String name);

    List<ContactGroup> findByOwnerIdAndContactIdsContaining(String ownerId, String contactId);
}
