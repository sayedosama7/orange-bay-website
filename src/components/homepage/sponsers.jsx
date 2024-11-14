import React from 'react';

const Sponsors = () => {
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Sponsors</h2>
      <div className="row justify-content-center">
        <div className="col-md-2 ml-4 " >
          <img src="spo.png" alt="Sponsor 1"  className="img-fluid" />
        </div>
        <div className="col-md-2 ml-4">
          <img src="spo1.png" alt="Sponsor 2"  className="img-fluid" />
        </div>
        <div className="col-md-2 ml-4">
          <img src="spo2.png" alt="Sponsor 3" className="img-fluid" />
        </div>
        <div className="col-md-2 ml-4">
          <img src="spo4.png" alt="Sponsor 4" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
