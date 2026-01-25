package com.labirinto.app.entities;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserPhoto {

    @EmbeddedId
    private UserPhotoId id;

    public UserPhoto() {
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }




    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UserPhoto other = (UserPhoto) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }




    @Embeddable
    public class UserPhotoId implements Serializable {

        private Long userId;
        private Long photoId;

        public UserPhotoId() {
        }

        @Override
        public int hashCode() {
            final int prime = 31;
            int result = 1;
            result = prime * result + getEnclosingInstance().hashCode();
            result = prime * result + ((userId == null) ? 0 : userId.hashCode());
            result = prime * result + ((photoId == null) ? 0 : photoId.hashCode());
            return result;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj)
                return true;
            if (obj == null)
                return false;
            if (getClass() != obj.getClass())
                return false;
            UserPhotoId other = (UserPhotoId) obj;
            if (!getEnclosingInstance().equals(other.getEnclosingInstance()))
                return false;
            if (userId == null) {
                if (other.userId != null)
                    return false;
            } else if (!userId.equals(other.userId))
                return false;
            if (photoId == null) {
                if (other.photoId != null)
                    return false;
            } else if (!photoId.equals(other.photoId))
                return false;
            return true;
        }

        

        public Long getUserId() {
            return userId;
        }
        

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public void setPhotoId(Long photoId) {
            this.photoId = photoId;
        }

        public Long getPhotoId() {
            return photoId;
        }

        private UserPhoto getEnclosingInstance() {
            return UserPhoto.this;
        }
    }

    public UserPhotoId getId() {
        return id;
    }

    public void setId(UserPhotoId id) {
        this.id = id;
    }
}
