/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Loading } from '../Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL, CRUISES, HARBOURES, NATIONALITY, ORDER_CREATE, TOURGUIDE } from '../Api/Api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { clearCart } from '../../store/Cart/cartSlice';
const Payment = ({ handleNext }) => {
  const [boats, setBoats] = useState([]);
  const [guides, setGuides] = useState([]);
  const [nationalities, setNationalities] = useState([]);
  const [harbours, setHarbours] = useState([]);
  const [selectedHarbour, setSelectedHarbour] = useState("");
  const [selectedBoats, setSelectedBoats] = useState("");
  const [selectedGuides, setSelectedGuides] = useState("");
  const [selectedNationalities, setSelectedNationalities] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [boatingError, setBoatingError] = useState('');
  const [guideError, setGuideError] = useState('');
  const [nationalityError, setNationalityError] = useState('');
  const [harbourError, setHarbourError] = useState('');

  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch()

  const handleOpenDialog = (e) => {
    e.preventDefault();

    const errors = {
      boatingError: !selectedBoats ? 'Please select a Cruise' : '',
      guideError: !selectedGuides ? 'Please select a Tour Guide' : '',
      nationalityError: !selectedNationalities ? 'Please select a Nationality' : '',
      harbourError: !selectedHarbour ? 'Please select a Marina' : '',
    };

    setBoatingError(errors.boatingError);
    setGuideError(errors.guideError);
    setNationalityError(errors.nationalityError);
    setHarbourError(errors.harbourError);

    const valid = Object.values(errors).every((error) => error === '');
    if (valid) {
      setOpen(true);
    }
  };
  const handleChange = (setter, errorSetter) => (event) => {
    setter(event.target.value);
    errorSetter('');
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleBoatsChange = handleChange(setSelectedBoats, setBoatingError);
  const handleGuideChange = handleChange(setSelectedGuides, setGuideError);
  const handleNatChange = handleChange(setSelectedNationalities, setNationalityError);
  const handleHarbourChange = handleChange(setSelectedHarbour, setHarbourError);

  const fetchData = async (endpoint, setState, key = null, currentData = []) => {
    if (currentData.length > 0) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      const response = await axios.get(`${baseURL}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(key ? response.data[key] : response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoats = () => fetchData(CRUISES, setBoats, null, boats);
  const fetchGuides = () => fetchData(TOURGUIDE, setGuides, null, guides);
  const fetchNationalities = () => fetchData(NATIONALITY, setNationalities, null, nationalities);
  const fetchHarbours = () => fetchData(HARBOURES, setHarbours, 'value', harbours);

  const handleCashPay = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const calculateTotalPrice = (orderItems) => {
        return (orderItems || []).reduce((total, item) => {
          const itemTotal = (item.orderItemDetails || []).reduce(
            (sum, detail) => sum + Number(detail.ticketPrice || 0),
            0
          );
          return total + itemTotal;
        }, 0);
      };

      if (!cartItems || !Array.isArray(cartItems)) {
        throw new Error("Invalid cartItems structure");
      }

      const payload = {
        nationalityId: Number(selectedNationalities) || 0,
        cruiseId: Number(selectedBoats) || 0,
        tourGuideId: Number(selectedGuides) || 0,
        harbourId: Number(selectedHarbour) || 0,
        paymentDone: 1,
        totalPrice: 0,
        orderType: 2,
        orderItems: cartItems.map(item => ({
          orderItemDetails: (item.details || []).map(detail => ({
            ticketId: Number(item.ticketId) || 0,
            ticketPrice:
              detail.personAge === 1
                ? Number(item.adultPrice || 0) + Number(detail.totalAdtionalPrice || 0)
                : detail.personAge === 2
                  ? Number(item.childPrice || 0) + Number(detail.totalAdtionalPrice || 0)
                  : Number(detail.totalAdtionalPrice || 0),
            phoneNumber: detail.phoneNumber || "string",
            name: detail.name || "string",
            email: detail.email || "string",
            adttionalServicesPrice: Number(detail.totalAdtionalPrice || 0),
            personAge: Number(detail.personAge) || 1,
            services: Array.isArray(detail.addTionalServices)
              ? detail.addTionalServices.map(service => Number(service) || 0)
              : [],
            bookingDate: item.bookingDate,
          })),
          adultQuantity: Number(item.numberOfAdults) || 0,
          childQuantity: Number(item.numberOfChilds) || 0,
        })),
      };

      payload.totalPrice = calculateTotalPrice(payload.orderItems);

      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${baseURL}/${ORDER_CREATE}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('bookingResponse', JSON.stringify(response.data));

      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Your payment has been processed successfully.',
      });
      localStorage.removeItem("cart");
      dispatch(clearCart());

      setOpen(false);
      handleNext();
    } catch (error) {
      console.error('Error processing payment:', error);

      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'An error occurred while processing your payment. Please try again.',
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-capitalize mt-5">
      <div className="row">
        {loading && <Loading />}
        <Box className="d-flex flex-wrap justify-content-center align-items-center">

          {/* Cruise */}
          <div className="mt-lg-0 mt-3 m-1">
            <label htmlFor="CriuseId" className="d-flex">
              Cruise
            </label>
            <select
              name="CriuseId"
              value={selectedBoats}
              onClick={fetchBoats}
              onChange={handleBoatsChange}
              className="form-control"
            >
              <option value="">Choose Cruise</option>
              {boats.map(boat => (
                <option key={boat.id} value={boat.id}>
                  {boat.name}
                </option>
              ))}
            </select>
            {boatingError && <div className="text-danger">{boatingError}</div>}
          </div>

          {/* Tour Guide */}
          <div className="mt-lg-0 mt-3 m-1">
            <label htmlFor="TourGuideId" className="d-flex">
              Tour Guide
            </label>
            <select
              name="TourGuideId"
              value={selectedGuides}
              onClick={fetchGuides}
              onChange={handleGuideChange}
              className="form-control"
            >
              <option value="">Choose Tour Guide</option>
              {guides.map(guide => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </select>
            {guideError && <div className="text-danger">{guideError}</div>}
          </div>

          {/* Nationality */}
          <div className="mt-lg-0 mt-3 m-1">
            <label htmlFor="NationalityId" className="d-flex">
              Nationality
            </label>
            <select
              name="NationalityId"
              onClick={fetchNationalities}
              value={selectedNationalities}
              onChange={handleNatChange}
              className="form-control"
            >
              <option value="">Choose Nationality</option>
              {nationalities.map(nat => (
                <option key={nat.id} value={nat.id}>
                  {nat.name}
                </option>
              ))}
            </select>
            {nationalityError && <div className="text-danger">{nationalityError}</div>}
          </div>

          {/* Marina */}
          <div className="mt-lg-0 mt-3 m-1">
            <label htmlFor="HarbourId" className="d-flex">
              Marina
            </label>
            <select
              name="HarbourId"
              onClick={fetchHarbours}
              value={selectedHarbour}
              onChange={handleHarbourChange}
              className="form-control"
            >
              <option value="">Choose Marina</option>
              {harbours.map(Harbour => (
                <option key={Harbour.id} value={Harbour.id}>
                  {Harbour.name}
                </option>
              ))}
            </select>
            {harbourError && <div className="text-danger">{harbourError}</div>}
          </div>

        </Box>
        <div className='d-flex justify-content-center mt-4'>
          <button
            className="m-1 card-btn"
            onClick={handleOpenDialog}
          >
            Pay
          </button>
        </div>

        {/* Payment Method Dialog */}
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth={"sm"}>
          <DialogTitle className='text-center'>Choose Payment Method</DialogTitle>
          <DialogContent>
            <div className="col-md-12 d-flex flex-column justify-content-center">
              <button className="btn btn-warning btn-lg mb-3">
                <img src="/img/paypal.svg" alt="Paypal" />
              </button>
              <button className="btn btn-dark btn-lg mb-3 text-capitalize">
                <i className="fas fa-credit-card mr-1"></i>
                <span>Debit or Credit Card</span>
              </button>
              <button
                className="btn btn-primary btn-lg fw-bold text-capitalize"
                onClick={handleCashPay}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Cash Pay'
                )}
              </button>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="error">
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

export default Payment;
