// src/main/java/com/smartcampus/backend/dto/resource/ResourceFilterDTO.java
package com.smartcampus.backend.dto.resource;

import com.smartcampus.backend.model.resource.Resource;

public class ResourceFilterDTO {
    private Resource.ResourceType type;
    private Integer minCapacity;
    private String location;
    private Resource.ResourceStatus status;
    private String searchTerm;

    public ResourceFilterDTO() {}

    // Getters and Setters
    public Resource.ResourceType getType() { return type; }
    public void setType(Resource.ResourceType type) { this.type = type; }
    
    public Integer getMinCapacity() { return minCapacity; }
    public void setMinCapacity(Integer minCapacity) { this.minCapacity = minCapacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Resource.ResourceStatus getStatus() { return status; }
    public void setStatus(Resource.ResourceStatus status) { this.status = status; }
    
    public String getSearchTerm() { return searchTerm; }
    public void setSearchTerm(String searchTerm) { this.searchTerm = searchTerm; }
}