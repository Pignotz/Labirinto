package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.entities.UserPoem;
import com.labirinto.app.repository.UserPoemRepository;

@RestController
@RequestMapping("/api/user_poem")
@CrossOrigin(origins = "http://localhost:5173")
public class UserPoemController {

    private final UserPoemRepository userPoemRepository;
    public UserPoemController(UserPoemRepository userPoemRepository) {
        this.userPoemRepository = userPoemRepository;
    }

    @GetMapping("/list")
    public List<UserPoem> list() {
        return userPoemRepository.findAll();
    }
}

