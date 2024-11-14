import React from 'react';
import "../../css/related.css";

const RelatedTripsComponent = () => {
  // function toggleFavorite(event) {
  //   const wishlistIcon = event.target;
  //   wishlistIcon.classList.toggle('favorite');
  // }
  
  return (
    <div className="container mt-5">
    <h2 className="mb-4 text-center">Related Programs</h2>
    <div className="row">
      <div className="col-md-4">
        <div className="card border-0" style={{ width: '344px', height: '516px' }}>
          <div className="top-left">
            <p className="start-price start">Start from <br /><strong className="start-price"> 850 EGP </strong></p>
          </div>
          <div className="top-right">
            <div className="circle">
              <i className="fa-sharp fa-solid fa-heart fa-fade"></i>
            </div>
          </div>
          <img src="Mask.png" alt="img 1" className="card-img-top" />
          <div className="card-body">
            <p className="card-text">Experience the joy of the red sea beauty in a 40 minutes</p>
            <div className="rating">
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0" style={{ width: '344px', height: '516px' }}>
          <div className="top-left">
            <p className="start-price start">Start from <br /><strong className="start-price"> 850 EGP </strong></p>
          </div>
          <div className="top-right">
            <div className="circle">
              <i className="fa-sharp fa-solid fa-heart fa-fade"></i>
            </div>
          </div>
          <img src="Mask2.png" alt="img 2" className="card-img-top" />
          <div className="card-body">
            <p className="card-text">Experience a day on our <br />magical beach</p>
            <div className="rating ">
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card border-0" style={{ width: '344px', height: '516px' }}>
          <div className="top-left">
            <p className="start-price start">Start from <br /><strong className="start-price"> 850 EGP </strong></p>
          </div>
          <div className="top-right">
            <div className="circle">
              <i className="fa-sharp fa-solid fa-heart fa-fade"></i>
            </div>
          </div>
          <img src="Mask3.png" alt="img 3" className="card-img-top" width="344" height="279" />
          <div className="card-body">
            <p className="card-text">The ecologically protected island of <br /> Giftun.</p>
            <div className="rating ">
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
              <span className="orange-star"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row justify-content-center">
      <div className="text-center">
        <button className="btn-orange  mb-5" >
          See All
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default RelatedTripsComponent;
