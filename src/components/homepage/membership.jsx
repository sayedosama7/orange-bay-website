import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import "../../css/membership.css";


export default function Membership() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };
    
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="text-left">
              <h2>Membership</h2>
              <p className="section-description text-dark">Join our community and discover the benefits offered by our large variety of membership cards.</p>
              <div className='row'>
              <ul className="marks row">
  <div className="col-md-6">
    <li className="col-md-4">
      <FontAwesomeIcon icon={faCheckCircle} className="orange-checkmark" />
      <span>Whale</span>
    </li>
    <li className="col-md-4">
      <FontAwesomeIcon icon={faCheckCircle} className="orange-checkmark" />
      <span>Shark</span>
    </li>
    <li className="col-md-4">
      <FontAwesomeIcon icon={faCheckCircle} className="orange-checkmark" />
      <span>Mermaid</span>
    </li>
  </div>
  <div className="col-md-6">
    <li className="col-md-4">
      <FontAwesomeIcon icon={faCheckCircle} className="orange-checkmark" />
      <span>Mantaray</span>
    </li>
    <li className="col-md-4">
      <FontAwesomeIcon icon={faCheckCircle} className="orange-checkmark" />
      <span>Dolphin</span>
    </li>
    <li className="col-md-4 mb-5">
      <FontAwesomeIcon icon={faCheckCircle} className="orange-checkmark" />
      <span>YachtClub</span>
    </li>
  </div>
</ul>
<button className="membership-button">Membership Cards</button>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-5 ">
            <Slider {...settings}>
              <div>
                <img src="whale.jpg" alt="" />
              </div>
              <div>
                <img src="whale2.jpg" alt="" />
              </div>
              <div>
                <img src="yacht1.jpg" className='ych' alt="" />
              </div>
              <div>
                <img src="shark.jpg" alt="" />
              </div>
              <div>
                <img src="Dolphin.jpg" alt="" />
              </div>
              <div>
                <img src="Mermaid.jpg" alt="" />
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}
