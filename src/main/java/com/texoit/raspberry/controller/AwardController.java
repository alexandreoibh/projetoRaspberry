package com.texoit.raspberry.controller;

import com.texoit.raspberry.dto.ProducerIntervalResponseDTO;
import com.texoit.raspberry.service.AwardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AwardController {
    
    private final AwardService awardService;
    
    public AwardController(AwardService awardService) {
        this.awardService = awardService;
    }
    
    @GetMapping("/producers/intervals")
    public ResponseEntity<ProducerIntervalResponseDTO> getProducerIntervals() {
        return ResponseEntity.ok(awardService.getProducerIntervals());
    }
}
