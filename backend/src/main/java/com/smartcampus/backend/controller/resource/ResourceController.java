// src/main/java/com/smartcampus/backend/controller/ResourceController.java
package com.smartcampus.backend.controller.resource;

import com.smartcampus.backend.dto.resource.ResourceFilterDTO;
import com.smartcampus.backend.dto.resource.ResourceRequestDTO;
import com.smartcampus.backend.dto.resource.ResourceResponseDTO;
import com.smartcampus.backend.model.resource.Resource;
import com.smartcampus.backend.service.resource.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // ==================== GET Endpoints ====================
    
    // GET all resources (Anyone authenticated)
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // GET active resources only
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<List<ResourceResponseDTO>> getActiveResources() {
        return ResponseEntity.ok(resourceService.getActiveResources());
    }

    // GET resource by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // GET resources by type
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<List<ResourceResponseDTO>> getResourcesByType(@PathVariable Resource.ResourceType type) {
        return ResponseEntity.ok(resourceService.getResourcesByType(type));
    }

    // GET resources by location
    @GetMapping("/location")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<List<ResourceResponseDTO>> getResourcesByLocation(@RequestParam String location) {
        return ResponseEntity.ok(resourceService.getResourcesByLocation(location));
    }

    // GET search/filter resources
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<List<ResourceResponseDTO>> searchResources(
            @RequestParam(required = false) Resource.ResourceStatus status,
            @RequestParam(required = false) Resource.ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(resourceService.searchResources(status, type, minCapacity, location));
    }

    // POST advanced search
    @PostMapping("/advanced-search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<List<ResourceResponseDTO>> advancedSearch(@RequestBody ResourceFilterDTO filter) {
        return ResponseEntity.ok(resourceService.advancedSearch(filter));
    }

    // GET resource statistics (ADMIN and MANAGER only)
    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ResourceService.ResourceStatistics> getStatistics() {
        return ResponseEntity.ok(resourceService.getStatistics());
    }

    // ==================== POST Endpoints ====================
    
    // POST create resource (ADMIN only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO request) {
        ResourceResponseDTO created = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ==================== PUT/PATCH Endpoints ====================
    
    // PUT update resource (ADMIN only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceRequestDTO request) {
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    // PATCH update resource status (ADMIN only)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResourceStatus(
            @PathVariable String id,
            @RequestParam Resource.ResourceStatus status) {
        return ResponseEntity.ok(resourceService.updateResourceStatus(id, status));
    }

    // PATCH bulk update status (ADMIN only)
    @PatchMapping("/bulk/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResourceResponseDTO>> bulkUpdateStatus(
            @RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        List<String> ids = (List<String>) request.get("ids");
        Resource.ResourceStatus status = Resource.ResourceStatus.valueOf((String) request.get("status"));
        return ResponseEntity.ok(resourceService.bulkUpdateStatus(ids, status));
    }

    // ==================== DELETE Endpoints ====================
    
    // DELETE resource (ADMIN only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE multiple resources (ADMIN only)
    @DeleteMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMultipleResources(@RequestBody Map<String, List<String>> request) {
        List<String> ids = request.get("ids");
        for (String id : ids) {
            resourceService.deleteResource(id);
        }
        return ResponseEntity.noContent().build();
    }
}