import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import { allServices, baseURL } from '../Api/Api';
import { Loading } from '../Loading/Loading';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const UserData = ({ bookDetail, handleNext }) => {
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { adults, children, totalPrice, title, selectedDate, currentDate } = bookDetail;

  const [formData, setFormData] = useState({
    adults: [],
    children: [],
    allServices: []
  });

  const [errors, setErrors] = useState({
    adults: [],
    children: [],
    allServices: []
  });

  // Fetch all All Services
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      let role = '';

      if (token) {
        try {
          const decoded = jwtDecode(token);
          role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
      if (role === 'Admin') {
        const response = await axios.get(`${baseURL}/${allServices}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAllServices(response.data.value);
      }
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
    if (adults > 0 && children >= 0) {
      setFormData({
        adults: Array(adults).fill({ name: '', email: '', phoneNumber: '' }),
        children: Array(children).fill({ name: '' }),
      });
      setErrors({
        adults: Array(adults).fill({ name: '', email: '', phoneNumber: '' }),
        children: Array(children).fill({ name: '' }),
      });
    }
  }, [adults, children]);

  const handleChange = (type, index, field, value) => {
    const updatedData = [...formData[type]];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setFormData({ ...formData, [type]: updatedData });
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
          newErrors.adults[index] = { ...newErrors.adults[index], phoneNumber: 'phoneNumber is required' };
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

  const handleSubmit = () => {
    if (validateForm()) {
      const bookingUserDetails = {
        adults: formData.adults.map(adult => ({
          name: adult.name,
          email: adult.email,
          phoneNumber: adult.phoneNumber,
          personAge: 1,
        })),
        children: formData.children.map(child => ({
          name: child.name,
          personAge: 2,
        })),
      };
      localStorage.setItem('bookingUserDetails', JSON.stringify(bookingUserDetails));
      handleNext();
    }
  };


  const additionalServicesTotal = allServices.reduce((total, service) => total + service.price, 0);

  const formatDate = (date) => {
    if (!date) return 'No date selected';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const personAge = {
    1: 'Adult',
    2: 'Child',
  };

  return (
    <>
      <div className="container text-capitalize mt-5">
        <div className="row">
          <div className="user-details col-md-6 pb-5">
            <h4 className='main-color text-center mb-4 border p-2 rounded-3 mt-2'>Enter Details</h4>

            <h5 className='main-color mt-4'>Adults</h5>
            {formData.adults.map((adult, index) => (
              <div key={index}>
                <div className="row">

                  <div className='col-md-6 mt-3'>
                    <label className='fw-bold' htmlFor={`adult-name-${index}`}>The Adult Name Number {index + 1}:</label>
                    <input
                      type="text"
                      className='form-control'
                      id={`adult-name-${index}`}
                      placeholder="Name"
                      value={adult.name}
                      onChange={e => handleChange('adults', index, 'name', e.target.value)}
                      required
                    />
                    {errors.adults[index]?.name && <div className="error-log">{errors.adults[index]?.name}</div>}
                  </div>
                  {/*All Additional Services */}
                  <div className='col-md-6'>
                    <label htmlFor="tax" className="d-flex main-color fw-bold">
                      Additional Services
                    </label>
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={allServices.filter(service => service.status === 1)}
                      disableCloseOnSelect
                      getOptionLabel={option => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, addtionalServices: newValue });
                      }}
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
                                Price: {option.price} for{' '}
                                {personAge[option.personAge]}
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

                {index === 0 && (
                  <>
                    <div className="row mb-2">
                      <div className="col-md-6 mt-3">
                        <label className='fw-bold' htmlFor={`adult-email-${index}`}>Email Address:</label>
                        <input
                          type="email"
                          className='form-control'
                          id={`adult-email-${index}`}
                          placeholder="Email"
                          value={adult.email}
                          onChange={e => handleChange('adults', index, 'email', e.target.value)}
                          required
                        />
                        {errors.adults[index]?.email && <div className="error-log">{errors.adults[index]?.email}</div>}
                      </div>

                      <div className="col-md-6 mt-3">
                        <label className='fw-bold' htmlFor={`adult-phoneNumber-${index}`}>phoneNumber Number:</label>
                        <input
                          type="text"
                          className='form-control'
                          id={`adult-phoneNumber-${index}`}
                          placeholder="phoneNumber"
                          value={adult.phoneNumber}
                          onChange={e => handleChange('adults', index, 'phoneNumber', e.target.value)}
                          required
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
                <h5 className='mt-5 main-color'>Children</h5>
                {formData.children.map((child, index) => (
                  <div key={index}>
                    <div className="row">
                      <div className="col-md-6 mt-3">
                        <label className='fw-bold' htmlFor={`child-name-${index}`}>
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
                        />
                        {errors.children[index]?.name && <div className="error-log">{errors.children[index]?.name}</div>}
                      </div>
                      {/*All Additional Services */}
                      <div className='col-md-6 mt-1'>
                        <label htmlFor="tax" className="d-flex main-color fw-bold">
                          Additional Services
                        </label>
                        <Autocomplete
                          multiple
                          id="checkboxes-tags-demo"
                          options={allServices.filter(service => service.status === 1)}
                          disableCloseOnSelect
                          getOptionLabel={option => option.name}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(event, newValue) => {
                            setFormData({ ...formData, addtionalServices: newValue });
                          }}
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
                                    Price: {option.price} for{' '}
                                    {personAge[option.personAge]}
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

          <div className="booking-summary col-md-5 mt-lg-0 mt-3 ml-auto">
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
            {allServices.length > 0 ? (
              allServices.map((service, index) => (
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

            {allServices.length > 0 && (
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

          <div className="col-md-12">
            <button className='mt-lg-4 mt-3 btn-main btn pay-btn' onClick={handleSubmit} >pay</button>

          </div>
        </div>
      </div >
    </>

  )
}

export default UserData;
