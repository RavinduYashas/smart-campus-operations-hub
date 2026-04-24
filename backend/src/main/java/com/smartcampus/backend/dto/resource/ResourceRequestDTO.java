package com.smartcampus.backend.dto.resource;

import com.smartcampus.backend.model.resource.Resource;
import jakarta.validation.constraints.*;
import java.util.List;

public class ResourceRequestDTO {
    
    private String resourceCode;
    
    @NotBlank(message = "Resource name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Resource type is required")
    private Resource.ResourceType type;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 1000, message = "Capacity cannot exceed 1000")
    private Integer capacity;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    private String building;
    private String floor;
    
    @NotNull(message = "Status is required")
    private Resource.ResourceStatus status;
    
    private List<Resource.AvailabilityWindow> availabilityWindows;
    private String description;
    private String imageUrl;
    
    // Getters and Setters
    public String getResourceCode() { return resourceCode; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Resource.ResourceType getType() { return type; }
    public void setType(Resource.ResourceType type) { this.type = type; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    
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
}