import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ADDTIONALSERVICES, baseURL } from '../Api/Api';
import { Loading } from '../Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from '../../store/Cart/cartSlice';
import Swal from 'sweetalert2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { jwtDecode } from 'jwt-decode';

const UserData = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    const isValid = validateForm();
    if (isValid) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedServices, setSelectedServices] = useState({
    adults: [],
    children: [],
  });

  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const bookingDetails = useSelector((state) => state.booking.bookingDetails);

  const [formData, setFormData] = useState({
    adults: [],
    children: [],
  });

  const [errors, setErrors] = useState({
    adults: [],
    children: [],
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      let role = ''
      role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const response = await axios.get(`${baseURL}/${ADDTIONALSERVICES}/GetByRole?role=${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllServices(response.data.value);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (bookingDetails.adults > 0 && bookingDetails.children >= 0) {
      setFormData({
        adults: Array(bookingDetails.adults).fill({ name: '', email: '', phoneNumber: '', addtionalServices: [] }),
        children: Array(bookingDetails.children).fill({ name: '', addtionalServices: [] }),
      });
      setErrors({
        adults: Array(bookingDetails.adults).fill({ name: '', email: '', phoneNumber: '' }),
        children: Array(bookingDetails.children).fill({ name: '' }),
      });
    }
  }, [bookingDetails.adults, bookingDetails.children]);

  const handleChange = (type, index, field, value) => {
    const updatedData = [...formData[type]];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setFormData({ ...formData, [type]: updatedData });
  };

  // const handleServiceChange = (type, index, newValue) => {
  //   const updatedData = [...formData[type]];
  //   updatedData[index] = { ...updatedData[index], addtionalServices: newValue };
  //   setFormData({ ...formData, [type]: updatedData });
  // };

  const handleServiceChange = (type, index, newValue) => {
    const updatedData = [...formData[type]];
    updatedData[index] = { ...updatedData[index], addtionalServices: newValue };

    setFormData({ ...formData, [type]: updatedData });

    const updatedSelectedServices = {
      ...selectedServices,
      [type]: updatedData.map(item => item.addtionalServices),
    };
    setSelectedServices(updatedSelectedServices);
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = { adults: [], children: [] };

    formData.adults.forEach((adult, index) => {
      if (!adult.name.trim()) {
        newErrors.adults[index] = { ...newErrors.adults[index], name: 'Name is required' };
        formIsValid = false;
      }
      if (index === 0) {
        if (!adult.email.trim()) {
          newErrors.adults[index] = { ...newErrors.adults[index], email: 'Email is required' };
          formIsValid = false;
        }
        if (!adult.phoneNumber.trim()) {
          newErrors.adults[index] = { ...newErrors.adults[index], phoneNumber: 'Phone number is required' };
          formIsValid = false;
        }
      }
    });

    formData.children.forEach((child, index) => {
      if (!child.name.trim()) {
        newErrors.children[index] = { ...newErrors.children[index], name: 'Name is required' };
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    let totalPrice = 0;

    const adultTicketPrice = bookingDetails.adults * bookingDetails.adultPrice;
    const childTicketPrice = bookingDetails.children * bookingDetails.childPrice;
    totalPrice += adultTicketPrice + childTicketPrice;

    const details = [
      ...formData.adults.map(adult => {
        const totalAdditionalPrice = adult.addtionalServices.reduce(
          (sum, service) => sum + (service.adultPrice || 0),
          0
        );
        totalPrice += totalAdditionalPrice;

        return {
          phoneNumber: adult.phoneNumber,
          addTionalServices: adult.addtionalServices.map(service => service.id),
          totalAdtionalPrice: totalAdditionalPrice,
          name: adult.name,
          email: adult.email,
          personAge: 1,
        };
      }),
      ...formData.children.map(child => {
        const totalAdditionalPrice = child.addtionalServices.reduce(
          (sum, service) => sum + (service.childPrice || 0),
          0
        );
        totalPrice += totalAdditionalPrice;

        return {
          phoneNumber: null,
          addTionalServices: child.addtionalServices.map(service => service.id),
          totalAdtionalPrice: totalAdditionalPrice,
          name: child.name,
          email: null,
          personAge: 2,
        };
      }),
    ];
    const additionalServices = [
      ...formData.adults.flatMap(adult => adult.addtionalServices),
      ...formData.children.flatMap(child => child.addtionalServices),
    ];
    const payload = {
      ticketId: bookingDetails.id,
      adultPrice: bookingDetails.adultPrice,
      childPrice: bookingDetails.childPrice,
      ticketImg: bookingDetails.ticketImg,
      ticketName: bookingDetails.title,
      currentDate: bookingDetails.currentDate,
      price: totalPrice,
      numberOfAdults: formData.adults.length,
      numberOfChilds: formData.children.length,
      details,
      additionalServices,
      bookingDate: bookingDetails.selectedDate,
      srvPrice: calculateTotalServicesPrice()
    };
    console.log(payload);


    dispatch(addItemToCart(payload));
    Swal.fire({
      text: 'Successfully added to cart!',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    navigate("/program")
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const calculateTotalServicesPrice = () => {
    let totalAdultsServices = selectedServices.adults.flat().reduce((acc, service) => {
      return acc + (service.adultPrice * (service.count || 1));
    }, 0);

    let totalChildrenServices = selectedServices.children.flat().reduce((acc, service) => {
      return acc + (service.childPrice * (service.count || 1));
    }, 0);

    return totalAdultsServices + totalChildrenServices;
  };

  const calculateTotalPrice = () => {
    const basePrice =
      bookingDetails.adults * bookingDetails.adultPrice +
      bookingDetails.children * bookingDetails.childPrice;

    const totalServicesPrice = calculateTotalServicesPrice();

    return basePrice + totalServicesPrice;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <>
      {loading && <Loading />}
      <div className="container text-capitalize mt-5">
        <div className="row">
          <div className="user-details col-md-10 m-auto pb-5">
            <h4 className='main-color text-center mb-4 border p-2 rounded-3 mt-2'>Enter Details</h4>

            <h5 className='mt-4 fw-bold'>Adults</h5>
            {formData.adults.map((adult, index) => (
              <div key={index}>
                <div className="row">

                  <div className='col-md-6 mt-3'>
                    <label className='fw-bold main-color' htmlFor={`adult-name-${index}`}>The Adult Name Number {index + 1}:</label>
                    <input
                      type="text"
                      className='form-control'
                      id={`adult-name-${index}`}
                      placeholder="Name"
                      value={adult.name}
                      onChange={e => handleChange('adults', index, 'name', e.target.value)}
                      required
                      style={{ height: "56px" }}
                    />
                    {errors.adults[index]?.name && <div className="error-log">{errors.adults[index]?.name}</div>}
                  </div>
                  {/*All Additional Services */}
                  <div className='col-md-6 mt-3'>
                    <label htmlFor="tax" className="d-flex main-color fw-bold">
                      Additional Services
                    </label>
                    <Autocomplete
                      multiple
                      id={`adult-services-${index}`}
                      options={allServices.filter(
                        service => service.adultPrice > 0 && service.status === 1
                      )}
                      disableCloseOnSelect
                      getOptionLabel={option => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, newValue) => handleServiceChange('adults', index, newValue)}

                      renderOption={(props, option, { selected }) => {
                        const { key, ...restProps } = props;
                        return (
                          <li key={option.id} {...restProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              checked={selected}
                              style={{ marginRight: 8 }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <span>{option.name}</span>
                              <span
                                style={{
                                  fontSize: '0.85em',
                                  color: 'gray',
                                }}
                              >
                                Price: {option.adultPrice}
                              </span>
                            </div>
                          </li>
                        );
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Choose Services"
                        />)}
                    />
                  </div>
                </div>

                {index === 0 && (
                  <>
                    <div className="row mb-2">
                      <div className="col-md-6 mt-3">
                        <label className='fw-bold main-color' htmlFor={`adult-email-${index}`}>Email Address:</label>
                        <input
                          type="email"
                          className='form-control'
                          id={`adult-email-${index}`}
                          placeholder="Email"
                          value={adult.email}
                          onChange={e => handleChange('adults', index, 'email', e.target.value)}
                          required
                          style={{ height: "58px" }}
                        />
                        {errors.adults[index]?.email && <div className="error-log">{errors.adults[index]?.email}</div>}
                      </div>

                      <div className="col-md-6 mt-3">
                        <label className='fw-bold main-color' htmlFor={`adult-phoneNumber-${index}`}>phoneNumber Number:</label>
                        <input
                          type="text"
                          className='form-control'
                          id={`adult-phoneNumber-${index}`}
                          placeholder="phoneNumber"
                          value={adult.phoneNumber}
                          onChange={e => handleChange('adults', index, 'phoneNumber', e.target.value)}
                          required
                          style={{ height: "58px" }}
                        />
                        {errors.adults[index]?.phoneNumber && <div className="error-log">{errors.adults[index]?.phoneNumber}</div>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {formData.children.length > 0 && (
              <>
                <h5 className='mt-5 fw-bold'>Children</h5>
                {formData.children.map((child, index) => (
                  <div key={index}>
                    <div className="row">
                      <div className="col-md-6 mt-3">
                        <label className='fw-bold main-color' htmlFor={`child-name-${index}`}>
                          The Child Name Number {index + 1}:
                        </label>
                        <input
                          type="text"
                          className='form-control'
                          id={`child-name-${index}`}
                          placeholder="Name"
                          value={child.name}
                          onChange={e => handleChange('children', index, 'name', e.target.value)}
                          required
                          style={{ height: "58px" }}
                        />
                        {errors.children[index]?.name && <div className="error-log">{errors.children[index]?.name}</div>}
                      </div>
                      {/*All Additional Services */}
                      <div className='col-md-6 mt-3'>
                        <label htmlFor="tax" className="d-flex main-color fw-bold">
                          Additional Services
                        </label>
                        <Autocomplete
                          multiple
                          id={`child-services-${index}`}
                          options={allServices.filter(
                            service => service.childPrice > 0 && service.status === 1
                          )}
                          disableCloseOnSelect
                          getOptionLabel={option => option.name}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => handleServiceChange('children', index, newValue)}

                          renderOption={(props, option, { selected }) => {
                            const { key, ...restProps } = props;
                            return (
                              <li key={option.id} {...restProps}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  checked={selected}
                                  style={{ marginRight: 8 }}
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                  }}
                                >
                                  <span>{option.name}</span>
                                  <span
                                    style={{
                                      fontSize: '0.85em',
                                      color: 'gray',
                                    }}
                                  >
                                    Price: {option.childPrice}
                                  </span>
                                </div>
                              </li>
                            );
                          }}
                          renderInput={params => (
                            <TextField {...params} label="Choose Services" />
                          )}
                        />
                      </div>
                    </div>

                  </div>

                ))}
              </>
            )}

          </div>

          <div className="d-flex justify-content-center">
            {/* <button className='mt-lg-4 mt-3 btn-main btn pay-btn' onClick={handleSubmit} >Add To Cart</button> */}
            <button className="mt-lg-4 mt-3 btn-main btn pay-btn" onClick={handleOpen}>
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Dialog details*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h4" className='main-color text-center mb-0 pb-0'>Details</DialogTitle>
        <DialogContent>
          <hr className='my-2' />
          {formData.adults.length > 0 && (
            <Typography variant="h6">
              <span className='main-color'>Number Of Adults:</span> {formData.adults.length} x {bookingDetails.adultPrice}$
            </Typography>
          )}

          {formData.adults.length === 0 && (
            <Typography variant="h6">
              <span className='main-color'>Number Of Adults:</span> 0
            </Typography>
          )}

          {formData.children.length > 0 && (
            <Typography variant="h6">
              <span className="main-color">Number Of Children:</span> {formData.children.length} x {bookingDetails.childPrice}$
            </Typography>
          )}

          {formData.children.length === 0 && (
            <Typography variant="h6">
              <span className="main-color">Number Of Children:</span> 0
            </Typography>
          )}
          <hr className='my-2' />
          <Typography variant="h6" className="mt-"><span className="main-color">Adults Services:</span></Typography>
          {selectedServices.adults.length > 0 ? (
            Object.values(
              selectedServices.adults.flat().reduce((acc, service) => {
                if (service && service.name) {
                  if (!acc[service.name]) {
                    acc[service.name] = { ...service, count: 1 };
                  } else {
                    acc[service.name].count += 1;
                  }
                }
                return acc;
              }, {})
            ).map((service, index) => (
              <Typography key={index}>
                {service.name} - {service.adultPrice} x {service.count} = {service.adultPrice * service.count} $
              </Typography>
            ))
          ) : (
            <Typography>No services.</Typography>
          )}
          <hr className='my-2' />
          <Typography variant="h6" className="mt-3"><span className="main-color">Children Services:</span></Typography>
          {selectedServices.children.length > 0 ? (
            Object.values(
              selectedServices.children.flat().reduce((acc, service) => {
                if (service && service.name) {
                  if (!acc[service.name]) {
                    acc[service.name] = { ...service, count: 1 };
                  } else {
                    acc[service.name].count += 1;
                  }
                }
                return acc;
              }, {})
            ).map((service, index) => (
              <Typography key={index}>
                {service.name} - {service.childPrice} x {service.count} = {service.childPrice * service.count} $
              </Typography>
            ))
          ) : (
            <Typography>No services</Typography>
          )}
          <hr className='my-2' />
          <Typography variant="h6" className="mt-3">
            <span className="main-color">Total Services Price:</span> {calculateTotalServicesPrice()} $
          </Typography>
          <hr className='my-2' />
          <Typography variant="h6" className="">
            <span className="main-color">Total Booking Price (with services):</span> {totalPrice} $
          </Typography>

        </DialogContent>
        <hr className='my-2' />
        <DialogActions className='d-flex justify-content-between align-items-center pb-3'>
          <button className='btn-main rounded-2 p-2' onClick={handleClose}>Close</button>
          <button className='btn-main rounded-2 p-2' onClick={handleSubmit}>Add to Cart</button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default UserData;
