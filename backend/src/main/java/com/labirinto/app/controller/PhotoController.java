package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.entities.Photo;
import com.labirinto.app.repository.PhotoRepository;

@RestController
@RequestMapping("/api/photo")
@CrossOrigin(origins = "http://localhost:5173")
public class PhotoController {

    private final PhotoRepository photoRepository;

    public PhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @GetMapping("/list")
    public List<Photo> list() {
        return photoRepository.findAll();
    }
}

