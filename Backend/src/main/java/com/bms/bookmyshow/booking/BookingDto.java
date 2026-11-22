package com.bms.bookmyshow.booking;

import com.bms.bookmyshow.show.ShowDto;
import com.bms.bookmyshow.showseat.ShowSeat;
import com.bms.bookmyshow.user.UserDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookingDto {

    public enum BookingStatus {
        CONFIRMED,
        CANCELLED
    }

    public record BookingResponse(
            Long id,
            Long showId,
            Integer seats,
            Long userId,
            String movieTitle,
            String theatreName,
            String customerName,
            String customerEmail,
            String customerPhone,
            List<String> seatLabels,
            LocalDateTime bookedAt,
            BigDecimal totalAmount,
            BookingStatus status
    ){
        public static BookingResponse from(Booking booking)
        {
            return new BookingResponse(
                    booking.getId(),
                    booking.getShow().getId(),
                    booking.getSeats(),
                    booking.getUser().getId(),
                    booking.getShow().getMovie().getTitle(),
                    booking.getShow().getTheatre().getName(),
                    booking.getUser().getName(),
                    booking.getUser().getEmail(),
                    booking.getUser().getPhone(),
                    booking.getSeatLabels(),
                    booking.getBookedAt(),
                    booking.getTotalAmount(),
                    booking.getStatus()
            );
        }
    }

    public record CreateBooking(
            @NotNull Long profileId,
            @NotEmpty @Size(max = 8) List<@NotBlank String> seatlabels
    ){}
}
