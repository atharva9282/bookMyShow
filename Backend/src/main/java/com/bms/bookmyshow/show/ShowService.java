package com.bms.bookmyshow.show;

import com.bms.bookmyshow.showseat.ShowSeatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShowService {

    private final ShowRepository repository;
    private final ShowSeatRepository showSeatRepository;

    public ShowService(ShowRepository repository, ShowSeatRepository showSeatRepository) {
        this.repository = repository;
        this.showSeatRepository = showSeatRepository;
    }

    public List<ShowDto.ShowResponse> getActiveShows(String city, LocalDate date)
    {
        LocalDateTime from = date.atStartOfDay();
        return repository.findActiveShows(city, from, from.plusDays(1)).stream().
                map(show-> ShowDto.ShowResponse.from(show, showSeatRepository.findAvailableLabels(show.getId())))
                .toList();
    }
}
