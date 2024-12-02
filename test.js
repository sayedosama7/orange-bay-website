import React from 'react'

const test = () => {
    return (
        <div>
            {/* Additional Services for one ticket*/}
            {/* <div className="col-md-12 mt-5 ">
                                <h6 className="main-color">Additional Services</h6>
                                <div className="services-list">
                                    {allServices.map(service => (
                                        <div
                                            key={service.id}
                                            className="service-item d-flex justify-content-between align-items-center"
                                            style={{
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            <div>
                                                <span
                                                    style={{ display: 'block' }}
                                                    className="main-color"
                                                >
                                                    Name :{' '}
                                                    <span className="text-dark">
                                                        {service.name}
                                                    </span>
                                                </span>
                                                <span
                                                    style={{ display: 'block' }}
                                                    className="main-color"
                                                >
                                                    Price :{' '}
                                                    <span className="text-dark">
                                                        {service.price}$ <span>for</span>{' '}
                                                        {personAge[service.personAge]}
                                                    </span>
                                                </span>
                                            </div>

                                            <Checkbox
                                                checked={formData.addtionalServices.some(
                                                    selectedService =>
                                                        selectedService.id === service.id
                                                )}
                                                onChange={event => {
                                                    const isChecked = event.target.checked;
                                                    setFormData(prevFormData => {
                                                        const updatedServices = isChecked
                                                            ? [
                                                                  ...prevFormData.addtionalServices,
                                                                  service,
                                                              ]
                                                            : prevFormData.addtionalServices.filter(
                                                                  selectedService =>
                                                                      selectedService.id !==
                                                                      service.id
                                                              );
                                                        return {
                                                            ...prevFormData,
                                                            addtionalServices: updatedServices,
                                                        };
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div> */}
        </div>
    )
}

export default test