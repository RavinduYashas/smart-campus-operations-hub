// src/main/java/com/smartcampus/backend/repository/resource/ResourceRepository.java
package com.smartcampus.backend.repository.resource;

import com.smartcampus.backend.model.resource.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    List<Resource> findByStatus(Resource.ResourceStatus status);
    
    List<Resource> findByType(Resource.ResourceType type);
    
    List<Resource> findByLocationContainingIgnoreCase(String location);
    
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
    
    List<Resource> findByNameContainingIgnoreCase(String name);
    
    List<Resource> findByStatusAndType(Resource.ResourceStatus status, Resource.ResourceType type);
    
    List<Resource> findByStatusAndCapacityGreaterThanEqual(Resource.ResourceStatus status, Integer capacity);
    
    List<Resource> findByStatusAndLocationContainingIgnoreCase(Resource.ResourceStatus status, String location);
    
    @Query("{ 'status': ?0, 'type': ?1, 'capacity': { $gte: ?2 }, 'location': { $regex: ?3, $options: 'i' } }")
    List<Resource> searchResources(Resource.ResourceStatus status, Resource.ResourceType type, 
                                   Integer minCapacity, String location);
    
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Resource> searchByNameOrDescription(String searchTerm);
    
    @Query("{ 'status': 'ACTIVE', $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Resource> searchActiveByNameOrDescription(String searchTerm);
    
    @Query("{ 'status': 'ACTIVE' }")
    List<Resource> findAllActive();
    
    boolean existsByName(String name);
}