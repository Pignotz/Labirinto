package com.labirinto.app.init;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.labirinto.app.entities.Photo;
import com.labirinto.app.entities.Poem;
import com.labirinto.app.repository.PhotoRepository;
import com.labirinto.app.repository.PoemRepository;

@Component
public class DbInit implements CommandLineRunner {

    private final PoemRepository poetryRepository;
    private final PhotoRepository photoRepository;

    @Value("${app.input-data-path:input-data}")
    private String inputDataDir;

    public DbInit(PoemRepository poetryRepository, PhotoRepository photoRepository) {
        this.poetryRepository = poetryRepository;
        this.photoRepository = photoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        loadPoems();
        loadPhotos();
    }

    private void loadPhotos() {
        if (photoRepository.count() == 0) {
            Path inputDir = Paths.get(inputDataDir + "/images");
            System.out.println("Popolando DB con foto da " + inputDir.toAbsolutePath());
            try {
                Files.list(inputDir).forEach(filePath -> {
                    try {
                        byte[] data = Files.readAllBytes(filePath);
                        Photo photo = new Photo();
                        photo.setImage(data);
                        photoRepository.save(photo);
                    } catch (IOException e) {
                        System.err.println("Errore nel caricamento della foto: " + filePath.getFileName());
                    }
                });
            } catch (IOException e) {
                System.err.println("Errore nell lettura della directory delle foto: " + e.getMessage());
            }
        } else {
            System.out.println("DB già popolato CON foto, nessuna azione.");
        }
    }

    @SuppressWarnings("null")
    private void loadPoems() throws IOException {
        if (poetryRepository.count() == 0) {
            Path jsonPath = Paths.get("input-data", "poems.json");
            System.out.println("Popolando DB con dati iniziali...");
            ObjectMapper mapper = new ObjectMapper();
            List<Poem> poems = mapper.readValue(
                Files.readString(jsonPath),
                new TypeReference<List<Poem>>() {}
            );
            poetryRepository.saveAll(poems);
        } else {
            System.out.println("DB già popolato, nessuna azione.");
        }
    }

}
