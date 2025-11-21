package com.texoit.raspberry.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "year_award")
    private Integer year;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "studios")
    private String studios;
    
    @Column(name = "producers")
    private String producers;
    
    @Column(name = "winner")
    private Boolean winner;
}
