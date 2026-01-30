package com.labirinto.app.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.labirinto.app.entities.Photo;
import com.labirinto.app.entities.UserPhoto;
import com.labirinto.app.entities.UserPhoto.UserPhotoId;

public interface UserPhotoRepository extends JpaRepository<UserPhoto, UserPhotoId> {

    @Query("""
                SELECT p FROM Photo p
                WHERE p.id NOT IN (
                    SELECT up.id.photoId
                    FROM UserPhoto up
                    WHERE up.id.userId = :userId
                )
                AND (:excludedPhotoIds IS NULL OR p.id NOT IN :excludedPhotoIds)
            """)
    Page<Photo> findUncollectedWithExclusion(
            @Param("userId") Long userId,
            @Param("excludedPhotoIds") List<Long> excludedPhotoIds,
            Pageable pageable);

}
