package com.bms.bookmyshow.theatre;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheatreService {

    private final TheatreRepository repository;

    public TheatreService(TheatreRepository repository) {
        this.repository = repository;
    }

    public List<TheatreDto.TheatreResponse> findByCity(String city)
    {
        return repository.findByCityIgnoreCaseOrderByName(city).stream().map(TheatreDto.TheatreResponse::from).toList();
    }

    public List<TheatreDto.TheatreResponse> findByCityAndName(String city, String name)
    {
        return repository.findByNameAndCity(name, city).stream().map(TheatreDto.TheatreResponse::from).toList();
    }

}
