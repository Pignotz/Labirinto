package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.entities.UserPhoto;
import com.labirinto.app.repository.UserPhotoRepository;

@RestController
@RequestMapping("/api/user_photo")
@CrossOrigin(origins = "http://localhost:5173")
public class UserPhotoController {

    private final UserPhotoRepository userPhotoRepository;
    public UserPhotoController(UserPhotoRepository userPhotoRepository) {
        this.userPhotoRepository = userPhotoRepository;
    }

    @GetMapping("/list")
    public List<UserPhoto> list() {
        return userPhotoRepository.findAll();
    }
}

