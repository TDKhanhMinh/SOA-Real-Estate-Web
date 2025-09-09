package com.example.ListingService.service;

import com.example.ListingService.entity.Properties;
import com.example.ListingService.repository.PropertiesRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PropertiesService {
    private final PropertiesRepo propertiesRepo;


    public ResponseEntity<List<Properties>> getAllProperties() {
        try {
            return new ResponseEntity<List<Properties>>(propertiesRepo.findAll(), HttpStatus.OK);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }


}
