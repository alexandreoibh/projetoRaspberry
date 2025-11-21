package com.texoit.raspberry;

import com.texoit.raspberry.dto.ProducerIntervalDTO;
import com.texoit.raspberry.dto.ProducerIntervalResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AwardControllerIntegrationTest {
    
    @LocalServerPort
    private int port;
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    public void testGetProducerIntervals() {
        String url = "http://localhost:" + port + "/api/producers/intervals";
        
        ResponseEntity<ProducerIntervalResponseDTO> response = restTemplate.getForEntity(
            url,
            ProducerIntervalResponseDTO.class
        );
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        ProducerIntervalResponseDTO result = response.getBody();
        
        // Verify that min and max lists are not null
        assertNotNull(result.getMin());
        assertNotNull(result.getMax());
        
        // Verify there are producers with intervals
        assertTrue(result.getMin().size() > 0 || result.getMax().size() > 0);
        
        // If there are min intervals, verify the structure
        if (!result.getMin().isEmpty()) {
            ProducerIntervalDTO minInterval = result.getMin().get(0);
            assertNotNull(minInterval.getProducer());
            assertNotNull(minInterval.getInterval());
            assertNotNull(minInterval.getPreviousWin());
            assertNotNull(minInterval.getFollowingWin());
            assertTrue(minInterval.getInterval() >= 0);
        }
        
        // If there are max intervals, verify the structure
        if (!result.getMax().isEmpty()) {
            ProducerIntervalDTO maxInterval = result.getMax().get(0);
            assertNotNull(maxInterval.getProducer());
            assertNotNull(maxInterval.getInterval());
            assertNotNull(maxInterval.getPreviousWin());
            assertNotNull(maxInterval.getFollowingWin());
            assertTrue(maxInterval.getInterval() >= 0);
        }
        
        // Verify that min interval is less than or equal to max interval
        if (!result.getMin().isEmpty() && !result.getMax().isEmpty()) {
            int minIntervalValue = result.getMin().get(0).getInterval();
            int maxIntervalValue = result.getMax().get(0).getInterval();
            assertTrue(minIntervalValue <= maxIntervalValue);
        }
    }
    
    @Test
    public void testApplicationContextLoads() {
        // This test ensures that the Spring context loads successfully
        assertNotNull(restTemplate);
    }
}
