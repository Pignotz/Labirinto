package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.Poetry;

public interface PoetryRepository extends JpaRepository<Poetry, Long> {}
