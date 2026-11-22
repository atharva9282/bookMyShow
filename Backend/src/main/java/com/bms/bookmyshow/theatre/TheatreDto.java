package com.bms.bookmyshow.theatre;

public class TheatreDto {

    public record TheatreResponse(
            Long id,
            String name,
            String city,
            String address
    ){
        public static TheatreResponse from(Theatre theatre)
        {
            return new TheatreResponse(
                    theatre.getId(),
                    theatre.getName(),
                    theatre.getCity(),
                    theatre.getAddress()
            );
        }
    }
}
