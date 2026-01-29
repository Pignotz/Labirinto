package com.labirinto.app.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labirinto.app.dto.UserRequest;
import com.labirinto.app.entities.User;
import com.labirinto.app.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/list")
    public List<User> list() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<User> getById(@PathVariable(required = true) Long id) {
        return userRepository.findById(id);
    }

    @PostMapping("/add")
    public User add(@RequestBody UserRequest userRequest) {
        User user = new User(null, userRequest.getUsername());
        return userRepository.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        return userRepository.findById(id)
                .map(user -> {
                    User updatedUser = new User(user.getId(), userRequest.getUsername());
                    return userRepository.save(updatedUser);
                })
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/count")
    public long count() {
        return userRepository.count();
    }
}

