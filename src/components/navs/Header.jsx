import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Navbar, Nav, NavLink, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/firstnav.css';
import { jwtDecode } from 'jwt-decode';
import { clearCart } from '../../store/Cart/cartSlice';
import { useDispatch } from 'react-redux';

const Header = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearCart());
        localStorage.clear();
        navigate('/login');
    };

    let userId = '';

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    return (
        <Navbar expand="md" className="n">
            <Navbar
                className="d-flex flex-lg-row justify-content-lg-between justify-content-start flex-column align-items-lg-center align-items-start"
                id="basic-navbar-nav"
            >
                <Nav className="">
                    <Nav className="nav-link">
                        <a href="https://www.facebook.com">
                            <FaFacebook className="icon" />
                        </a>
                        <a href="https://www.instagram.com">
                            <FaInstagram className="icon" />
                        </a>
                        <a href="https://www.twitter.com">
                            <FaTwitter className="icon" />
                        </a>
                    </Nav>
                </Nav>

                <Nav className="">
                    {/* <NavDropdown title="EGP" id="basic-nav-dropdown" className="nav-dropdown">
                        <NavDropdown.Item className="hh" href="#">
                            EGP
                        </NavDropdown.Item>
                        <NavDropdown.Item className="hh" href="#">
                            USD
                        </NavDropdown.Item>
                    </NavDropdown>
                    <NavLink className="nav-link" to="/schools">
                        العربية
                    </NavLink> */}
                    <p className="text-white fw-bold p-2 text-capitalize">welcome {userId}</p>
                    {token ? (
                        <button className="admission" onClick={handleLogout}>
                            Log out
                        </button>
                    ) : (
                        <Link to="/login">
                            <button className="admission">Sign in</button>
                        </Link>
                    )}
                </Nav>
            </Navbar>
        </Navbar>
    );
};

export default Header;
