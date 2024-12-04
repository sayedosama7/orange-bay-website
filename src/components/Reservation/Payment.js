/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Loading } from '../Loading/Loading';
import { toZonedTime, format } from 'date-fns-tz';

const Payment = ({ bookDetail, handleNext }) => {
  const { adults, children, currentDate, selectedDate } = bookDetail;

  const [loading, setLoading] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [addTionalServices, setAddTionalServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [additionalServices, setAdditionalServices] = useState([]);

  useEffect(() => {
    const storedDetails = localStorage.getItem('bookingUserDetails');
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      // setSelectedDate(parsedDetails.bookingDate || null);
      setAddTionalServices(parsedDetails.details?.flatMap(detail => detail.addTionalServices) || []);
      setTotalPrice(parsedDetails.price || 0);
      setAdditionalServices(parsedDetails.additionalServices);

      const uniqueServices = [
        ...new Map(parsedDetails.additionalServices.map(service => [service.id, service])).values()
      ];
      setAdditionalServices(uniqueServices);

    }
  }, []);

  const formatDate = (date) => {
    if (!date) return 'No date selected';
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Invalid date:', date);
      return 'Invalid date';
    }
  };

  const handleCashPay = async () => {
    const storedDetails = localStorage.getItem('bookingUserDetails');

    if (!storedDetails) {
      console.error('No booking details found!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const parsedDetails = JSON.parse(storedDetails);

    const details = parsedDetails.details || [];
    if (!Array.isArray(details) || details.length === 0) {
      console.error("Details are missing or invalid in bookingUserDetails.");
      return;
    }

    const bookingDate = selectedDate ? toZonedTime(selectedDate, 'Africa/Cairo') : new Date();
    const formattedBookingDate = bookingDate.toISOString();

    const data = {
      ticketId: parsedDetails.ticketId || parsedDetails.id,
      currentDate: parsedDetails.bookingDate || parsedDetails.currentDate,
      price: parsedDetails.price || 0,
      numberOfAdults: parsedDetails.numberOfAdults || 0,
      numberOfChilds: parsedDetails.numberOfChilds || 0,
      details: details.map(detail => ({
        phoneNumber: detail.phoneNumber,
        addTionalServices: detail.addTionalServices || [],
        totalAdtionalPrice: detail.totalAdtionalPrice || 0,
        name: detail.name,
        email: detail.email,
        personAge: detail.personAge || 0,
      })),
      bookingDate: formattedBookingDate,
    };

    try {
      setLoading(true);
      const response = await fetch('http://elgzeraapp.runasp.net/api/Booking/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem('bookingResponse', JSON.stringify(result));

      Swal.fire({
        title: 'Booking Successful!',
        text: 'Your booking was completed successfully. Click below to view the details.',
        icon: 'success',
        confirmButtonText: 'Go to Details',
        confirmButtonColor: '#E07026',
      }).then(() => {
        handleNext();
        localStorage.removeItem("bookDetail");
        localStorage.removeItem("bookingUserDetails");
      });
    } catch (error) {
      setLoading(false);
      console.error('Failed to complete booking:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Failed to complete the booking. Please try again.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  };

  return (
    <div className="container text-capitalize mt-5">
      <div className="row">
        {loading && <Loading />}

        <div className="col-md-6 d-flex flex-column justify-content-center">
          <button className="btn btn-warning btn-lg mb-3">
            <img src="img/paypal.svg" alt="" />
          </button>
          <button className="btn btn-dark btn-lg mb-3 text-capitalize">
            <i className="fas fa-credit-card mr-1"></i>
            <span>Debit or Credit Card</span>
          </button>
          <button
            className="btn btn-primary btn-lg fw-bold text-capitalize"
            onClick={handleCashPay}
          >
            Cash Pay
          </button>
        </div>

        <div className="booking-summary col-md-5 m-auto">
          <h4 className='main-color text-center mb-4 border p-2 rounded-3 mt-2'>Booking Details</h4>
          <p className='main-color fw-bold'>trip name :<span className='text-dark ml-1'>{bookDetail.title}</span></p>
          <p className='main-color fw-bold'>
            booking date :
            <span className='text-dark ml-1'>
              {formatDate(selectedDate)}
            </span>
          </p>
          <p className='main-color fw-bold'>
            booking on :
            <span className='text-dark ml-1'>
              {formatDate(currentDate)}
            </span>
          </p>
          <p className='main-color fw-bold'>Number of Adults :<span className='text-dark ml-1'>{adults}</span></p>
          <p className='main-color fw-bold'>Number of Children :<span className='text-dark ml-1'>{children}</span></p>
          <span className='main-color fw-bold m-0'>Additional Services : </span>
          {additionalServices && additionalServices.length > 0 ? (
            additionalServices.map((service, index) => (
              <div
                key={index}
              >
                <div className='mt-2 fw-bold'>
                  <span>{service.name || 'No Name'}</span>
                </div>
              </div>
            ))
          ) : (
            <span className='mt-2'>No additional services available.</span>
          )}

          <hr />
          <div className='d-flex justify-content-between align-items-center'>
            <h5 className='main-color fw-bold'>Total Price :</h5>
            <h6 className='text-dark ml-1'>{totalPrice} EGP</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
