import { Navbar, Nav, NavLink } from 'react-bootstrap';
import "../../css/secondnav.css";
import { Link } from "react-router-dom";
const NavBars = () => {
  return (
    <Navbar expand="lg"  className='bg'>
      <Nav className="mr-auto ">
        <Link className="nav-link o" to="/">
          Home
        </Link>
        <Link className="nav-link o " to="/program">
          Program
        </Link>
        <Link className="nav-link o " to="/gallery">
          Gallery
        </Link>
        <Link className="nav-link o" to="/dining">
          Dining
        </Link>
      </Nav>
      <Navbar.Brand className="ml-auto">
      <Link to="/">
          <img src="/logo.png" className="logo" alt="Logo" />
        </Link>
      </Navbar.Brand>
      <Nav className="ml-auto">
        <NavLink className="nav-link o" to="/contact">
          Contact Us
        </NavLink>
        <NavLink className="nav-link o" to="/membership">
          Membership
        </NavLink>
        <Link className="nav-link o" to="/reservation">
          Reservations
        </Link>
      </Nav>
    </Navbar>
  );
};

export default NavBars;
