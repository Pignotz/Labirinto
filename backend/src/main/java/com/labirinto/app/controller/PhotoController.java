package com.labirinto.app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.dto.PhotoRequest;
import com.labirinto.app.entities.Photo;
import com.labirinto.app.repository.PhotoRepository;
import com.labirinto.app.repository.UserPhotoRepository;
import com.labirinto.app.util.ColorExtractor;

@RestController
@RequestMapping("/api/photo")
@CrossOrigin(origins = "http://localhost:5173")
public class PhotoController {

    private final PhotoRepository photoRepository;
    private final UserPhotoRepository userPhotoRepository;

    public PhotoController(PhotoRepository photoRepository, UserPhotoRepository userPhotoRepository) {
        this.photoRepository = photoRepository;
        this.userPhotoRepository = userPhotoRepository;
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
                .filter(photo -> color.equalsIgnoreCase(photo.getRepresentativeColor()))
                .toList();
    }

    @GetMapping("/random-uncollected/{userId}")
    public Photo getRandomUncollectedPhoto(@PathVariable Long userId) {
        List<Photo> allPhotos = photoRepository.findAll();
        List<Long> collectedPhotoIds = userPhotoRepository.findAll().stream()
                .filter(up -> up.getId().getUserId().equals(userId))
                .map(up -> up.getId().getPhotoId())
                .toList();

        // Find a photo that hasn't been collected
        Optional<Photo> uncollectedPhoto = allPhotos.stream()
                .filter(photo -> !collectedPhotoIds.contains(photo.getId()))
                .findAny();

        return uncollectedPhoto.orElse(null);
    }

@GetMapping("/random-uncollected-with-exclusion/{userId}")
public ResponseEntity<Photo> getRandomUncollectedWithExclusionPhoto(
        @PathVariable Long userId,
        @RequestParam(required = false) List<Long> excludedPhotoIds) {

    Page<Photo> page = userPhotoRepository.findUncollectedWithExclusion(
            userId,
            excludedPhotoIds,
            PageRequest.of(0, 1)
    );

    return page.hasContent()
            ? ResponseEntity.ok(page.getContent().get(0))
            : ResponseEntity.noContent().build();
}

@GetMapping("/{id}/image")
public ResponseEntity<byte[]> getPhotoImage(@PathVariable Long id) {
    Photo photo = photoRepository.findById(id).orElseThrow();
    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_JPEG)
        .body(photo.getImage());
}


}
