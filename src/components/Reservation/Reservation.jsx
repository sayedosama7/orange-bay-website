import React, { useState } from "react";
import "../../css/reservation/navbook.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import QRCode from "qrcode.react";
import Overview from "./Overview";

export default function Reservation() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");

  const decreaseCounter = (type) => {
    if (type === "adults" && adults > 0) {
      setAdults(adults - 1);
    } else if (type === "children" && children > 0) {
      setChildren(children - 1);
    }
  };

  const increaseCounter = (type) => {
    if (type === "adults") {
      setAdults(adults + 1);
    } else if (type === "children") {
      setChildren(children + 1);
    }
  };

  const handleBookNow = () => {
    const data = {
      date: selectedDate,
      adults,
      children,
    };
    localStorage.setItem("reservationData", JSON.stringify(data));
    setQRCodeValue(
      `Date: ${selectedDate}\nAdults: ${adults}\nChildren: ${children}`
    );

    setShowQRCode(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const total = adults * 750;

  const handleSaveQRCode = () => {
    const canvas = document.querySelector(".qr canvas");

    // Check if the canvas element exists
    if (!canvas) {
      console.error("QR code canvas element not found.");
      return;
    }

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr_code.png";

    // Simulate a click on the link to trigger the download
    link.click();
  };
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-7 ml-4">
          <Overview />
        </div>

        <div className="col-md-4">
          <div className="card bill mt-4">
            {/* Card content */}
            <div className="card-header text-center qq">
              {/* Date picker */}
              <div
                className="input-group"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control text-center"
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i className="fa-regular fa-calendar"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body ">
              <div className="form-group row">
                <label htmlFor="adults" className="col-sm-4  col-form-label">
                  <h5>Adults</h5>
                </label>
                <div className="col-sm-8">
                  <div className="input-group we1">
                    <i
                      className="fa-sharp fa-solid fa-circle-minus mt-1"
                      onClick={() => decreaseCounter("adults")}
                    ></i>
                    <input
                      type="number"
                      className="form-control innn text-center ml-2"
                      id="adults"
                      min="0"
                      value={adults}
                      readOnly
                    />
                    <i
                      className="fa-solid fa-circle-plus mt-1"
                      onClick={() => increaseCounter("adults")}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="children" className="col-sm-4 col-form-label">
                  <h5>Children</h5>
                </label>
                <div className="col-sm-6">
                  <div className="input-group we">
                    <i
                      className="fa-sharp fa-solid fa-circle-minus mt-1"
                      onClick={() => decreaseCounter("children")}
                    ></i>
                    <input
                      type="number"
                      className="form-control innn text-center ml-2"
                      id="children"
                      min="0"
                      value={children}
                      readOnly
                    />
                    <i
                      className="fa-solid fa-circle-plus mt-1"
                      onClick={() => increaseCounter("children")}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <br /> <br />
            <div className="card-body mb-5 mt-5">
              <p className="card-text">
                <i className="fas fa-exclamation"></i> Children under 4 are
                free.
              </p>
              <p className="card-text">
                <i className="fas fa-exclamation"></i> For a full refund, cancel
                at least 24 hours in advance of the start date of the
                experience.
              </p>
            </div>
            <br />
            <div className="card-footer mt-4">
              <strong>Adults x {adults}</strong> <br />
              <strong>Children x {children}</strong> <br />
              <strong>Total: {total}</strong> <br />
              <div className="text-center mt-4">
                {showQRCode ? (
                  <div className="text-center qr">
                    <QRCode value={qrCodeValue} />
                  </div>
                ) : (
                  <button className="book" onClick={handleBookNow}>
                    Book Now
                  </button>
                )}
                {showQRCode && (
                  <button className="book" onClick={handleSaveQRCode}>
                    Save QR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
