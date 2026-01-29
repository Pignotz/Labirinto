package com.labirinto.app.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;

@Entity
public record UserPoem(
    @EmbeddedId
    UserPoemId id
) {
    @Embeddable
    public static record UserPoemId(
        Long userId,
        Long poemId
    ) implements Serializable {}
}
