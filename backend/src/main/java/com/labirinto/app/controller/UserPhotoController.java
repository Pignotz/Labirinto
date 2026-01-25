package com.labirinto.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.dto.UserPhotoRequest;
import com.labirinto.app.entities.User;
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

    @PostMapping("/add")
    public void add(@RequestBody UserPhotoRequest userPhotoRequest){
        UserPhoto userPhoto = new UserPhoto();
        UserPhoto.UserPhotoId userPhotoId = userPhoto.new UserPhotoId();
        userPhotoId.setUserId(userPhotoRequest.getUserId());
        userPhotoId.setPhotoId(userPhotoRequest.getPhotoId());
        userPhoto.setId(userPhotoId);
        userPhotoRepository.save(userPhoto);
    }
}

