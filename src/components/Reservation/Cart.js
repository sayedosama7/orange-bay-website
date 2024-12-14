
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeItemFromCart } from '../../store/Cart/cartSlice';
import React from 'react';
import { IMG_URL } from '../Api/Api';
import CardContent from '@mui/material/CardContent';
import { Card } from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router';

const Cart = ({ handleNext }) => {
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();

    const handleRemove = (id) => {
        dispatch(removeItemFromCart(id));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleHome = () => {
        navigate('/');
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-5 empty-cart">
                <h3>Your cart is empty.</h3>
                <button onClick={handleHome} className='btn btn-primary mt-4'>back home</button>
            </div>
        );
    }

    return (
        <div>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-md-12 mb-2">
                        <Grid container spacing={3} justifyContent="center">
                            {cartItems.map((item) => {
                                const serviceCounts = item.additionalServices.reduce((acc, service) => {
                                    const serviceKey = service.name;
                                    if (acc[serviceKey]) {
                                        acc[serviceKey] += 1;
                                    } else {
                                        acc[serviceKey] = 1;
                                    }
                                    return acc;
                                }, {});

                                const priceForAllAdults = item.adultPrice * item.numberOfAdults
                                const priceForAllChild = item.childPrice * item.numberOfChilds

                                const uniqueServices = item.additionalServices.filter((value, index, self) =>
                                    index === self.findIndex((t) => (
                                        t.name === value.name
                                    ))
                                );

                                return (
                                    <Grid item xs={12} sm={6} md={6} key={item.ticketId}>
                                        <Card className='mb-2 position-relative'>
                                            <div
                                                className="remove-icon-card position-absolute"
                                                style={{ top: '10px', right: '15px' }}
                                                onClick={() => handleRemove(item.ticketId)}
                                            >
                                                <i className='fas fa-xmark'></i>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div
                                                        className="d-flex justify-content-center align-items-center ticket-img"
                                                        style={{ height: "100%" }}
                                                    >
                                                        <img src={`${IMG_URL}${item.ticketImg}`}
                                                            alt="ticket-img" className="w-100 px-lg-4 px-0" style={{ objectFit: "cover", height: "200px", borderRadius: "5px" }} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <CardContent>
                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Ticket Name: </strong> {item.ticketName}
                                                        </p>
                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Ticket ID: </strong> {item.ticketId}
                                                        </p>
                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Adults: </strong> {item.numberOfAdults} x {item.adultPrice} $ = {priceForAllAdults} $
                                                        </p>
                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Children: </strong> {item.numberOfChilds} x {item.childPrice} $ = {priceForAllChild} $
                                                        </p>
                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Booking On:</strong> {item.currentDate.split("T")[0]}
                                                        </p>
                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Booking Date: </strong> {item.bookingDate}
                                                        </p>

                                                        <h6 className='main-color fw-bold'>Additional Services:</h6>
                                                        <div>
                                                            {uniqueServices.map((service, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        <ul>
                                                                            <li>
                                                                                {serviceCounts[service.name]} x <span className="main-color fw-bold">{service.name}</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Total Price for Services: </strong> {item.srvPrice} $
                                                        </p>

                                                        <p className="text-dark fw-bold m-1">
                                                            <strong className='main-color'>Total Price: </strong> {item.price} $
                                                        </p>
                                                    </CardContent>
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                </div>

                <div className="mt-lg-4 mt-0 d-flex flex-column align-items-center">
                    <button
                        className="m-1 card-btn"
                        onClick={handleNext}
                    >
                        Continue
                    </button>
                    <button
                        className="m-1 card-btn card-btn-clear"
                        onClick={handleClearCart}
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
