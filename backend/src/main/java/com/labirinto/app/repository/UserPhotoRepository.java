package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.UserPhoto;

public interface UserPhotoRepository extends JpaRepository<UserPhoto, Long> {}
