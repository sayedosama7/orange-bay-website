import React from "react";
import "../../css/popular.css";

export default function Popular() {
  return (
    <section className="mb-5">
      <h2 className="section-title mb-4 ml-auto">
        {" "}
        <span className="text-dark"> Most Popular in </span> Orange Bay
      </h2>
      <div className="row justify-content-center">
        <div className="col-md-4 image1-item">
          <img src="vid.png" alt="Videos" />
          <p className="image-title">Videos</p>
        </div>
        <div className="col-md-4 image1-item">
          <img src="img.png" alt="Images" />
          <p className="image-title">Images</p>
        </div>
        <div className="col-md-4 image1-item">
          <img src="eve.png" alt="Events" />
          <p className="image-title">Events</p>
        </div>
      </div>
    </section>
  );
}
