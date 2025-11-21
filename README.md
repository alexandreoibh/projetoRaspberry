# Golden Raspberry Awards API

REST API for the Golden Raspberry Awards (Razzies) - A technical test implementation.

## About

This project is a RESTful API that reads data from a CSV file about worst movie awards and provides endpoints to query producer award intervals. The Golden Raspberry Awards is a parody award show that honors the worst in film.

## Technologies

- Java 17
- Spring Boot 3.1.5
- Spring Data JPA
- H2 In-Memory Database
- OpenCSV
- Maven
- JUnit 5

## Features

- Automatic CSV data loading on application startup
- In-memory H2 database
- REST API endpoint for producer award intervals
- Integration tests that run automatically

## API Endpoints

### Get Producer Intervals

Returns producers with the longest and shortest intervals between consecutive awards.

**Endpoint:** `GET /api/producers/intervals`

**Response Example:**
```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

## How to Run

### Prerequisites

- Java 17 or higher
- Maven 3.6+

### Building the Project

```bash
mvn clean install
```

### Running the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Running Tests

```bash
mvn test
```

## Project Structure

```
src/
├── main/
│   ├── java/com/texoit/raspberry/
│   │   ├── App.java                    # Main Spring Boot application
│   │   ├── config/
│   │   │   └── DataLoader.java         # CSV data loader
│   │   ├── controller/
│   │   │   └── AwardController.java    # REST API controller
│   │   ├── dto/
│   │   │   ├── ProducerIntervalDTO.java
│   │   │   └── ProducerIntervalResponseDTO.java
│   │   ├── entity/
│   │   │   └── Movie.java              # JPA entity
│   │   ├── repository/
│   │   │   └── MovieRepository.java    # JPA repository
│   │   └── service/
│   │       └── AwardService.java       # Business logic
│   └── resources/
│       ├── application.properties      # Application configuration
│       └── movielist.csv              # Movie data
└── test/
    └── java/com/texoit/raspberry/
        └── AwardControllerIntegrationTest.java  # Integration tests
```

## Data Format

The CSV file (`movielist.csv`) contains the following columns:
- year: Award year
- title: Movie title
- studios: Production studios
- producers: Movie producers (comma or "and" separated)
- winner: "yes" if the movie won the award

## License

This project is for technical test purposes only.
