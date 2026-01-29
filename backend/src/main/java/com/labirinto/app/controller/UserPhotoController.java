package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.dto.UserPhotoRequest;
import com.labirinto.app.entities.UserPhoto;
import com.labirinto.app.entities.UserPhoto.UserPhotoId;
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

    @PostMapping("/add")
    public UserPhoto add(@RequestBody UserPhotoRequest userPhotoRequest) {
        UserPhotoId userPhotoId = new UserPhotoId(userPhotoRequest.getUserId(), userPhotoRequest.getPhotoId());
        UserPhoto userPhoto = new UserPhoto(userPhotoId);
        return userPhotoRepository.save(userPhoto);
    }

    @DeleteMapping("/{userId}/{photoId}")
    public void delete(@PathVariable Long userId, @PathVariable Long photoId) {
        UserPhotoId userPhotoId = new UserPhotoId(userId, photoId);
        userPhotoRepository.deleteById(userPhotoId);
    }

    @GetMapping("/count")
    public long count() {
        return userPhotoRepository.count();
    }

    @GetMapping("/user/{userId}")
    public List<UserPhoto> getByUserId(@PathVariable Long userId) {
        return userPhotoRepository.findAll().stream()
                .filter(up -> up.getId().getUserId().equals(userId))
                .toList();
    }

    @GetMapping("/photo/{photoId}")
    public List<UserPhoto> getByPhotoId(@PathVariable Long photoId) {
        return userPhotoRepository.findAll().stream()
                .filter(up -> up.getId().getPhotoId().equals(photoId))
                .toList();
    }
}

