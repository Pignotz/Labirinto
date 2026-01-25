package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.Photo;

public interface PhotoRepository extends JpaRepository<Photo, Long> {}
