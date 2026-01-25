package com.labirinto.app.entities;

import jakarta.persistence.Entity;

@Entity
public class UserPoem {

    private Long userId;
    private Long poemId;

    public UserPoem() {
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getPoemId() {
        return poemId;
    }
    public void setPoemId(Long poemId) {
        this.poemId = poemId;
    }

    
}
