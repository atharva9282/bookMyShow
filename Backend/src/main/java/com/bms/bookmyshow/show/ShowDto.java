package com.bms.bookmyshow.show;

import com.bms.bookmyshow.movie.Movie;
import com.bms.bookmyshow.movie.MovieDto;
import com.bms.bookmyshow.theatre.Theatre;
import com.bms.bookmyshow.theatre.TheatreDto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ShowDto {

    public record ShowResponse(
        Long id,
        MovieDto.MovieResponse movie,
        TheatreDto.TheatreResponse theatre,
        int totalSeats,
        int availableSeats,
        int ticketPrice,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        boolean active,
        List<String> availableSeatLabels
    ){
        public static ShowResponse from (Show show, List<String> availableSeatLabels)
        {
            return new ShowResponse(
                    show.getId(),
                    MovieDto.MovieResponse.from(show.getMovie()),
                    TheatreDto.TheatreResponse.from(show.getTheatre()),
                    show.getTotalSeats(),
                    show.getAvailableSeats(),
                    show.getTicketPrice(),
                    show.getStartsAt(),
                    show.getEndsAt(),
                    show.isActive(),
                    availableSeatLabels
            );
        }
    }
}
