package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.UserPoem;

public interface UserPoemRepository extends JpaRepository<UserPoem, Long> {}
