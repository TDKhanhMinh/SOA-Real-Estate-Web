package com.example.ListingService.service;

import com.example.ListingService.model.Property;
import com.example.ListingService.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ListingService {
    private final PropertyRepository propertyRepository;


    public ResponseEntity<List<Property>> getAllProperties() {
        try {
            return new ResponseEntity<List<Property>>(propertyRepository.findAll(), HttpStatus.OK);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }


}
