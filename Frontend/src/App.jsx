import {useEffect, useState} from "react";
import {Route, Routes} from "react-router-dom";
import {readStorage} from "./utils/format";
import {Header} from "./components/layout/Header";
import {Footer} from "./components/layout/Footer";
import {Home} from "./pages/Home";
import {Browse} from "./pages/Browse";
import {Movie} from "./pages/Movie";
import {Event} from "./pages/Event";
import {Booking} from "./pages/Booking";
import {Login, Profile, Confirm} from "./pages/Account";
import {NotFound} from "./components/common/NotFound";

function App() {
    const [city, setCity] = useState(() => readStorage("rh-city", "Mumbai"));
    const [user, setUser] = useState(() => readStorage("rh-user", null));
    const [bookings, setBookings] = useState(() =>
        readStorage("rh-bookings", []),
    );

    useEffect(
        () => localStorage.setItem("rh-city", JSON.stringify(city)),
        [city],
    );
    useEffect(
        () => localStorage.setItem("rh-user", JSON.stringify(user)),
        [user],
    );
    useEffect(
        () => localStorage.setItem("rh-bookings", JSON.stringify(bookings)),
        [bookings],
    );

    return (
        <AppLayout city={city} setCity={setCity} user={user}>
            <AppRoutes
                city={city}
                user={user}
                setUser={setUser}
                bookings={bookings}
                setBookings={setBookings}
            />
        </AppLayout>
    );
}

function AppLayout({city, setCity, user, children}) {
    return (
        <>
            <Header city={city} setCity={setCity} user={user}/>
            {children}
            <Footer/>
        </>
    );
}

function AppRoutes({city, user, setUser, bookings, setBookings}) {
    return (
        <Routes>
            <Route path="/" element={<Home city={city}/>}/>
            <Route path="/movies" element={<Browse type="movie"/>}/>
            <Route path="/theatres" element={<Browse type="theatre" city={city}/>}/>
            <Route path="/movie/:id" element={<Movie city={city}/>}/>
            <Route path="/event/:id" element={<Event city={city}/>}/>
            <Route
                path="/book/:id"
                element={
                    <Booking
                        city={city}
                        user={user}
                        setUser={setUser}
                        bookings={bookings}
                        setBookings={setBookings}
                    />
                }
            />
            <Route path="/login" element={<Login setUser={setUser}/>}/>
            <Route
                path="/profile"
                element={<Profile user={user} setUser={setUser} bookings={bookings}/>}
            />
            <Route
                path="/confirmation/:ref"
                element={<Confirm bookings={bookings}/>}
            />
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
}

export default App;
