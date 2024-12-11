import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeItemFromCart } from '../../store/Cart/cartSlice';
import React from 'react';
import { IMG_URL } from '../Api/Api';
import CardContent from '@mui/material/CardContent';
import { Card } from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router';

const Cart = ({ handleNext }) => {
    const navigate = useNavigate()
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

                            {cartItems.map((item) => (

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
                                                    <p className="text-dark fw-bold m-1 m-1">
                                                        <strong className='main-color'>Ticket Name : </strong>{" "} {item.ticketName}
                                                    </p>
                                                    <p className="text-dark fw-bold m-1">
                                                        <strong className='main-color'>Ticket ID : </strong>{" "} {item.ticketId}
                                                    </p>
                                                    <p className="text-dark fw-bold m-1">
                                                        <strong className='main-color'>Adults : </strong>{" "} {item.numberOfAdults}
                                                    </p>
                                                    <p className="text-dark fw-bold m-1">
                                                        <strong className='main-color'>Children : </strong>{" "} {item.numberOfChilds}
                                                    </p>
                                                    <p className="text-dark fw-bold m-1">
                                                        <strong className='main-color'>Booking On:</strong>{" "} {item.currentDate.split("T")[0]}
                                                    </p>
                                                    <p className="text-dark fw-bold m-1">
                                                        <strong className='main-color'>Booking Date : </strong>{" "} {item.bookingDate}
                                                    </p>
                                                    <h6 className='main-color fw-bold'>Additional Services:</h6>
                                                    <div>
                                                        {Array.from(
                                                            new Map(item.additionalServices.map(service => [service.id, service])).values()
                                                        ).map((service, index) => (
                                                            <div key={index}>
                                                                <p><span className='main-color fw-bold'>Service Name : </span>{" "} {service.name}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-dark fw-bold m-1">
                                                        <strong className='main-color'>Total Price : </strong>{" "} {item.price} EGP
                                                    </p>
                                                </CardContent>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </div>

                <div className="mt-lg-4 mt-0 d-flex flex-column align-items-center">
                    <button
                        className="m-1 card-btn"
                        // onClick={handleOpenDialog}
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
