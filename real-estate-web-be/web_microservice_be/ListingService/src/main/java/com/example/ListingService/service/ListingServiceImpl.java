package com.example.ListingService.service;

import com.example.ListingService.model.Property;
import com.example.ListingService.repository.PropertyImageRepository;
import com.example.ListingService.repository.PropertyRepository;
import com.example.ListingService.request.CreatePropertyRequest;
import com.example.ListingService.request.PropertyActionRequest;
import com.example.ListingService.request.UpdatePropertyRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ListingServiceImpl implements ListingService{
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;

    @Override
    public Property createProperty(Long userId, CreatePropertyRequest request) {
        return null;
    }

    @Override
    public void submitProperty(Long userId, Long propertyId) {

    }

    @Override
    public Property updateProperty(Long userId, Long propertyId, UpdatePropertyRequest request) {
        return null;
    }

    @Override
    public void toggleVisibility(Long userId, Long propertyId) {

    }

    @Override
    public void markAsSold(Long userId, Long propertyId) {

    }

    @Override
    public void markAsRented(Long userId, Long propertyId) {

    }

    @Override
    public void deleteProperty(Long userId, Long propertyId) {

    }

    @Override
    public void approveProperty(Long propertyId, PropertyActionRequest request) {

    }
}
