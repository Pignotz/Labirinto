package com.labirinto.app.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public record Poem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,
    
    String title,
    
    @Lob
    @Column(nullable = false)
    String text
) {}
