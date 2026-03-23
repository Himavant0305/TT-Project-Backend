package com.contactmgmt.controller;

import com.contactmgmt.dto.GroupRequest;
import com.contactmgmt.dto.GroupResponse;
import com.contactmgmt.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> create(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody GroupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupService.create(user.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<GroupResponse>> list(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(groupService.findAll(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getById(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String id) {
        return ResponseEntity.ok(groupService.findById(user.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponse> update(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String id,
            @Valid @RequestBody GroupRequest request) {
        return ResponseEntity.ok(groupService.update(user.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String id) {
        groupService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/contacts/{contactId}")
    public ResponseEntity<GroupResponse> addContact(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String id,
            @PathVariable String contactId) {
        return ResponseEntity.ok(groupService.addContact(user.getUsername(), id, contactId));
    }

    @DeleteMapping("/{id}/contacts/{contactId}")
    public ResponseEntity<GroupResponse> removeContact(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String id,
            @PathVariable String contactId) {
        return ResponseEntity.ok(groupService.removeContact(user.getUsername(), id, contactId));
    }
}
