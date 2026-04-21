package com.smartcampus.backend.dto.resource;

import com.smartcampus.backend.model.resource.Resource;
import java.time.LocalDateTime;
import java.util.List;

public class ResourceResponseDTO {
    private String id;
    private String name;
    private Resource.ResourceType type;
    private Integer capacity;
    private String location;
    private Resource.ResourceStatus status;
    private List<Resource.AvailabilityWindow> availabilityWindows;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public ResourceResponseDTO() {}
    
    public ResourceResponseDTO(Resource resource) {
        this.id = resource.getId();
        this.name = resource.getName();
        this.type = resource.getType();
        this.capacity = resource.getCapacity();
        this.location = resource.getLocation();
        this.status = resource.getStatus();
        this.availabilityWindows = resource.getAvailabilityWindows();
        this.description = resource.getDescription();
        this.imageUrl = resource.getImageUrl();
        this.createdAt = resource.getCreatedAt();
        this.updatedAt = resource.getUpdatedAt();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Resource.ResourceType getType() { return type; }
    public void setType(Resource.ResourceType type) { this.type = type; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Resource.ResourceStatus getStatus() { return status; }
    public void setStatus(Resource.ResourceStatus status) { this.status = status; }
    
    public List<Resource.AvailabilityWindow> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<Resource.AvailabilityWindow> availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}