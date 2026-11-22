package com.bms.bookmyshow.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserPhoneOrderByBookedAtDesc(Integer userPhone);

    Optional<Booking> findByIdAndUserPhone(Long id, Integer userPhone);

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    Optional<Booking> findByIdAndUserId(Long id, Long userId);

}
