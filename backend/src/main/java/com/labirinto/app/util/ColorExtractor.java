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

        // Use color quantization to group similar colors together before counting.
        // This reduces the effect of small variations and noise that would make
        // exact-RGB frequency counting unreliable for photographs.
        // We'll quantize to 12 bits (4 bits per channel).
        final Map<Integer, long[]> bucketMapAll = new HashMap<>();
        final Map<Integer, long[]> bucketMapFiltered = new HashMap<>();
        int totalSamples = 0;
        int excludedSamples = 0;

        final int LUMINANCE_MIN = 30;  // consider near-black as potential background
        final int LUMINANCE_MAX = 240; // consider near-white as potential background

        for (int y = 0; y < height; y += SAMPLE_RATE) {
            for (int x = 0; x < width; x += SAMPLE_RATE) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                totalSamples++;
                double luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                boolean excluded = (luminance < LUMINANCE_MIN || luminance > LUMINANCE_MAX);
                if (excluded) excludedSamples++;

                // Quantize to 4 bits per channel
                int rq = r >> 4;
                int gq = g >> 4;
                int bq = b >> 4;

                int bucket = (rq << 8) | (gq << 4) | bq;

                // Update ALL buckets
                long[] statsAll = bucketMapAll.get(bucket);
                if (statsAll == null) {
                    statsAll = new long[4];
                    bucketMapAll.put(bucket, statsAll);
                }
                statsAll[0] += 1;
                statsAll[1] += r;
                statsAll[2] += g;
                statsAll[3] += b;

                // Update FILTERED buckets (only non-excluded)
                if (!excluded) {
                    long[] statsF = bucketMapFiltered.get(bucket);
                    if (statsF == null) {
                        statsF = new long[4];
                        bucketMapFiltered.put(bucket, statsF);
                    }
                    statsF[0] += 1;
                    statsF[1] += r;
                    statsF[2] += g;
                    statsF[3] += b;
                }
            }
        }

        // Decide whether to use filtered buckets or fall back to all buckets
        double excludedRatio = totalSamples == 0 ? 0.0 : (double) excludedSamples / (double) totalSamples;
        final double EXCLUDED_RATIO_THRESHOLD = 0.40; // if too many excluded, use all pixels

        Map<Integer, long[]> chosenMap = bucketMapFiltered;
        if (bucketMapFiltered.isEmpty() || excludedRatio >= EXCLUDED_RATIO_THRESHOLD) {
            chosenMap = bucketMapAll;
        }

        if (chosenMap.isEmpty()) {
            // Fallback to average color if nothing useful
            return getAverageColor(image);
        }

        // Score buckets using count weighted by saturation to favor colorful clusters
        int bestBucket = -1;
        double bestScore = -1.0;
        for (Map.Entry<Integer, long[]> e : chosenMap.entrySet()) {
            long[] st = e.getValue();
            long count = st[0];
            int avgR = (int) (st[1] / count);
            int avgG = (int) (st[2] / count);
            int avgB = (int) (st[3] / count);

            int max = Math.max(avgR, Math.max(avgG, avgB));
            int min = Math.min(avgR, Math.min(avgG, avgB));
            double saturation = (max == 0) ? 0.0 : ((double) (max - min) / (double) max);

            double score = count * (1.0 + saturation); // emphasize saturated colors
            if (score > bestScore) {
                bestScore = score;
                bestBucket = e.getKey();
            }
        }

        if (bestBucket == -1) {
            return getAverageColor(image);
        }

        long[] bestStats = chosenMap.get(bestBucket);
        int avgR = (int) (bestStats[1] / bestStats[0]);
        int avgG = (int) (bestStats[2] / bestStats[0]);
        int avgB = (int) (bestStats[3] / bestStats[0]);

        int dominantRGB = (avgR << 16) | (avgG << 8) | avgB;
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
