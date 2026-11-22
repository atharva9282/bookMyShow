package com.bms.bookmyshow.movie;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService service;

    public MovieController(MovieService service) {
        this.service = service;
    }

    @GetMapping
    List<MovieDto.MovieResponse> getActiveMovies()
    {
        return service.getActiveMovies();
    }


//    List<MovieDto.MovieResponse> getByTitle(@RequestParam String title)
//    {
//        return service.getMovieByTitle(title);
//    }
}
