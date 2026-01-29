package com.labirinto.app.dto;

public class UserPoemRequest {
    private Long userId;
    private Long poemId;

    public UserPoemRequest() {
    }

    public UserPoemRequest(Long userId, Long poemId) {
        this.userId = userId;
        this.poemId = poemId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPoemId() {
        return poemId;
    }

    public void setPoemId(Long poemId) {
        this.poemId = poemId;
    }
}
