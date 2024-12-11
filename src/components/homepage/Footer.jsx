/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "../../css/footer.css";

const Footer = () => {
  return (
    <footer className="padding_4x mt-5">
      {/* <div className="flex">
        <section className="flex-content padding_1x ml-3">
          <h5 className="text-white">About Us</h5>
          <a href="#">Contact Us</a>
          <a href="#">Cities</a>
        </section>
        <section className="flex-content padding_1x mr-5">
          <h5 className="text-white">The Red Sea Weather</h5>
          <div className="image-link-container">
            <img src="wether.png" className="mb-2" alt="" />
            <a href="#">
              Air Temperature <p>21&deg;</p>{" "}
            </a>
          </div>
          <div className="image-link-container mb-0">
            <img src="water.png" className="mb-2" alt="" />
            <a href="#">
              Air Temperature <p>23&deg;</p>{" "}
            </a>
          </div>
        </section>
        <section className="flex-content padding_1x">
          <h5 className="text-white">Information</h5>
          <a href="#">FAQs</a>
          <a href="#">Vision</a>
          <a href="#">Goals</a>
        </section>
        <section className="flex-content padding_1x">
          <h5 className="text-white">Subscribe to our newsletter</h5>

          <fieldset className="fixed_flex inn mt-5">
            <input
              type="email"
              name="newsletter"
              placeholder="Your Email Address"
            />
            <button className="btn btn_2">send</button>
          </fieldset>
          <h5 className=" mt-5 mr-5 text-white "> Follow us </h5>
          <div className="social-icons  mr-5 mt-3">
            <i className="fab fa-facebook fa-lg mr-2 "></i>
            <i className="fab fa-instagram fa-lg mr-2"></i>
            <i className="fab fa-twitter fa-lg mr-5"></i>
          </div>
        </section>
      </div> */}
      <div className="flex">
        <section className="flex-content padding_1x">
          <p>Orange Bay.©2023 - All rights reserved </p>
        </section>
        <section className="flex-content padding_1x">
          <p>Created By ITD </p>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
