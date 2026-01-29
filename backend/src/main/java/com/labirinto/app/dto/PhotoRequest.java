package com.labirinto.app.dto;

public class PhotoRequest {
    private byte[] image;

    public PhotoRequest() {
    }

    public PhotoRequest(byte[] image) {
        this.image = image;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
