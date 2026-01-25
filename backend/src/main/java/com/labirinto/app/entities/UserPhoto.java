package com.labirinto.app.entities;

import jakarta.persistence.Entity;

@Entity
public class UserPhoto {

    private Long userId;
    private Long photoId;

    public UserPhoto() {
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getPhotoId() {
        return photoId;
    }
    public void setPhotoId(Long photoId) {
        this.photoId = photoId;
    }

    
}
