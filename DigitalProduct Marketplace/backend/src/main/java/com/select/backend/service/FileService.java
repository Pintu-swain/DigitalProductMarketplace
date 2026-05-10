package com.select.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileService {

    // IMPORTANT: Change this path to a real folder on your Laptop!
    // Example: "D:/select-project/uploads/"
    private final String UPLOAD_DIR = "D:/select_uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        // 1. Check if the file is empty
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        // 2. Create the folder if it doesn't exist
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 3. Generate a unique name to prevent overwriting
        // Example: "image.jpg" -> "a1b2c3d4-image.jpg"
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // 4. Save the file to the disk
        Path destinationPath = Paths.get(UPLOAD_DIR + uniqueFileName);
        Files.copy(file.getInputStream(), destinationPath);

        // 5. Return the full path so we can save it in the database later
        return destinationPath.toString();
    }
}