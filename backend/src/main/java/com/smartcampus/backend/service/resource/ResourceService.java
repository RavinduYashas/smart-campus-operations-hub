package com.smartcampus.backend.service.resource;

import com.smartcampus.backend.dto.resource.ResourceFilterDTO;
import com.smartcampus.backend.dto.resource.ResourceRequestDTO;
import com.smartcampus.backend.dto.resource.ResourceResponseDTO;
import com.smartcampus.backend.exception.resource.ResourceConflictException;
import com.smartcampus.backend.exception.resource.ResourceNotFoundException;
import com.smartcampus.backend.model.resource.Resource;
import com.smartcampus.backend.repository.resource.ResourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {
    
    private static final Logger logger = LoggerFactory.getLogger(ResourceService.class);
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    // Create Resource
    @CacheEvict(value = "resources", allEntries = true)
    public ResourceResponseDTO createResource(ResourceRequestDTO request) {
        logger.info("Creating new resource: {}", request.getName());
        
        if (resourceRepository.existsByName(request.getName())) {
            throw new ResourceConflictException("Resource with name '" + request.getName() + "' already exists");
        }
        
        Resource resource = new Resource();
        resource.setResourceCode(request.getResourceCode());
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setBuilding(request.getBuilding());
        resource.setFloor(request.getFloor());
        resource.setStatus(request.getStatus());
        resource.setAvailabilityWindows(request.getAvailabilityWindows());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        resource.setCreatedAt(LocalDateTime.now());
        resource.setUpdatedAt(LocalDateTime.now());
        
        Resource savedResource = resourceRepository.save(resource);
        logger.info("Resource created successfully with id: {}", savedResource.getId());
        
        return new ResourceResponseDTO(savedResource);
    }
    
    // Get All Resources
    @Cacheable(value = "resources", key = "'all'")
    public List<ResourceResponseDTO> getAllResources() {
        logger.info("Fetching all resources");
        return resourceRepository.findAll()
                .stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get Resource by ID
    @Cacheable(value = "resources", key = "#id")
    public ResourceResponseDTO getResourceById(String id) {
        logger.info("Fetching resource with id: {}", id);
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return new ResourceResponseDTO(resource);
    }
    
    // Update Resource
    @CacheEvict(value = "resources", allEntries = true)
    public ResourceResponseDTO updateResource(String id, ResourceRequestDTO request) {
        logger.info("Updating resource with id: {}", id);
        
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        
        if (!resource.getName().equals(request.getName()) && resourceRepository.existsByName(request.getName())) {
            throw new ResourceConflictException("Resource with name '" + request.getName() + "' already exists");
        }
        
        resource.setResourceCode(request.getResourceCode());
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setBuilding(request.getBuilding());
        resource.setFloor(request.getFloor());
        resource.setStatus(request.getStatus());
        resource.setAvailabilityWindows(request.getAvailabilityWindows());
        resource.setDescription(request.getDescription());
        if (request.getImageUrl() != null) {
            resource.setImageUrl(request.getImageUrl());
        }
        resource.setUpdatedAt(LocalDateTime.now());
        
        Resource updatedResource = resourceRepository.save(resource);
        logger.info("Resource updated successfully with id: {}", updatedResource.getId());
        
        return new ResourceResponseDTO(updatedResource);
    }
    
    // Delete Resource
    @CacheEvict(value = "resources", allEntries = true)
    public void deleteResource(String id) {
        logger.info("Deleting resource with id: {}", id);
        
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        
        resourceRepository.deleteById(id);
        logger.info("Resource deleted successfully with id: {}", id);
    }
    
    // Search Resources
    public List<ResourceResponseDTO> searchResources(
            Resource.ResourceStatus status,
            Resource.ResourceType type,
            Integer minCapacity,
            String location) {
        
        logger.info("Searching resources with filters - status: {}, type: {}, minCapacity: {}, location: {}", 
                   status, type, minCapacity, location);
        
        List<Resource> resources;
        
        if (status != null && type != null && minCapacity != null && location != null && !location.isEmpty()) {
            resources = resourceRepository.searchResources(status, type, minCapacity, location);
        } else if (status != null && type != null) {
            resources = resourceRepository.findByStatusAndType(status, type);
        } else if (status != null && minCapacity != null) {
            resources = resourceRepository.findByStatusAndCapacityGreaterThanEqual(status, minCapacity);
        } else if (status != null && location != null && !location.isEmpty()) {
            resources = resourceRepository.findByStatusAndLocationContainingIgnoreCase(status, location);
        } else if (status != null) {
            resources = resourceRepository.findByStatus(status);
        } else if (type != null) {
            resources = resourceRepository.findByType(type);
        } else if (location != null && !location.isEmpty()) {
            resources = resourceRepository.findByLocationContainingIgnoreCase(location);
        } else if (minCapacity != null) {
            resources = resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        } else {
            resources = resourceRepository.findAllActive();
        }
        
        return resources.stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Advanced search
    public List<ResourceResponseDTO> advancedSearch(ResourceFilterDTO filter) {
        logger.info("Advanced search with filter: {}", filter);
        
        List<Resource> resources = resourceRepository.findAll();
        
        if (filter.getStatus() != null) {
            resources = resources.stream()
                    .filter(r -> r.getStatus() == filter.getStatus())
                    .collect(Collectors.toList());
        }
        
        if (filter.getType() != null) {
            resources = resources.stream()
                    .filter(r -> r.getType() == filter.getType())
                    .collect(Collectors.toList());
        }
        
        if (filter.getMinCapacity() != null) {
            resources = resources.stream()
                    .filter(r -> r.getCapacity() >= filter.getMinCapacity())
                    .collect(Collectors.toList());
        }
        
        if (filter.getLocation() != null && !filter.getLocation().isEmpty()) {
            resources = resources.stream()
                    .filter(r -> r.getLocation().toLowerCase().contains(filter.getLocation().toLowerCase()))
                    .collect(Collectors.toList());
        }
        
        if (filter.getSearchTerm() != null && !filter.getSearchTerm().isEmpty()) {
            String term = filter.getSearchTerm().toLowerCase();
            resources = resources.stream()
                    .filter(r -> r.getName().toLowerCase().contains(term) || 
                                (r.getDescription() != null && r.getDescription().toLowerCase().contains(term)))
                    .collect(Collectors.toList());
        }
        
        return resources.stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get Active Resources
    public List<ResourceResponseDTO> getActiveResources() {
        logger.info("Fetching active resources");
        return resourceRepository.findAllActive()
                .stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Update Resource Status
    @CacheEvict(value = "resources", allEntries = true)
    public ResourceResponseDTO updateResourceStatus(String id, Resource.ResourceStatus status) {
        logger.info("Updating resource status for id: {} to {}", id, status);
        
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        
        resource.setStatus(status);
        resource.setUpdatedAt(LocalDateTime.now());
        
        Resource updatedResource = resourceRepository.save(resource);
        
        return new ResourceResponseDTO(updatedResource);
    }
    
    // Bulk Status Update
    @CacheEvict(value = "resources", allEntries = true)
    public List<ResourceResponseDTO> bulkUpdateStatus(List<String> ids, Resource.ResourceStatus status) {
        logger.info("Bulk updating status for {} resources to {}", ids.size(), status);
        
        List<Resource> resources = resourceRepository.findAllById(ids);
        resources.forEach(resource -> {
            resource.setStatus(status);
            resource.setUpdatedAt(LocalDateTime.now());
        });
        
        List<Resource> updatedResources = resourceRepository.saveAll(resources);
        
        return updatedResources.stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get Resources by Type
    public List<ResourceResponseDTO> getResourcesByType(Resource.ResourceType type) {
        logger.info("Fetching resources by type: {}", type);
        return resourceRepository.findByType(type)
                .stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get Resources by Location
    public List<ResourceResponseDTO> getResourcesByLocation(String location) {
        logger.info("Fetching resources by location: {}", location);
        return resourceRepository.findByLocationContainingIgnoreCase(location)
                .stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get Resources by Building
    public List<ResourceResponseDTO> getResourcesByBuilding(String building) {
        logger.info("Fetching resources by building: {}", building);
        return resourceRepository.findByBuilding(building)
                .stream()
                .map(ResourceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get Statistics
    public ResourceStatistics getStatistics() {
        logger.info("Fetching resource statistics");
        
        ResourceStatistics stats = new ResourceStatistics();
        stats.setTotalResources(resourceRepository.count());
        stats.setActiveResources((long) resourceRepository.findByStatus(Resource.ResourceStatus.ACTIVE).size());
        stats.setOutOfServiceResources((long) resourceRepository.findByStatus(Resource.ResourceStatus.OUT_OF_SERVICE).size());
        
        for (Resource.ResourceType type : Resource.ResourceType.values()) {
            stats.setCountByType(type, (long) resourceRepository.findByType(type).size());
        }
        
        return stats;
    }
    
    // Inner class for statistics
    public static class ResourceStatistics {
        private long totalResources;
        private long activeResources;
        private long outOfServiceResources;
        private java.util.Map<Resource.ResourceType, Long> countByType = new java.util.HashMap<>();
        
        public long getTotalResources() { return totalResources; }
        public void setTotalResources(long totalResources) { this.totalResources = totalResources; }
        
        public long getActiveResources() { return activeResources; }
        public void setActiveResources(long activeResources) { this.activeResources = activeResources; }
        
        public long getOutOfServiceResources() { return outOfServiceResources; }
        public void setOutOfServiceResources(long outOfServiceResources) { this.outOfServiceResources = outOfServiceResources; }
        
        public java.util.Map<Resource.ResourceType, Long> getCountByType() { return countByType; }
        public void setCountByType(java.util.Map<Resource.ResourceType, Long> countByType) { this.countByType = countByType; }
        public void setCountByType(Resource.ResourceType type, Long count) { this.countByType.put(type, count); }
    }
}