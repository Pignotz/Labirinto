package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {}
