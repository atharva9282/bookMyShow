package com.bms.bookmyshow.movie;

public class MovieDto {

    public record MovieResponse(
            Long id,
            String title,
            String language,
            String genre,
            String description,
            Integer durationMinutes,
            String posterUrl,
            String trailerUrl,
            String certificates,
            boolean active

    ){
        public static MovieResponse from(Movie movie)
        {
            return new MovieResponse(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getLanguage(),
                    movie.getGenre(),
                    movie.getDescription(),
                    movie.getDurationMinutes(),
                    movie.getPosterUrl(),
                    movie.getTrailerUrl(),
                    movie.getCertificates(),
                    movie.isActive()
            );
        }
    }
}
