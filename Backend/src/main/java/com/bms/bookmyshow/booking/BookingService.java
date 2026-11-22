package com.bms.bookmyshow.booking;

import com.bms.bookmyshow.common.ResourceNotFoundException;
import com.bms.bookmyshow.common.SeatUnavailableException;
import com.bms.bookmyshow.show.Show;
import com.bms.bookmyshow.show.ShowRepository;
import com.bms.bookmyshow.showseat.ShowSeat;
import com.bms.bookmyshow.showseat.ShowSeatRepository;
import com.bms.bookmyshow.user.User;
import com.bms.bookmyshow.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowSeatRepository showSeatRepository;
    private final ShowRepository showRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, ShowSeatRepository showSeatRepository, ShowRepository showRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.showSeatRepository = showSeatRepository;
        this.showRepository = showRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDto.BookingResponse book(Long showId, BookingDto.CreateBooking request, String email)
    {
        Show show = showRepository.findById(showId).orElseThrow(()->new ResourceNotFoundException("No such show available"));
        User user = userRepository.findByEmail(email).orElseThrow(()->new ResourceNotFoundException("Unauthorised user"));

        List<String> labels = request.seatlabels().stream()
                .map(label->label.trim().toUpperCase(Locale.ROOT)).toList();

        if(labels.stream().distinct().count() != labels.size())
        {
            throw new SeatUnavailableException("Duplicate seat labels are not allowed");
        }

        List<ShowSeat> seats = showSeatRepository.findForUpdate(showId, labels);
        if(seats.size() != labels.size() || seats.stream().anyMatch(ShowSeat::isReserved)){
            throw new SeatUnavailableException("One or more selected seats are unavailable");
        }
        seats.forEach(ShowSeat::reserve);
        show.reserve(labels.size());

        BigDecimal amount = BigDecimal.valueOf(Math.multiplyExact(request.seatlabels().size(), show.getTicketPrice()));
        Booking booking = bookingRepository.save(new Booking(show, labels.size(), user, labels, amount));

        return BookingDto.BookingResponse.from(booking);
    }

    @Transactional
    BookingDto.BookingResponse find(Long bookingId)
    {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()-> new ResourceNotFoundException("Booking not found"));
        return BookingDto.BookingResponse.from(booking);
    }

    @Transactional
    List<BookingDto.BookingResponse> findByProfileId(Long userId)
    {
        if(!userRepository.existsById(userId))
        {
            throw new ResourceNotFoundException("Profile Not Found");
        }

        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId).stream()
                .map(BookingDto.BookingResponse::from).toList();
    }

    @Transactional
    BookingDto.BookingResponse cancel(Long bookingId, Long profileId)
    {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, profileId)
                .orElseThrow(()->new ResourceNotFoundException("Booking not found"));

        if(booking.getStatus()== BookingDto.BookingStatus.CONFIRMED)
        {
            List<ShowSeat> seats = showSeatRepository.findForUpdate(booking.getShow().getId(), booking.getSeatLabels());
            seats.forEach(ShowSeat::release);
            booking.getShow().release(booking.getSeats());
            booking.cancel();
        }
        return BookingDto.BookingResponse.from(booking);
    }

}
