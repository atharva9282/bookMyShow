package com.bms.bookmyshow.movie;

import jakarta.persistence.*;

@Entity
@Table(name = "movies", uniqueConstraints = @UniqueConstraint(
        name = "uk_movie_title",
        columnNames = "title"
))
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String language;
    private String genre;
    private String description;
    private Integer durationMinutes;

    private String certificates;
    private String posterUrl;
    private String trailerUrl;

    private boolean active = true;

    public Movie(){

    }

    public Movie(String title, String language, String genre, String description, Integer durationMinutes, String certificates, String posterUrl, String trailerUrl) {
        this.title = title;
        this.language = language;
        this.genre = genre;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.certificates = certificates;
        this.posterUrl = posterUrl;
        this.trailerUrl = trailerUrl;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getCertificates() {
        return certificates;
    }

    public void setCertificates(String certificates) {
        this.certificates = certificates;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
