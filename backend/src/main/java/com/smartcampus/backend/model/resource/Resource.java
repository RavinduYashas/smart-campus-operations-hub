package com.smartcampus.backend.model.resource;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "resources")
public class Resource {
    
    @Id
    private String id;
    
    @Indexed
    private String resourceCode;
    
    @Indexed
    private String name;
    
    private ResourceType type;
    private Integer capacity;
    private String location;
    private String building;
    private String floor;
    private ResourceStatus status;
    private List<AvailabilityWindow> availabilityWindows = new ArrayList<>();
    private String description;
    private String imageUrl;
    private String imagePublicId;  // For cloud storage
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum ResourceType {
        LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT, OTHER
    }
    
    public enum ResourceStatus {
        ACTIVE, OUT_OF_SERVICE
    }
    
    public static class AvailabilityWindow {
        private String dayOfWeek;
        private String startTime;
        private String endTime;
        
        public AvailabilityWindow() {}
        
        public AvailabilityWindow(String dayOfWeek, String startTime, String endTime) {
            this.dayOfWeek = dayOfWeek;
            this.startTime = startTime;
            this.endTime = endTime;
        }
        
        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        public String getStartTime() { return startTime; }
        public void setStartTime(String startTime) { this.startTime = startTime; }
        public String getEndTime() { return endTime; }
        public void setEndTime(String endTime) { this.endTime = endTime; }
    }
    
    public Resource() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getResourceCode() { return resourceCode; }
    public void setResourceCode(String resourceCode) { this.resourceCode = resourceCode; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }
    
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    
    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }
    
    public List<AvailabilityWindow> getAvailabilityWindows() { return availabilityWindows; }
    public void setAvailabilityWindows(List<AvailabilityWindow> availabilityWindows) {
        this.availabilityWindows = availabilityWindows;
    }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getImagePublicId() { return imagePublicId; }
    public void setImagePublicId(String imagePublicId) { this.imagePublicId = imagePublicId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}