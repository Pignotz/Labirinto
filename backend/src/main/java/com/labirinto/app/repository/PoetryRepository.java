package com.labirinto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.labirinto.app.entities.Poem;

public interface PoetryRepository extends JpaRepository<Poem, Long> {}
