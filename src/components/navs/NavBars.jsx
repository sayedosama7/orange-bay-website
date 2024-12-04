import { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import '../../css/secondnav.css';
import { Link } from 'react-router-dom';

const NavBars = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const updateToken = () => {
            setToken(localStorage.getItem('token')); 
        };

        window.addEventListener('storage', updateToken);

        const interval = setInterval(updateToken, 500);

        return () => {
            window.removeEventListener('storage', updateToken);
            clearInterval(interval);
        };
    }, []);

    return (
        <Navbar expand="lg" className="bg">
            <Nav>
                <Link className="nav-link o" to="/">
                    Home
                </Link>
                <Link className="nav-link o" to="/program">
                    Programs
                </Link>
                {token && (
                    <Link className="nav-link o" to="/my-reservation">
                        My Reservation
                    </Link>
                )}
                <Link className="nav-link o" to="/program">
                    Gallery
                </Link>
                <Link className="nav-link o" to="/program">
                    Dining
                </Link>
            </Nav>
            <Navbar.Brand>
                <Link to="/">
                    <img src="/logo.png" className="logo" alt="Logo" />
                </Link>
            </Navbar.Brand>
        </Navbar>
    );
};

export default NavBars;
