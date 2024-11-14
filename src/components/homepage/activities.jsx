import React from 'react'
import { Link } from 'react-router-dom';

export default function Activities() {
  return (
    <div className="container">
    <div className="row mt-5">
      <div className="col-md-6">
        <h2 ><span className="text-dark">Activities</span></h2>
        <p className="section-description text-dark">
        - We created a unique dream place to spend a day relaxing          <br /> <br />
        - We created a unique dream place to spend a day relaxing or to gather <br /> <br />
        - Join our community and discover the benefits offered        </p>
        </div>
      <div className="col-md-6 mb-5 ">
        <div className="row">
          <div className="col-sm-6 d-flex align-items-center">
            <img src="cam.png" alt="img 1" className="img-fluid mr-2" />
            <p className='mr-2 section-description text-dark'>photo session </p>
            <Link to="/destination-component">
            <img src="arrow.png" width={"40px"} height={"40px"} alt="" className=' img-fluid ml-5'/> </Link>
          </div>
         
          <div className="col-sm-12 d-flex align-items-center mt-5">
            <img src="msg.png" alt="img 3" className="img-fluid  mr-2 ml-5" />
            <p className='mr-2 section-description mt-4 text-dark'>message</p>
            <img src="arrow.png" width={"40px"} height={"40px"} alt="" className=' img-fluid ml-5' />   
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
