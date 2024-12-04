import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ADDTIONALSERVICES, baseURL } from '../Api/Api';
import { Loading } from '../Loading/Loading';

const UserData = ({ bookDetail, handleNext }) => {
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { adults, children, id, adultPrice, childPrice } = bookDetail;

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
      const response = await axios.get(`${baseURL}/${ADDTIONALSERVICES}`, {
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
    if (adults > 0 && children >= 0) {
      setFormData({
        adults: Array(adults).fill({ name: '', email: '', phoneNumber: '', addtionalServices: [] }),
        children: Array(children).fill({ name: '', addtionalServices: [] }),
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

  const handleServiceChange = (type, index, newValue) => {
    const updatedData = [...formData[type]];
    updatedData[index] = { ...updatedData[index], addtionalServices: newValue };
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

    const adultTicketPrice = adults * adultPrice;
    const childTicketPrice = children * childPrice;
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
      ticketId: id,
      price: totalPrice,
      numberOfAdults: formData.adults.length,
      numberOfChilds: formData.children.length,
      details,
      additionalServices,
      bookingDate: new Date().toISOString(),
    };
    localStorage.setItem('bookingUserDetails', JSON.stringify(payload));
    handleNext(payload.additionalServices);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
            <button className='mt-lg-4 mt-3 btn-main btn pay-btn' onClick={handleSubmit} >pay</button>
          </div>
        </div>
      </div >
    </>

  )
}

export default UserData;
