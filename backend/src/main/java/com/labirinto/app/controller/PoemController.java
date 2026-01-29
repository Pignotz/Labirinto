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

import com.labirinto.app.dto.PoemRequest;
import com.labirinto.app.entities.Poem;
import com.labirinto.app.repository.PoemRepository;

@RestController
@RequestMapping("/api/poem")
@CrossOrigin(origins = "http://localhost:5173")
public class PoemController {

    private final PoemRepository poemRepository;

    public PoemController(PoemRepository poemRepository) {
        this.poemRepository = poemRepository;
    }

    @GetMapping("/list")
    public List<Poem> list() {
        return poemRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Poem> getById(@PathVariable Long id) {
        return poemRepository.findById(id);
    }

    @PostMapping("/add")
    public Poem add(@RequestBody PoemRequest poemRequest) {
        Poem poem = new Poem(null, poemRequest.getTitle(), poemRequest.getText());
        return poemRepository.save(poem);
    }

    @PutMapping("/{id}")
    public Poem update(@PathVariable Long id, @RequestBody PoemRequest poemRequest) {
        return poemRepository.findById(id)
                .map(poem -> {
                    Poem updatedPoem = new Poem(poem.id(), poemRequest.getTitle(), poemRequest.getText());
                    return poemRepository.save(updatedPoem);
                })
                .orElseThrow(() -> new IllegalArgumentException("Poem not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        poemRepository.deleteById(id);
    }

    @GetMapping("/count")
    public long count() {
        return poemRepository.count();
    }

    @GetMapping("/search/{title}")
    public List<Poem> searchByTitle(@PathVariable String title) {
        return poemRepository.findAll().stream()
                .filter(poem -> poem.title() != null && poem.title().toLowerCase().contains(title.toLowerCase()))
                .toList();
    }
}

