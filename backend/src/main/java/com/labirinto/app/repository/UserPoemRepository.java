package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.UserPoem;
import com.labirinto.app.entities.UserPoem.UserPoemId;

public interface UserPoemRepository extends JpaRepository<UserPoem, UserPoemId> {}
