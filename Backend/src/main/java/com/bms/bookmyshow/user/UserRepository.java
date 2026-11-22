package com.bms.bookmyshow.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(Integer phone);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(Integer phone);

}
