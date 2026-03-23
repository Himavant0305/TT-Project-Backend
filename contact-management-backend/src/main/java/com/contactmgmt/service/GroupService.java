package com.contactmgmt.service;

import com.contactmgmt.dto.ContactResponse;
import com.contactmgmt.dto.GroupRequest;
import com.contactmgmt.dto.GroupResponse;
import com.contactmgmt.exception.DuplicateResourceException;
import com.contactmgmt.exception.ResourceNotFoundException;
import com.contactmgmt.model.Contact;
import com.contactmgmt.model.ContactGroup;
import com.contactmgmt.repository.ContactGroupRepository;
import com.contactmgmt.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final ContactGroupRepository groupRepository;
    private final ContactRepository contactRepository;

    public GroupResponse create(String ownerId, GroupRequest request) {
        String normalizedName = normalizeName(request.getName());
        if (groupRepository.existsByOwnerIdAndNameIgnoreCase(ownerId, normalizedName)) {
            throw new DuplicateResourceException("Group name already exists");
        }

        List<String> validatedIds = validateContactIds(ownerId, request.getContactIds());

        ContactGroup group = ContactGroup.builder()
                .ownerId(ownerId)
                .name(normalizedName)
                .description(normalizeDescription(request.getDescription()))
                .contactIds(new ArrayList<>(validatedIds))
                .build();

        return toResponse(groupRepository.save(group), ownerId);
    }

    public List<GroupResponse> findAll(String ownerId) {
        return groupRepository.findByOwnerId(ownerId).stream()
                .sorted(Comparator.comparing(ContactGroup::getName, String.CASE_INSENSITIVE_ORDER))
                .map(group -> toResponse(group, ownerId))
                .collect(Collectors.toList());
    }

    public GroupResponse findById(String ownerId, String groupId) {
        ContactGroup group = findOwnedGroup(ownerId, groupId);
        return toResponse(group, ownerId);
    }

    public GroupResponse update(String ownerId, String groupId, GroupRequest request) {
        ContactGroup group = findOwnedGroup(ownerId, groupId);
        String normalizedName = normalizeName(request.getName());

        if (!group.getName().equalsIgnoreCase(normalizedName)
                && groupRepository.existsByOwnerIdAndNameIgnoreCase(ownerId, normalizedName)) {
            throw new DuplicateResourceException("Group name already exists");
        }

        group.setName(normalizedName);
        group.setDescription(normalizeDescription(request.getDescription()));
        group.setContactIds(new ArrayList<>(validateContactIds(ownerId, request.getContactIds())));

        return toResponse(groupRepository.save(group), ownerId);
    }

    public void delete(String ownerId, String groupId) {
        ContactGroup group = findOwnedGroup(ownerId, groupId);
        groupRepository.delete(group);
    }

    public GroupResponse addContact(String ownerId, String groupId, String contactId) {
        ContactGroup group = findOwnedGroup(ownerId, groupId);
        ensureContactOwned(ownerId, contactId);

        List<String> ids = new ArrayList<>(safeIds(group.getContactIds()));
        if (!ids.contains(contactId)) {
            ids.add(contactId);
            group.setContactIds(ids);
            group = groupRepository.save(group);
        }
        return toResponse(group, ownerId);
    }

    public GroupResponse removeContact(String ownerId, String groupId, String contactId) {
        ContactGroup group = findOwnedGroup(ownerId, groupId);
        List<String> ids = new ArrayList<>(safeIds(group.getContactIds()));
        ids.removeIf(id -> id.equals(contactId));
        group.setContactIds(ids);
        return toResponse(groupRepository.save(group), ownerId);
    }

    ContactGroup findOwnedGroup(String ownerId, String groupId) {
        return groupRepository.findByIdAndOwnerId(groupId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found"));
    }

    private List<String> validateContactIds(String ownerId, List<String> contactIds) {
        List<String> normalized = safeIds(contactIds);
        if (normalized.isEmpty()) {
            return normalized;
        }

        List<Contact> contacts = contactRepository.findByOwnerIdAndIdIn(ownerId, normalized);
        if (contacts.size() != normalized.size()) {
            throw new ResourceNotFoundException("One or more contacts were not found");
        }

        return normalized;
    }

    private void ensureContactOwned(String ownerId, String contactId) {
        contactRepository.findByIdAndOwnerId(contactId, ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    private GroupResponse toResponse(ContactGroup group, String ownerId) {
        List<String> ids = safeIds(group.getContactIds());

        // To keep group endpoints fast and reliable, we return only `contactIds`.
        // The frontend can render member cards by matching these IDs against the
        // contacts it already fetched from `/api/contacts`.
        return GroupResponse.builder()
                .id(group.getId())
                .ownerId(group.getOwnerId())
                .name(group.getName())
                .description(group.getDescription())
                .contactIds(ids)
                .contacts(List.of())
                .createdAt(group.getCreatedAt())
                .build();
    }

    private List<String> safeIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return ids.stream()
                .filter(id -> id != null && !id.isBlank())
                .distinct()
                .collect(Collectors.toList());
    }

    private String normalizeName(String raw) {
        return raw == null ? "" : raw.trim();
    }

    private String normalizeDescription(String raw) {
        return raw == null ? "" : raw.trim();
    }

    private ContactResponse toContactResponse(Contact c) {
        return ContactResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .ownerId(c.getOwnerId())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
