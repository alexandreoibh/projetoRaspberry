package com.texoit.raspberry.config;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.texoit.raspberry.entity.Movie;
import com.texoit.raspberry.repository.MovieRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    
    private final MovieRepository movieRepository;
    
    public DataLoader(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }
    
    @Override
    public void run(String... args) {
        try {
            loadMoviesFromCSV();
        } catch (IOException | CsvException e) {
            throw new RuntimeException("Failed to load movie data", e);
        }
    }
    
    private void loadMoviesFromCSV() throws IOException, CsvException {
        ClassPathResource resource = new ClassPathResource("movielist.csv");
        
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream())) {
            com.opencsv.CSVParserBuilder parserBuilder = new com.opencsv.CSVParserBuilder()
                .withSeparator(';');
            com.opencsv.CSVReaderBuilder readerBuilder = new com.opencsv.CSVReaderBuilder(reader)
                .withCSVParser(parserBuilder.build());
            
            try (CSVReader csvReader = readerBuilder.build()) {
                List<String[]> records = csvReader.readAll();
                
                // Skip header
                for (int i = 1; i < records.size(); i++) {
                    String[] record = records.get(i);
                    
                    if (record.length >= 5) {
                        Movie movie = new Movie();
                        movie.setYear(Integer.parseInt(record[0].trim()));
                        movie.setTitle(record[1].trim());
                        movie.setStudios(record[2].trim());
                        movie.setProducers(record[3].trim());
                        movie.setWinner(record.length > 4 && "yes".equalsIgnoreCase(record[4].trim()));
                        
                        movieRepository.save(movie);
                    }
                }
            }
        }
    }
}
