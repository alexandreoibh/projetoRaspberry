package com.texoit.raspberry.service;

import com.texoit.raspberry.dto.ProducerIntervalDTO;
import com.texoit.raspberry.dto.ProducerIntervalResponseDTO;
import com.texoit.raspberry.entity.Movie;
import com.texoit.raspberry.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AwardService {
    
    private final MovieRepository movieRepository;
    
    public AwardService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }
    
    public ProducerIntervalResponseDTO getProducerIntervals() {
        List<Movie> winners = movieRepository.findAllWinners();
        
        // Map to store producers and their winning years
        Map<String, List<Integer>> producerWins = new HashMap<>();
        
        for (Movie movie : winners) {
            String[] producers = parseProducers(movie.getProducers());
            for (String producer : producers) {
                producerWins.computeIfAbsent(producer, k -> new ArrayList<>()).add(movie.getYear());
            }
        }
        
        // Calculate intervals for producers with multiple wins
        List<ProducerIntervalDTO> intervals = new ArrayList<>();
        
        for (Map.Entry<String, List<Integer>> entry : producerWins.entrySet()) {
            List<Integer> years = entry.getValue();
            if (years.size() > 1) {
                Collections.sort(years);
                for (int i = 0; i < years.size() - 1; i++) {
                    int interval = years.get(i + 1) - years.get(i);
                    intervals.add(new ProducerIntervalDTO(
                        entry.getKey(),
                        interval,
                        years.get(i),
                        years.get(i + 1)
                    ));
                }
            }
        }
        
        if (intervals.isEmpty()) {
            return new ProducerIntervalResponseDTO(new ArrayList<>(), new ArrayList<>());
        }
        
        // Find minimum and maximum intervals
        int minInterval = intervals.stream().mapToInt(ProducerIntervalDTO::getInterval).min().orElse(0);
        int maxInterval = intervals.stream().mapToInt(ProducerIntervalDTO::getInterval).max().orElse(0);
        
        List<ProducerIntervalDTO> minIntervals = intervals.stream()
            .filter(p -> p.getInterval() == minInterval)
            .collect(Collectors.toList());
        
        List<ProducerIntervalDTO> maxIntervals = intervals.stream()
            .filter(p -> p.getInterval() == maxInterval)
            .collect(Collectors.toList());
        
        return new ProducerIntervalResponseDTO(minIntervals, maxIntervals);
    }
    
    private String[] parseProducers(String producers) {
        if (producers == null || producers.isEmpty()) {
            return new String[0];
        }
        
        // Split by comma or " and " while handling multiple separators
        String[] parts = producers.split(",| and ");
        
        return Arrays.stream(parts)
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .toArray(String[]::new);
    }
}
