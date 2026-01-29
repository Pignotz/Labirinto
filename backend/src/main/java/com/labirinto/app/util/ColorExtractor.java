package com.labirinto.app.util;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Utility class to extract the representative color from image byte arrays.
 * Uses the dominant color extraction algorithm.
 */
public class ColorExtractor {

    private static final int SAMPLE_RATE = 1; // Sample every nth pixel for performance

    /**
     * Extracts the dominant/representative color from an image byte array.
     *
     * @param imageData the image as a byte array
     * @return hex color string (e.g., "#FF5733") or null if extraction fails
     */
    public static String extractRepresentativeColor(byte[] imageData) {
        if (imageData == null || imageData.length == 0) {
            return null;
        }

        try {
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageData));
            if (image == null) {
                return null;
            }

            return getDominantColor(image);
        } catch (IOException e) {
            System.err.println("Error extracting color from image: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extracts the dominant color using frequency analysis.
     *
     * @param image the BufferedImage to analyze
     * @return hex color string or null
     */
    private static String getDominantColor(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        Map<Integer, Integer> colorFrequency = new HashMap<>();

        // Sample pixels to find most frequent color
        for (int y = 0; y < height; y += SAMPLE_RATE) {
            for (int x = 0; x < width; x += SAMPLE_RATE) {
                int rgb = image.getRGB(x, y);
                // Remove alpha channel
                rgb = rgb & 0xFFFFFF;
                colorFrequency.put(rgb, colorFrequency.getOrDefault(rgb, 0) + 1);
            }
        }

        // Find the most frequent color
        int dominantRGB = colorFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0xFFFFFF); // Default to white if empty

        return rgbToHex(dominantRGB);
    }

    /**
     * Alternative: Extract average color across the entire image.
     * This provides a more balanced color representation.
     *
     * @param image the BufferedImage to analyze
     * @return hex color string
     */
    private static String getAverageColor(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        long sumRed = 0, sumGreen = 0, sumBlue = 0;
        long pixelCount = 0;

        // Sample pixels for performance
        for (int y = 0; y < height; y += SAMPLE_RATE) {
            for (int x = 0; x < width; x += SAMPLE_RATE) {
                int rgb = image.getRGB(x, y);
                sumRed += (rgb >> 16) & 0xFF;
                sumGreen += (rgb >> 8) & 0xFF;
                sumBlue += rgb & 0xFF;
                pixelCount++;
            }
        }

        int avgRed = (int) (sumRed / pixelCount);
        int avgGreen = (int) (sumGreen / pixelCount);
        int avgBlue = (int) (sumBlue / pixelCount);

        int avgRGB = (avgRed << 16) | (avgGreen << 8) | avgBlue;
        return rgbToHex(avgRGB);
    }

    /**
     * Converts an RGB integer to a hex color string.
     *
     * @param rgb the RGB value (without alpha)
     * @return hex color string (e.g., "#FF5733")
     */
    private static String rgbToHex(int rgb) {
        return String.format("#%06X", rgb);
    }
}
