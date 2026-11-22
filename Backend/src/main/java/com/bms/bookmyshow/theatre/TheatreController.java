package com.bms.bookmyshow.theatre;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    private final TheatreService service;

    public TheatreController(TheatreService service) {
        this.service = service;
    }

    @GetMapping
    public List<TheatreDto.TheatreResponse> getAllTheatresByCity(@RequestParam String city)
    {
        return service.findByCity(city);
    }
}
