package com.labirinto.app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.dto.PhotoRequest;
import com.labirinto.app.entities.Photo;
import com.labirinto.app.repository.PhotoRepository;
import com.labirinto.app.util.ColorExtractor;

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

    @GetMapping("/{id}")
    public Optional<Photo> getById(@PathVariable Long id) {
        return photoRepository.findById(id);
    }

    @PostMapping("/add")
    public Photo add(@RequestBody PhotoRequest photoRequest) {
        String representativeColor = ColorExtractor.extractRepresentativeColor(photoRequest.getImage());
        Photo photo = new Photo(null, photoRequest.getImage(), representativeColor);
        return photoRepository.save(photo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        photoRepository.deleteById(id);
    }

    @GetMapping("/count")
    public long count() {
        return photoRepository.count();
    }

    @GetMapping("/by-color/{color}")
    public List<Photo> getByColor(@PathVariable String color) {
        return photoRepository.findAll().stream()
                .filter(photo -> color.equalsIgnoreCase(photo.representativeColor()))
                .toList();
    }
}

