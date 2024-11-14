import React from 'react'
import "../../css/program.css";

export default function Program() {
  return (
    // <section className='container'>
    //   <img src="pro.png"  className="slider-image"  alt="" />
    //   <div className='row'>
    //     <img src="pro2.png" className='col-md-6 proimg' alt="" />
    //     <img src="pro3.png" className='col-md-6 proimg' alt="" />    

    //   </div>
    // </section>
//     <section className="position-relative container">
//   <img src="pro.png" className="slider-image" alt="" />
//   <div className="image-overlay row">
//     <div className="centered-images">
//       <img src="pro2.png"  className="proimg col-md-6" alt="" />
//       <img src="pro3.png" className="proimg col-md-6" alt="" />
//     </div>
//   </div>
// </section>
<section className="position-relative container prog-section">
  <img src="pro.png" className="slider-image" alt="" />
  <div className="image-overlay">
    <div className="centered-images">
    <div className="row ">
  <div className="col-md-6 ">
    <div className="image-container position-relative">
      <img src="pro2.png" className="background-image" alt="pro2" />
      <div className="overlay-container">
        <div className="text-container">
          <h5 className="card-title">Classic</h5>
          <br />
          <p className="card-text">500 EGP Per Person</p>
          <p className="card-text">250 EGP Per Person</p>
          <img src="logo.png" className="logop" alt="logo" />
        </div>
      </div>
    </div>
  </div>
  {/* just  */}
  <div className="col-md-6">
    <div className="image-container position-relative">
      <img src="pro3.png" className="background-image" alt="pro3" />
      <div className="overlay-container">
        <div className="text-container">
          <h5 className="card-title ">Go Island</h5>
          <br />
          <p className="card-text">1000 EGP Per Person</p>
          <p className="card-text">750 EGP Per Children</p>
          <img src="logo.png" className="logop" alt="logo" />
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  </div>
</section>

  )
}
