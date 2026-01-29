package com.labirinto.app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public record Photo(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,
    
    @Lob
    byte[] image,
    
    String representativeColor
) {}