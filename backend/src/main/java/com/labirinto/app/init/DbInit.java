package com.labirinto.app.init;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.labirinto.app.entities.Poetry;
import com.labirinto.app.repository.PhotoRepository;
import com.labirinto.app.repository.PoetryRepository;

@Component
public class DbInit implements CommandLineRunner {

    private final PoetryRepository poetryRepository;
    private final PhotoRepository photoRepository;

    private final String inputDataDir = "input-data";

    public DbInit(PoetryRepository poetryRepository, PhotoRepository photoRepository) {
        this.poetryRepository = poetryRepository;
        this.photoRepository = photoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        loadPoems();
        loadPhotos();
    }

    private void loadPhotos() {
        if(photoRepository.count() == 0){
            Path inputDir = Paths.get(inputDataDir + "/images");

            
        }else{
            System.out.println("DB già popolato con foto, nessuna azione.");
        } 
    }

    private void loadPoems() throws IOException {
        if (poetryRepository.count() == 0) {
            System.out.println("Popolando DB con dati iniziali...");
            
            ClassPathResource resource = new ClassPathResource("db-initial-data/poetry/poems.json");
            List<String> lines = Files.readAllLines(resource.getFile().toPath());

            for (String line : lines) {
                Poetry p = new Poetry();
                p.setContent(line);
                poetryRepository.save(p);
            }

            System.out.println("DB popolato con " + lines.size() + " poesie.");
        } else {
            System.out.println("DB già popolato, nessuna azione.");
        }
    }

}
