import { Navbar, Nav } from 'react-bootstrap';
import '../../css/secondnav.css';
import { Link } from 'react-router-dom';
const NavBars = () => {
    return (
        <Navbar expand="lg" className="bg">
            <Nav>
                <Link className="nav-link o" to="/">
                    Home
                </Link>
                <Link className="nav-link o " to="/program">
                    Programs
                </Link>
                <Link className="nav-link o" to="/my-reservation">
                    My Reservation
                </Link>
                <Link className="nav-link o " to="/program">
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
            {/* <Nav>
                <NavLink className="nav-link o" to="/contact">
                    Contact Us
                </NavLink>
                <NavLink className="nav-link o" to="/membership">
                    Membership
                </NavLink>
                <Link className="nav-link o" to="/details">
                    Reservations
                </Link>
            </Nav> */}
        </Navbar>
    );
};

export default NavBars;
