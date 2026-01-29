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

import com.labirinto.app.dto.UserPoemRequest;
import com.labirinto.app.entities.UserPoem;
import com.labirinto.app.entities.UserPoem.UserPoemId;
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

    @PostMapping("/add")
    public UserPoem add(@RequestBody UserPoemRequest userPoemRequest) {
        UserPoemId userPoemId = new UserPoemId(userPoemRequest.getUserId(), userPoemRequest.getPoemId());
        UserPoem userPoem = new UserPoem(userPoemId);
        return userPoemRepository.save(userPoem);
    }

    @DeleteMapping("/{userId}/{poemId}")
    public void delete(@PathVariable Long userId, @PathVariable Long poemId) {
        UserPoemId userPoemId = new UserPoemId(userId, poemId);
        userPoemRepository.deleteById(userPoemId);
    }

    @GetMapping("/count")
    public long count() {
        return userPoemRepository.count();
    }

    @GetMapping("/user/{userId}")
    public List<UserPoem> getByUserId(@PathVariable Long userId) {
        return userPoemRepository.findAll().stream()
                .filter(up -> up.getId().getUserId().equals(userId))
                .toList();
    }

    @GetMapping("/poem/{poemId}")
    public List<UserPoem> getByPoemId(@PathVariable Long poemId) {
        return userPoemRepository.findAll().stream()
                .filter(up -> up.getId().getPoemId().equals(poemId))
                .toList();
    }
}

