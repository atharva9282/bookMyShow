package com.bms.bookmyshow.movie;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepository repository;

    public MovieService(MovieRepository repository) {
        this.repository = repository;
    }

    public List<MovieDto.MovieResponse> getActiveMovies()
    {
        return repository.findByActiveTrueOrderByTitle().stream().map(MovieDto.MovieResponse::from).toList();
    }

    public List<MovieDto.MovieResponse> getMovieByTitle(String title)
    {
        return repository.findByTitle(title).stream().map(MovieDto.MovieResponse::from).toList();
    }

}
