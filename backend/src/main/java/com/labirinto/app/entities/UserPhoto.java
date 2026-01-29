package com.labirinto.app.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;

@Entity
public record UserPhoto(
    @EmbeddedId
    UserPhotoId id
) {
    @Embeddable
    public static record UserPhotoId(
        Long userId,
        Long photoId
    ) implements Serializable {}
}
