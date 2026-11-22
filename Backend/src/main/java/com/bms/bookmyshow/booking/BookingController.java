package com.bms.bookmyshow.booking;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/book/{showId}")
    public BookingDto.BookingResponse book(@PathVariable Long showId, @RequestBody BookingDto.CreateBooking request, Principal principal)
    {
        return bookingService.book(showId, request, principal.getName());
    }

    @GetMapping("/bookings")
    public List<BookingDto.BookingResponse> myBookings(Long profileId)
    {
        return bookingService.findByProfileId(profileId);
    }

    @GetMapping("/bookings/{bookingId}")
    public BookingDto.BookingResponse findBooking(@PathVariable Long bookingId)
    {
        return bookingService.find(bookingId);
    }

    @DeleteMapping("/bookings/{bookingId}")
    public BookingDto.BookingResponse cancel(@PathVariable Long bookingId, Long profileId)
    {
        return bookingService.cancel(bookingId, profileId);
    }
}
