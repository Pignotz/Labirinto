package com.labirinto.app.init;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.labirinto.app.entities.Photo;
import com.labirinto.app.entities.Poem;
import com.labirinto.app.repository.PhotoRepository;
import com.labirinto.app.repository.PoemRepository;
import com.labirinto.app.util.ColorExtractor;

@Component
public class DbInit implements CommandLineRunner {

    private final PoemRepository poetryRepository;
    private final PhotoRepository photoRepository;

    @Value("${app.input-data-path:/static}")
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
            ClassPathResource inputDir = new ClassPathResource(inputDataDir + "/images");
            System.out.println("Popolando DB con foto da " + inputDir.getFilename());
            try {
                Files.list(Paths.get(inputDir.getURI())).forEach(filePath -> {
                    try {
                        byte[] image = Files.readAllBytes(filePath);
                        String representativeColor = ColorExtractor.extractRepresentativeColor(image);
                        Photo photo = new Photo(null, image, representativeColor);
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

    private void loadPoems() throws IOException {
        if (poetryRepository.count() == 0) {
        ClassPathResource resource =
        new ClassPathResource("static/poems.json");
                    System.out.println("Popolando DB con dati iniziali...");
            ObjectMapper mapper = new ObjectMapper();
            List<Poem> poems = mapper.readValue(
                Files.readString(resource.getFile().toPath()),
                new TypeReference<List<Poem>>() {}
            );
            poetryRepository.saveAll(poems);
        } else {
            System.out.println("DB già popolato, nessuna azione.");
        }
    }

}
