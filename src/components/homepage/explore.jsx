import React from 'react'
import "../../css/explore.css";

export default function Explore() {
  return (
    <section className="section">
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-6">
            <video src="vid.mp4" controls width="100%" height="auto" />{" "}
          </div>
          <div className="col-md-6 text-left  ">
            <h2>
              {" "}
              Get the best out of the Red Sea & juiciest out of{" "}
              <span className="orange-text"> Orange Bay Hurghada </span>{" "}
            </h2>
            <p className="section-description">
              Get the best out of the & juiciest out of Sail & snorkel & have
              fun during the day, enjoy. The Island all to yourself afternoon &
              early morning.
            </p>
            <button className="explore-button mt-4 "> Explore </button>
          </div>
        </div>
        
        <div className="rectangle-container mb-5">
      <div className="row mt-5 image-row ">
        <div className="col-md-3">
          <img src="vis2.png"  alt="" />
        </div>
        <div className="col-md-3">
          <img src="vis1.png" alt=""  />
        </div>
        <div className="col-md-3">
          <img src="vis3.png" alt="" />
        </div>
            </div>
        </div>
        
      </div>
    </section>
  );
}
