package com.bms.bookmyshow.booking;

import com.bms.bookmyshow.show.Show;
import com.bms.bookmyshow.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Show show;

    private @Min(1) Integer seats;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @ElementCollection
    @CollectionTable(
            name = "booking_seats",
            joinColumns = @JoinColumn(name = "booking_id")
    )
    @Column(name = "seat_label", nullable = false)
    private List<String> seatLabels;

    private LocalDateTime bookedAt;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private BookingDto.BookingStatus status;

    public Booking(){

    }

    public Booking(Show show, Integer seats, User user, List<String> seatLabels, BigDecimal totalAmount) {
        this.show = show;
        this.seats = seats;
        this.user = user;
        this.seatLabels = new ArrayList<>(seatLabels);
        this.bookedAt = LocalDateTime.now();
        this.totalAmount = totalAmount;
        this.status = BookingDto.BookingStatus.CONFIRMED;
    }

    public Long getId() {
        return id;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<String> getSeatLabels() {
        return seatLabels;
    }

    public void setSeatLabels(List<String> seatLabels) {
        this.seatLabels = seatLabels;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BookingDto.BookingStatus getStatus() {
        return status;
    }

    public void cancel() {
        status = BookingDto.BookingStatus.CANCELLED;
    }
}
