package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.entities.Poem;
import com.labirinto.app.repository.PoemRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final PoemRepository poetryRepository;

    public UserController(PoemRepository poetryRepository) {
        this.poetryRepository = poetryRepository;
    }

    @GetMapping("/list")
    public List<Poem> list() {
        return poetryRepository.findAll();
    }

    @GetMapping("/create")
    public void create() {
        // Implementation for creating a user
    }
}

