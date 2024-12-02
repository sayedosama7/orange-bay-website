import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Loading } from '../Loading/Loading';

const Payment = ({ bookDetail, handleNext }) => {
  const { adults, children, totalPrice, addTionalServices = [], title, selectedDate, id, currentDate } = bookDetail;
  const [loading, setLoading] = useState(false)
  const additionalServicesTotal = addTionalServices.reduce((total, service) => total + service.price, 0);
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

    const token = localStorage.getItem('token');
    if (!storedDetails) {
      console.error('No booking details found!');
      return;
    }

    const parsedDetails = JSON.parse(storedDetails);
    const { adults, children } = parsedDetails;

    const allDetails = [
      ...adults,
      ...children
    ];


    const serviceIds = addTionalServices.map(service => service.id);

    const data = {
      ticketId: id,
      currentDate: currentDate,
      price: totalPrice,
      numberOfAdults: adults.length,
      numberOfChilds: children.length,
      details: allDetails,
      addTionalServices: serviceIds,
      bookingDate: new Date(selectedDate).toISOString(),
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


  const personAge = {
    1: 'Adult',
    2: 'Child',
  };

  return (
    <div className="container text-capitalize mt-5">
      <div className="row">
        {loading && <Loading />}

        {/* pay buttons  */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <button className="btn btn-warning btn-lg mb-3">
            <img src="img/paypal.svg" alt="" />
          </button>
          <button className="btn btn-dark btn-lg mb-3 text-capitalize">
            <i className="fas fa-credit-card mr-1"></i>
            <span>Debit or Credit Card</span>
          </button>
          <button className="btn btn-primary btn-lg fw-bold text-capitalize"
            onClick={handleCashPay}>
            Cash Pay
          </button>
        </div>

        {/* booking-summary */}
        <div className="booking-summary col-md-5 m-auto">
          <h4 className='main-color text-center mb-4 border p-2 rounded-3 mt-2'>Booking Details</h4>
          <p className='main-color fw-bold'>trip name :<span className='text-dark ml-1'>{title}</span></p>
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
          {addTionalServices.length > 0 ? (
            addTionalServices.map((service, index) => (
              <div className='d-flex justify-content-between align-items-lg-center align-items-start flex-lg-row flex-column' key={index}>
                <div className='mt-2 fw-bold'>
                  <span className='main-color'>name :{" "}</span>
                  <span>
                    {service.name}
                  </span>
                </div>

                <div className='mt-2 fw-bold'>
                  <span className='main-color'>
                    price :{" "}
                  </span>
                  <span>
                    {service.price} EGP
                  </span>
                </div>

                <div className='mt-2 fw-bold'>
                  <span className='main-color'>for{" "}</span>
                  <span> ({personAge[service.personAge]})</span>
                </div>
              </div>
            ))
          ) : (
            <span className='mt-2'>None</span>
          )}

          {addTionalServices.length > 0 && (
            <div className='mt-2 fw-bold'>
              <span className='main-color'>total price for services : </span>
              <span>{additionalServicesTotal} EGP</span>
            </div>
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
