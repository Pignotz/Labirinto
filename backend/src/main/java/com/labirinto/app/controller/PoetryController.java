package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.entities.Poetry;
import com.labirinto.app.repository.PoetryRepository;

@RestController
@RequestMapping("/poetry")
@CrossOrigin(origins = "http://localhost:5173")
public class PoetryController {

    private final PoetryRepository poetryRepository;

    public PoetryController(PoetryRepository poetryRepository) {
        this.poetryRepository = poetryRepository;
    }

    @GetMapping("/list")
    public List<Poetry> list() {
        return poetryRepository.findAll();
    }
}

