package com.bms.bookmyshow.show;

import com.bms.bookmyshow.movie.Movie;
import com.bms.bookmyshow.theatre.Theatre;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shows")
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Movie movie;

    private int totalSeats;

    private int availableSeats;

    private int ticketPrice;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Theatre theatre;

    private LocalDateTime startsAt;
    private LocalDateTime endsAt;

    private boolean active=true;


    public Show(){

    }

    public Show(Movie movie, int totalSeats, int ticketPrice, Theatre theatre, LocalDateTime startsAt, LocalDateTime endsAt) {
        this.movie = movie;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
        this.ticketPrice = ticketPrice;
        this.theatre = theatre;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
    }

    public Long getId() {
        return id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public int getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(int ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public Theatre getTheatre() {
        return theatre;
    }

    public void setTheatre(Theatre theatre) {
        this.theatre = theatre;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void reserve(int seats){
        if(seats<=0 || seats > availableSeats)
        {
            throw new IllegalArgumentException("Not enough Seat Available");
        }

        availableSeats-=seats;
    }

    public void release(int seats)
    {
        availableSeats=availableSeats+seats;
    }

}
