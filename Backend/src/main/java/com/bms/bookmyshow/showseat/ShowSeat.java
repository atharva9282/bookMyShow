package com.bms.bookmyshow.showseat;

import com.bms.bookmyshow.show.Show;
import jakarta.persistence.*;

@Entity
@Table(name = "show_seats", uniqueConstraints = @UniqueConstraint(
        name = "uk_show_seat",
        columnNames = {"show_id", "seatLabel"}
))
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatLabel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Show show;

    private boolean reserved;

    public ShowSeat(){

    }

    public ShowSeat(String seatLabel, Show show, boolean reserved) {
        this.seatLabel = seatLabel;
        this.show = show;
        this.reserved = reserved;
    }

    public Long getId() {
        return id;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public void setSeatLabel(String seatLabel) {
        this.seatLabel = seatLabel;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public boolean isReserved() {
        return reserved;
    }

    public void reserve() {
        reserved = true;
    }

    public void release() {
        reserved = false;
    }
}
