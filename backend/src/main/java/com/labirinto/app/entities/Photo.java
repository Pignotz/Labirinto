package com.labirinto.app.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isAlreadyFound;

    @Lob
    private byte[] image;

    // --- Costruttori ---
    public Photo() {}

    public Photo(boolean isAlreadyFound, byte[] image) {
        this.isAlreadyFound = isAlreadyFound;
        this.image = image;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isAlreadyFound() {
        return isAlreadyFound;
    }

    public void setAlreadyFound(boolean alreadyFound) {
        isAlreadyFound = alreadyFound;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
