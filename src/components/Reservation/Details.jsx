/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import '../../css/reservation/navbook.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Overview from './Overview';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import MySlider from '../homepage/slider';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingDetails } from '../../store/Booking/bookingSlice';

export default function Details() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.items);

    const handleIncrement = type => {
        if (type === 'adults') {
            setAdults(adults + 1);
        } else if (type === 'children') {
            setChildren(children + 1);
        }
    };

    const handleDecrement = type => {
        if (type === 'adults' && adults > 0) {
            setAdults(adults - 1);
        } else if (type === 'children' && children > 0) {
            setChildren(children - 1);
        }
    };
    const handleDateChange = date => {
        if (!date) return;
        const localDate = new Date(date.setHours(12, 0, 0, 0));
        setSelectedDate(localDate);
    };

    const [overviewData, setOverviewData] = useState({
        id: null,
        adultPrice: null,
        childPrice: null,
        title: null,
        selectedDate: null,
    });

    const handleBookNow = () => {
        if (cart.length > 0) {
            const isDateInCart = cart.some(
                item => new Date(item.bookingDate).toDateString() === selectedDate.toDateString()
            );

            if (!isDateInCart) {
                Swal.fire({
                    text: 'The selected date does not match items in the cart.',
                    icon: 'warning',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                return;
            }
        }

        const ticketExists = cart.some(item => item.ticketId === overviewData.id);
        if (ticketExists) {
            Swal.fire({
                text: 'This ticket is already in your cart!',
                icon: 'warning',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        if (!selectedDate) {
            Swal.fire({
                icon: 'error',
                title: 'Booking Error',
                text: 'Please select a date.',
                confirmButtonColor: '#E07026',
            });
            return;
        }

        if (adults === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Booking Error',
                text: 'Please select at least one adult.',
                confirmButtonColor: '#E07026',
            });
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Please log in to continue.',
                confirmButtonColor: '#E07026',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        const bookDetail = {
            title: overviewData.title,
            ticketImg: overviewData.ticketImg,
            id: overviewData.id,
            selectedDate: selectedDate.toISOString().split('T')[0],
            currentDate: new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Cairo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date()),
            adults,
            children,
            adultPrice: overviewData.adultPrice,
            childPrice: overviewData.childPrice,
        };
        dispatch(setBookingDetails(bookDetail));
        console.log('bookDetail', bookDetail);
        navigate('/user-data');
    };

    return (
        <>
            <MySlider />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <Overview onDataUpdate={setOverviewData} />
                    </div>
                    <div className="col-md-1"></div>

                    <div className="col-md-5">
                        <div className="card mt-4">
                            {/* date */}
                            <div className="card-header text-center qq">
                                {/* Date picker */}
                                <div
                                    className="input-group"
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control text-center"
                                        minDate={new Date()}
                                        placeholderText="Select a date"
                                        // filterDate={date => {
                                        //     const today = new Date();
                                        //     return date > today;
                                        // }}
                                    />

                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            <i className="fa-regular fa-calendar"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* adult and child counter  */}
                            <div className="p-3">
                                {/* adult  */}
                                <div className="d-flex justify-content-between flex-wrap">
                                    <div className="d-flex flex-lg-row flex-column ">
                                        <h5 className="main-color">Adults</h5>
                                        <span
                                            className="ml-2 pt-1 text-muted fw-bold"
                                            style={{ fontSize: '14px' }}
                                        >
                                            {overviewData.adultPrice
                                                ? `(${overviewData.adultPrice} EGP)`
                                                : 'Price not available'}
                                        </span>
                                    </div>
                                    <div className="">
                                        <div className="input-group we1">
                                            <i
                                                className="fa-sharp fa-solid main-color fa-circle-minus mt-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDecrement('adults')}
                                            ></i>
                                            <input
                                                type="number"
                                                className="form-control innn text-center ml-2"
                                                id="adults"
                                                value={adults}
                                                readOnly
                                            />
                                            <i
                                                className="fa-solid fa-circle-plus mt-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleIncrement('adults')}
                                            ></i>
                                        </div>
                                    </div>
                                </div>

                                {/* children  */}
                                <div className="d-flex justify-content-between flex-wrap mt-2">
                                    <div className="d-flex flex-lg-row flex-column ">
                                        <h5 className="main-color">Children</h5>
                                        <span
                                            className="ml-2 pt-1 text-muted fw-bold"
                                            style={{ fontSize: '14px' }}
                                        >
                                            {overviewData.childPrice
                                                ? `(${overviewData.childPrice} EGP)`
                                                : 'Price not available'}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between flex-wrap">
                                        <div className="input-group we1">
                                            <i
                                                className="fa-sharp fa-solid fa-circle-minus mt-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleDecrement('children')}
                                            ></i>
                                            <input
                                                type="number"
                                                className="form-control innn text-center ml-2"
                                                id="children"
                                                value={children}
                                                readOnly
                                            />
                                            <i
                                                className="fa-solid fa-circle-plus mt-1"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleIncrement('children')}
                                            ></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center my-4">
                                    <button className="book" onClick={handleBookNow}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
